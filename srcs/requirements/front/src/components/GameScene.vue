<script lang="ts">

import '@geckos.io/snapshot-interpolation';
import { io } from 'socket.io-client';
import Phaser from 'phaser';
import rectWrapper from '../elements/rectWrapper';
import * as Matter from 'matter-js';
import Player from '../elements/player';
import { SnapshotInterpolation } from '@geckos.io/snapshot-interpolation';
import { insertWaiter } from './api/post.call'

const socket = io('http://localhost:3000');

const SI = new SnapshotInterpolation();

export default class Game extends Phaser.Scene {
	mainPlayer !: Player;
	secondPlayer !: Player;
	ball : Matter.Image;
	scoreMainPlayer : number;
	scoreSecondPlayer : number;
	scoreMainPlayerDisplayed : any;
	scoreSecondPlayerDisplayed : any;
	bounce : any;
	startButton !: Phaser.GameObjects.BitmapText;

	gameRunning : boolean = false;
	multiGameMode : boolean = false;
	botGameMode : boolean = false;

	preload(){
		this.load.setPath('src/assets');
		//Ball sprite
		this.load.image('ball','ball-pink.png');
		//Font
		this.load.bitmapFont('atari', 'atari-smooth.png', 'atari-smooth.xml');
		//Ball bouncing sound
		this.load.audio('bounce', 'SwitchClickOldDbx PE1090906.mp3');
		//Particles sprite
		this.load.image('red', 'red.png');
		this.load.image('bg','modern-futuristic-sci-fi-background.jpg');
		//Button sprite
	}

	chooseGameMode(){
		let choiceButton1 : Phaser.GameObjects.BitmapText;
		let choiceButton2 : Phaser.GameObjects.BitmapText;

		const graphics = this.add.graphics({ fillStyle: { color: 0xdb2e94ff } });

		const fx0 = graphics.postFX.addGlow(0xdb2e94, 4, 0, false, 0.1, 8);
		graphics.lineStyle(3, 0xff00ff, 1);

		graphics.strokeRoundedRect(410, 385, 200, 70,12);
		graphics.strokeRoundedRect(280, 285,480, 70,12);

		choiceButton1 = this.add.bitmapText(300, 300, 'atari', '', 40)
		choiceButton1.setText("MULTIPLAYER").setTint(0xdb2e94ff);
		choiceButton1.setInteractive({ useHandCursor: true })

		choiceButton1.on('pointerdown', () => {
			this.multiGameMode = true;
			this.botGameMode = false;
			choiceButton1.destroy();
			choiceButton2.destroy();
			graphics.visible = false;
			socket.emit('playerReady', { multiplayer : this.multiGameMode, bot : this.botGameMode });
			insertWaiter(socket.id);
		}, this)

		choiceButton2 = this.add.bitmapText(450, 400, 'atari', '', 40)
		choiceButton2.setText("BOT").setTint(0xdb2e94ff);
		choiceButton2.setInteractive({ useHandCursor: true })

		choiceButton2.on('pointerdown', () => {
			this.multiGameMode = false;
			this.botGameMode = true;
			choiceButton1.destroy();
			choiceButton2.destroy();
			graphics.visible = false;
			socket.emit('playerReady', { multiplayer : this.multiGameMode, bot : this.botGameMode });
		}, this)

		const fx1 = choiceButton1.postFX.addGlow(0xdb2e94ff, 0, 0, false, 0.1, 24);
		const fx2 = choiceButton2.postFX.addGlow(0xdb2e94ff, 0, 0, false, 0.1, 24);

		this.tweens.add({
			targets: [fx0, fx1, fx2],
			outerStrength: 1,
			yoyo: true,
			loop: -1,
			ease: 'sine.inout'
		})
	}

	setupUI(){
		let startButtonCanvas : any;

		const graphics = this.add.graphics({ fillStyle: { color: 0xdb2e94ff } });

		const fx0 = graphics.postFX.addGlow(0xdb2e94, 4, 0, false, 0.1, 8);
		graphics.lineStyle(3, 0xff00ff, 1);

		startButtonCanvas = graphics.strokeRoundedRect(380, 385, 250, 70,12);
		this.startButton = this.add.bitmapText(400, 400, 'atari', '', 40)
		this.startButton.setText("START").setTint(0xdb2e94ff);
		this.startButton.setInteractive({ useHandCursor: true })
		this.startButton.on('pointerdown', () => {
			this.chooseGameMode();
			this.startButton.destroy();
			startButtonCanvas.destroy();
		}, this)

		const fx1 = this.startButton.postFX.addGlow(0xdb2e94ff, 0, 0, false, 0.1, 24);
		this.tweens.add({
			targets: fx1,
			outerStrength: 1,
			yoyo: true,
			loop: -1,
			ease: 'sine.inout'
		});
	}

	setupScore(){
		this.scoreMainPlayerDisplayed = this.add.bitmapText(300, 120, 'atari', '', 35);
		this.scoreSecondPlayerDisplayed = this.add.bitmapText(680, 120, 'atari', '', 35);

		this.scoreMainPlayerDisplayed.setScale(3 / 4, 1);
		this.scoreSecondPlayerDisplayed.setScale(3 / 4, 1);

		this.scoreMainPlayerDisplayed.setText("0").setTint(0xdb2e94ff)
		this.scoreSecondPlayerDisplayed.setText("0").setTint(0xdb2e94ff)

		const fx1 = this.scoreMainPlayerDisplayed.postFX.addGlow(0xdb2e94ff, 0, 0, false, 0.1, 24);
		const fx2 = this.scoreSecondPlayerDisplayed.postFX.addGlow(0xdb2e94ff, 0, 0, false, 0.1, 24);

		this.tweens.add({
			targets: [fx1, fx2],
			outerStrength: 1,
			yoyo: true,
			loop: -1,
			ease: 'sine.inout'
		});
	}

	create(){
		this.setupUI();

		socket.on('init',  (data) => {
			if (this.ball){
				this.ball.destroy();
			}
			this.bounce = this.sound.add('bounce');
			this.startButton.destroy();
			this.setupScore();

			//Middle line
			const graphics = this.add.graphics({ fillStyle: { color: 0xdb2e94ff } });
			const fx1 = graphics.postFX.addGlow(0xdb2e94, 4, 0, false, 0.1, 8);

			const point = new Phaser.Math.Vector2(500, 20);
			for (let offset = 100; offset < 680; offset+=40)
			{
				point.y = offset;
				const rect = new Phaser.Geom.Rectangle(point.x, point.y, 3, 20);
				graphics.fillRectShape(rect);
			}
			this.matter.world.disableGravity();
			this.matter.world.setBounds();
			
			const walls : rectWrapper[] = data.walls;
			const players : rectWrapper[] = data.players;
			const ball : any = data.ball;
			const id : string = data.id;
			const firstSlotOccupied : boolean = data.firstSlot;
			
			//Creating the game objects based on the serialized data received from the server
			//and adding them inside the physics simulation to have collisions.
			// for (let i = 0; i < 4; i++){
			//   this.matter.add.gameObject(
			//     this.add.rectangle(walls[i].x, walls[i].y, walls[i].width, walls[i].height, 0xffffffff),
			//     { isStatic: true, label: walls[i].label, render : { visible : false} });
			// }

			for (let i = 0; i < 2; i++){
				let playerObject = this.matter.add.gameObject(
				this.add.rectangle(players[i].x, players[i].y, 5, 80, 0xdb2e94ff),
				{ isStatic: true, label: players[i].label });
				if (i == 0){
					if (firstSlotOccupied == false){
						this.mainPlayer = new Player(socket.id, playerObject);
					}
					else{
						this.secondPlayer = new Player("", playerObject);
					}
					}
					else{
					if (this.mainPlayer == undefined){
						this.mainPlayer = new Player(socket.id, playerObject);
					}
					else{
						this.secondPlayer = new Player("", playerObject);
					}
				}
			}
			const fx2 = this.mainPlayer.gameObject.postFX.addGlow(0xdb2e94, 4, 0, false, 0.1, 8);
			const fx3 = this.secondPlayer.gameObject.postFX.addGlow(0xdb2e94, 4, 0, false, 0.1, 8);

			const ballOptions = {
				isStatic: false,
				restitution: 1,
				friction: 0,
				frictionAir: 0,
				frictionStatic: 0,
				inertia: Infinity,
				label: ball.name
			}

			this.ball = this.add.rectangle(ball.x, ball.y, 10, 10, 0xdb2e94ff);

			// this.ball.setVelocity(5, 5);
			this.ball = this.matter.add.gameObject(this.ball, ballOptions);
			const fx4 = this.ball.postFX.addGlow(0xdb2e94, 4, 0, false, 0.1, 8);
			// this.ball.setVelocity(5, 5);

			this.tweens.add({
				targets: [fx1, fx2, fx3],
				outerStrength: 1,
				yoyo: true,
				loop: -1,
				ease: 'sine.inout'
			});
		});

		socket.on('otherPlayerConnect', (data) => {
			const id : string = data.id;
			this.secondPlayer.id = id;
			console.log("other player is connected");
			let counter = 3;
			// intervalId = setInterval
			let countdown = this.add.bitmapText(500, 400, 'atari', '', 125);

			let interval = setInterval(() => {
				let temp = countdown.setText(counter.toString()).setTint(0xdb2e94ff);
				if (counter == 0){
					clearInterval(interval);
					temp.destroy();
				}
				counter--;
			}, 1000);
			setTimeout(() => {
				this.gameRunning = true;
				this.ball.setVelocity(5, 5);
			}, 5000);
		});

		this.input.on('pointermove', function(pointer : any){
			socket.emit('playerMovement', { x: pointer.x, y : pointer.y })
			if (this.mainPlayer){
				this.mainPlayer.gameObject.y = Phaser.Math.Clamp(pointer.y, 65, 735);
				this.mainPlayer.gameObject.body.position.y = this.mainPlayer.gameObject.y;
			}
		}, this);

		//Ball collision
		this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
			let bodies = [bodyA.label, bodyB.label];
			if (bodies.includes('lower') || bodies.includes('upper') || bodies.includes('player1') || bodies.includes('player2')){
				this.bounce.play();
			}
			if (bodies.includes('ball') && (bodies.includes('player1') || bodies.includes('player2'))){
				this.handleCollisionsPlayerBall(bodyA, bodyB);
			}
		}, this);

		socket.on('playerMoved', (data) => {
			if (this.mainPlayer && data.id != this.mainPlayer.id){
				this.secondPlayer.gameObject.y = data.y
				this.secondPlayer.gameObject.body.position.y = this.secondPlayer.gameObject.y;
			}
		});

		socket.on('snapshot', (data) => {
			//read the snapshot
			SI.snapshot.add(data);
		})
	}

	destroy(){
		this.scene.remove();
	}

	handleCollisionsPlayerBall(bodyA : any, bodyB : any){
		var player : Player;
		if (bodyB.label == 'player1'){
			if (this.mainPlayer.gameObject.label == "player1"){
				player = this.mainPlayer;
			}
			else{
				player = this.secondPlayer;
			}
		}
		else{
			if (this.mainPlayer.gameObject.label == "player2"){
				player = this.mainPlayer;
			}
			else{
				player = this.secondPlayer;
			}
		}
		var intersectionDeltaY = 0;
		if (this.ball.body.velocity.y > 0){
			if (player.gameObject.y > this.ball.y){
				intersectionDeltaY = player.gameObject.y - this.ball.y;
				this.ball.setVelocityY(this.ball.body.velocity.y * -1);
			}
			else{
				intersectionDeltaY = this.ball.y - player.gameObject.y;
				this.ball.setVelocityY(this.ball.body.velocity.y );
			}
		}
		else{
			if (player.gameObject.y > this.ball.y){
				intersectionDeltaY = player.gameObject.y - this.ball.y;
				this.ball.setVelocityY(this.ball.body.velocity.y );
			}
			else{
				intersectionDeltaY = this.ball.y - player.gameObject.y;
				this.ball.setVelocityY(this.ball.body.velocity.y * -1);
			}
		}
	}

	update(){
		//Client receive a snapshot which contains both the ball and the players position
		//by doing so, every client we read the same game steps.
		//Interpolate x y coordinates on ball object
		const ballSnapshot = SI.calcInterpolation('x y', 'ball')
		if (ballSnapshot) {
			const { state } = ballSnapshot;
			if (state){
				const { id, x, y } = state[0];
				if (this.ball) {
					this.ball.x = x;
					this.ball.y = y;
				}
			}
		}

		//Interpolate x y coordinates on players object
		const playerSnapshot = SI.calcInterpolation('x y', 'players');
		if (playerSnapshot){
			const { state } = playerSnapshot;
			if (state) {
				state.forEach(s => {
					const { id, x, y, score } = s;
					if (id != undefined){
						if (id == this.mainPlayer.id){
							this.mainPlayer.gameObject.y = y;
							this.scoreMainPlayer = score;
							this.scoreMainPlayerDisplayed.setText(this.scoreMainPlayer);
						}
						else{
							this.secondPlayer.gameObject.y = y;
							this.scoreSecondPlayer = score;
							this.scoreSecondPlayerDisplayed.setText(this.scoreSecondPlayer);
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
