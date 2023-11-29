<script lang="ts">

//IMPORTS

import { computed, onMounted, ref } from "vue";

//Linear interpolation
import '@geckos.io/snapshot-interpolation';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';

//Socket communication
import { io } from 'socket.io-client';

//Game library
import Phaser from 'phaser';

//Game Physics library
import * as Matter from 'matter-js';

//Post and Get Methods
import { getGameRoomByRoomId, getUserByCookie } from './api/get.call';
import { setClientSocket } from './api/post.call';

//Cookie
import Cookies from "js-cookie";

//Interfaces
import Entities from '../entities/entities';

import GameRoom from "../gameRoom/gameRoom";

import Player from "../player/player";


//Get user by cookie
const token = await Cookies.get("_authToken");
const user = await getUserByCookie(token);

//Initialize snapshot library
const SI = new SnapshotInterpolation();

//Create and bind our socket to the server
const socket = io('http://localhost:3000');


export default class Game extends Phaser.Scene {

	startButton !: Phaser.GameObjects.BitmapText;
	gameRoom : GameRoom | undefined;
	UIElement : Phaser.GameObjects.DOMElement;
	UIScorePlayer1: Phaser.GameObjects.DOMElement;
	UIScorePlayer2: Phaser.GameObjects.DOMElement;
	graphics : Phaser.GameObjects.Graphics;

	constructor(){
		super("game");
		setClientSocket(user.userName, socket.id);

	}

	preload(){
		this.load.setPath('src/assets');
	}

	gamePage(self : any){
		this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-6 justify-items-center ..."> \
			<div class="row-start-1  ..."><button id="multiplayerButton" class="btn btn-primary ml-5 ...">Multiplayer</button></div> \
			<div class="row-start-6 ...">Press <kbd class="kbd kbd-sm">SPACE</kbd> to go full screen</div> \
			</div> \
		');

		if (this.input.keyboard){
			const SPACEKey = this.input.keyboard.addKey('SPACE');

			SPACEKey.on('down', function (){
				if (this.scale.isFullscreen){
					this.scale.stopFullscreen();
				}
				else{
					this.scale.startFullscreen();
				}
			}, this);
		}


		let multiplayerButton = this.UIElement.node.querySelector('#multiplayerButton') as HTMLElement;

		multiplayerButton.addEventListener('click', function() {
			self.UIElement.destroy();
			self.UIElement = self.add.dom(500, 400).createFromHTML(' <div id="parent" class="grid grid-rows-3 grid-cols-5 justify-items-center ..."> \
				<div class="row-start-1 col-start-3 ..."> \
					<h1 class="text-4xl font-bold dark:text-white ...">Choose a game mode</h1> \
				</div> \
				<div class="row-start-3 col-start-2 ..."> \
					<button id="choseCustomGameMode" class="btn btn-primary ml-5 ...">Custom</button> \
				</div> \
				<div class="row-start-3 col-start-4 ..."> \
					<button id="choseNormalGameMode" class="btn btn-primary ml-5 ...">Normal</button> \
				</div> \
			</div>');

			let customGameModeButton = self.UIElement.node.querySelector("#choseCustomGameMode") as HTMLElement;

			let normalGameModeButton = self.UIElement.node.querySelector("#choseNormalGameMode") as HTMLElement;

			document.getElementById('parent').addEventListener('click', function(event) {
				if (event.target.id == "choseCustomGameMode" || event.target.id == "choseNormalGameMode"){
					if (event.target.id == "choseCustomGameMode"){
						self.UIElement.destroy();
						socket.emit('playerJoinCustomQueue', user.userId);
					}
					else{
						self.UIElement.destroy();
						socket.emit('playerJoinNormalQueue', user.userId);
					}
					self.UIElement = self.add.dom(500, 400).createFromHTML(' \
					<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y 8 ..."> \
						<div class="row-start-1 col-start-2 col-end-3 ..."> \
							<h1 class="text-4xl font-bold dark:text-white ...">Looking for a game</h1> \
						</div> \
						<div class="row-start-2 col-start-2 col-end-3 ..."> \
							<span class=" loading loading-dots loading-lg"></span> \
						</div> \
					</div>');
				}
			});
		});
	}

	hideSceneGameObjects(){
		if (this.gameRoom.entities){
			for (let i = 0; i < 2; i++){
				this.gameRoom.entities.players[i].gameObject.visible = false;
			}
			for (let i = 0; i < 4; i++){
				this.gameRoom.entities.walls[i].gameObject.visible = false;
			}
			this.gameRoom.entities.ball.gameObject.visible = false;
		}
		this.graphics.visible = false;
	}

	async create(){
		var self = this;

		if (user.gameRoomId != null){
			let gameRoom : any = await getGameRoomByRoomId(user.gameRoomId);
			// gameRoom.running = false;
			if (gameRoom && gameRoom.running == true){
				this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-2  justify-items-center ..."> \
				<div class="row-start-1 ..."><h1 class="text-4xl font-bold dark:text-white ...">Trying to reconnect to the game...</h1></div> \
				<div class="row-start-2 ..."><span class="loading loading-spinner loading-lg"></span></div> \
				</div>');
				socket.emit('playerReconnection', {
					roomId: user.gameRoomId,
					userId: user.userId
				});
			}
			else {
				this.gamePage(self);
			}
		}
		else {
			this.gamePage(self);
		}

		socket.on('opponentReconnection', (data) => {
			if (this.gameRoom.player1UserId == data.userId){
				this.gameRoom.player1SocketId = data.playerSocket;
			}
			else{
				this.gameRoom.player2SocketId = data.playerSocket;
			}
		});

		socket.on('resumeGame', (data) => {
			this.time.delayedCall(4000, self.spawnSceneProps, [], self);
		});


		socket.on('informOnReconnection', (data) => {

			this.gameRoom = new GameRoom(
				this,
				data.roomId,
				data.customGameMode,
				data.player1SocketId,
				data.player2SocketId,
				data.player1UserId,
				data.player2UserId,
				data.player1UserName,
				data.player2UserName);
		
			this.gameRoom.engine = Matter.Engine.create();

			this.gameRoom.engine.gravity.x = 0;
			this.gameRoom.engine.gravity.y = 0;

			this.matter.world.disableGravity();

			this.matter.world.setBounds();
	
        	this.gameRoom.world = this.gameRoom.engine.world;
		});

		socket.on('lobby', (data) => {
			this.UIElement.destroy();
			this.startLobby(data);
		});
	
		socket.on('localGameCreated', (data) => {
			this.UIElement.destroy();
			this.UIElement = this.add.dom(450, 400).createFromHTML(' \
			<div class="grid grid-rows-6 grid-cols-3 justify-items-center  gap-y-4 gap-x-32"> \
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
				<div class="row-start-5 col-start-2  ..."><button id="startButton"class="btn btn-primary ml-5 ...">START</button></div> \
				<div class="row-start-6 col-start-2 ..."><button id="leaveButton"class="btn btn-error ml-5 ...">LEAVE</button></div> \
			</div>');


			// let userProfile1 = this.UIElement.node.querySelector("#userProfile1");

			// let userProfile1Name = this.UIElement.node.querySelector("#player1Name") as HTMLElement;

			// userProfile1Name.innerText = data.player1UserName;

			// let imagePathPlayer1 = "userImages/" + data.player1Image;

			// this.load.image('userImage1', imagePathPlayer1);

			// this.load.once(Phaser.Loader.Events.COMPLETE, () => {
			// 	Phaser.DOM.AddToDOM(this.textures.get('userImage1').getSourceImage() as HTMLElement, 'userProfile1');
			// });

			// this.load.start();

			// let startButton = this.UIElement.node.querySelector('#startButton') as HTMLElement;
			// let leaveButton = this.UIElement.node.querySelector('#leaveButton') as HTMLElement;

			// let isReadyButtonPlayer1 = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
			// let isReadyButtonPlayer2 = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;
		});
	
		socket.on('botReady', (data) => {
			this.gameRoom = GameRoom.createBotGameRoom(
				this,
				data.roomId,
				socket.id,
				user.userId,
				user.userName);
		
			this.gameRoom.engine = Matter.Engine.create();

			this.gameRoom.engine.gravity.x = 0;
			this.gameRoom.engine.gravity.y = 0;

			this.matter.world.disableGravity();

			this.matter.world.setBounds();

			this.gameRoom.world = this.gameRoom.engine.world;

			this.spawnSceneProps();
		});

		socket.on('opponentDisconnection', (data) => {
			if (user.userId == this.gameRoom.player1UserId){
				this.gameRoom.player2Disconnected = true;
			}
			else{
				this.gameRoom.player1Disconnected = true;
			}
			this.destroyUI();
			this.hideSceneGameObjects();
			this.UIElement.destroy();
			this.UIElement = this.add.dom(500, 400).createFromHTML('<div class="grid grid-rows-2  justify-items-center ..."> \
				<div class="row-start-1 ..."><h1 class="text-4xl font-bold dark:text-white ...">Waiting for opponent to reconnect to the game...</h1></div> \
				<div class="row-start-2 ..."> \
					<span class="countdown font-mono text-6xl"> \
						<span id="countdown" style="--value:10;"></span> \
					</span> \
				</div> \
			</div>');
			let counter = 10;
			const refreshID = setInterval(() => {
				if(counter > 0){
					counter--;
				}
				let countdownUI = this.UIElement.node.querySelector('#countdown') as HTMLElement;
				countdownUI.style.setProperty('--value', counter.toString());
				if (counter == 0){

					this.UIElement.destroy();
					clearInterval(refreshID);
				}
			}, 1000);
		});

		//Happy Birthday to our lead developper kenny <3

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
			if (otherPlayerReadyButton){
				otherPlayerReadyButton.innerText = 'Ready';
				otherPlayerReadyButton.className = 'btn no-animation btn-active btn-accent';
			}
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
			
			this.spawnSceneProps();

			socket.emit('readyAfterInit', { roomId: this.gameRoom.id, socketId: socket.id });
		});

		
		socket.on('gameStart', () => {
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
				}
			}, 1000);
		})

		//Mouse hook for movement
		this.input.on('pointermove', (pointer : Phaser.Input.Pointer) => {
			if (this?.gameRoom?.entities){
				if (this.gameRoom?.player1SocketId == socket.id){
					this.gameRoom.entities.players[0].y = Phaser.Math.Clamp(pointer.y, 75, 725);
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
					this.gameRoom.entities.players[1].y = Phaser.Math.Clamp(pointer.y, 75, 725);
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
			if (this.gameRoom.entities){
				if (!this.gameRoom.player1Disconnected && !this.gameRoom.player2Disconnected){
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
			}
		});

		socket.on('restartAfterScore', (data) => {
			this?.gameRoom?.entities?.ball.gameObject.setVelocity(data.ball.vecX, data.ball.vecY);
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

		socket.on('gameFinish', (data) => {
			this.children.removeAll();
			this.destroyUI();
			this.UIElement = this.add.dom(500, 400).createFromHTML(' \
				<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y-8"> \
				<div class="row-start-1"> <h1 id="winLooseMessage" class="text-4xl font-bold dark:text-white ..."></h1> </div> \
				<div class="row-start-2 col-start-1 col-end-2"><button id="replayButton" class="btn btn-accent">Play again 0/2</button></div> \
				<div class="row-start-3 col-start-1 col-end-2"><button id="stopButton" class="btn btn-secondary">Stop</button></div> \
				</div> \
			')

			let winLooseMessage = this.UIElement.node.querySelector("#winLooseMessage") as HTMLElement;
			
			if (this.gameRoom && user.userId == data.winUserId){
				if (user.userId == this.gameRoom.player1UserId)
					winLooseMessage.innerText = "You won against " + this.gameRoom.player1UserName;
				else
					winLooseMessage.innerText = "You won against " + this.gameRoom.player2UserName;
			}
			else if (this.gameRoom){
				if (user.userId == this.gameRoom.player1UserId)
					winLooseMessage.innerText = "You lost against " + this.gameRoom.player2UserName;
				else
					winLooseMessage.innerText = "You lost against " + this.gameRoom.player1UserName;
			}
		
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
				else if (this.gameRoom){
					this.gameRoom.player2PlayAgain = true;
					if (this.gameRoom.player1PlayAgain){
						playAgainButton.innerText = "Play again 2/2";
					}
					else{
						playAgainButton.innerText = "Play again 1/2";
					}
				}
				if (this.gameRoom){
					socket.emit('playAgain', this.gameRoom.id);
				}
			});

			stopButton.addEventListener('click', () => {
				if (this.gameRoom){
					socket.emit('stopPlay', this.gameRoom.id);
				}
				this.destroyUI();
				this.gameRoom = undefined;
				this.children.removeAll();
				this.gamePage(this);
			});
		});

		socket.on('snapshot', (data) => {
			//Read the snapshot
			SI.snapshot.add(data);
			SI.vault.add(data);
		});
	}

	destroyUI(){
		this.UIElement.destroy();
		if (this.UIScorePlayer1 && this.UIScorePlayer2){
			this.UIScorePlayer1.destroy();
			this.UIScorePlayer2.destroy();
		}
	}

	startLobby(data : any){
		if (this.gameRoom){
			this.destroyUI();
		}

		this.gameRoom = GameRoom.createGameRoom(
			this,
			data.roomId,
			data.customGameMode,
			data.player1SocketId,
			data.player2SocketId,
			data.player1UserId,
			data.player2UserId,
			data.player1UserName,
			data.player2UserName);

		this.UIElement = this.add.dom(450, 400).createFromHTML(' \
		<div class="grid grid-rows-6 grid-cols-3 justify-items-center  gap-y-4 gap-x-32"> \
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
			<div class="row-start-5 col-start-2  ..."><button id="startButton"class="btn btn-primary ml-5 ...">START</button></div> \
			<div class="row-start-6 col-start-2 ..."><button id="leaveButton"class="btn btn-error ml-5 ...">LEAVE</button></div> \
		</div>');

		let userProfile1 = this.UIElement.node.querySelector("#userProfile1");
		let userProfile2 = this.UIElement.node.querySelector("#userProfile2");

		let userProfile1Name = this.UIElement.node.querySelector("#player1Name") as HTMLElement;
		let userProfile2Name = this.UIElement.node.querySelector("#player2Name") as HTMLElement;


		var imagePathPlayer1;
		var imagePathPlayer2;

		if (socket.id == this.gameRoom.player1SocketId){
			userProfile1Name.innerText = data.player1UserName;
			userProfile2Name.innerText = data.player2UserName;
			
		}
		else{
			userProfile2Name.innerText = data.player2UserName;
			userProfile1Name.innerText = data.player1UserName;
		}

		// console.log(data.player1UserName, data.player1Image);
		// console.log(data.player2UserName, data.player2Image);

		imagePathPlayer1 = "userImages/" + data.player1Image;
		imagePathPlayer2 = "userImages/" + data.player2Image;

		this.load.image('userImage2', imagePathPlayer2);

		this.load.image('userImage1', imagePathPlayer1);

		console.log(imagePathPlayer1);
		console.log(imagePathPlayer2);


		this.load.once(Phaser.Loader.Events.COMPLETE, () => {
			Phaser.DOM.AddToDOM(this.textures.get('userImage1').getSourceImage() as HTMLElement, 'userProfile1');
			Phaser.DOM.AddToDOM(this.textures.get('userImage2').getSourceImage() as HTMLElement, 'userProfile2');
		});

	
		this.load.start();

		let startButton = this.UIElement.node.querySelector('#startButton') as HTMLElement;
		let leaveButton = this.UIElement.node.querySelector('#leaveButton') as HTMLElement;

		let isReadyButtonPlayer1 = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
		let isReadyButtonPlayer2 = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;

		var self = this;

		leaveButton.addEventListener('click', function() {
			socket.emit('playerLeaveLobby', self.gameRoom.id);
			self.UIElement.destroy();
			self.textures.remove('userImage2')
			self.textures.remove('userImage1')
			self.gamePage(self);
		});

		socket.on('otherPlayerLeaveLobby', () => {
			// self.UIElement.destroy();
			self.destroyUI();
			self.textures.remove('userImage2')
			self.textures.remove('userImage1')
			self.UIElement = self.add.dom(500, 400).createFromHTML(' \
				<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y 8 ..."> \
					<div class="row-start-1 col-start-2 col-end-3 ..."> \
						<h1 class="text-4xl font-bold dark:text-white ...">Looking for a game</h1> \
					</div> \
					<div class="row-start-2 col-start-2 col-end-3 ..."> \
						<span class=" loading loading-dots loading-lg"></span> \
					</div> \
				</div>');
			socket.emit('playerJoinNormalQueue', user.userId);
		});

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
		if (this.gameRoom.score && this.gameRoom.player1SocketId && this.gameRoom.player2SocketId){
			let scorePlayer1 = this.gameRoom.score.get(this.gameRoom.player1SocketId);
			let scorePlayer2 = this.gameRoom.score.get(this.gameRoom.player2SocketId);

			let scorePlayer1Ele = this.UIScorePlayer1.node.querySelector("#scorePlayer1") as HTMLElement;
			let scorePlayer2Ele = this.UIScorePlayer2.node.querySelector("#scorePlayer2") as HTMLElement;
			if ( scorePlayer1 <= 3 && scorePlayer2 <= 3){
				scorePlayer1Ele.style.setProperty('--value', scorePlayer1.toString());
				scorePlayer2Ele.style.setProperty('--value', scorePlayer2.toString());
			}
		}
	}

	switchSceneInvisible(){
		if (this.gameRoom.entities){
			for (let i = 0; i < 4; i++){
				this.gameRoom.entities.walls[i].gameObject.setVisible(false);
			}
			for (let i = 0; i < 2; i++){
				this.gameRoom.entities.players[i].gameObject.setVisible(false);
			}
			this.gameRoom.entities.ball.gameObject.setVisible(false);
		}
	}

	spawnSceneProps(){
		this.UIElement.destroy();

		this.createUIScore();
        this.gameRoom.entities = new Entities(
			this,
			this.gameRoom.customGameMode,
			this.gameRoom.player1SocketId,
			this.gameRoom.player2SocketId
		);


		this.graphics = this.add.graphics({ fillStyle: { color: 0xffffffff } });
		const point = new Phaser.Math.Vector2(500, 20);
		for (let offset = 100; offset < 680; offset+=40)
		{
			point.y = offset;
			const rect = new Phaser.Geom.Rectangle(point.x, point.y, 3, 20);
			this.graphics.fillRectShape(rect);
		}
	}

	destroy(){}

	update(){
		//Client receive a snapshot which contains both the ball and the players position
		//by doing so, every client read the same game steps.

		//Interpolate x y coordinates on ball object
		const ballSnapshot = SI.calcInterpolation('x y velX velY', 'ball');

		if (ballSnapshot) {
			const { state } = ballSnapshot;

			if (state){
				const { id, x, y, velX, velY } = state[0];
				if (this.gameRoom && this.gameRoom.entities && this.gameRoom.entities.ball.gameObject) {
					//get rid of old snapshot not rendered when the ball scored and then respawn
					this.gameRoom.entities.ball.gameObject.x = x;
					this.gameRoom.entities.ball.gameObject.y = y;
					this.gameRoom.entities.ball.gameObject.setVelocity(velX, velY);
				}
			}
		}

		if (this.gameRoom && this.gameRoom.customGameMode){
			const obstaclesSnapshot = SI.calcInterpolation('delta', 'obstacles');
			if (obstaclesSnapshot){
				const { state } = obstaclesSnapshot;
				if (state){
					const {id, delta} = state[0];
					if (id != undefined){
						for (let i = 0; i < 2; i++){
							this.gameRoom.entities.obstacles[i].gameObject.setAngle(delta);
						}
					}
				}
			}
		}

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
				});
			}
		}
	}
}

</script>
