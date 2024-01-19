<script lang="ts">
//Linear interpolation
import '@geckos.io/snapshot-interpolation';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
//Socket communication
import { Socket } from 'socket.io-client';
//Game library
import Phaser from 'phaser';
//Game Physics library
import * as Matter from 'matter-js';
//Interfaces
import Entities from '../../entities/entities';
import GameRoom from "../../gameRoom/gameRoom";

//Initialize snapshot library
const SI = new SnapshotInterpolation();

export default class Game extends Phaser.Scene {

	startButton !: Phaser.GameObjects.BitmapText;
	gameRoom : GameRoom | undefined;
	UIElement : Phaser.GameObjects.DOMElement;
	UIScorePlayer1: Phaser.GameObjects.DOMElement;
	UIScorePlayer2: Phaser.GameObjects.DOMElement;
	graphics : Phaser.GameObjects.Graphics;
	user : any;
	cookieJWT: string;
	socket: Socket;

	constructor(){
		super({ key: 'GameScene' });
	}

	init(data : any){
		this.user = data.user;
		this.socket = data.socket;
		this.UIElement = data.UIElement;
		this.gameRoom = data.gameRoom;
	}

	setupSocketEvents(){
		//Keep track of this instance for arrow function
		const self = this;

		this.socket.on('updateScore', (data : any)  => {
			if (this.gameRoom && this.gameRoom.score){
				this.gameRoom.score.set(this.gameRoom.player1UserId.toString(), data.scorePlayer1);
				this.gameRoom.score.set(this.gameRoom.player2UserId.toString(), data.scorePlayer2);
				this.updateUIScore();
			}
		});

		this.socket.on('currentGameInformation', (data : any) => {
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
			if (this.gameRoom && this.gameRoom.score && this.gameRoom.entities){
				if (data.scorePlayer1 < 3 && data.scorePlayer2 < 3){
					this.gameRoom.engine = Matter.Engine.create();
					this.gameRoom.engine.gravity.x = 0;
					this.gameRoom.engine.gravity.y = 0;
					this.gameRoom.score.set(this.gameRoom.player1UserId.toString(), data.scorePlayer1);
					this.gameRoom.score.set(this.gameRoom.player2UserId.toString(), data.scorePlayer2);
					this.destroyUI();
					this.matter.world.disableGravity();
					this.matter.world.setBounds();
					this.gameRoom.world = this.gameRoom.engine.world;
					this.spawnSceneProps();
					this.updateUIScore();
					this.gameRoom.entities.ball.gameObject.y = data.ballY;
					if (this.socket)
						this.socket.emit('readyAfterInitialisation', this.gameRoom.id);
				}
			}
		});

		this.socket.on('localGameCreated', (data) => {
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
				</div>'
			);
		})

		this.socket.on('gameStart', () => {
			this.UIElement = this.add.dom(500, 400).createFromHTML('<span class="countdown font-mono text-6xl"> \
				<span id="countdown" style="--value:3;"></span> \
				</span>');
			let counter = 3;
			const refreshID = setInterval(() => {
				if(counter > 0){
					counter--;
				}
				let countdownUI : any;
				if (this.UIElement && this.UIElement.node)
					countdownUI = this.UIElement.node.querySelector('#countdown') as HTMLElement;
				if (countdownUI){
					countdownUI.style.setProperty('--value', counter.toString());
					if (counter == 0){
						if (this.UIElement)
							this.UIElement.destroy();
						clearInterval(refreshID);
					}
				}
			}, 1000);
		})

		this.socket.on('scorePoint', (data : any) => {
			if (this.gameRoom && this.gameRoom.entities){
				if (this.gameRoom.player1Disconnected == false && this.gameRoom.player2Disconnected == false){
					//Reset ball to the middle
					if (this.gameRoom.entities.ball.gameObject) {
						this.gameRoom.entities.ball.gameObject.x = 500;
						this.gameRoom.entities.ball.gameObject.y = data.ball.y;
						this.gameRoom.entities.ball.gameObject.setVelocity(0, 0);
					}
					//Update score
					if (this.gameRoom.score && this.gameRoom.player1UserId && this.gameRoom.player2UserId){
						this.gameRoom.score.set(this.gameRoom.player1UserId.toString(), data.score.player1);
						this.gameRoom.score.set(this.gameRoom.player2UserId.toString(), data.score.player2);
						this.updateUIScore();
					}
				}
			}
		});

		this.socket.on('gameFinish', (data : any) => {
			this.removeSocketEvents();
			this.scene.stop('GameScene');
			this.scene.start('EndGameScene', { user: this.user, gameRoom: this.gameRoom, socket: this.socket, endGameData: data });
			this.children.removeAll();
			if (this.gameRoom)
				this.gameRoom.finish = true;
			this.destroyUI();
		});

		this.socket.on('snapshot', (data : any) => {
			//Read the snapshot
			SI.snapshot.add(data);
			SI.vault.add(data);
		});
	}

	setupGameHooks(){

		//Help me check if user press right or left click (right click context menu is disabled)

		this.input.on('pointermove', (pointer : Phaser.Input.Pointer) => {
			if (this.gameRoom && this.gameRoom.entities){
				if (this.gameRoom.player1SocketId == this.socket.id){
					this.gameRoom.entities.players[0].y = Phaser.Math.Clamp(pointer.y, 75, 725);
					if (this.gameRoom.customGameMode)
						this.gameRoom.entities.players[2].y = Phaser.Math.Clamp(pointer.y, 75, 725);
					this.socket.emit('playerMovement', {
						roomId: this.gameRoom.id,
						socketId: this.socket.id,
						x: this.gameRoom.entities.players[0].x,
						y: this.gameRoom.entities.players[0].y
					});
					if (this.gameRoom.entities.players[0].gameObject){
						this.gameRoom.entities.players[0].gameObject.y = this.gameRoom.entities.players[0].y;
						this.gameRoom.entities.players[0].gameObject.body.position.y = this.gameRoom.entities.players[0].y;
					}
				}
				else if (this.gameRoom.player2SocketId == this.socket.id){
					this.gameRoom.entities.players[1].y = Phaser.Math.Clamp(pointer.y, 75, 725);
					if (this.gameRoom.customGameMode)
						this.gameRoom.entities.players[3].y = Phaser.Math.Clamp(pointer.y, 75, 725);
					this.socket.emit('playerMovement', {
						roomId: this.gameRoom.id,
						socketId: this.socket.id,
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
	}

	removeSocketEvents() {
		this.socket.off('updateScore');
		this.socket.off('currentGameInformation');
		this.socket.off('localGameCreated');
		this.socket.off('gameStart');
		this.socket.off('scorePoint');
		this.socket.off('gameFinish');
		this.socket.off('snapshot');
	}

	
	async create(){
		if (this.gameRoom){
			this.gameRoom.engine = Matter.Engine.create();
			this.gameRoom.engine.gravity.x = 0;
			this.gameRoom.engine.gravity.y = 0;
			this.matter.world.disableGravity();
			this.matter.world.setBounds();
			this.gameRoom.world = this.gameRoom.engine.world;
			this.createUIScore();
			this.spawnSceneProps();
			if (this.socket)
				this.socket.emit('readyAfterInitialisation', this.gameRoom.id);
		}

		// if (this.user && this.user.userId != null){
		// 	let gameRoom : any = await getLastGameRoomIfAfk(self.user.userId, self.cookieJWT);
		// 	if (gameRoom){
		// 		this.children.removeAll();
		// 		if (this.UIElement){
		// 			this.destroyUI();
		// 		}
		// 		this.UIElement = this.add.dom(500, 400).createFromHTML(' \
		// 			<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y-8"> \
		// 			<div class="row-start-1"> <h1 id="winLooseMessage" class="text-4xl font-bold dark:text-white ..."></h1> </div> \
		// 			<div class="row-start-3 col-start-1 col-end-2"><button id="stopButton" class="btn btn-secondary">Stop</button></div> \
		// 			</div> \
		// 		')
		// 		var user1 = await getUserByUserId(gameRoom.users[0].userId, this.cookieJWT);
		// 		var user2 = await getUserByUserId(gameRoom.users[1].userId, this.cookieJWT);
		// 		let winLooseMessage = this.UIElement.node.querySelector("#winLooseMessage") as HTMLElement;
		// 		if (this.user.userId == gameRoom.winnerId){
		// 			if (this.user.userId == gameRoom.player1UserId)
		// 				winLooseMessage.innerText = "You won against " + user2.userName;
		// 			else
		// 				winLooseMessage.innerText = "You won against " + user1.userName;
		// 		}
		// 		else{
		// 			if (this.user.userId == gameRoom.player1UserId)
		// 				winLooseMessage.innerText = "You lost against " + user2.userName;
		// 			else
		// 				winLooseMessage.innerText = "You lost against " + user1.userName;
		// 		}
		// 		let stopButton = this.UIElement.node.querySelector("#stopButton") as HTMLElement;
		// 		stopButton.addEventListener('click', () => {
		// 			if (this.gameRoom){
		// 				this.socket.emit('stopPlay', this.gameRoom.id);
		// 			}
		// 			this.destroyUI();
		// 			this.gameRoom = undefined;
		// 			this.children.removeAll();
		// 			// this.gamePage(this);
		// 		});
		// 	}
		// }
		//Mouse hook for movement
		this.setupSocketEvents();
		this.setupGameHooks()
	}

	destroyUI(){
		this.UIElement.destroy();
		if (this.UIScorePlayer1 && this.UIScorePlayer2){
			this.UIScorePlayer1.destroy();
			this.UIScorePlayer2.destroy();
		}
	}

	createUIScore(){
		this.UIScorePlayer1 = this.add.dom(400, 100).createFromHTML('\
			<span class="countdown font-mono text-6xl"> \
				<span id="scorePlayer1" style="--value:0;"></span> \
			</span>'
		);
		this.UIScorePlayer2 = this.add.dom(600, 100).createFromHTML('\
			<span class="countdown font-mono text-6xl"> \
				<span id="scorePlayer2" style="--value:0;"></span> \
			</span>'
		);
	}

	updateUIScore(){
		if (this.gameRoom && this.gameRoom.score){
			let scorePlayer1 = this.gameRoom.score.get(this.gameRoom.player1UserId.toString());
			let scorePlayer2 = this.gameRoom.score.get(this.gameRoom.player2UserId.toString());
			let scorePlayer1Ele = this.UIScorePlayer1.node.querySelector("#scorePlayer1") as HTMLElement;
			let scorePlayer2Ele = this.UIScorePlayer2.node.querySelector("#scorePlayer2") as HTMLElement;
			if (scorePlayer1 <= 3 && scorePlayer2 <= 3){
				scorePlayer1Ele.style.setProperty('--value', scorePlayer1.toString());
				scorePlayer2Ele.style.setProperty('--value', scorePlayer2.toString());
			}
		}
	}

	switchSceneInvisible(){
		if (this.gameRoom?.entities){
			for (let i = 0; i < 4; i++)
				this.gameRoom.entities.walls[i].gameObject.setVisible(false);
			for (let i = 0; i < 2; i++)
				this.gameRoom.entities.players[i].gameObject.setVisible(false);
			this.gameRoom.entities.ball.gameObject.setVisible(false);
		}
		if (this.gameRoom && this.gameRoom.customGameMode && this.gameRoom.entities){
			for (let i = 2; i < 4; i++)
				this.gameRoom.entities.players[i].gameObject.setVisible(false);
		}
	}

	spawnSceneProps(){
		this.UIElement.destroy();

		if (this.gameRoom){
			this.gameRoom.entities = new Entities(
				this,
				this.gameRoom.customGameMode,
				this.gameRoom.player1SocketId,
				this.gameRoom.player2SocketId
			);
		}

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
		const playerSnapshot = SI.calcInterpolation('x y', 'players');
		if (playerSnapshot){
			const { state } = playerSnapshot;
			if (state) {
				state.forEach(s => {
					const { id, y } = s;
					if (id != undefined && this.gameRoom && this.gameRoom.entities){
						if (id == this.gameRoom.player1SocketId){
							this.gameRoom.entities.players[0].gameObject.y = y;
							if (this.gameRoom.customGameMode)
								this.gameRoom.entities.players[2].gameObject.y = y;
						}
						else{
							this.gameRoom.entities.players[1].gameObject.y = y;
							if (this.gameRoom.customGameMode)
								this.gameRoom.entities.players[3].gameObject.y = y;
						}
					}
				});
			}
		}

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
	}
}

</script>
