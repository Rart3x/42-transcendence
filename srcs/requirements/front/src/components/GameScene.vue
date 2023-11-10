<script lang="ts">

//IMPORTS
import '@geckos.io/snapshot-interpolation';

import { io } from 'socket.io-client';

//Game library
import Phaser from 'phaser';

import * as Matter from 'matter-js';

import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';

import { getUserByCookie, getUserByUsername } from './api/get.call';

import Cookies from "js-cookie";

import Entities from '../entities/entities';

import GameRoom from "../gameRoom/gameRoom";

import Player from "../player/player";

//UTILS
function Between(min : number, max : number){
	return (Math.random() * (max - min) + min)
}

//Create and bind our socke to the server
const socket = io('http://localhost:3000');

//Initialize snapshot library
const SI = new SnapshotInterpolation();

//GAME CLASS
export default class Game extends Phaser.Scene {

	startButton !: Phaser.GameObjects.BitmapText;
	gameRoom : GameRoom;
	player: Player;
	ball : any;
	walls : any[] = [];
	paused: Boolean = false;
	UIElement : Phaser.GameObjects.DOMElement;

	constructor(){
		super("game");
	}

	preload(){
		this.load.setPath('src/assets');
		//Ball sprite
		this.load.image('ball','ball-pink.png');
		//Font
		this.load.bitmapFont('atari', 'atari-smooth.png', 'atari-smooth.xml');
		//Particles sprite
		this.load.image('red', 'red.png');
		//html
		this.load.html('loading', '../assets/loading.html');
		this.load.image('userImage', 'userImages/dguillau.jpg');

	}

	async setupUI(){
		const token = Cookies.get("_authToken");
		const user = await getUserByCookie(token);

		let startButtonCanvas : Phaser.GameObjects.Graphics;

		//START BUTTON and hook
		// const graphics = this.add.graphics({ fillStyle: { color: 0xdb2e94ff } });
		// graphics.lineStyle(3, 0xff00ff, 1);
		// startButtonCanvas = graphics.strokeRoundedRect(380, 385, 250, 70,12);
		// this.startButton = this.add.bitmapText(400, 400, 'atari', '', 40);
		// this.startButton.setText("START").setTint(0xdb2e94ff);
		// this.startButton.setInteractive({ useHandCursor: true });

		// this.startButton.on('pointerdown', () => {
		// 	this.startButton.destroy();
		// 	startButtonCanvas.destroy();
		// 	// socket.emit('playerReady', user.userId);
		// }, this);
	}

	// createGameWorld(engine: Matter.Engine, world: Matter.World, entities: Entities){
	// 	engine.gravity.x = 0;
	// 	engine.gravity.y = 0;
	// 	//???? je garde ou garde pasz
	// 	this.matter.world.disableGravity();
	// 	this.matter.world.setBounds();
	// }

	launchGame(){
		// console.log("relaunch");
		this.scene.resume('game');
	}

	create(){
		var self = this;

		this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-1 grid-cols-1 justify-items-center gap-y 8> \
			<div class="..."><button id="inQueueButton" class="btn btn-primary ml-5 ...">Find game</button><div> \
		</div> \
		');
		let inQueueButton = this.UIElement.node.querySelector('#inQueueButton') as HTMLElement;
		inQueueButton.addEventListener('click', function() {
			socket.emit('playerJoinQueue', socket.id);
			self.UIElement.destroy();
			self.UIElement = self.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y 8 ..."> \
			<div class="row-start-1 col-start-2 col-end-3 ..."> \
				<h1 class="text-4xl font-bold dark:text-white ...">Looking for a game</h1> \
			</div> \
			<div class="row-start-2 col-start-2 col-end-3 ..."> \
				<span class=" loading loading-dots loading-lg"></span> \
			</div> \
			</div>');
			// console.log("inside the queue");
		});

		socket.on('lobby', (data) => {
			// this.setupUI();
			// console.log(self.UIElement);
			// this.UIElementHTMLElement().destroy();
			// console.log("inside a lobby");
			this.UIElement.destroy();

			this.gameRoom =  new GameRoom(this, data.roomId, data.player1SocketId, data.player2SocketId);


			// console.log(self.UIElement);

			this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-5 grid-cols-3 justify-items-center gap-y-8 gap-x-32"> \
			<div class="avatar row-start-2"> \
				<div id="userProfile1" class="avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ..."> \
				</div> \
			</div> \
			<div class="col-start-2 col-end-3 row-start-1 row-end-6 divider divider-horizontal ml-8 ...">VS</div> \
			<div class="avatar row-start-2 col-start-3 col-end-4 w-24 ..."> \
				<div id="userProfile2" class="avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ..."> \
				</div> \
			</div> \
			<div class="row-start-3 ..."> \
				<h1 class="text-4xl font-bold dark:text-white ...">dguillau</h1> \
			</div> \
			<div class="row-start-3 col-start-3 col-end-4 ..."> \
				<h1 class="text-4xl font-bold dark:text-white">random</h1> \
			</div> \
			<div class="row-start-4 col-start-1 col-end-2"> \
				<button id="isReadyButtonPlayer1" class="btn  btn-active no-animation btn-secondary"> Not ready  </button> \
			</div> \
			<div class="row-start-4 col-start-3 col-end-4"> \
				<button id="isReadyButtonPlayer2" class="btn btn-active no-animation btn-secondary"> Not ready  </button> \
			</div> \
			<div class="row-start-5 col-start-2 col-end-3 ..."><button id="startButton"class="btn btn-primary ml-5 ...">START</button></div> \
			</div>');
			
			// this.UIElement.setInteractive();
			Phaser.DOM.AddToDOM(this.textures.get('userImage').getSourceImage() as HTMLElement, 'userProfile1');
			let startButton = this.UIElement.node.querySelector('#startButton') as HTMLElement;
			let isReadyButtonPlayer1 = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
			let isReadyButtonPlayer2 = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;

			let userProfile1 = this.UIElement.node.querySelector("#userProfile1");
			let userProfile2 = this.UIElement.node.querySelector("#userProfile2");
			
			var self = this;

			// if (socket.id == this.gameRoom.player2SocketId){
			// 	isReadyButtonPlayer1.innerText = 'Ready';
			// 	isReadyButtonPlayer1.className = 'btn no-animation btn-active btn-accent';
			// 	if (userProfile1){
			// 		userProfile1.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
			// 	}
			// }
			startButton.addEventListener('click', function() {
				if (socket.id == self.gameRoom.player2SocketId){
					console.log("player 2 is ready!")
					isReadyButtonPlayer2.innerText = 'Ready';
					isReadyButtonPlayer2.className = 'btn no-animation btn-active btn-accent';
					if (userProfile2){
						userProfile2.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
					}
				}
				else{
					console.log("player 1 is ready!");
					isReadyButtonPlayer1.innerText = 'Ready';
					isReadyButtonPlayer1.className = 'btn no-animation btn-active btn-accent';
					if (userProfile1){
						userProfile1.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
					}
				}
				socket.emit('playerReady', self.gameRoom.id);
				// console.log('Start button clicked!');
			});
		});

		var self = this;

		socket.on('otherPlayerReady', () => {
			let otherPlayerProfile : any;
			let otherPlayerReadyButton : any;

			if (socket.id == self.gameRoom.player1SocketId){
				// console.log("other player 2 is ready!")
				otherPlayerProfile = this.UIElement.node.querySelector("#userProfile2");
				otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;
			}
			else if (socket.id == self.gameRoom.player2SocketId){
				// console.log("other player 1 is ready!")
				otherPlayerProfile = this.UIElement.node.querySelector("#userProfile1");
				otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
			}
			otherPlayerReadyButton.innerText = 'Ready';
			otherPlayerReadyButton.className = 'btn no-animation btn-active btn-accent';
			if (otherPlayerProfile){
				otherPlayerProfile.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
			}
		});

		// let grid = this.add.dom(500, 400).createFromHTML('<div class="grid grid-cols-3 gap-4"> \
		//   	<div class="...">01</div> \
		// 	<div class="btn btn-primary ...">START</button></div> \
		// 	<div class="btn btn-primary ...">START</button></div> \
		// 	</div>'
		// );

		// console.log(this.textures);

		// console.log(this.textures.get('userImage').getSourceImage());
		

		// this.UIElement.on('pointerdown', (event) => {
		
			// let button = this.UIElement.node.querySelector('#startButton') as HTMLElement;
			// console.log(event.quer);
			// if (event.target == button){
			// 	button.innerText = 'Ready';
			// 	button.className = 'btn btn-active btn-accent';
			// }
			// let newContent = document.createElement('div');
			// newContent.innerText = 'You clicked me!';
			// this.UIElement.setElement(newContent);
		// });

		
		// button.addListener('click')
		// button.on('click', function(event) {
		// 	socket.emit('playerReady', socket.id);
		// 	loadingAnim = this.add.dom(500, 400).createFromCache('loading');
		// 	button.destroy();
		// }, this);
		

		//Waiting for server response to isReady command
		var self = this;
		socket.on('init', () => {
			// isReadyButtonPlayer2.innerText = 'Ready';
			// isReadyButtonPlayer2.className = 'btn no-animation btn-active btn-accent';
			// if (userProfile2){
			// 	userProfile2.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
			// }
			// console.log("test init");
			this.gameRoom.engine = Matter.Engine.create();

			this.gameRoom.engine.gravity.x = 0;
			this.gameRoom.engine.gravity.y = 0;

			this.matter.world.disableGravity();
			this.matter.world.setBounds();
        	this.gameRoom.world = this.gameRoom.engine.world;


			//???? je garde ou garde pasz

			this.time.delayedCall(3000, self.spawnSceneProps, [], self);

			// isReadyButtonPlayer1.innerText = 'Ready';
			// isReadyButtonPlayer1.className = 'btn no-animation btn-active btn-accent';
			// if (userProfile1){
			// 	userProfile1.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
			// }
			
			// loadingAnim.destroy();
			// this.startButton.destroy();
			//Basic scene elements
		});

		//Mouse hook for movement
		this.input.on('pointermove', (pointer : Phaser.Input.Pointer) => {
			if (this.gameRoom && this.gameRoom.entities){
				if (this.gameRoom.player1SocketId == socket.id){
					this.gameRoom.entities.players[0].y = Phaser.Math.Clamp(pointer.y, 65, 735);
					socket.emit('playerMovement', {
						roomId: this.gameRoom.id,
						socketId: socket.id,
						x: this.gameRoom.entities.players[0].x,
						y: this.gameRoom.entities.players[0].y
					});
					if (this.gameRoom.entities.players[0].gameObject){
						this.gameRoom.entities.players[0].gameObject.y = this.gameRoom.entities.players[0].y;
						this.gameRoom.entities.players[0].gameObject.body.position.y = this.gameRoom.entities.players[0].y;
					}
				}
				else if (this.gameRoom.player2SocketId == socket.id){
					this.gameRoom.entities.players[1].y = Phaser.Math.Clamp(pointer.y, 65, 735);
					socket.emit('playerMovement', {
						roomId: this.gameRoom.id,
						socketId: socket.id,
						x: this.gameRoom.entities.players[1].x,
						y: this.gameRoom.entities.players[1].y
					});
					if (this.gameRoom.entities.players[1].gameObject){
						this.gameRoom.entities.players[1].gameObject.y = this.gameRoom.entities.players[1].y;
						this.gameRoom.entities.players[1].gameObject.body.position.y = this.gameRoom.entities.players[1].y;
					}
				}
			}
		}, this);

		socket.on('scorePoint', (data) => {
			if (this.gameRoom && this.gameRoom.entities){
				// setTimeout(() => {
					//Reset ball to the middle
				if (this.gameRoom.entities && this.gameRoom.entities.ball.gameObject) {
					// this.paused = true;
					this.gameRoom.entities.ball.gameObject.x = 500;
					this.gameRoom.entities.ball.gameObject.y = data.ball.y;
					this.gameRoom.entities.ball.gameObject.setVelocity(0, 0);
				}
				// }, 100);
				//Update score
				if (this.gameRoom.score && this.gameRoom.player1SocketId && this.gameRoom.player2SocketId){
					this.gameRoom.score.set(this.gameRoom.player1SocketId, data.score.player1);
					this.gameRoom.score.set(this.gameRoom.player2SocketId, data.score.player2);
				}
			}
		});

		socket.on('restartAfterScore', () => {
			if (this.gameRoom && this.gameRoom.entities && this.gameRoom.entities.ball.gameObject){
				console.log("test restartAfterScore")
				this.gameRoom.entities.ball.gameObject.setVelocity(3, 3);
				// this.paused = false;
			}
		});
	
		socket.on('gameFinish', () => {
			this.destroy();
		});

		socket.on('snapshot', (data) => {
			// if (this.paused == true)
			// 	return ;
			//Read the snapshot
			SI.snapshot.add(data);
		});
	}

	spawnSceneProps(){
		// console.log(data);
		// console.log(this.UIElement);
		this.UIElement.destroy();

        this.gameRoom.entities = new Entities(this, this.gameRoom.player1SocketId, this.gameRoom.player2SocketId);

		// console.log("spawn scene props");
		let countdown = this.add.dom(500, 400).createFromHTML('<span class="countdown font-mono text-6xl"> \
			<span id="countdown" style="--value:3;"></span> \
		</span>');
		let counter = 3;
		const refreshID = setInterval(() => {
			console.log(counter);
			if(counter > 0){
				counter--;
			}
			let countdownUI = countdown.node.querySelector('#countdown') as HTMLElement;
			countdownUI.style.setProperty('--value', counter.toString());
			if (counter == 0){
				countdown.destroy();
				clearInterval(refreshID);
				if (this.gameRoom.entities){
					this.gameRoom.entities.ball.gameObject.setVelocity(3, 3);
				}
			}
			// console.log(countdownUI);
		}, 1000);
		// Phaser.DOM.RemoveFromDOM(Phaser.DOM.GetTarget(this.UIElement));
		// console.log("scene loaded");
		const graphics = this.add.graphics({ fillStyle: { color: 0xdb2e94ff } });
		const point = new Phaser.Math.Vector2(500, 20);
		for (let offset = 100; offset < 680; offset+=40)
		{
			point.y = offset;
			const rect = new Phaser.Geom.Rectangle(point.x, point.y, 3, 20);
			graphics.fillRectShape(rect);
		}
		// if (this.gameRoom.engine && this.gameRoom.world && this.gameRoom.entities){
		// 	this.createGameWorld(this.gameRoom.engine, this.gameRoom.world, this.gameRoom.entities);
		// }
		//Assign player to each paddle
		if (this.gameRoom.entities){
			if (this.gameRoom.player1SocketId == socket.id){
				this.player = new Player(this.gameRoom.entities.players[0].gameObject);
			}
			else{
				this.player = new Player(this.gameRoom.entities.players[1].gameObject);
			}
		}
	}

	destroy(){
		this.scene.remove();
	}

	update(){
		//Client receive a snapshot which contains both the ball and the players position
		//by doing so, every client we read the same game steps.

		//Interpolate x y coordinates on ball object
		const ballSnapshot = SI.calcInterpolation('x y', 'ball');;
		if (ballSnapshot) {
			const { state } = ballSnapshot;
			if (state){
				const { id, x, y } = state[0];
				if (this.gameRoom && this.gameRoom.entities && this.gameRoom.entities.ball.gameObject) {
					this.gameRoom.entities.ball.gameObject.x = x;
					this.gameRoom.entities.ball.gameObject.y = y;
					console.log(` x ${x} y ${y}`);
				}
			}
		}

		//Interpolate x y coordinates on players object
		const playerSnapshot = SI.calcInterpolation('x y', 'players');
		if (playerSnapshot){
			const { state } = playerSnapshot;
			if (state) {
				state.forEach(s => {
					const { id, x, y, } = s;
					if (id != undefined && this.gameRoom && this.gameRoom.entities){
						if (id == this.gameRoom.player1SocketId){
							this.gameRoom.entities.players[0].gameObject.y = y;
						}
						else{
							this.gameRoom.entities.players[1].gameObject.y = y;
						}
					}
				})
			}
		}
	}
}

	const config = {
		width: 1000,
		height: 800,
		physics : {
			default: 'matter',
			matter : { debug: false }
	},
	scale : {
		mode: Phaser.Scale.FIT,
	},
	scene: Game
}

</script>
