import {
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	MessageBody,
	ConnectedSocket,
	OnGatewayDisconnect,
	OnGatewayInit,
	OnGatewayConnection
} from '@nestjs/websockets';

import {  createGameRoom } from '../gameRoom/gameRoom';

//Socket
import { Socket } from 'socket.io';

//Game Engine
import * as Matter from 'matter-js';

//Snapshot
import '@geckos.io/snapshot-interpolation';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';

//Services
import { UserService } from '../user/user.service';
import { GameRoomService } from '../gameRoom/gameRoom.service';
import { ScoreService } from '../score/score.service';

//ORM
import { User } from '@prisma/client';

//Interfaces
import { GameRoom } from '../gameRoom/gameRoom.interface';

//Entities
import Entities from '../entities/entities';
import Ball from '../entities/ball';
import Player from '../entities/player';        

//Server
import { Server } from 'ws';

//Aliases
const Engine = Matter.Engine,
	World = Matter.World,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite;

//Defines
const SERVER_REFRESH_RATE = 1000 / 60;
const PADDLE_HEIGHT = 94;
const MAX_BOUNCING_ANGLE = 5 * Math.PI/ 12;
const MAX_SCORE = 3;
const MIN_SCORE = 0;
const GAME_COUNTDOWN_START = 3000;

//Initialize the snapshot library
const SI = new SnapshotInterpolation();

//Utils
function Between(min : number, max : number){
	return (Math.random() * (max - min) + min)
}

const randomInt = (min : number, max : number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

@WebSocketGateway({
	cors : {
		origin: '*',
	},
})

export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

	@WebSocketServer()
	server: Server;

	queueListNormalGame : Map<number, string> = new Map();
	queueListCustomGame : Map<number, string> = new Map();

	gameRooms : GameRoom[] = [];
	roomId: number = 0;

	constructor(
		private readonly GameRoomService: GameRoomService,
		private readonly UserService: UserService,
		private readonly ScoreService: ScoreService
	){}

	handleConnection(socket: Socket){}

	async handleDisconnect(socket: Socket) {
		//If disconnected user was inside a game room
		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i]?.finish == false && this.gameRooms[i].active == true && this.gameRooms[i]?.running == true && this.gameRooms[i]?.insideLobby == false){
				//If game is running
				if (this.gameRooms[i]?.player1SocketId == socket.id){
					this.gameRooms[i].active = false;
					this.server.to(this.gameRooms[i]?.player2SocketId).emit('gameFinish', {
						winUserId: this.gameRooms[i]?.player2UserId,
						scoreWinner: MAX_SCORE,
						scoreLooser: MIN_SCORE,
						opponentAfk: true
					});
					await this.UserService.updateStatus(this.gameRooms[i]?.player1UserId, "offline");
					await this.UserService.updateStatus(this.gameRooms[i]?.player2UserId, "online");

					await this.UserService.updateUserGame(this.gameRooms[i]?.player1UserId, false);
					await this.UserService.updateUserGame(this.gameRooms[i]?.player2UserId, true);

					await this.GameRoomService.updateGameRoom(
						this.gameRooms[i]?.roomId,
						this.gameRooms[i]?.player1SocketId,
						this.gameRooms[i]?.player2SocketId,
						true,
						false
					);
			
					await this.ScoreService.updateGameRoomScore(
						this.gameRooms[i]?.roomId,
						undefined,
						MIN_SCORE,
						MAX_SCORE
					);
				
					await this.ScoreService.setWinByAfk(this.gameRooms[i]?.roomId);
					await this.ScoreService.setWinner(this.gameRooms[i]?.roomId, this.gameRooms[i]?.player2UserId);
					this.removeCollisionsEvent(this.gameRooms[i]);
					World.clear(this.gameRooms[i]?.world);
					Engine.clear(this.gameRooms[i]?.engine);
					this.gameRooms[i].finish = true;

				}
				else if (this.gameRooms[i]?.player2SocketId == socket.id){
					this.gameRooms[i].active = false;

					this.server.to(this.gameRooms[i]?.player1SocketId).emit('gameFinish', {
						winUserId: this.gameRooms[i]?.player1UserId,
						scoreWinner: MAX_SCORE,
						scoreLooser: MIN_SCORE,
						opponentAfk: true 
					});
					await this.UserService.updateStatus(this.gameRooms[i]?.player1UserId, "online");
					await this.UserService.updateStatus(this.gameRooms[i]?.player2UserId, "offline");

					await this.UserService.updateUserGame(this.gameRooms[i]?.player1UserId, true);
					await this.UserService.updateUserGame(this.gameRooms[i]?.player2UserId, false);

					await this.GameRoomService.updateGameRoom(
						this.gameRooms[i]?.roomId,
						this.gameRooms[i]?.player1SocketId,
						this.gameRooms[i]?.player2SocketId,
						false,
						true);
						await this.ScoreService.updateGameRoomScore(
						this.gameRooms[i]?.roomId,
						undefined,
						MAX_SCORE,
						MIN_SCORE
					);

					await this.ScoreService.setWinByAfk(this.gameRooms[i]?.roomId);
					await this.ScoreService.setWinner(this.gameRooms[i]?.roomId, this.gameRooms[i]?.player1UserId);

					this.removeCollisionsEvent(this.gameRooms[i]);
					World.clear(this.gameRooms[i]?.world);
					Engine.clear(this.gameRooms[i]?.engine);

					this.gameRooms[i].finish = true;
				}
			}
			else if (this.gameRooms[i]?.finish == false && this.gameRooms[i].active == true && this.gameRooms[i]?.started == false && this.gameRooms[i]?.insideLobby == true){
				//Still inside lobby
				if (socket.id == this.gameRooms[i]?.player1SocketId){
					this.gameRooms[i].player1Ready = true;
					this.UserService.updateStatus(this.gameRooms[i]?.player1UserId, "online");
					this.server.to(this.gameRooms[i]?.player2SocketId).emit('otherPlayerLeaveLobby', {});
					//Game never happened
					this.removeCollisionsEvent(this.gameRooms[i]);
					World.clear(this.gameRooms[i]?.world);
					Engine.clear(this.gameRooms[i]?.engine);
					// this.GameRoomService.deleteGameRoomByGameRoomId(this.gameRooms[i]?.roomId);
					this.gameRooms[i].active == false;
				}
				else if (socket.id == this.gameRooms[i]?.player2SocketId){
					this.gameRooms[i].player2Ready = true;
					this.UserService.updateStatus(this.gameRooms[i]?.player2UserId, "online");
					this.server.to(this.gameRooms[i]?.player1SocketId).emit('otherPlayerLeaveLobby', {});
					//Game never happened
					this.removeCollisionsEvent(this.gameRooms[i]);
					World.clear(this.gameRooms[i]?.world);
					Engine.clear(this.gameRooms[i]?.engine);
					// this.GameRoomService.deleteGameRoomByGameRoomId(this.gameRooms[i]?.roomId);
					this.gameRooms[i].active == false;
				}
	
			}
			else if(this.gameRooms[i].active == true){
				//If one player leave once the game is finish without clicking stop button then we delete the gameroom
				if (socket.id == this.gameRooms[i]?.player1SocketId){
					this.server.to(this.gameRooms[i]?.player2SocketId).emit('playStop');
					this.removeCollisionsEvent(this.gameRooms[i]);
					World.clear(this.gameRooms[i]?.world);
					Engine.clear(this.gameRooms[i]?.engine);
					this.gameRooms[i].active == false;
				}
				else if (socket.id == this.gameRooms[i]?.player2SocketId){
					this.server.to(this.gameRooms[i]?.player1SocketId).emit('playStop');
					this.removeCollisionsEvent(this.gameRooms[i]);
					World.clear(this.gameRooms[i]?.world);
					Engine.clear(this.gameRooms[i]?.engine);
					this.gameRooms[i].active == false;
				}
			}
		}

		for (let [userId, userSocket] of this.queueListCustomGame.entries()) {
			if (userSocket == socket.id) {
				this.queueListCustomGame.delete(userId);
				break;
			}
		}

		for (let [userId, userSocket] of this.queueListNormalGame.entries()) {
			if (userSocket == socket.id) {
				this.queueListNormalGame.delete(userId);
				break;
			}
		}
	}

	async afterInit() {
		setInterval(async () => {
			for (let i = 0; i < this.gameRooms.length; i++){
				if (this.gameRooms[i] && this.gameRooms[i].active == true && this.gameRooms[i]?.running && this.gameRooms[i]?.started && this.gameRooms[i]?.finish == false && this.gameRooms[i]?.pausedAfk == false){
					//Loop through every game room
					//If the game was launch then save her state every SERVER_REFRESH_RATE ms and sending it to game both players of the game.
					//If it wasnt then launch the game engine
					const scorePlayer1 = this.gameRooms[i]?.score.get(this.gameRooms[i]?.player1UserId.toString());
					const scorePlayer2 = this.gameRooms[i]?.score.get(this.gameRooms[i]?.player2UserId.toString());
					this.checkWinConditionMultiGame(this.gameRooms[i]);
					if (this.gameRooms[i]?.finish){
						if (scorePlayer1 > scorePlayer2){
							//End game lobby
							await this.UserService.updateStatus(this.gameRooms[i]?.player1UserId, "lobby");
							await this.UserService.updateStatus(this.gameRooms[i]?.player2UserId, "lobby");

							await this.UserService.updateUserGame(this.gameRooms[i]?.player1UserId, true);
							await this.UserService.updateUserGame(this.gameRooms[i]?.player2UserId, false);

							await this.ScoreService.setWinner(this.gameRooms[i]?.roomId, this.gameRooms[i]?.player1UserId);
							this.gameRooms[i].winnerId = this.gameRooms[i]?.player1UserId;

							this.server.to(this.gameRooms[i]?.player1SocketId).emit('gameFinish', {
								winUserId: this.gameRooms[i]?.player1UserId,
								scoreWinner: scorePlayer1,
								scoreLooser: scorePlayer2,
								opponentAfk: false
							});
							this.server.to(this.gameRooms[i]?.player2SocketId).emit('gameFinish', {
								winUserId: this.gameRooms[i]?.player1UserId,
								scoreWinner: scorePlayer1,
								scoreLooser: scorePlayer2,
								opponentAfk: false
							});

							this.removeCollisionsEvent(this.gameRooms[i]);
							World.clear(this.gameRooms[i]?.world);
							Engine.clear(this.gameRooms[i]?.engine);
						}
						else{
							//End game lobby
							await this.UserService.updateStatus(this.gameRooms[i]?.player1UserId, "lobby");
							await this.UserService.updateStatus(this.gameRooms[i]?.player2UserId, "lobby");
		
							await this.UserService.updateUserGame(this.gameRooms[i]?.player1UserId, false);
							await this.UserService.updateUserGame(this.gameRooms[i]?.player2UserId, true);

							await this.ScoreService.setWinner(this.gameRooms[i]?.roomId, this.gameRooms[i]?.player2UserId);
							this.gameRooms[i].winnerId = this.gameRooms[i]?.player2UserId;

							this.server.to(this.gameRooms[i]?.player1SocketId).emit('gameFinish', {
								winUserId: this.gameRooms[i]?.player2UserId,
								scoreWinner: scorePlayer2,
								scoreLooser: scorePlayer1,
								opponentAfk: false 
							});
							this.server.to(this.gameRooms[i]?.player2SocketId).emit('gameFinish', {
								winUserId: this.gameRooms[i]?.player2UserId,
								scoreWinner: scorePlayer2,
								scoreLooser: scorePlayer1,
								opponentAfk: false
							});
							this.removeCollisionsEvent(this.gameRooms[i]);
							World.clear(this.gameRooms[i]?.world);
							Engine.clear(this.gameRooms[i]?.engine);
						}
						// await this.UserService.updateStatus(this.gameRooms[i]?.player1UserId, "online");
						// await this.UserService.updateStatus(this.gameRooms[i]?.player2UserId, "online");
						this.gameRooms[i].endDate = new Date();
						await this.GameRoomService.updateGameRoom(
							this.gameRooms[i]?.roomId,
							this.gameRooms[i]?.player1SocketId,
							this.gameRooms[i]?.player2SocketId,
							false,
							false);
						this.gameRooms[i].active = false;
					}
					if (this.gameRooms[i] && this.gameRooms[i]?.player1Disconnected == false && this.gameRooms[i]?.player2Disconnected == false){
						this.saveGameState(this.gameRooms[i]);
						Engine.update(this.gameRooms[i]?.engine);
					}
			}
      		else if (this.gameRooms[i] && this.gameRooms[i].active == true && this.gameRooms[i]?.running == false){
				//Starting the game
				this.createGameWorld(this.gameRooms[i], this.gameRooms[i]?.engine, this.gameRooms[i]?.world, this.gameRooms[i]?.entities);
				this.GameRoomService.setRunning(this.gameRooms[i]?.roomId);

				Matter.Engine.run(this.gameRooms[i]?.engine);
				this.gameRooms[i].running = true;
			}
		}
		}, SERVER_REFRESH_RATE);
	}

	checkWinConditionMultiGame(gameRoom: GameRoom){
		const scorePlayer1 = gameRoom.score.get(gameRoom.player1UserId.toString());
		const scorePlayer2 = gameRoom.score.get(gameRoom.player2UserId.toString());
		(scorePlayer1 >= MAX_SCORE || scorePlayer2 >= MAX_SCORE) ? gameRoom.finish = true : gameRoom.finish = false;
	}

	createGameRoomLocal(gameRoomId: number, player1: any, player2: any, customGame: boolean) : GameRoom{
		let gameRoom = createGameRoom(gameRoomId, player1, player2, customGame);
		gameRoom.engine = Matter.Engine.create();
		//Desactive gravity so we got an arcade physic
		gameRoom.engine.gravity.x = 0;
		gameRoom.engine.gravity.y = 0;
		//Default score
		gameRoom.score.set(player1[0].toString(), 0);
		gameRoom.score.set(player2[0].toString(), 0);
		gameRoom.entities = new Entities(customGame, player1[1], player2[1])
		gameRoom.world = gameRoom.engine.world;
		return gameRoom;
	}

	createGameWorld(gameRoom: GameRoom, engine: Matter.Engine, world: Matter.World, entities: Entities){
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
	
	removeCollisionsEvent(gameRoom: GameRoom){
		// Remove 'collisionStart' event
		Matter.Events.off(gameRoom.engine, 'collisionStart');
		// Remove 'collisionEnd' event
		Matter.Events.off(gameRoom.engine, 'collisionEnd');
	}

	initCollisions(customGameMode: Boolean, entities: Entities, world: Matter.World){
		Matter.World.add(world, entities.ball.gameObject);
		for (let i = 0; i < 2; i++)
			Matter.World.add(world, entities.players[i].gameObject);
		if (customGameMode){
			for (let i = 0; i < 8; i++)
				Matter.World.add(world,  entities.walls[i].gameObject);
		}
		else{
			for (let i = 0; i < 4; i++)
				Matter.World.add(world,  entities.walls[i].gameObject);
		}
		if (customGameMode){
			for (let i = 2; i < 4; i++)
				Matter.World.add(world, entities.players[i].gameObject);
		}
	}

	initCollisionsEvent(engine: Matter.Engine, gameRoom: GameRoom){
		const collisionBallPlayer = (pair: Matter.Pair, gameRoom: GameRoom) => {
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

		const scorePoint = (pair: Matter.Pair, gameRoom: GameRoom) => {
			let scorerId : number;

			let scorePlayer1 = gameRoom.score.get(gameRoom.player1UserId.toString());
			let scorePlayer2  = gameRoom.score.get(gameRoom.player2UserId.toString());
			if (gameRoom.finish == false){
				//Custom game
				if (pair.bodyA.label == "leftmid" || pair.bodyA.label == "leftup" || pair.bodyA.label == "leftdown"){
					scorerId = gameRoom.player2UserId;
					gameRoom.score.set(gameRoom.player2UserId.toString(), ++scorePlayer2);
					this.ScoreService.updateGameRoomScore(
						gameRoom.roomId,
						scorerId,
						scorePlayer1,
						scorePlayer2);
				}
				else if (pair.bodyA.label == "rightmid" || pair.bodyA.label == "rightup" || pair.bodyA.label == "rightdown"){
					scorerId = gameRoom.player1UserId;
					gameRoom.score.set(gameRoom.player1UserId.toString(), ++scorePlayer1);
					this.ScoreService.updateGameRoomScore(
						gameRoom.roomId,
						scorerId,
						scorePlayer1,
						scorePlayer2);
				}
				//Normal game
				if (pair.bodyA.label == "left"){
					scorerId = gameRoom.player2UserId;
					gameRoom.score.set(gameRoom.player2UserId.toString(), ++scorePlayer2);
					this.ScoreService.updateGameRoomScore(
						gameRoom.roomId,
						scorerId,
						scorePlayer1,
						scorePlayer2);
				}
				else if (pair.bodyA.label == "right"){
					scorerId = gameRoom.player1UserId;
					gameRoom.score.set(gameRoom.player1UserId.toString(), ++scorePlayer1);
					this.ScoreService.updateGameRoomScore(
						gameRoom.roomId,
						scorerId,
						scorePlayer1,
						scorePlayer2);
				}
			}
		}

		const ballRespawn = (gameRoom: GameRoom, pair: Matter.Pairs) => {
			let randY = Between(10, 790);
			var vecX : number;
			var vecY : number;
	
			var coinFlip = randomInt(0, 1);
			if (coinFlip == 1)
				vecY = -3;
			else
				vecY = 3;
			if (pair.bodyA.label == "left")
				vecX = -3;
			else
				vecX = 3;
			this.server.to(gameRoom.player1SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.score.get(gameRoom.player1UserId.toString()),
					player2: gameRoom.score.get(gameRoom.player2UserId.toString())
				},
				ball: {
					y: randY,
				}
			});

			this.server.to(gameRoom.player2SocketId).emit('scorePoint', {
				score : {
					player1: gameRoom.score.get(gameRoom.player1UserId.toString()),
					player2: gameRoom.score.get(gameRoom.player2UserId.toString())
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
				if (gameRoom.pausedAfk == false){
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
       		 	}
			}, GAME_COUNTDOWN_START);
		}

		const self = this;
		Matter.Events.on(engine, 'collisionStart', function(event : Matter.IEventCollision<Matter.Engine>) {
			event.pairs.forEach(function(pair: Matter.Pair) {
				//Normal game mode rules
				if (gameRoom && gameRoom.customGame == false){
					if (pair.bodyB.label == "ball" && (pair.bodyA.label == "left" || pair.bodyA.label == "right")){
						gameRoom.paused = true;
						scorePoint(pair, gameRoom);
						ballRespawn(gameRoom, pair);
					}
					else if (pair.bodyB.label == "ball" && (pair.bodyA.label == "player1" || pair.bodyA.label == "player2")){
						collisionBallPlayer(pair, gameRoom);
					}
				}
				//Custom game mode rules
				else if (gameRoom && gameRoom.customGame == true){
					if (pair.bodyB.label == "ball" && (pair.bodyA.label == "leftmid" || pair.bodyA.label == "rightmid")){
						gameRoom.paused = true;
						scorePoint(pair, gameRoom);
						ballRespawn(gameRoom, pair);
					}
					//Elastic physics
					else if (pair.bodyB.label == "ball" && (pair.bodyA.label == "player1" || pair.bodyA.label == "player2")){
						if (gameRoom && gameRoom.entities && gameRoom.entities.ball && gameRoom.customGame){
							let velocity = Matter.Body.getVelocity(gameRoom.entities.ball.gameObject);
							if (velocity.x > 0 && pair.bodyA.label == "player1" && gameRoom.entities.ball.gameObject.position.x > 500)
								pair.isActive = false;
							else if (velocity.x < 0 && pair.bodyA.label == "player2" && gameRoom.entities.ball.gameObject.position.x < 500)
								pair.isActive = false;
							else
								collisionBallPlayer(pair, gameRoom);
						}	
					}
				}
			}, this);
		});

		Matter.Events.on(engine, 'collisionEnd', function(event : Matter.IEventCollision<Matter.Engine>) {
			event.pairs.forEach(function(pair: Matter.Pair) {
				if (pair.bodyB.label == "ball" && (pair.bodyA.label == "up" || pair.bodyA.label == "down")){
					let velocity = Matter.Body.getVelocity(gameRoom.entities.ball.gameObject);

					var velX : number;
					var velY : number;
					if (velocity.x > 0)
						velX = velocity.x + 0.1;
					else if (velocity.x < 0)
						velX = velocity.x - 0.1;
					if (velocity.y > 0)
						velY = velocity.y + 0.1;
					else if (velocity.y < 0)
						velY = velocity.y - 0.1;
					//Bouncing angle
					Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {
						x: velX,
						y: velY,
					});
				}
		
			});
		});
	}

	@SubscribeMessage('inviteInGame')
	async handleInviteInGame(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number) {
		
	}

	@SubscribeMessage('playerJoinNormalQueue')
	async handleJoinQueueNormal(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number) {
		var localRoom : GameRoom;
		var user1 : User;
		var user2 : User;

		this.queueListNormalGame.set(userId, socket.id);
		if (this.queueListNormalGame.size >= 2){
			const first = this.queueListNormalGame.entries().next().value;
			this.queueListNormalGame.delete(first[0]);

			const second = this.queueListNormalGame.entries().next().value;

			user1 = await this.UserService.getUserById(first[0]);
			user2 = await this.UserService.getUserById(second[0]);
	
			this.queueListNormalGame.delete(second[0]);

			//Database service
			const gameRoom = await this.GameRoomService.createGameRoom(first, second, false);

			localRoom = this.createGameRoomLocal(gameRoom.id, first, second, false);

			this.gameRooms.push(localRoom);


			this.UserService.updateStatus(user1.userId, "lobby");
			this.UserService.updateStatus(user2.userId, "lobby");


			this.server.to(localRoom.player1SocketId).emit('lobby', {
				roomId: localRoom.roomId,
				customGameMode: false,
				player1SocketId: localRoom.player1SocketId,
				player2SocketId: localRoom.player2SocketId,
				player1UserId: user1.userId,
				player2UserId: user2.userId,
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
				player1UserId: user1.userId,
				player2UserId: user2.userId,
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
    	if (!gameRoom)
      		return ;
			gameRoom.finish = true;
			if (gameRoom.playAgain == false){
				this.gameRooms[this.gameRooms.indexOf(gameRoom)].active = false;
			}
			else{
				if (socket.id == gameRoom.player1SocketId){
					this.UserService.updateStatus(gameRoom.player1UserId, "online");
					this.UserService.updateStatus(gameRoom.player2UserId, "online");
					this.server.to(gameRoom.player2SocketId).emit('playStop');
					gameRoom.playAgain = false;
					this.removeCollisionsEvent(gameRoom);
					World.clear(gameRoom.world);
					Engine.clear(gameRoom.engine);
					this.gameRooms[this.gameRooms.indexOf(gameRoom)].active = false;
					gameRoom.player1Ready = false;
				}
				else{
					this.UserService.updateStatus(gameRoom.player1UserId, "online");
					this.UserService.updateStatus(gameRoom.player2UserId, "online");
					this.server.to(gameRoom.player1SocketId).emit('playStop');
					gameRoom.playAgain = false;
					this.removeCollisionsEvent(gameRoom);
					World.clear(gameRoom.world);
					Engine.clear(gameRoom.engine);
					this.gameRooms[this.gameRooms.indexOf(gameRoom)].active = false;
					gameRoom.player2Ready = false;
				}
    	}
	}

	@SubscribeMessage('playerJoinCustomQueue')
	async handleJoinQueueCustom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: number) {
		this.queueListCustomGame.set(userId, socket.id);
		var localRoom : GameRoom;
		var user1 : User;
		var user2 : User;

		if (this.queueListCustomGame.size >= 2){

			const first = this.queueListCustomGame.entries().next().value;
			this.queueListCustomGame.delete(first[0]);
			const second = this.queueListCustomGame.entries().next().value;
			user1 = await this.UserService.getUserById(first[0]);
			user2 = await this.UserService.getUserById(second[0]);
			this.queueListCustomGame.delete(second[0]);
			const gameRoom = await this.GameRoomService.createGameRoom(first, second, true);
			localRoom = this.createGameRoomLocal(gameRoom.id, first, second, true);
			this.gameRooms.push(localRoom);
			this.server.to(localRoom.player1SocketId).emit('lobby', {
				roomId: localRoom.roomId,
				customGameMode: true,
				player1SocketId: localRoom.player1SocketId,
				player2SocketId: localRoom.player2SocketId,
				player1UserId: user1.userId,
				player2UserId: user2.userId,
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
				player1UserId: user1.userId,
				player2UserId: user2.userId,
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
		let gameRoom = await this.GameRoomService.getGameRoomById(data.roomId);
		if (gameRoom){
			const user1 = await this.UserService.getUserById(gameRoom.users[0].userId);
			const user2 = await this.UserService.getUserById(gameRoom.users[1].userId);

			if (data.userId == user1.userId){
				this.server.to(socket.id).emit('endGameInformation', {
					customGameMode: gameRoom.customGame,
					player1UserId: user1.userId,
					player2UserId: user2.userId,
					player1UserName: user1.userName,
					player2UserName: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image,
					winnerId: user2.userId
				});
			}
			else{
				this.server.to(socket.id).emit('endGameInformation', {
					customGameMode: gameRoom.customGame,
					player1UserId: user1.userId,
					player2UserId: user2.userId,
					player1UserName: user1.userName,
					player2UserName: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image,
					winnerId: user1.userId
				});
			}
		}
	}

	@SubscribeMessage('playAgain')
	async handleReplay(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number) {

		let gameRoom = this.findCorrespondingGame(roomId);

		this.removeCollisionsEvent(gameRoom);

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
				
				var customGameMode = gameRoom.customGame;

				//Db service
				var newGameRoom = await this.GameRoomService.createGameRoom(
					[ gameRoom.player1UserId, gameRoom.player1SocketId ],
					[ gameRoom.player2UserId, gameRoom.player2SocketId ],
					gameRoom.customGame);

				//Erasing previous game from local array
				let indexGameRoom = this.gameRooms.indexOf(gameRoom);
	
				//Recreating a new game room with same both users
				const localRoom = this.createGameRoomLocal(
					newGameRoom.id,
					[ gameRoom.player1UserId, newGameRoom.player1SocketId ],
					[ gameRoom.player2UserId, newGameRoom.player2SocketId ],
					gameRoom.customGame);
				this.gameRooms[indexGameRoom].active = false;
				this.gameRooms.push(localRoom);
				this.server.to(localRoom.player1SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					customGameMode: customGameMode,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1UserId: user1.userId,
					player2UserId: user2.userId,
					player1UserName: user1.userName,
					player2UserName: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image
				});
				this.server.to(localRoom.player2SocketId).emit('lobby', {
					roomId: localRoom.roomId,
					customGameMode: customGameMode,
					player1SocketId: localRoom.player1SocketId,
					player2SocketId: localRoom.player2SocketId,
					player1UserId: user1.userId,
					player2UserId: user2.userId,
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
		@MessageBody() data : { playerId: number, hostGameId: number } ) {
		setTimeout(async () => {
			const gameRoom = await this.GameRoomService.getGameRoomById(data.hostGameId);
			var user1 : any;
			var user2 : any;

			setTimeout(async () => {
				user1 = await this.UserService.getUserById(gameRoom.player1UserId);
				user2 = await this.UserService.getUserById(gameRoom.player2UserId);
				this.UserService.updateStatus(user1.userId, "lobby");
				this.UserService.updateStatus(user2.userId, "lobby");
				if (!this.findCorrespondingGame(gameRoom.id)){
					var localRoom = this.createGameRoomLocal(gameRoom.id, [user1.userId, user1.socket] , [user2.userId, user2.socket], false);
					this.gameRooms.push(localRoom);
				}
 
				var receiverSocketId : string;
				if (data.playerId == user1.userId){
					receiverSocketId = user1.socket;
				}
				else{
					receiverSocketId = user2.socket;
				}
				this.server.to(receiverSocketId).emit('lobby', {
					roomId: gameRoom.id,
					customGameMode: false,
					player1SocketId: user1.socket,
					player2SocketId: user2.socket,
					player1UserId: gameRoom.player1UserId,
					player2UserId: gameRoom.player2UserId,
					player1UserName: user1.userName,
					player2UserName: user2.userName,
					player1Image: user1.image,
					player2Image: user2.image
				});
			}, 2000)
		});
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
		var gameRoom : GameRoom = this.findCorrespondingGame(roomId);
		//If first player to leave we tell the other
		if (gameRoom){
			if (socket.id == gameRoom.player1SocketId){
				gameRoom.player1Ready = true;
				this.UserService.updateStatus(gameRoom.player1UserId, "online");
				this.UserService.updateStatus(gameRoom.player2UserId, "online");
				this.server.to(gameRoom.player2SocketId).emit('otherPlayerLeaveLobby', {});
			}
			else{
				gameRoom.player2Ready = true;
				this.UserService.updateStatus(gameRoom.player1UserId, "online");
				this.UserService.updateStatus(gameRoom.player2UserId, "online");
				this.server.to(gameRoom.player1SocketId).emit('otherPlayerLeaveLobby', {});
			}
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
		}
	}

	@SubscribeMessage('playerNotReady')
	handlePlayerNotReady(
		@ConnectedSocket() socket: Socket,
		@MessageBody() roomId: number): void {
		var gameRoom : GameRoom = this.findCorrespondingGame(roomId);
		if (socket.id == gameRoom.player1SocketId){
			gameRoom.player1Ready = false;
			this.server.to(gameRoom.player2SocketId).emit('otherPlayerNotReady', {});
		}
		else{
			gameRoom.player2Ready = false;
			this.server.to(gameRoom.player1SocketId).emit('otherPlayerNotReady', {});
		}
	}

	@SubscribeMessage('readyAfterInitialisation')
	handleGameStart(@ConnectedSocket() socket: Socket, @MessageBody() roomId: number){

		var gameRoom : GameRoom = this.findCorrespondingGame(roomId);

		if (gameRoom){
			if (socket.id == gameRoom.player1SocketId)
				gameRoom.player1Spawn = true;
			else
				gameRoom.player2Spawn = true;
			if (gameRoom.finish == false && gameRoom.player1Spawn == true && gameRoom.player2Spawn == true && gameRoom.inCooldown == false){
				//to synchronize countdown on front end back
				this.server.to(gameRoom.player1SocketId).emit('gameStart');
				this.server.to(gameRoom.player2SocketId).emit('gameStart');
				gameRoom.inCooldown = true;
				gameRoom.insideLobby = false;
				setTimeout(() => {
					this.UserService.updateStatus(gameRoom.player1UserId, "ingame");
					this.UserService.updateStatus(gameRoom.player2UserId, "ingame");
					gameRoom.started = true;
					randomInt(0, 1) == 1 ? Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {x: 3, y: 3}) : Matter.Body.setVelocity(gameRoom.entities.ball.gameObject, {x: -3, y: -3});
					gameRoom.inCooldown = false;
					gameRoom.pausedAfk = false;
					gameRoom.player2Ready = false;
					gameRoom.player1Ready = false;
				}, GAME_COUNTDOWN_START);
			}
		}
	}

	saveGameState(gameRoom: GameRoom){
		//We take a snapshot of ball and players position
		let velocity : any;

		if (gameRoom.entities)
			velocity = Matter.Body.getVelocity(gameRoom.entities.ball.gameObject);

		const ballState = [{
			id: '0',
			x : gameRoom.entities.ball.gameObject.position.x,
			y : gameRoom.entities.ball.gameObject.position.y,
			velX: velocity.x,
			velY: velocity.y
		}];

		var playerState : any;

		playerState = [{
			id : gameRoom.player1SocketId,
			y : gameRoom.entities.players[0].gameObject.position.y
		},
		{
			id : gameRoom.player2SocketId,
			y : gameRoom.entities.players[1].gameObject.position.y
		}]

		var globalState : any;

		//Better use JSON stringify function to do this
		globalState = {
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
			if (this.gameRooms[i]?.roomId == data.roomId){
				// Update player position in data structure
				if (this.gameRooms[i]?.player1SocketId == data.socketId){

					if (this.gameRooms[i]?.customGame == false){
						Matter.Body.setPosition(this.gameRooms[i]?.entities.players[0].gameObject, {
							x: this.gameRooms[i]?.entities.players[0].gameObject.position.x,
							//The collision between the players and upper lower wall is hardcoded by clamping the y value
							y: Math.min(Math.max(data.y, 75), 725)
						});
					}
					else{
						Matter.Body.setPosition(this.gameRooms[i]?.entities.players[0].gameObject, {
							x: this.gameRooms[i]?.entities.players[0].gameObject.position.x,
							//The collision between the players and upper lower wall is hardcoded by clamping the y value
							y: Math.min(Math.max(data.y, 50), 750)
						});
						Matter.Body.setPosition(this.gameRooms[i]?.entities.players[2].gameObject, {
							x: this.gameRooms[i]?.entities.players[2].gameObject.position.x,
							y: Math.min(Math.max(data.y, 50), 750)
						});
					}

				}
				else if (this.gameRooms[i]?.player2SocketId == data.socketId){
					if (this.gameRooms[i]?.customGame == false){
						Matter.Body.setPosition(this.gameRooms[i]?.entities.players[1].gameObject, {
							x: this.gameRooms[i]?.entities.players[1].gameObject.position.x,
							y: Math.min(Math.max(data.y, 75), 725)
						});
					}
					else{
						Matter.Body.setPosition(this.gameRooms[i]?.entities.players[1].gameObject, {
							x: this.gameRooms[i]?.entities.players[1].gameObject.position.x,
							y: Math.min(Math.max(data.y, 50), 750)
						});
						Matter.Body.setPosition(this.gameRooms[i]?.entities.players[3].gameObject, {
							x: this.gameRooms[i]?.entities.players[3].gameObject.position.x,
							y: Math.min(Math.max(data.y, 50), 750)
						});
					}
				}
			}
		}
	}

	findCorrespondingGame(roomId: number) : GameRoom{
		for (let i = 0; i < this.gameRooms.length; i++){
			if (this.gameRooms[i]?.roomId == roomId){
				return (this.gameRooms[i]);
			}
		}
		return null;
	}
}
