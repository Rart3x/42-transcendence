import {
SubscribeMessage,
WebSocketGateway,
WebSocketServer,
WsResponse,
MessageBody,
ConnectedSocket,
} from '@nestjs/websockets';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
import { io, Socket } from 'socket.io-client';
import { serialize } from 'v8';
import rectWrapper from '../../../front/src/elements/rectWrapper';
import * as Matter from 'matter-js';
import Player from '../../../front/src/elements/player';
import '@geckos.io/snapshot-interpolation';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';

//Constants
const LEFT_WALL = "left"
const RIGHT_WALL = "right"
const UPPER_WALL = "upper"
const LOWER_WALL = "lower"
const LEFT_PLAYER = "player1"
const RIGHT_PLAYER = "player2"
const BALL = "ball"
const SERVER_REFRESH_RATE = 1000 / 60

//Initialize the snapshot library
const SI = new SnapshotInterpolation();

//Aliases
const Engine = Matter.Engine,
	World = Matter.World,
	Render = Matter.Render,
	Runner = Matter.Runner,
	Bodies = Matter.Bodies,
	Composite = Matter.Composite;

//Engine creation
const engine = Matter.Engine.create();

//GameObjects Options
const wallOptions = {
	isStatic: true,
}

const playerOptions = {
	isStatic: true,
}

const ballOptions = {
	restitution : 1,
	inertia: Infinity,
	friction: 0,
	frictionStatic: 0,
	frictionAir : 0,
	isStatic: false,
}

//Entities
const walls : Array<Matter.Bodies.rectangle> = [
	new Matter.Bodies.rectangle(20, 400, 10, 770, wallOptions),
	new Matter.Bodies.rectangle(980, 400, 10, 770, wallOptions),
	new Matter.Bodies.rectangle(500, 10, 970, 10, wallOptions),
	new Matter.Bodies.rectangle(500, 790, 970, 10, wallOptions)
]

const players : Array<Matter.Bodies.rectangle> = [
	new Matter.Bodies.rectangle(50, 400, 10, 60, playerOptions),
	new Matter.Bodies.rectangle(950, 400, 10, 60, playerOptions),
]

const ball = Matter.Bodies.circle(500, 400, 20, ballOptions);

ball.name = "ball";

//Useless
engine.world.bounds = { min: { x: 0, y: 0 }, max: { x: 1000, y: 800 } };

//Alias
let world = engine.world;

//Set gravity to 0,0 so no extern force is exerced on the game object
engine.gravity.x = 0;
engine.gravity.y = 0;

Matter.World.add(world, ball);

//enum
const playerLabel = [
	LEFT_PLAYER,
	RIGHT_PLAYER
]

const wallLabel = [
	LEFT_WALL,
	RIGHT_WALL,
	UPPER_WALL,
	LOWER_WALL
]

//Usefull functions not in the library matterjs
function Between(min : number, max : number){
	return (Math.random() * (max - min) + min)
}

//Adding entities to the world
let j = 0;

for (let player of players) {
	Matter.World.add(world, player);
	Matter.Collision.create(ball, player);
	player.name = playerLabel[j++];
}

let i = 0;

for (let wall of walls){
	Matter.World.add(world, wall);
	Matter.Collision.create(ball, wall);
	wall.name = wallLabel[i++];
}

//Default velocity
Matter.Body.setVelocity(ball, {x: 2, y: 5});

//Random ball spawning
Matter.Body.setPosition(ball, {x: 500, y: Between(65, 735)});

//Clients container
let clientsId : string[] = [];

//Starting the engine
Matter.Engine.run(engine);

//Scores
let score_player1 = 0
let score_player2 = 0

//Gateway
@WebSocketGateway({
	cors : {
		origin: '*',
	},
})

@WebSocketGateway()
export class EventsGateway {

	@WebSocketServer()
	server: Server;
	player1 : Player;
	player2 : Player;

	sendGameObjets(client : any){
		//Sending info on players, wall and ball
		let firstSlotOccupied = false;

		const serializedWalls = walls.map((wall) => {
			let wallWidth = wall.bounds.max.x - wall.bounds.min.x;
			let wallHeight = wall.bounds.max.y - wall.bounds.min.y;
			let wallPositionX = wall.position.x;
			let wallPositionY = wall.position.y;
			//There's a shift of +- 20 in the coordinates system between phaser and matter
			if (wall.name == LEFT_WALL){
				wallHeight -= 40;
				wallPositionX += 20;
			}
			if (wall.name == RIGHT_WALL){
				wallHeight -= 40;
				wallPositionX -= 20;
			}
			if (wall.name == UPPER_WALL || wall.name == LOWER_WALL) {
				wallWidth -= 40;
				if (wall.name == UPPER_WALL) {
				wallPositionY += 20;
				}
				else {
				wallPositionY -= 20;
				}
			}
			return { x: wallPositionX, y: wallPositionY, width: wallWidth, height: wallHeight, label: wall.name };
		});

		const serializedPlayers = players.map((player) => {
			if (clientsId.length > 1){
				firstSlotOccupied = true;
			}
			let playerPositionX = player.position.x;
			let playerPositionY = player.position.y;
			if (player.name == LEFT_PLAYER){
				playerPositionX += 20;
			}
			else{
				playerPositionX -= 20;
			}
			return { x: playerPositionX, y: playerPositionY, width: 10, height: 60, label: player.name };
		});

		const serializedBall = {x: 500, y: 400, radius: 10};
		if (clientsId.length == 2){
			setTimeout(() => {
				this.server.to(clientsId[0]).emit('otherPlayerConnect', {id : clientsId[1]});
				this.server.to(clientsId[1]).emit('otherPlayerConnect', {id : clientsId[0]});
				this.player1 = new Player(clientsId[0], players[0]);
				this.player2 = new Player(clientsId[1], players[1]);
			}, 3000);
		}
		this.server.to(client.id).emit('init', { walls : serializedWalls, players: serializedPlayers, ball: serializedBall, firstSlot : firstSlotOccupied});
	}

	handleConnection(client: any){
		//When a new client connect to the server we send him the whole scene by sending him
		//by web socket all the game objects which we serialized and also information about
		//which slot he occupies inside the game (left or right), all with emit function.
		clientsId.push(client.id);

		const scorePoint = (pair : Matter.Pairs) => {
			Matter.Body.setPosition(ball, {x: 999999, y: 999999});
			if (pair.bodyA.name == LEFT_WALL){
				score_player2+=1;
			}
			else{
				score_player1+=1;
			}
			setTimeout(() => {
				Matter.Body.setPosition(ball, {x: 500, y: Between(65, 735)});
			}, 3000);
		}

		const collisionBallPlayer = (pair: Matter.Pairs) => {
			var player : Player;
			if (this.player1 == undefined || this.player2 == undefined){
			return ;
			}
			if (pair.bodyB.label == LEFT_PLAYER){
			if (this.player1.gameObject.label == LEFT_PLAYER){
				player = this.player1;
			}
			else{
				player = this.player2;
			}
			}
			else{
			if (this.player1.gameObject.label == RIGHT_PLAYER){
				player = this.player1;
			}
			else{
				player = this.player2;
			}
			}
			var intersectionDeltaY = 0;
			if (ball.velocity.y > 0){
				if (player.gameObject.y > ball.y){
					intersectionDeltaY = player.gameObject.y - ball.y;
					ball.body.setVelocityY(ball.velocity.y * -1);
				}
				else{
					intersectionDeltaY = ball.y - player.gameObject.y;
					ball.body.setVelocityY(ball.velocity.y );
				}
			}
			else{
				if (player.gameObject.y > ball.y){
					intersectionDeltaY = player.gameObject.y - ball.y;
					ball.body.setVelocityY(ball.velocity.y );
				}
				else{
					intersectionDeltaY = ball.y - player.gameObject.y;
					ball.body.setVelocityY(ball.velocity.y * -1);
				}
			}
		}

		Matter.Events.on(engine, 'collisionStart', function(event) {
			event.pairs.forEach(function(pair: any) {
				if (clientsId.length == 2)
				{
					//Ball score
					if (pair.bodyB.name == BALL && (pair.bodyA.name == LEFT_WALL || pair.bodyA.name == RIGHT_WALL)){
						// scorePoint(pair);
					}
					//Elastic physics
					else if (pair.bodyB.name == BALL && (pair.bodyA.name == LEFT_PLAYER || pair.bodyA.name == RIGHT_PLAYER)){
						// collisionBallPlayer(pair);
					}
				}
			}, this);
		}, this);
	}

	handleDisconnect(client: any){
		const index = clientsId.indexOf(client.id);
		if (index !== -1) {
			clientsId.splice(index, 1);
		}
		Matter.Engine.run(engine, false);
		Matter.Engine.clear(engine);
		Matter.World.clear(engine.world);
	}

	@SubscribeMessage('playerReady')
	handlePlayerReady(
		@MessageBody() data: {multiplayer : boolean, bot : boolean},
		@ConnectedSocket() client: Socket,
	): void {
		if (data.bot == true){
			console.log("game mode: BOT")
		}
		else{
			console.log("game mode: MULTI")
		}
		this.sendGameObjets(client);
		console.log(`Client ${client.id} is connected`);
		if (clientsId.length == 2){
			if (this.player2 == undefined)
				return ;
			//Server update loop
			setInterval(() => {
				//We take a snapshot of ball and players position
				const ballState = [{
					id : '0',
					x : ball.position.x,
					y : ball.position.y
				}];
				const playerState = [{
					id : this.player1.id,
					x : this.player1.gameObject.position.x,
					y : this.player1.gameObject.position.y,
					score: score_player1 / 2
				},
				{
					id : this.player2.id,
					x : this.player2.gameObject.position.x,
					y : this.player2.gameObject.position.y,
					score: score_player2 / 2
				}]
				//better use JSON function to do this
				const globalState = {
					players : playerState,
					ball: ballState
				}
				const snapshot = SI.snapshot.create(globalState)
				this.server.sockets.emit('snapshot', snapshot);
				Engine.update(engine);
				//Refresh rate is 15 images / snapshot per second
			}, SERVER_REFRESH_RATE);
		}
	}

	@SubscribeMessage('playerMovement')
	handlePlayerMovement(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: {x : number, y : number}): void {
		// Update player position in your players data structure
		if (this.player1 && client.id == this.player1.id) {
			//The collision between the players and upper lower wall is hardcoded by clamping the y value
			let newY = Math.max(data.y, 65);
			newY = Math.min(newY, 735);
			Matter.Body.setPosition(this.player1.gameObject, {x: this.player1.gameObject.position.x, y: newY});
		}
		else if (this.player2) {
			let newY = Math.max(data.y, 65);
			newY = Math.min(newY, 735);
			Matter.Body.setPosition(this.player2.gameObject, {x: this.player2.gameObject.position.x, y: newY});
		}
		// Then broadcast new position to all connected clients
		this.server.sockets.emit('playerMoved', { id: client.id, x: data.x, y: data.y });
	}
}
