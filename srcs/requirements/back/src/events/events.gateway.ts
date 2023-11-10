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
import { Socket } from 'socket.io' //good

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

	// queueList : Array<number> = new Array();
	queueList : Array<string> = new Array();
	gameRooms : GameRoom[] = [];
	roomId: number = 0;

	constructor(
		private readonly QueueListService: QueueListService,
		private readonly GameRoomService: GameRoomService,
		private readonly UserService: UserService
	){}

	async afterInit() {
		const clients = await this.QueueListService.getAllClients();
		const nbClients = clients.length;

		setInterval(async () => {
			if (this.queueList.length == 2){
				// const gameRoom = await this.GameRoomService.createGameRoom(this.queueList[0], this.queueList[1]);
				// this.queueList.slice(0, 2);
				// const player1SocketId = await this.UserService.getSocketByUserId(this.queueList[0]);
				// const player2SocketId = await this.UserService.getSocketByUserId(this.queueList[1]);
				
				// const localRoom = this.createGameRoomLocal(gameRoom.id, player1SocketId, player2SocketId);
				
				// En attendant de pouvoir tester avec des differents users
				const localRoom = this.createGameRoomLocal(this.roomId++, this.queueList[0], this.queueList[1]);
				this.queueList.pop();
				this.queueList.pop();
				// console.log()
				this.gameRooms.push(localRoom);

				this.server.to(localRoom.player1SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId
				});

				this.server.to(localRoom.player2SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId
				});
				// console.log(localRoom);
			}

			for (let i = 0; i < this.gameRooms.length; i++){
				if (this.gameRooms[i].running && this.gameRooms[i].started){
					//save game state and sending it to game players
					this.checkWinCondition(this.gameRooms[i]);
					if (this.gameRooms[i].finish){
						//Need a method to update it in the database
						this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish', {});
						this.server.to(this.gameRooms[i].player2SocketId).emit('gameFinish', {});
						// this.server.to(this.gameRooms[i].player2SocketId).emit('gameFinish', {});
						this.gameRooms.splice(i, 1);
						return ;
					}
					// if (this.gameRooms[i].paused == true){
						// this.saveGameState(this.gameRooms[i]);
						// continue ;
					// }
					console.log("impossible");
					this.saveGameState(this.gameRooms[i]);
					Engine.update(this.gameRooms[i].engine);
					// console.log(`ball x: ${this.gameRooms[i].entities.ball.gameObject.position.x} y: ${this.gameRooms[i].entities.ball.gameObject.position.y}\n`)
				}
				else if (this.gameRooms[i].running == false){
					//starting the game
					// console.log(`${this.gameRooms.length}\n`);
					// console.log(`game ${i} is not running yet`)
					this.createGameWorld(this.gameRooms[i], this.gameRooms[i].engine, this.gameRooms[i].world, this.gameRooms[i].entities);
					// this.sendGameInfoToPlayers(this.gameRooms[i]);
					// this.gameRooms[i].paused = true;
					// setTimeout(() => {
						// if (this.gameRooms[i]){
					this.gameRooms[i].running = true;
						// }
					Matter.Engine.run(this.gameRooms[i].engine);
					// }, 3000);
				}
			}
		}, SERVER_REFRESH_RATE);
	}

	checkWinCondition(gameRoom: GameRoom){
		const scorePlayer1 = gameRoom.score.get(gameRoom.player1SocketId);
		const scorePlayer2 = gameRoom.score.get(gameRoom.player2SocketId);

		(scorePlayer1 >= 3 || scorePlayer2 >= 3) ? gameRoom.finish = true : gameRoom.finish = false;
	}

	createGameRoomLocal(gameRoomId: number, player1SocketId: string, player2SocketId: string) : GameRoom{
		let gameRoom : GameRoom = {
			roomId: gameRoomId,
			player1SocketId: player1SocketId,
			player2SocketId: player2SocketId,
			player1Ready: false,
			player2Ready: false,
			world: null,
			engine: null,
			entities: null,
			score: new Map<string, number>(),
			running: false,
			started: false,
			finish: false,
			startDate: new Date(),
			endDate: null
		};

		gameRoom.engine = Matter.Engine.create();

		//Desactive gravity so we got an arcade physic
		gameRoom.engine.gravity.x = 0;
		gameRoom.engine.gravity.y = 0;

		//Default score
		gameRoom.score.set(player1SocketId, 0);
		gameRoom.score.set(player2SocketId, 0);

		gameRoom.entities = this.createEntities(player1SocketId, player2SocketId);
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
					// console.log("test rebound");
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
			//test score
			// let testscorePlayer1 = gameRoom.score.get(gameRoom.player1SocketId);
			// let testscorePlayer2 = gameRoom.score.get(gameRoom.player2SocketId);
			// console.log(`Score player1 / player2 | ${testscorePlayer1} / ${testscorePlayer2}`)
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
			// gameRoom.paused = true;
			setTimeout(() => {
				// gameRoom.paused = false;
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
			}, 3000);
			// this.server.to(gameRoom.player2SocketId).emit('scorePoint', {
			// 	score : {
			// 		player1: gameRoom.score.get(gameRoom.player1SocketId),
			// 		player2: gameRoom.score.get(gameRoom.player2SocketId)
			// 	},
			// 	ball: {
			// 		y: gameRoom.entities.ball.gameObject.y
			// 	}
			// });
		}

		Matter.Events.on(engine, 'collisionStart', function(event : Matter.IEventCollision<Matter.Engine>) {
			event.pairs.forEach(function(pair: Matter.Pair) {
				//Ball score
				if (pair.bodyB.label == "ball" && (pair.bodyA.label == "left" || pair.bodyA.label == "right")){
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


	sendGameInfoToPlayers(gameRoom: GameRoom){

		// this.server.to(gameRoom.player1SocketId).emit('init', {});
		// this.server.to(gameRoom.player2SocketId).emit('init', {
		// 	roomId: gameRoom.roomId,
		// 	player1SocketId: gameRoom.player1SocketId,
		// 	player2SocketId: gameRoom.player2SocketId
		// });
	}

	@SubscribeMessage('playerJoinQueue')
	handleEvent(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number): void {
		// this.queueList.push(userId);
		// console.info(socket);
		if (this.queueList.length == 0){
			// socket.join(socket.id);
		}
		else {
			// socket.join(this.queueList[0]);
		}
		this.queueList.push(socket.id);
		this.server.to(socket.id).emit('matchmaking', {});
		// this.server.to(this.queueList[0]).emit('matchmaking', {});
		// this.queueList.push(userId);
		// console.log(`${socket.id} joined the queue`)
		// setInterval(() => {
		// 	for (let i = 0; i < this.queueList.length; i++){
		// 		console.log(`In queue ${i}: ${userId}`);
		// 	}
		// }, SERVER_REFRESH_RATE);
	}

	@SubscribeMessage('playerReady')
	handlePlayerReady(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number): void {
		// console.log("test");
		var gameRoom : GameRoom = this.findCorrespondingGame(roomId);
		// console.log(gameRoom);
		if (socket.id == gameRoom.player1SocketId){
			gameRoom.player1Ready = true;
			this.server.to(gameRoom.player2SocketId).emit('otherPlayerReady', {});
			// console.log("player1 is ready");
		}
		else{
			gameRoom.player2Ready = true;
			// console.log("player2 is ready");
			this.server.to(gameRoom.player1SocketId).emit('otherPlayerReady', {});
		}
		if (gameRoom.player1Ready == true && gameRoom.player2Ready == true){
			// console.log("both player are ready");
			// gameRoom.player2SocketId.join(gameRoom.player1SocketId);
			this.server.to(gameRoom.player1SocketId).emit('init', {});
			this.server.to(gameRoom.player2SocketId).emit('init', {});
			setTimeout(() => {
				gameRoom.started = true;
				Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
					x: 3,
					y: 3
				});
			}, 6000);
			// this.server.to(gameRoom.player2SocketId).emit('init', {});
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

		// console.log(`Engine state: ${globalState}`);

		const snapshot = SI.snapshot.create(globalState);

		this.server.to(gameRoom.player1SocketId).emit('snapshot', snapshot);
		this.server.to(gameRoom.player2SocketId).emit('snapshot', snapshot);

		// this.server.to(gameRoom.player2SocketId).emit('snapshot', snapshot);
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
				// console.log(`player 1 position: x ${this.gameRooms[i].entities.players[0].gameObject.position.x} y ${this.gameRooms[i].entities.players[0].gameObject.position.y} \n player 2 position x ${this.gameRooms[i].entities.players[1].gameObject.position.x} y ${this.gameRooms[i].entities.players[1].gameObject.position.y} \n`)
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
