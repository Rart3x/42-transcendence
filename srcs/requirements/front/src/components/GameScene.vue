<script lang="ts">

//IMPORTS
import '@geckos.io/snapshot-interpolation';

import { io } from 'socket.io-client';

//Game library
import Phaser from 'phaser';

import * as Matter from 'matter-js';

import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
  import { computed, onMounted, ref } from "vue";

import { getUserByCookie } from './api/get.call';

import Cookies from "js-cookie";

import Entities from '../entities/entities';

import GameRoom from "../gameRoom/gameRoom";

import Player from "../player/player";

//UTILS
function Between(min : number, max : number){
	return (Math.random() * (max - min) + min)
}

//get user
const token = await Cookies.get("_authToken");
const user = await getUserByCookie(token);

//get image path
let imagePath = "../assets/userImages/" + user.image;

await import(/* @vite-ignore */ imagePath).then((image) => {
	user.image = image.default;
});


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
	UIScorePlayer1: Phaser.GameObjects.DOMElement;
	UIScorePlayer2: Phaser.GameObjects.DOMElement;


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
		// this.load.html('loading', '../assets/loading.html');
		this.load.image('userImage', 'userImages/dguillau.jpg');

	}

	async setupUI(){

		let startButtonCanvas : Phaser.GameObjects.Graphics;
	}

	launchGame(){
		this.scene.resume('game');
	}

	async create(){
		var self = this;

		this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-1 grid-cols-1 justify-items-center gap-y 8> \
			<div class="..."><button id="inQueueButton" class="btn btn-primary ml-5 ...">Find game</button><div> \
		</div> \
		');

		let inQueueButton = this.UIElement.node.querySelector('#inQueueButton') as HTMLElement;
		
		inQueueButton.addEventListener('click', function() {
			socket.emit('playerJoinQueue', user.userId);
			self.UIElement.destroy();
			self.UIElement = self.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y 8 ..."> \
			<div class="row-start-1 col-start-2 col-end-3 ..."> \
				<h1 class="text-4xl font-bold dark:text-white ...">Looking for a game</h1> \
			</div> \
			<div class="row-start-2 col-start-2 col-end-3 ..."> \
				<span class=" loading loading-dots loading-lg"></span> \
			</div> \
			</div>');
		});

		socket.on('lobby', (data) => {
			this.UIElement.destroy();
    
			this.gameRoom =  new GameRoom(this, data.roomId, data.player1SocketId, data.player2SocketId);

			this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-5 grid-cols-3 justify-items-center gap-y-8 gap-x-32"> \
			<div class="avatar row-start-2"> \
				<div id="userProfile1" class="avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ..."> \
					<img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" /> \
				</div> \
			</div> \
			<div class="col-start-2 col-end-3 row-start-1 row-end-6 divider divider-horizontal ml-8 ...">VS</div> \
			<div class="avatar row-start-2 col-start-3 col-end-4 w-24 ..."> \
				<div id="userProfile2" class="avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ..."> \
				    <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" /> \
				</div> \
			</div> \
			<div class="row-start-3 ..."> \
				<h1 id="player1Name" class="text-4xl font-bold dark:text-white ..."></h1> \
			</div> \
			<div class="row-start-3 col-start-3 col-end-4 ..."> \
				<h1 id="player2Name" class="text-4xl font-bold dark:text-white"></h1> \
			</div> \
			<div class="row-start-4 col-start-1 col-end-2"> \
				<button id="isReadyButtonPlayer1" class="btn  btn-active no-animation btn-secondary"> Not ready  </button> \
			</div> \
			<div class="row-start-4 col-start-3 col-end-4"> \
				<button id="isReadyButtonPlayer2" class="btn btn-active no-animation btn-secondary"> Not ready  </button> \
			</div> \
			<div class="row-start-5 col-start-2 col-end-3 ..."><button id="startButton"class="btn btn-primary ml-5 ...">START</button></div> \
			</div>');
	
			let userProfile1 = this.UIElement.node.querySelector("#userProfile1");
			let userProfile2 = this.UIElement.node.querySelector("#userProfile2");
			let userProfile1Img = userProfile1.querySelector("img");
			let userProfile2Img = userProfile2.querySelector("img");

			let userProfile1Name = this.UIElement.node.querySelector("#player1Name") as HTMLElement;
			let userProfile2Name = this.UIElement.node.querySelector("#player2Name") as HTMLElement;
	
			if (socket.id == this.gameRoom.player1SocketId){
				userProfile1Img.src = imagePath;
				userProfile1Name.innerText = user.userName;
				userProfile2Name.innerText = data.player2Name;
			}
			else{
				userProfile2Img.src = imagePath;
				userProfile2Name.innerText = user.userName;
				userProfile1Name.innerText = data.player1Name;
			}

			Phaser.DOM.AddToDOM(this.textures.get('userImage').getSourceImage() as HTMLElement, 'userProfile1');
			Phaser.DOM.AddToDOM(this.textures.get('userImage').getSourceImage() as HTMLElement, 'userProfile2');

			let startButton = this.UIElement.node.querySelector('#startButton') as HTMLElement;
			let isReadyButtonPlayer1 = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
			let isReadyButtonPlayer2 = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;


			
			var self = this;

			startButton.addEventListener('click', function() {
				if (socket.id == self.gameRoom.player2SocketId){
					isReadyButtonPlayer2.innerText = 'Ready';
					isReadyButtonPlayer2.className = 'btn no-animation btn-active btn-accent';
					if (userProfile2){
						userProfile2.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
					}
				}
				else{
					isReadyButtonPlayer1.innerText = 'Ready';
					isReadyButtonPlayer1.className = 'btn no-animation btn-active btn-accent';
					if (userProfile1){
						userProfile1.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
					}
				}
				socket.emit('playerReady', self.gameRoom.id);
			});
		});

		socket.on('otherPlayerReady', () => {
			let otherPlayerProfile : any;
			let otherPlayerReadyButton : any;

			if (socket.id == self.gameRoom.player1SocketId){
				otherPlayerProfile = this.UIElement.node.querySelector("#userProfile2");
				otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;
			}
			else if (socket.id == self.gameRoom.player2SocketId){
				otherPlayerProfile = this.UIElement.node.querySelector("#userProfile1");
				otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
			}
			otherPlayerReadyButton.innerText = 'Ready';
			otherPlayerReadyButton.className = 'btn no-animation btn-active btn-accent';
			if (otherPlayerProfile){
				otherPlayerProfile.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
			}
		});

		//Waiting for server response to isReady command
		socket.on('init', () => {
			this.gameRoom.engine = Matter.Engine.create();

			this.gameRoom.engine.gravity.x = 0;
			this.gameRoom.engine.gravity.y = 0;

			this.matter.world.disableGravity();
			this.matter.world.setBounds();
        	this.gameRoom.world = this.gameRoom.engine.world;

			this.time.delayedCall(3000, self.spawnSceneProps, [], self);
		});

		//Mouse hook for movement
		this.input.on('pointermove', (pointer : Phaser.Input.Pointer) => {
			if (this?.gameRoom?.entities){
				if (this.gameRoom?.player1SocketId == socket.id){
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
				else if (this.gameRoom?.player2SocketId == socket.id){
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
			if (this?.gameRoom?.entities){
				//Reset ball to the middle
				if (this.gameRoom.entities?.ball.gameObject) {
					this.gameRoom.entities.ball.gameObject.x = 500;
					this.gameRoom.entities.ball.gameObject.y = data.ball.y;
					this.gameRoom.entities.ball.gameObject.setVelocity(0, 0);
				}
				//Update score
				if (this.gameRoom.score && this.gameRoom.player1SocketId && this.gameRoom.player2SocketId){
					this.gameRoom.score.set(this.gameRoom.player1SocketId, data.score.player1);
					this.gameRoom.score.set(this.gameRoom.player2SocketId, data.score.player2);
					this.updateUIScore();
				}
			}
		});

		socket.on('restartAfterScore', () => {
				this?.gameRoom?.entities?.ball.gameObject.setVelocity(3, 3);
		});

		socket.on('playAgain', () => {
			let playAgainButton = this.UIElement.node.querySelector("#replayButton") as HTMLElement;
			if (socket.id == this?.gameRoom?.player1SocketId){
				this.gameRoom.player2PlayAgain = true;
				if (this.gameRoom.player1PlayAgain){
					playAgainButton.innerText = "Play again 2/2";
				}
				else{
					playAgainButton.innerText = "Play again 1/2";
				}
			}
			else{
				this.gameRoom.player1PlayAgain = true;
				if (this.gameRoom.player2PlayAgain){
					playAgainButton.innerText = "Play again 2/2";
				}
				else{
					playAgainButton.innerText = "Play again 1/2";
				}
			}
		});

		socket.on('gameFinish', () => {
			if (this?.gameRoom?.entities){
				this.switchSceneInvisible();
			}
			this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y-8"> \
			<div class="row-start-1 col-start-2 col-end-3"><button id="replayButton" class="btn btn-accent">Play again 0/2</button></div> \
			<div class="row-start-2 col-start-2 col-end-3"> <button id="stopButton" class="btn btn-secondary">Stop</button></div></div>');
			let playAgainButton = this.UIElement.node.querySelector("#replayButton") as HTMLElement;
			let stopButton = this.UIElement.node.querySelector("#stopButton") as HTMLElement;
			playAgainButton.addEventListener('click', () => {
				if (socket.id == this?.gameRoom?.player1SocketId){
					this.gameRoom.player1PlayAgain = true;
					if (this.gameRoom.player2PlayAgain){
						playAgainButton.innerText = "Play again 2/2";
					}
					else{
						playAgainButton.innerText = "Play again 1/2";
					}
				}
				else{
					this.gameRoom.player2PlayAgain = true;
					if (this.gameRoom.player1PlayAgain){
						playAgainButton.innerText = "Play again 2/2";
					}
					else{
						playAgainButton.innerText = "Play again 1/2";
					}
				}
				socket.emit('playAgain', this.gameRoom.id);
				// setTimeout(() => {
				// 	this.UIElement.destroy();
				// }, 3000);
			});
			stopButton.addEventListener('click', () => {
				socket.emit('stopPlay', this.gameRoom.id);
				setTimeout(() => {
					this.UIElement.destroy();
				}, 3000);
			});
		});

		socket.on('snapshot', (data) => {
			//Read the snapshot
			SI.snapshot.add(data);
		});
	}

	createUIScore(){
		this.UIScorePlayer1 = this.add.dom(400, 100).createFromHTML('<span class="countdown font-mono text-6xl"> \
			<span id="scorePlayer1" style="--value:0;"></span> \
		</span>');
		this.UIScorePlayer2 = this.add.dom(600, 100).createFromHTML('<span class="countdown font-mono text-6xl"> \
			<span id="scorePlayer2" style="--value:0;"></span> \
		</span>');
	}

	updateUIScore(){
		let scorePlayer1 = this.gameRoom.score.get(this.gameRoom.player1SocketId);
		let scorePlayer2 = this.gameRoom.score.get(this.gameRoom.player2SocketId);

		let scorePlayer1Ele = this.UIScorePlayer1.node.querySelector("#scorePlayer1") as HTMLElement;
		let scorePlayer2Ele = this.UIScorePlayer2.node.querySelector("#scorePlayer2") as HTMLElement;
		if (scorePlayer1 <= 3 && scorePlayer2 <= 3){
			scorePlayer1Ele.style.setProperty('--value', scorePlayer1.toString());
			scorePlayer2Ele.style.setProperty('--value', scorePlayer2.toString());
		}
	}

	switchSceneInvisible(){
		for (let i = 0; i < 4; i++){
			this.gameRoom.entities.walls[i].gameObject.setVisible(false);
		}
		for (let i = 0; i < 2; i++){
			this.gameRoom.entities.players[i].gameObject.setVisible(false);

		}
		this.gameRoom.entities.ball.gameObject.setVisible(false);
	}

	spawnSceneProps(){
		this.UIElement.destroy();

		this.createUIScore();
        this.gameRoom.entities = new Entities(this, this.gameRoom.player1SocketId, this.gameRoom.player2SocketId);

		let countdown = this.add.dom(500, 400).createFromHTML('<span class="countdown font-mono text-6xl"> \
			<span id="countdown" style="--value:3;"></span> \
		</span>');
		let counter = 3;
		const refreshID = setInterval(() => {
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
		}, 1000);
		const graphics = this.add.graphics({ fillStyle: { color: 0xdb2e94ff } });
		const point = new Phaser.Math.Vector2(500, 20);
		for (let offset = 100; offset < 680; offset+=40)
		{
			point.y = offset;
			const rect = new Phaser.Geom.Rectangle(point.x, point.y, 3, 20);
			graphics.fillRectShape(rect);
		}
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

	}

	update(){
		//Client receive a snapshot which contains both the ball and the players position
		//by doing so, every client we read the same game steps.

		//Interpolate x y coordinates on ball object
		const ballSnapshot = SI.calcInterpolation('x y', 'ball');
		if (ballSnapshot) {
			const { state } = ballSnapshot;
			if (state){
				const { id, x, y } = state[0];
				if (this.gameRoom && this.gameRoom.entities && this.gameRoom.entities.ball.gameObject) {
					if (this.gameRoom.entities.ball.gameObject.body.velocity.x != 0){
						this.gameRoom.entities.ball.gameObject.x = x;
						this.gameRoom.entities.ball.gameObject.y = y;
					}
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
