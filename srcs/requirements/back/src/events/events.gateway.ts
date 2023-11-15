//IMPORTS--------------------------------------------------------------------------------------------------------------------------------------
import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
	MessageBody,
	ConnectedSocket,
	OnGatewayDisconnect,
	OnGatewayInit,
	OnGatewayConnection
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
import { Score } from '../score/score.interface';
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
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

	@WebSocketServer() server: any = io("https://localhost:5573");

	queueList : Map<number, string> = new Map();
	gameRooms : GameRoom[] = [];
	roomId: number = 0;

	constructor(
		private readonly QueueListService: QueueListService,
		private readonly GameRoomService: GameRoomService,
		private readonly UserService: UserService
	){}

	handleConnection(){}

	handleDisconnect(client: any) {
		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i].player1SocketId == client.id){
				this.server.to(this.gameRooms[i].player2SocketId).emit('opponentDisconnection');
				this.gameRooms[i].player1Disconnected = true;
			}
			else if (this.gameRooms[i].player2SocketId == client.id){
				this.server.to(this.gameRooms[i].player1SocketId).emit('opponentDisconnection');
				this.gameRooms[i].player2Disconnected = true;
			}
		}
	}

	async afterInit() {

		setInterval(async () => {
			if (this.queueList && this.queueList.size == 2){

				const first = this.queueList.entries().next().value;

				this.queueList.delete(first[0]);

				const second = this.queueList.entries().next().value;

				const user1 = await  this.UserService.getUserById(first[0]);

				const user2 = await this.UserService.getUserById(second[0]);

				this.queueList.delete(second[0]);

				//Database service
				const gameRoom = await this.GameRoomService.createGameRoom(first, second);

				//Create same variable but in local so its easier to access
				const localRoom = this.createGameRoomLocal(gameRoom.id, first, second);

				this.gameRooms.push(localRoom);

				this.server.to(localRoom.player1SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1Name: user1.userName,
					player2Name: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image
				});

				this.server.to(localRoom.player2SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1Name: user1.userName,
					player2Name: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image
				});
			}

			for (let i = 0; i < this.gameRooms.length; i++){
				if (this.gameRooms[i].running && this.gameRooms[i].started && this.gameRooms[i].finish == false){
					//Loop through every game room
					//If the game was launch then save her state every SERVER_REFRESH_RATE ms and sending it to game both players of the game.
					//If it wasnt then launch the game engine
					this.checkWinCondition(this.gameRooms[i]);
					if (this.gameRooms[i].finish){
						//Need a method to update it in the database
						this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish', {});

						this.server.to(this.gameRooms[i].player2SocketId).emit('gameFinish', {});

						this.gameRooms[i].finish = true;
						this.gameRooms[i].endDate = new Date();
						this.GameRoomService.updateGameRoom(this.gameRooms[i].roomId, this.gameRooms[i].player1SocketId, this.gameRooms[i].player2SocketId, this.gameRooms[i].score);
					}
					if (this.gameRooms[i].player1Disconnected == false && this.gameRooms[i].player2Disconnected == false){
						this.saveGameState(this.gameRooms[i]);
						Engine.update(this.gameRooms[i].engine);
					}
				}
				else if (this.gameRooms[i].running == false){
					//Starting the game
					this.createGameWorld(this.gameRooms[i], this.gameRooms[i].engine, this.gameRooms[i].world, this.gameRooms[i].entities);
					this.gameRooms[i].running = true;
					this.GameRoomService.setRunning(this.gameRooms[i].roomId);
					Matter.Engine.run(this.gameRooms[i].engine);
				}
			}
		}, SERVER_REFRESH_RATE);
	}

	checkWinCondition(gameRoom: GameRoom){
		const scorePlayer1 = gameRoom.scoreActual.get(gameRoom.player1SocketId);

		const scorePlayer2 = gameRoom.scoreActual.get(gameRoom.player2SocketId);

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
			player1Disconnected: false,
			player2Disconnected: false,
			world: null,
			engine: null,
			entities: null,
			scoreActual: new Map<string, number>(),
			score: [],
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
		gameRoom.scoreActual.set(player1[1], 0);
		gameRoom.scoreActual.set(player2[1], 0);

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
			
			if (gameRoom.entities.ball.gameObject.velocity.x > 0){

				if (player.gameObject.y > gameRoom.entities.ball.gameObject.position.y){
					intersectionDeltaY = player.gameObject.y - gameRoom.entities.ball.gameObject.position.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y
					});
				}
				else{
					intersectionDeltaY = gameRoom.entities.ball.gameObject.position.y - player.gameObject.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y * -1
					});
				}
			}
			else{
				if (player.gameObject.y > gameRoom.entities.ball.gameObject.position.y){
					intersectionDeltaY = player.gameObject.y - gameRoom.entities.ball.gameObject.position.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y * -1
					});
				}
				else{
					intersectionDeltaY = gameRoom.entities.ball.gameObject.position.y - player.gameObject.y;
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: gameRoom.entities.ball.gameObject.velocity.x,
						y: gameRoom.entities.ball.gameObject.velocity.y
					});
				}
			}
		}

		const scorePoint = (pair: Matter.Pair, gameRoom: GameRoom) => {
			let scorerId : number;
			let scorePlayer1 = gameRoom.scoreActual.get(gameRoom.player1SocketId);
			let scorePlayer2  = gameRoom.scoreActual.get(gameRoom.player2SocketId);

			if (pair.bodyA.label == "left"){
				scorerId = gameRoom.player2UserId;
				gameRoom.scoreActual.set(gameRoom.player2SocketId, ++scorePlayer2);
			}
			else{
				scorerId = gameRoom.player1UserId;
				gameRoom.scoreActual.set(gameRoom.player1SocketId, ++scorePlayer1);
			}

			let scoreDate = new Date();

			let timeDiff = (scoreDate.valueOf() - gameRoom.startDate.valueOf()) / 1000;
			let newScore : Score = {
				time: timeDiff,
				scorerId: scorerId,
				score: [
					{
						userId: gameRoom.player1UserId,
						score: scorePlayer1 
					},
					{
						userId: gameRoom.player2UserId,
						score: scorePlayer2 
					}
				]
			}
			gameRoom.score.push(newScore);
		}

		const ballRespawn = (gameRoom: GameRoom) => {
			let randY = Between(10, 790);
			this.server.to(gameRoom.player1SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.scoreActual.get(gameRoom.player1SocketId),
					player2: gameRoom.scoreActual.get(gameRoom.player2SocketId)
				},
				ball: {
					y: randY
				}
			});
			this.server.to(gameRoom.player2SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.scoreActual.get(gameRoom.player1SocketId),
					player2: gameRoom.scoreActual.get(gameRoom.player2SocketId)
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
		this.queueList.set(userId, socket.id);
		this.server.to(socket.id).emit('matchmaking', {});
	}

	@SubscribeMessage('playerReconnection')
	async handlePlayerReconnection(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number, userId: number) {
		var gameRoom = this.findCorrespondingGame(roomId);

		console.log(gameRoom);
		if (!gameRoom){
			return ;
		}
		const user1 = await this.UserService.getUserById(gameRoom.player1UserId);
		const user2 = await this.UserService.getUserById(gameRoom.player2UserId);
		
		if (gameRoom && gameRoom.player1UserId == userId){
			socket.to(gameRoom.player2SocketId).emit('playerReconnection',{
				playerSocket: socket.id
			});

			socket.to(gameRoom.player1SocketId).emit('informOnReconnection',{
				roomId: gameRoom.roomId,
				player1SocketId: gameRoom.player1SocketId,
				player2SocketId: gameRoom.player2SocketId,
				player1Name: user1.userName,
				player2Name: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
			gameRoom.player1SocketId = socket.id;
		}
		else if (gameRoom && gameRoom.player2UserId == userId){
			socket.to(gameRoom.player1SocketId).emit('playerReconnection',{
				playerSocket: socket.id
			});
			socket.to(gameRoom.player2SocketId).emit('informOnReconnection',{
				roomId: gameRoom.roomId,
				player1SocketId: gameRoom.player1SocketId,
				player2SocketId: gameRoom.player2SocketId,
				player1Name: user1.userName,
				player2Name: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
			gameRoom.player2SocketId = socket.id;
		}
		if (gameRoom){
			setTimeout(() => {
				socket.to(gameRoom.player1SocketId).emit('resumeGame');
				socket.to(gameRoom.player2SocketId).emit('resumeGame');
			}, 3000);
		}
	}

	@SubscribeMessage('playAgain')
	async handleReplay(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number) {

		let gameRoom = this.findCorrespondingGame(roomId);

		if (gameRoom){
			const user1 = await this.UserService.getUserById(gameRoom.player1UserId);
			const user2 = await this.UserService.getUserById(gameRoom.player2UserId);
			if (gameRoom.player1SocketId == socket.id){
				this.server.to(gameRoom.player2SocketId).emit('playAgain');
				gameRoom.player1Ready = true;
			}
			else if (gameRoom.player2SocketId == socket.id){
				this.server.to(gameRoom.player1SocketId).emit('playAgain');
				gameRoom.player2Ready = true;
			}
			if (gameRoom.player1Ready == true && gameRoom.player2Ready == true){
				let indexGameRoom = this.gameRooms.indexOf(gameRoom);
				this.gameRooms.splice(indexGameRoom, 1);
				const localRoom = this.createGameRoomLocal(gameRoom.roomId, [ gameRoom.player1UserId, gameRoom.player1SocketId ],  [ gameRoom.player2UserId, gameRoom.player2SocketId ]);
				this.gameRooms.push(localRoom);
				setTimeout(() => {
					this.server.to(gameRoom.player1SocketId).emit('lobby', {
						roomId: gameRoom.roomId,
						player1SocketId: gameRoom.player1SocketId,
						player2SocketId: gameRoom.player2SocketId,
						player1Name: user1.userName,
						player2Name: user2.userName,
						player1Image: user1.image,
						player2Image: user2.image
					});
					this.server.to(gameRoom.player2SocketId).emit('lobby', {
						roomId: gameRoom.roomId,
						player1SocketId: gameRoom.player1SocketId,
						player2SocketId: gameRoom.player2SocketId,
						player1Name: user1.userName,
						player2Name: user2.userName,
						player1Image: user1.image,
						player2Image: user2.image
					});
				});
			}
		}
	}

	@SubscribeMessage('playAgain')
	handle(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number): void {
		let gameRoom = this.findCorrespondingGame(roomId);
		if (gameRoom?.player1SocketId == socket.id){
			this.server.to(gameRoom.player2SocketId).emit('playAgain');
		}
		else if (gameRoom?.player2SocketId == socket.id){
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
				gameRoom.player2Ready = false;
				gameRoom.player1Ready = false;
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

		//Better use JSON stringify function to do this
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
				console.log("found");
				return (this.gameRooms[i]);
			}
		}
	}
}
