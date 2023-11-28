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


import { GameRoomType, createGameRoom } from '../gameRoom/gameRoom';

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
import { ScoreService } from '../score/score.service';

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


//Server
import { Server } from 'ws';
import { isArray } from 'class-validator';
import { GameRoomModule } from '../gameRoom/gameRoom.module';


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
const SERVER_REFRESH_RATE = 1000 / 60;
const PADDLE_HEIGHT = 94;
const MAX_BOUNCING_ANGLE = 5 * Math.PI/ 12;
//-------------------------------------------------------------------------------------------------------------------------------------------

//UTILS--------------------------------------------------------------------------------------------------------------------------------------
function Between(min : number, max : number){
	return (Math.random() * (max - min) + min)
}

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
//-------------------------------------------------------------------------------------------------------------------------------------------

//Gateway
@WebSocketGateway({
	cors : {
		origin: '*',
	},
})

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

	@WebSocketServer() server: any = io("https://localhost:5173");

	queueListNormalGame : Map<number, string> = new Map();
	queueListCustomGame : Map<number, string> = new Map();

	gameRooms : GameRoomType[] = [];
	roomId: number = 0;

	constructor(
		private readonly QueueListService: QueueListService,
		private readonly GameRoomService: GameRoomService,
		private readonly UserService: UserService,
		private readonly ScoreService: ScoreService
	){}

	handleConnection(){}

	handleDisconnect(client: any) {
		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i].player1SocketId == client.id){
				this.server.to(this.gameRooms[i].player2SocketId).emit('opponentDisconnection');
				this.gameRooms[i].player1Disconnected = true;
				setTimeout(() => {
					if (this.gameRooms[i].player1Disconnected == true){
						this.server.to(this.gameRooms[i].player2SocketId).emit('gameFinish',{
							winUserId: this.gameRooms[i].player2UserId
						})
					}
				}, 10000);
			}
			else if (this.gameRooms[i].player2SocketId == client.id){
				this.server.to(this.gameRooms[i].player1SocketId).emit('opponentDisconnection');
				this.gameRooms[i].player2Disconnected = true;
				setTimeout(() => {
					if (this.gameRooms[i].player2Disconnected == true){
						this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish',{
							winUserId: this.gameRooms[i].player1UserId
						})
					}
				}, 10000);
			}
		}
	}

	afterInit() {
		setInterval(() => {
			for (let i = 0; i < this.gameRooms.length; i++){
				if (this.gameRooms[i].running && this.gameRooms[i].started && this.gameRooms[i].finish == false){
					//Loop through every game room
					//If the game was launch then save her state every SERVER_REFRESH_RATE ms and sending it to game both players of the game.
					//If it wasnt then launch the game engine
					if (this.gameRooms[i].botGame == false){
						const scorePlayer1 = this.gameRooms[i].score.get(this.gameRooms[i].player1SocketId);
						const scorePlayer2 = this.gameRooms[i].score.get(this.gameRooms[i].player2SocketId);

						// console.log(scorePlayer1, scorePlayer2);
						this.checkWinConditionMultiGame(this.gameRooms[i]);
						if (this.gameRooms[i].finish){

							if (scorePlayer1 > scorePlayer2){
								
								this.UserService.updateUserGame(this.gameRooms[i].player1UserId, true);
								this.UserService.updateUserGame(this.gameRooms[i].player2UserId, false);

								this.ScoreService.setWinner(this.gameRooms[i].roomId, this.gameRooms[i].player1UserId);

								this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish', {
									winUserId: this.gameRooms[i].player1UserId
								});
								this.server.to(this.gameRooms[i].player2SocketId).emit('gameFinish', {
									winUserId: this.gameRooms[i].player1UserId
								});
							}
							else{

								this.UserService.updateUserGame(this.gameRooms[i].player1UserId, false);
								this.UserService.updateUserGame(this.gameRooms[i].player2UserId, true);

								this.ScoreService.setWinner(this.gameRooms[i].roomId, this.gameRooms[i].player2UserId);
								this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish', {
									winUserId: this.gameRooms[i].player2UserId
								});
								this.server.to(this.gameRooms[i].player2SocketId).emit('gameFinish', {
									winUserId: this.gameRooms[i].player2UserId
								});
							}

						
							this.UserService.updateStatus(this.gameRooms[i].player1UserId, "online");
							this.UserService.updateStatus(this.gameRooms[i].player2UserId, "online");
	
							//faut rajouter le score
							this.gameRooms[i].finish = true;
							this.gameRooms[i].endDate = new Date();
							this.GameRoomService.updateGameRoom(
								this.gameRooms[i].roomId,
								this.gameRooms[i].player1SocketId,
								this.gameRooms[i].player2SocketId,
								this.gameRooms[i].nbBounces);
						}
						if (this.gameRooms[i].player1Disconnected == false && this.gameRooms[i].player2Disconnected == false){
							// if (this.gameRooms[i].customGame && this.gameRooms[i].entities){

							// 	// console.log(`test ${this.gameRooms[i].entities}`);
							// 	for (let i=0; i < 2; i++){
							// 		console.log(this.gameRooms[i].entities.obstacles[i].rotate(0.1));
							// 	}
							// }
							// console.log(this.gameRooms[i], new Date());
							this.saveGameState(this.gameRooms[i]);
							Engine.update(this.gameRooms[i].engine);
						}
					}
					else if (this.gameRooms[i].botGame == true){
						const scorePlayer1 = this.gameRooms[i].score.get(this.gameRooms[i].player1SocketId);
						const scorePlayer2 = this.gameRooms[i].score.get(this.gameRooms[i].player2SocketId)
						this.checkWinConditionBotGame(this.gameRooms[i]);
						if (this.gameRooms[i].finish){
							if (scorePlayer1 > scorePlayer2){
								this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish', {
									winUserId: this.gameRooms[i].player1UserId
								});
							}
							else{
								this.server.to(this.gameRooms[i].player1SocketId).emit('gameFinish', {
									winUserId: 1001
								});
							}
							this.UserService.updateStatus(this.gameRooms[i].player1UserId, "online");
							
							this.gameRooms[i].finish = true;
							this.gameRooms[i].endDate = new Date();
						}
						else if (this.gameRooms[i].player1Disconnected == false){
							this.saveGameState(this.gameRooms[i]);
							Engine.update(this.gameRooms[i].engine);
						}
					}
			}
			if (this.gameRooms[i].running == false){
				//Starting the game
				this.createGameWorld(this.gameRooms[i], this.gameRooms[i].engine, this.gameRooms[i].world, this.gameRooms[i].entities);
				if (this.gameRooms[i].botGame == false){
					this.GameRoomService.setRunning(this.gameRooms[i].roomId);
				}

				this.UserService.updateStatus(this.gameRooms[i].player1UserId, "ingame");
				if (this.gameRooms[i].botGame == false){
					this.UserService.updateStatus(this.gameRooms[i].player2UserId, "ingame");
				}
				Matter.Engine.run(this.gameRooms[i].engine);
				this.gameRooms[i].running = true;
			}
		}
		}, SERVER_REFRESH_RATE);
	}

	checkWinConditionMultiGame(gameRoom: GameRoomType){
		const scorePlayer1 = gameRoom.score.get(gameRoom.player1SocketId);

		const scorePlayer2 = gameRoom.score.get(gameRoom.player2SocketId);

		(scorePlayer1 >= 3 || scorePlayer2 >= 3) ? gameRoom.finish = true : gameRoom.finish = false;
	}

	checkWinConditionBotGame(gameRoom: GameRoomType){
		const scorePlayer1 = gameRoom.score.get(gameRoom.player1SocketId);

		const scorePlayer2 = gameRoom.score.get("bot");

		(scorePlayer1 >= 3 || scorePlayer2 >= 3) ? gameRoom.finish = true : gameRoom.finish = false;
	}

	createBotGameRoomLocal(gameRoomId: number, player1: any) : GameRoomType{
		let gameRoom = createGameRoom(gameRoomId, player1, null, false, true);

		gameRoom.engine = Matter.Engine.create();

		//Desactive gravity so we got an arcade physic
		gameRoom.engine.gravity.x = 0;
		gameRoom.engine.gravity.y = 0;

		//Default score
		gameRoom.score.set(player1[1], 0);
		gameRoom.score.set("bot", 0);

		gameRoom.entities = new Entities(false, player1[1], "bot");
		gameRoom.world = gameRoom.engine.world;

		return gameRoom;
	}

	createGameRoomLocal(gameRoomId: number, player1: any, player2: any, customGame: Boolean) : GameRoomType{
		let gameRoom = createGameRoom(gameRoomId, player1, player2, customGame, false);

		gameRoom.engine = Matter.Engine.create();

		//Desactive gravity so we got an arcade physic
		gameRoom.engine.gravity.x = 0;
		gameRoom.engine.gravity.y = 0;

		//Default score
		gameRoom.score.set(player1[1], 0);
		gameRoom.score.set(player2[1], 0);

		gameRoom.entities = new Entities(customGame, player1[1], player2[1])
		gameRoom.world = gameRoom.engine.world;

		return gameRoom;
	}

	createGameWorld(gameRoom: GameRoomType, engine: Matter.Engine, world: Matter.World, entities: Entities){

		this.setBallDefaultParameters(entities.ball);

		this.initCollisions(gameRoom.customGame, entities, world);

		this.initCollisionsEvent(engine, gameRoom);
	
	}

	setBallDefaultParameters(ball: Ball){

		//Default ball velocity
		Matter.Body.setVelocity(ball.gameObject, {x: 0, y: 0});

		//Random ball spawning
		Matter.Body.setPosition(ball.gameObject, {x: 500, y: 400});

	}
	
	removeCollisionsEvent(engine: Matter.Engine, gameRoom: GameRoomType){
		// Remove 'collisionStart' event
		Matter.Events.off(engine, 'collisionStart');
	 
		// Remove 'collisionEnd' event
		Matter.Events.off(engine, 'collisionEnd');
	 }
	 

	initCollisions(customGameMode: Boolean, entities: Entities, world: Matter.World){
		Matter.World.add(world, entities.ball.gameObject);

		for (let i = 0; i < 2; i++){
			Matter.World.add(world, entities.players[i].gameObject);
		}

		for (let i = 0; i < 4; i++){
			Matter.World.add(world,  entities.walls[i].gameObject);
		}

		if (customGameMode){
			for (let i = 0; i < 2; i++){
				Matter.World.add(world,  entities.obstacles[i].gameObject);
			}
		}
	}

	initCollisionsEvent(engine: Matter.Engine, gameRoom: GameRoomType){
		const collisionBallPlayer = (pair: Matter.Pair, gameRoom: GameRoomType) => {
			let player: Player;
			var intersectionDeltaY = 0;
			var theta = 0;
			var bouncingAngle = 0;

			pair.bodyA.label == "player1" ?
				player = (gameRoom.entities.players[0].gameObject.label == "player1" ? gameRoom.entities.players[0] : gameRoom.entities.players[1]) :
				player = (gameRoom.entities.players[0].gameObject.label == "player2" ? gameRoom.entities.players[0] : gameRoom.entities.players[1])

				//Relative intersect (between -40 and 40)

				intersectionDeltaY = player.gameObject.position.y  - gameRoom.entities.ball.gameObject.position.y;
			
				//Normalized intersect

				theta = (intersectionDeltaY / (PADDLE_HEIGHT / 2));
				
				//Get speed of incoming ball and saving it
				let velocity = Matter.Body.getVelocity(gameRoom.entities.ball.gameObject);
				let speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

				//Bouncing angle

				bouncingAngle = theta * MAX_BOUNCING_ANGLE;

				let xDirection = (speed + 0.1) * Math.cos(bouncingAngle);
				let yDirection = (speed + 0.1) * -Math.sin(bouncingAngle);

				Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
					x: xDirection,
					y: yDirection
				});
			}

		const scorePoint = (pair: Matter.Pair, gameRoom: GameRoomType) => {
			let scorerId : number;
			let scorePlayer1 = gameRoom.score.get(gameRoom.player1SocketId);
			let scorePlayer2  = gameRoom.score.get(gameRoom.player2SocketId);

			// console.log(gameRoom.roomId, scorePlayer1, scorePlayer2);
			if (gameRoom.finish == false && gameRoom.player1Disconnected == false && (gameRoom.player2Disconnected == false || gameRoom.botGame)){
				if (pair.bodyA.label == "left"){
					scorerId = gameRoom.player2UserId;
					gameRoom.score.set(gameRoom.player2SocketId, ++scorePlayer2);
					this.ScoreService.updateGameRoomScore(
						gameRoom.roomId,
						scorerId,
						scorePlayer1,
						scorePlayer2);
				}
				else{
					scorerId = gameRoom.player1UserId;
					gameRoom.score.set(gameRoom.player1SocketId, ++scorePlayer1);
					this.ScoreService.updateGameRoomScore(
						gameRoom.roomId,
						scorerId,
						scorePlayer1,
						scorePlayer2);
				}
			}
		}

		const ballRespawn = (gameRoom: GameRoomType, pair: Matter.Pairs) => {
			let randY = Between(10, 790);
			var vecX : number;
			var vecY : number;
	
			var coinFlip = randomInt(0, 1);

			if (coinFlip == 1){
				vecY = -4;
			}
			else{
				vecY = 4;
			}

			if (pair.bodyA.label == "left"){
				vecX = -4;
			}
			else{
				vecX = 4;
			}

			this.server.to(gameRoom.player1SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.score.get(gameRoom.player1SocketId),
					player2: gameRoom.score.get(gameRoom.player2SocketId)
				},
				ball: {
					y: randY,
				}
			});
			this.server.to(gameRoom.player2SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.score.get(gameRoom.player1SocketId),
					player2: gameRoom.score.get(gameRoom.player2SocketId)
				},
				ball: {
					y: randY,
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
					x: vecX,
					y: vecY
				});

				this.server.to(gameRoom.player1SocketId).emit('restartAfterScore', {
					ball: {
						vecX: vecX,
						vecY: vecY
					}
				});
				this.server.to(gameRoom.player2SocketId).emit('restartAfterScore', {
					ball: {
						vecX: vecX,
						vecY: vecY
					}
				});
				gameRoom.paused = false;
			}, 3000);
		}

		Matter.Events.on(engine, 'collisionStart', function(event : Matter.IEventCollision<Matter.Engine>) {
			event.pairs.forEach(function(pair: Matter.Pair) {
				//Ball score
				if (pair.bodyB.label == "ball" && (pair.bodyA.label == "left" || pair.bodyA.label == "right")){
					gameRoom.paused = true;
					scorePoint(pair, gameRoom);

					ballRespawn(gameRoom, pair);
				}
				//Elastic physics
				else if (pair.bodyB.label == "ball" && (pair.bodyA.label == "player1"|| pair.bodyA.label == "player2")){
					collisionBallPlayer(pair, gameRoom);
					gameRoom.nbBounces++;
				}
			}, this);
		});

		Matter.Events.on(engine, 'collisionEnd', function(event : Matter.IEventCollision<Matter.Engine>) {
			event.pairs.forEach(function(pair: Matter.Pair) {
				if (pair.bodyB.label == "ball" && (pair.bodyA.label == "up" || pair.bodyA.label == "down")){
					let velocity = Matter.Body.getVelocity(gameRoom.entities.ball.gameObject);
					gameRoom.nbBounces++;

					var velX : number;
					var velY : number;
					if (velocity.x > 0){
						velX = velocity.x + 0.1;
					}
					else if (velocity.x < 0){
						velX = velocity.x - 0.1;
					}
					if (velocity.y > 0){
						velY = velocity.y + 0.1;
					}
					else if (velocity.y < 0){
						velY = velocity.y - 0.1;
					}
					//Bouncing angle
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: velX,
						y: velY,
					});
				}
			});
		});
	}

	@SubscribeMessage('botGame')
	handleBotGame(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number): void {
		const roomId = randomInt(1000, 5000);
		let gameRoom = this.createBotGameRoomLocal(roomId, [userId, socket.id]);
		this.GameRoomService.createGameRoom([userId, socket.id], undefined, true, false);
		this.gameRooms.push(gameRoom);
	
		this.server.to(socket.id).emit('botReady', {
			roomId: roomId
		});

		setTimeout(() => {
			gameRoom.started = true;
			Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
				x: 4,
				y: 4
			});
		}, 3000);
	}

	@SubscribeMessage('playerJoinNormalQueue')
	async handleJoinQueueNormal(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number) {
		this.queueListNormalGame.set(userId, socket.id);
		var localRoom : GameRoomType;
		var user1 : any;
		var user2 : any;

		if (this.queueListNormalGame.size >= 2){
			const first = this.queueListNormalGame.entries().next().value;

			this.queueListNormalGame.delete(first[0]);
	
			const second = this.queueListNormalGame.entries().next().value;
	
			user1 = await this.UserService.getUserById(first[0]);
	
			user2 = await this.UserService.getUserById(second[0]);
	
			this.queueListNormalGame.delete(second[0]);

			//Database service
			const gameRoom = await this.GameRoomService.createGameRoom(first, second, false, false);

			localRoom = this.createGameRoomLocal(gameRoom.id, first, second, false);

			this.gameRooms.push(localRoom);

			this.server.to(localRoom.player1SocketId).emit('lobby', {
				roomId: localRoom.roomId,
				customGameMode: false,
				player1SocketId: localRoom.player1SocketId,
				player2SocketId: localRoom.player2SocketId,
				player1UserName: user1.userName,
				player2UserName: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
	
			this.server.to(localRoom.player2SocketId).emit('lobby', {
				roomId: localRoom.roomId,
				customGameMode: false,
				player1SocketId: localRoom.player1SocketId,
				player2SocketId: localRoom.player2SocketId,
				player1UserName: user1.userName,
				player2UserName: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
		}

		this.server.to(socket.id).emit('matchmaking', {});
	}

	@SubscribeMessage('stopPlay')
	async handleStopPlay(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number) {
		var gameRoom = this.findCorrespondingGame(roomId);
		gameRoom.finish = true;
	
		this.removeCollisionsEvent(gameRoom.engine, gameRoom);

	}

	@SubscribeMessage('playerJoinCustomQueue')
	async handleJoinQueueCustom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number) {
		this.queueListCustomGame.set(userId, socket.id);
		var localRoom : GameRoomType;
		var user1 : any;
		var user2 : any;

		if (this.queueListCustomGame.size >= 2){
			const first = this.queueListCustomGame.entries().next().value;

			this.queueListCustomGame.delete(first[0]);
	
			const second = this.queueListCustomGame.entries().next().value;
	
			user1 = await this.UserService.getUserById(first[0]);
	
			user2 = await this.UserService.getUserById(second[0]);
	
			this.queueListCustomGame.delete(second[0]);
	
			//Database service
	
			const gameRoom = await this.GameRoomService.createGameRoom(first, second, false, true);
	
			localRoom = this.createGameRoomLocal(gameRoom.id, first, second, true);

			this.gameRooms.push(localRoom);

			this.server.to(localRoom.player1SocketId).emit('lobby', {
				roomId: localRoom.roomId,
				customGameMode: true,
				player1SocketId: localRoom.player1SocketId,
				player2SocketId: localRoom.player2SocketId,
				player1UserName: user1.userName,
				player2UserName: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
	
			this.server.to(localRoom.player2SocketId).emit('lobby', {
				roomId: localRoom.roomId,
				customGameMode: true,
				player1SocketId: localRoom.player1SocketId,
				player2SocketId: localRoom.player2SocketId,
				player1UserName: user1.userName,
				player2UserName: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
		}
		else{
			this.server.to(socket.id).emit('matchmaking', {});
		}
	}

	@SubscribeMessage('playerReconnection')
	async handlePlayerReconnection(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data : { roomId: number, userId: number }) {
		
		let gameRoom = this.findCorrespondingGame(data.roomId);

		if (!gameRoom){
			return ;
		}
		const user1 = await this.UserService.getUserById(gameRoom.player1UserId);
		const user2 = await this.UserService.getUserById(gameRoom.player2UserId);

		if (gameRoom && gameRoom.player1UserId == data.userId){

			gameRoom.player1SocketId = socket.id;

			this.server.to(gameRoom.player2SocketId).emit('opponentReconnection',{
				userId: gameRoom.player1UserId,
				playerSocket: socket.id
			});

			this.server.to(socket.id).emit('informOnReconnection',{
				roomId: gameRoom.roomId,
				customGameMode: gameRoom.customGame,
				player1SocketId: gameRoom.player1SocketId,
				player2SocketId: gameRoom.player2SocketId,
				player1UserId: gameRoom.player1UserId,
				player2UserId: gameRoom.player2UserId,
				player1UserName: user1.userName,
				player2UserName: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
		}
		else if (gameRoom && gameRoom.player2UserId == data.userId){

			gameRoom.player2SocketId = socket.id;

			this.server.to(gameRoom.player1SocketId).emit('opponentReconnection',{
				userId: gameRoom.player2UserId,
				playerSocket: socket.id
			});

			this.server.to(socket.id).emit('informOnReconnection',{
				roomId: gameRoom.roomId,
				player1SocketId: gameRoom.player1SocketId,
				player2SocketId: gameRoom.player2SocketId,
				player1UserId: gameRoom.player1UserId,
				player2UserId: gameRoom.player2UserId,
				player1UserName: user1.userName,
				player2UserName: user2.userName,
				player1Image: user1.image,
				player2Image: user2.image
			});
		}
		if (gameRoom){
			setTimeout(() => {
				this.server.to(gameRoom.player1SocketId).emit('resumeGame');
				this.server.to(gameRoom.player2SocketId).emit('resumeGame');
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
				
				const user1 = await this.UserService.getUserById(gameRoom.player1UserId);
				const user2 = await this.UserService.getUserById(gameRoom.player2UserId);

				//Db service
				var newGameRoom = await this.GameRoomService.createGameRoom(
					[ gameRoom.player1UserId, gameRoom.player1SocketId ],
					[ gameRoom.player2UserId, gameRoom.player2SocketId ],
					false,
					gameRoom.customGame);

				//Erasing previous game from local array
				let indexGameRoom = this.gameRooms.indexOf(gameRoom);
	
				//Recreating a new game room with same both users
				const localRoom = this.createGameRoomLocal(
					newGameRoom.id,
					[ gameRoom.player1UserId, newGameRoom.player1SocketId ],
					[ gameRoom.player2UserId, newGameRoom.player2SocketId ],
					gameRoom.customGame);

				this.gameRooms.splice(indexGameRoom, 1);

				this.gameRooms.push(localRoom);

				this.server.to(localRoom.player1SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1UserName: user1.userName,
					player2UserName: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image
				});
				this.server.to(localRoom.player2SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1UserName: user1.userName,
					player2UserName: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image
				});
			}
		}
	}

	@SubscribeMessage('localGame')
	async handleInvitation(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number) {
		setTimeout(async () => {
			const user1 = await this.UserService.getUserById(userId);
			(user1.socket);
			this.server.to(user1.socket).emit('localGameCreated', {
				// player1SocketId: socket.id,
				// player1UserName: user1.userName,
				// player1Image: user1.image,
			});
		}, 5000);
	}

	@SubscribeMessage('playAgain')
	handlePlayAgain(
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

	@SubscribeMessage('playerLeaveLobby')
	handlePlayerLeaveLobby(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number): void {
		var gameRoom : GameRoomType = this.findCorrespondingGame(roomId);
		if (socket.id == gameRoom.player1SocketId){
			gameRoom.player1Ready = true;
			this.server.to(gameRoom.player2SocketId).emit('otherPlayerLeaveLobby', {});
		}
		else{
			gameRoom.player2Ready = true;
			this.server.to(gameRoom.player1SocketId).emit('otherPlayerLeaveLobby', {});
		}
	}

	@SubscribeMessage('playerReady')
	handlePlayerReady(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number): void {
		var gameRoom : GameRoomType = this.findCorrespondingGame(roomId);
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
		}
	}

	@SubscribeMessage('readyAfterInit')
	handleGameStart(
		@ConnectedSocket() socket: Socket,
		@MessageBody() data: {roomId: number, socketId: string }) : void {

		var gameRoom : GameRoomType = this.findCorrespondingGame(data.roomId);

		if (gameRoom && socket.id == gameRoom.player1SocketId){
			gameRoom.player1Spawn = true;
		}
		else if (gameRoom){
			gameRoom.player2Spawn = true;
		}
		if (gameRoom && gameRoom.player1Spawn == true && gameRoom.player2Spawn == true){
			this.server.to(gameRoom.player1SocketId).emit('gameStart');
			this.server.to(gameRoom.player2SocketId).emit('gameStart');

			setTimeout(() => {
				gameRoom.started = true;
				Matter.Body.setVelocity(gameRoom.entities.ball.gameObject,{
					x: 4,
					y: 4
				});
				gameRoom.player2Ready = false;
				gameRoom.player1Ready = false;
			}, 3000);
		}
	}
	

	botPlay(gameRoom: GameRoomType){
		//IA Thinking
		Matter.Body.setPosition(gameRoom.entities.players[1].gameObject,
		{
			x: gameRoom.entities.players[1].gameObject.position.x,
			y: gameRoom.entities.ball.gameObject.position.y
		});
	}

	saveGameState(gameRoom: GameRoomType){
		//We take a snapshot of ball and players position
		let velocity : any;

		if (gameRoom.entities){
			velocity = Matter.Body.getVelocity(gameRoom.entities.ball.gameObject);
		}

		if (gameRoom.botGame == true ){
			this.botPlay(gameRoom);
		}
		if (gameRoom.customGame && gameRoom.entities){
			Matter.Body.rotate(gameRoom.entities.obstacles[0].gameObject, 0.05);
			Matter.Body.rotate(gameRoom.entities.obstacles[1].gameObject, 0.05);
		}

		const ballState = [{
			id: '0',
			x : gameRoom.entities.ball.gameObject.position.x,
			y : gameRoom.entities.ball.gameObject.position.y,
			velX: velocity.x,
			velY: velocity.y
		}];
	
		var obstaclesState: any;

		if (gameRoom.customGame){
			obstaclesState = [{
				id: '0',
				delta: gameRoom.entities.obstacles[0].angle
			}];
		}

		var playerState : any;


		if (gameRoom.botGame == false){
			playerState = [{
				id : gameRoom.player1SocketId,
				x : gameRoom.entities.players[0].gameObject.position.x,
				y : gameRoom.entities.players[0].gameObject.position.y
			},
			{
				id : gameRoom.player2SocketId,
				x : gameRoom.entities.players[1].gameObject.position.x,
				y : gameRoom.entities.players[1].gameObject.position.y
			}]
		}
		else{
			playerState = [{
				id : gameRoom.player1SocketId,
				x : gameRoom.entities.players[0].gameObject.position.x,
				y : gameRoom.entities.players[0].gameObject.position.y
			},
			{
				id : 100001,
				x : gameRoom.entities.players[1].gameObject.position.x,
				y : gameRoom.entities.players[1].gameObject.position.y
			}]
		}

		var globalState : any;
		//Better use JSON stringify function to do this
		if (gameRoom.customGame == false){
			globalState = {
				players : playerState,
				ball: ballState
			}
		}
		else{
			globalState = {
				players: playerState,
				ball: ballState,
				obstacles: obstaclesState
			}
		}

		const snapshot = SI.snapshot.create(globalState);

		this.server.to(gameRoom.player1SocketId).emit('snapshot', snapshot);
		if (gameRoom.botGame == false){
			this.server.to(gameRoom.player2SocketId).emit('snapshot', snapshot);
		}
	}

	@SubscribeMessage('playerMovement')
	handlePlayerMovement(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: {roomId: number, socketId: string, x: number,y : number}): void {
		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i].roomId == data.roomId){
				// Update player position in data structure
				if (this.gameRooms[i].player1SocketId == data.socketId || this.gameRooms[i].botGame == true){
					Matter.Body.setPosition(this.gameRooms[i].entities.players[0].gameObject, {
						x: this.gameRooms[i].entities.players[0].gameObject.position.x,
						//The collision between the players and upper lower wall is hardcoded by clamping the y value
						y: Math.min(Math.max(data.y, 75), 725)
					});
				}
				else if (this.gameRooms[i].botGame == false && this.gameRooms[i].player2SocketId == data.socketId){
					Matter.Body.setPosition(this.gameRooms[i].entities.players[1].gameObject, {
						x: this.gameRooms[i].entities.players[1].gameObject.position.x,
						y: Math.min(Math.max(data.y, 75), 725)
					});
				}
			}
		}
	}

	findCorrespondingGame(roomId: number) : GameRoomType{
		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i].roomId == roomId){
				return (this.gameRooms[i]);
			}
		}
		return null;
	}
}
