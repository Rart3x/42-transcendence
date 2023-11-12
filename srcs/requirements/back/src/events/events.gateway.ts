//IMPORTS--------------------------------------------------------------------------------------------------------------------------------------
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';

//Utils
import { map } from 'rxjs/operators';

//Socket
import { io } from 'socket.io-client';
import { Socket } from 'socket.io';

//Game Engine
import * as Matter from 'matter-js';

//Snapshot
import '@geckos.io/snapshot-interpolation';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';

//Services
import { QueueListService } from '../queueList/queueList.service';
import { UserService } from '../user/user.service';
import { GameRoomService } from '../gameRoom/gameRoom.service';

//ORM
import { Prisma } from '@prisma/client';

//Interfaces
import { GameRoom } from '../gameRoom/gameRoom.interface';

//Initialize the snapshot library
const SI = new SnapshotInterpolation();

//Entities
import Entities from '../entities/entities';
import Ball from '../entities/ball';
import Player from '../entities/player';

//???
import { takeCoverage } from 'v8';

//Server
import { Server } from 'ws';
import { isArray } from 'class-validator';


//-------------------------------------------------------------------------------------------------------------------------------------------

//ALIASES------------------------------------------------------------------------------------------------------------------------------------
const Engine = Matter.Engine,
	World = Matter.World,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite;
//-------------------------------------------------------------------------------------------------------------------------------------------

//DEFINES------------------------------------------------------------------------------------------------------------------------------------
const SERVER_REFRESH_RATE = 1000 / 15
//-------------------------------------------------------------------------------------------------------------------------------------------

//UTILS--------------------------------------------------------------------------------------------------------------------------------------
function Between(min : number, max : number){
	return (Math.random() * (max - min) + min)
}
//-------------------------------------------------------------------------------------------------------------------------------------------

//Gateway
@WebSocketGateway({
	cors : {
		origin: '*',
	},
})


@WebSocketGateway()
export class EventsGateway {

	@WebSocketServer() server: any = io("https://localhost:5573");

	queueList : Map<number, string> = new Map();
	gameRooms : GameRoom[] = [];
	roomId: number = 0;

	constructor(
		private readonly QueueListService: QueueListService,
		private readonly GameRoomService: GameRoomService,
		private readonly UserService: UserService
	){}

	async afterInit() {

		setInterval(async () => {
			if (this.queueList && this.queueList.size == 2){

				const first = this.queueList.entries().next().value;

				this.queueList.delete(first[0]);

				const second = this.queueList.entries().next().value;

				const user1 = await  this.UserService.getUserById(first[0]);

				const user2 = await this.UserService.getUserById(second[0]);
				
				console.log(user1, user2);
				this.queueList.delete(second[0]);

				const gameRoom = await this.GameRoomService.createGameRoom(first, second);

				const localRoom = this.createGameRoomLocal(gameRoom.id, first, second);

				this.gameRooms.push(localRoom);

				this.server.to(localRoom.player1SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1Name: user1.userName,
					player2Name: user2.userName
				});

				this.server.to(localRoom.player2SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1Name: user1.userName,
					player2Name: user2.userName
				});
			}

			for (let i = 0; i < this.gameRooms.length; i++){
				if (this.gameRooms[i].running && this.gameRooms[i].started && this.gameRooms[i].finish == false){
					//save game state and sending it to game players
					this.checkWinCondition(this.gameRooms[i]);
					if (this.gameRooms[i].finish){

						//Need a method to update it in the database
						this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish', {});

						this.server.to(this.gameRooms[i].player2SocketId).emit('gameFinish', {});

						this.gameRooms[i].finish = true;
						this.GameRoomService.updateGameRoom(this.gameRooms[i].roomId, this.gameRooms[i].player1SocketId, this.gameRooms[i].player2SocketId, this.gameRooms[i].score);
					}
					this.saveGameState(this.gameRooms[i]);

					Engine.update(this.gameRooms[i].engine);
				}
				else if (this.gameRooms[i].running == false){
					//Starting the game
					this.createGameWorld(this.gameRooms[i], this.gameRooms[i].engine, this.gameRooms[i].world, this.gameRooms[i].entities);
					this.gameRooms[i].running = true;
					Matter.Engine.run(this.gameRooms[i].engine);
				}
			}
		}, SERVER_REFRESH_RATE);
	}

	checkWinCondition(gameRoom: GameRoom){
		const scorePlayer1 = gameRoom.score.get(gameRoom.player1SocketId);

		const scorePlayer2 = gameRoom.score.get(gameRoom.player2SocketId);

		(scorePlayer1 >= 3 || scorePlayer2 >= 3) ? gameRoom.finish = true : gameRoom.finish = false;
	}

	createGameRoomLocal(gameRoomId: number, player1: any, player2: any) : GameRoom{
		let gameRoom : GameRoom = {
			roomId: gameRoomId,
			player1UserId: player1[0],
			player2UserId: player2[0],
			player1SocketId: player1[1],
			player2SocketId: player2[1],
			player1Ready: false,
			player2Ready: false,
			world: null,
			engine: null,
			entities: null,
			score: new Map<string, number>(),
			running: false,
			started: false,
			paused: false,
			finish: false,
			startDate: new Date(),
			endDate: null
		};

		gameRoom.engine = Matter.Engine.create();

		//Desactive gravity so we got an arcade physic
		gameRoom.engine.gravity.x = 0;
		gameRoom.engine.gravity.y = 0;

		//Default score
		gameRoom.score.set(player1[1], 0);
		gameRoom.score.set(player2[1], 0);

		gameRoom.entities = this.createEntities(player1[1], player2[1]);
		gameRoom.world = gameRoom.engine.world;

		return gameRoom;
	}

	createEntities(player1SocketId: string, player2SocketId: string) : Entities{
		//Entities
		return new Entities(player1SocketId, player2SocketId);
	}

	createGameWorld(gameRoom: GameRoom, engine: Matter.Engine, world: Matter.World, entities: Entities){

		this.setBallDefaultParameters(entities.ball);

		this.initCollisions(entities, world);

		this.initCollisionsEvent(engine, gameRoom);
	
	}

	setBallDefaultParameters(ball: Ball){

		//Default ball velocity
		Matter.Body.setVelocity(ball.gameObject, {x: 0, y: 0});

		//Random ball spawning
		Matter.Body.setPosition(ball.gameObject, {x: 500, y: 400});

	}

	initCollisions(entities: Entities, world: Matter.World){
		Matter.World.add(world, entities.ball.gameObject);

		for (let i = 0; i < 2; i++){
			Matter.World.add(world, entities.players[i].gameObject);
		}

		for (let i = 0; i < 4; i++){
			Matter.World.add(world,  entities.walls[i].gameObject);
		}
	}

	initCollisionsEvent(engine: Matter.Engine, gameRoom: GameRoom){
		const collisionBallPlayer = (pair: Matter.Pair, gameRoom: GameRoom) => {
			let player: Player;
			var intersectionDeltaY = 0;
	
			pair.bodyA.label == "player1" ? 
				player = (gameRoom.entities.players[0].gameObject.label == "player1" ? gameRoom.entities.players[0] : gameRoom.entities.players[1]) :
				player = (gameRoom.entities.players[0].gameObject.label == "player2" ? gameRoom.entities.players[0] : gameRoom.entities.players[1])
			
			if (gameRoom.entities.ball.gameObject.velocity.y > 0){
				if (player.gameObject.y > gameRoom.entities.ball.gameObject.y){
					intersectionDeltaY = player.gameObject.y - gameRoom.entities.ball.gameObject.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y * -1
					});
				}
				else{
					intersectionDeltaY = gameRoom.entities.ball.gameObject.y - player.gameObject.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y
					});
				}
			}
			else{
				if (player.gameObject.y > gameRoom.entities.ball.gameObject.y){
					intersectionDeltaY = player.gameObject.y - gameRoom.entities.ball.gameObject.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y
					});
				}
				else{
					intersectionDeltaY = gameRoom.entities.ball.gameObject.y - player.gameObject.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y * -1
					});
				}
			}
		}

		const scorePoint = (pair: Matter.Pair, gameRoom: GameRoom) => {
			let scorePlayer1 = gameRoom.score.get(gameRoom.player1SocketId);
			let scorePlayer2 = gameRoom.score.get(gameRoom.player2SocketId);

			pair.bodyA.label == "left" ?
				gameRoom.score.set(gameRoom.player2SocketId, ++scorePlayer2) :
				gameRoom.score.set(gameRoom.player1SocketId, ++scorePlayer1);
		}
	
		const ballRespawn = (gameRoom: GameRoom) => {
			let randY = Between(10, 790);
			this.server.to(gameRoom.player1SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.score.get(gameRoom.player1SocketId),
					player2: gameRoom.score.get(gameRoom.player2SocketId)
				},
				ball: {
					y: randY
				}
			});
			this.server.to(gameRoom.player2SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.score.get(gameRoom.player1SocketId),
					player2: gameRoom.score.get(gameRoom.player2SocketId)
				},
				ball: {
					y: randY
				}
			});
			Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
				x: 0,
				y: 0
			});
			setTimeout(() => {
				Matter.Body.setPosition(gameRoom.entities.ball.gameObject, {
					x: 500,
					y: randY
				});
				Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
					x: 3,
					y: 3
				});
				this.server.to(gameRoom.player1SocketId).emit('restartAfterScore', {});
				this.server.to(gameRoom.player2SocketId).emit('restartAfterScore', {});
				gameRoom.paused = false;
			}, 3000);
		}

		Matter.Events.on(engine, 'collisionStart', function(event : Matter.IEventCollision<Matter.Engine>) {
			event.pairs.forEach(function(pair: Matter.Pair) {
				//Ball score
				if (pair.bodyB.label == "ball" && (pair.bodyA.label == "left" || pair.bodyA.label == "right")){
					gameRoom.paused = true;
					scorePoint(pair, gameRoom);
					ballRespawn(gameRoom);
				}
				//Elastic physics
				else if (pair.bodyB.label == "ball" && (pair.bodyA.label == "player1"|| pair.bodyA.label == "player2")){
					collisionBallPlayer(pair, gameRoom);
				}
			}, this);
		});
	}

	@SubscribeMessage('playerJoinQueue')
	handleEvent(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number): void {
		// console.log(`userId: ${userId} socketId: ${socket.id}`);
		this.queueList.set(userId, socket.id);
		this.server.to(socket.id).emit('matchmaking', {});
	}

	@SubscribeMessage('playAgain')
	handleReplay(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number): void {
		let gameRoom = this.findCorrespondingGame(roomId);
		// console.log(gameRoom)
		if (gameRoom?.player1SocketId == socket.id){
			// console.log("player 1 wants to play again");
			this.server.to(gameRoom.player2SocketId).emit('playAgain');
		}
		else if (gameRoom?.player2SocketId == socket.id){
			// console.log("player 2 wants to play again");
			this.server.to(gameRoom.player1SocketId).emit('playAgain');
		}
	}

	@SubscribeMessage('playerReady')
	handlePlayerReady(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number): void {
		var gameRoom : GameRoom = this.findCorrespondingGame(roomId);
		if (socket.id == gameRoom.player1SocketId){
			gameRoom.player1Ready = true;
			this.server.to(gameRoom.player2SocketId).emit('otherPlayerReady', {});
		}
		else{
			gameRoom.player2Ready = true;
			this.server.to(gameRoom.player1SocketId).emit('otherPlayerReady', {});
		}
		if (gameRoom.player1Ready == true && gameRoom.player2Ready == true){
			this.server.to(gameRoom.player1SocketId).emit('init', {});
			this.server.to(gameRoom.player2SocketId).emit('init', {});
			setTimeout(() => {
				gameRoom.started = true;
				Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
					x: 3,
					y: 3
				});
			}, 7000);
		}
	}

	saveGameState(gameRoom: GameRoom){
		//We take a snapshot of ball and players position
		const ballState = [{
			id : '0',
			x : gameRoom.entities.ball.gameObject.position.x,
			y : gameRoom.entities.ball.gameObject.position.y
		}];

		const playerState = [{
			id : gameRoom.player1SocketId,
			x : gameRoom.entities.players[0].gameObject.position.x,
			y : gameRoom.entities.players[0].gameObject.position.y,
		},
		{
			id : gameRoom.player2SocketId,
			x : gameRoom.entities.players[1].gameObject.position.x,
			y : gameRoom.entities.players[1].gameObject.position.y,
		}]

		//better use JSON stringify function to do this
		const globalState = {
			players : playerState,
			ball: ballState
		}

		const snapshot = SI.snapshot.create(globalState);

		this.server.to(gameRoom.player1SocketId).emit('snapshot', snapshot);
		this.server.to(gameRoom.player2SocketId).emit('snapshot', snapshot);
	}

	@SubscribeMessage('playerMovement')
	handlePlayerMovement(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: {roomId: number, socketId: string, x: number,y : number}): void {

		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i].roomId == data.roomId){
				// Update player position in data structure
				if (this.gameRooms[i].player1SocketId == data.socketId){
					Matter.Body.setPosition(this.gameRooms[i].entities.players[0].gameObject, {
						x: this.gameRooms[i].entities.players[0].gameObject.position.x,
						//The collision between the players and upper lower wall is hardcoded by clamping the y value
						y: Math.min(Math.max(data.y, 65), 735)
					});
				}
				else{
					Matter.Body.setPosition(this.gameRooms[i].entities.players[1].gameObject, {
						x: this.gameRooms[i].entities.players[1].gameObject.position.x,
						y: Math.min(Math.max(data.y, 65), 735)
					});
				}
			}
		}
	}

	findCorrespondingGame(roomId: number) : GameRoom{
		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i].roomId == roomId){
				return (this.gameRooms[i]);
			}
		}
	}
}
