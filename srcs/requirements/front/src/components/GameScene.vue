<script>

import Phaser from 'phaser';
import { Bodies } from 'matter-js'

export default class Game extends Phaser.Scene {

    leftSide;
    rightSide;
    uppeSide;
    lowerSide;
    player1;
    player2;
    ball;
    emitter;
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    scorePlayer1Displayed;
    scorePlayer2Displayed;
    bounce;
    timerEvent;
    gameFinishMessage;
    button;
    gameRunning = false;
    initializationDone = false;

    //constants
    static SCORE_PLAYER1_X = 440;
    static SCORE_PLAYER2_X = 520;
    static SCORE_SIZE = 35;
    static MAP_POINT_Y = 500;
    static MAP_HEIGHT = 770;
    static PLAYER_WIDTH = 10;
    static PLAYER_HEIGHT = 60;
    static BALL_SCALE = 0.1;

    constructor(){
        super('game');
    }

    preload(){
        this.load.setPath('src/assets');
        this.load.bitmapFont('atari', 'atari-smooth.png', 'atari-smooth.xml');
        this.load.image('button', 'flixel-button.png', { frameWidth: 80, frameHeight: 20 });
        this.load.image('red', 'red.png');
        this.load.image('ball','ball-pink.png');
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.load.audio('bounce', 'SwitchClickOldDbx PE1090906.mp3');
        this.game.scale.refresh();
    }

    create(){

        this.setupUI();
        // this.startGame();

        //deplacements
        this.input.on('pointermove', function(pointer){
            if (this.gameRunning){
                this.player1.body.y = Phaser.Math.Clamp(pointer.worldY, 20, 760);
                this.player1.y = Phaser.Math.Clamp(pointer.worldY, 40, 760);
            }
        }, this);

        //collision ball
        this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            if (this.gameRunning)
            {
                let bodies = [bodyA.label, bodyB.label];
                if (bodies.includes('lower') || bodies.includes('upper') || bodies.includes('player1') || bodies.includes('player2')){
                    this.bounce.play();
                }
                if (bodies.includes('ball') && (bodies.includes('player1') || bodies.includes('player2'))){
                    this.handleCollisionsPlayerBall(bodyA, bodyB);
                }
                else if (bodies.includes('ball') && (bodies.includes('left') || bodies.includes('right'))){
                    this.handleCollisionsBallWalls(bodyA, bodyB);
                }
            }
        }, this);
    }

    setupUI(){
        this.startButton = this.add.text(500, 400, 'START')
            .setPadding(10)
            .setOrigin(0.5)
            .setScale(2, 2)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.startGame, this)
            .on('pointerover', () => this.startButton.setStyle({ fill: '#ffff00' }))
            .on('pointerout', () => this.startButton.setStyle({ fill: '#ffffff' }))
    }

    setupWorld(){
        this.matter.world.disableGravity();
        this.matter.world.setBounds();
    }

    startGame(){
        if (this.initializationDone == false)
        {
            this.setupMap();
            this.setupBall();
            this.setupParticles();
            this.setupPlayers();
            this.setupScore();
            this.setupSound();
            this.setupCollision();
            this.setupWorld();
            this.initializationDone = true;
        }
        else{
            this.scorePlayer1 = 0;
            this.scorePlayer2 = 0;
            this.ballSpawn();
            this.gameFinishMessage.setVisible(false);
            this.scorePlayer1Displayed.setText("0");
            this.scorePlayer2Displayed.setText("0");
            this.ball.setPosition(500, Phaser.Math.Between(20, 760));
            this.decideRandomBallDirection();
        }
        this.gameRunning = true;
        this.startButton.destroy();
    }

    setupParticles(){
        this.emitter = this.add.particles(this.ball.body.x, this.ball.body.y, 'red', {
            speed: 100,
            scale: { start: 0.2, end: 0.3 },
            blendMode: 'ADD',
        });
        const deathZoneEmitter = new Phaser.Geom.Rectangle(20, 20, 960, 760);
        this.emitter.addDeathZone({ type : 'edge', source : deathZoneEmitter});
        this.emitter.startFollow(this.ball);
    }

    decideRandomBallDirection(){
        if (Phaser.Math.Between(0, 1) % 2 == 0){
            this.ball.setVelocityX(5);
        }
        else{
            this.ball.setVelocityX(-5);
        }
    }

    setupBall(){
        const ballOptions = {
            inertia: Infinity,
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            label: 'ball'
        }
        this.ball = this.matter.add.image(500, 400, 'ball');
        this.ball.scale = 0.1;
        this.ball.setCircle(10, ballOptions);
        this.ball.setVelocity(5);
        this.ball.setPosition(500, Phaser.Math.Between(20, 760));
        this.decideRandomBallDirection();
    }

    setupMap(){
        const point = new Phaser.Math.Vector2(Game.MAP_POINT_Y, 20);
        const graphics = this.add.graphics({ fillStyle: { color: 0xffffffff } });
        for (let offset = 20; offset < 800; offset+=20)
        {
            point.y = offset;
            graphics.fillPointShape(point, 10);
        }
        this.leftSide = this.add.rectangle(20, 400, 10, 770, 0xffffffff);
        this.rightSide = this.add.rectangle(980, 400, 10, 770, 0xffffffff);
        this.upperSide = this.add.rectangle(500, 10,970, 10, 0xffffffff);
        this.lowerSide = this.add.rectangle(500, 790, 970, 10, 0xffffffff);
    }

    setupPlayers(){
        this.player1 = this.add.rectangle(50, 400, 10, 60, 0xffffffff);
        this.player2 = this.add.rectangle(950, 400, 10, 60, 0xffffffff);
    }

    setupCollision(){
        //walls
        this.matter.add.gameObject(this.lowerSide, { label: 'lower', isStatic: true });
        this.matter.add.gameObject(this.upperSide, { label: 'upper', isStatic: true });
        this.matter.add.gameObject(this.leftSide, { label: 'left', isStatic: true });
        this.matter.add.gameObject(this.rightSide, { label: 'right', isStatic: true });
        //players
        this.matter.add.gameObject(this.player1, { label: 'player1', isStatic: true });
        this.matter.add.gameObject(this.player2, { label: 'player2', isStatic: true });
    }

    setupScore(){
        this.gameFinishMessage = this.add.bitmapText(320, 350, 'atari', '', 40);
        this.gameFinishMessage.setText("Game finish");
        this.gameFinishMessage.setVisible(false);
        this.scorePlayer1Displayed = this.add.bitmapText(Game.SCORE_PLAYER1_X, 40, 'atari', '', Game.SCORE_SIZE);
        this.scorePlayer2Displayed = this.add.bitmapText(Game.SCORE_PLAYER2_X, 40, 'atari', '', Game.SCORE_SIZE);
        this.scorePlayer1Displayed.setText("0");
        this.scorePlayer2Displayed.setText("0");
    }

    setupSound(){
        this.bounce = this.sound.add('bounce');
    }

    updateScore(bodyA, bodyB){
        if (bodyB.label == 'bodyA'){
            this.ball.setPosition(500, Phaser.Math.Between(20, 760));
        }
        else{
            this.ball.setPosition(500, Phaser.Math.Between(20, 760));
        }
        this.scorePlayer1Displayed.setText(this.scorePlayer1);
        this.scorePlayer2Displayed.setText(this.scorePlayer2);
        this.ballSpawn();
    }

    update(time, delta) {
        if (this.gameRunning && this.ball.x > 500 && this.ball.body.velocity.x > 0){
            if (this.player2.y > this.ball.y){
                this.player2.y-=5;
            }
            else if (this.player2.y < this.ball.y){
                this.player2.y+=5;
            }
            this.player1.y = Phaser.Math.Clamp(this.player1.y, 45, 755);
            this.player1.body.y = Phaser.Math.Clamp(this.player1.y, 40, 760);
            this.player2.y = Phaser.Math.Clamp(this.player2.y, 45, 755);
            this.player2.body.y = Phaser.Math.Clamp(this.player2.y, 40, 760);
        }
    }

    handleCollisionsPlayerBall(bodyA, bodyB){
        var player;
        if (bodyB.label == 'player1'){
            player = this.player1;
        }
        else{
            player = this.player2;
        }
        var intersectionDeltaY = 0;
        if (this.ball.body.velocity.y > 0){
            if (player.y > this.ball.y){
                intersectionDeltaY = player.y - this.ball.y;
                this.ball.setVelocityY(this.ball.body.velocity.y * -1);
            }
            else{
                intersectionDeltaY = this.ball.y - player.y;
                this.ball.setVelocityY(this.ball.body.velocity.y );
            }
        }
        else{
            if (player.y > this.ball.y){
                intersectionDeltaY = player.y - this.ball.y;
                this.ball.setVelocityY(this.ball.body.velocity.y );
            }
            else{
                intersectionDeltaY = this.ball.y - player.y;
                this.ball.setVelocityY(this.ball.body.velocity.y * -1);
            }
        }
    }

    restartGame(){
        this.gameRunning = false;
        this.setupUI();
    }

    ballDespawn(){
        this.ball.setActive(false).setVisible(false);
        this.emitter.stopFollow(this.ball);
        this.ball.body.isStatic = true;
    }

    ballSpawn(){
        this.ball.body.isStatic = false;
        this.ball.setActive(true).setVisible(true);
        this.emitter.startFollow(this.ball);
    }

    handleCollisionsBallWalls(bodyA, bodyB){
        if (bodyB.label == 'left'){
            this.scorePlayer2++;
            this.scorePlayer2Displayed.setText(this.scorePlayer2);
        }
        else{
            this.scorePlayer1++;
            this.scorePlayer1Displayed.setText(this.scorePlayer1);
        }
        if (this.scorePlayer1 == 1 || this.scorePlayer2 == 1){
            this.scorePlayer1Displayed.setText(this.scorePlayer1);
            this.scorePlayer2Displayed.setText(this.scorePlayer2);
            this.gameFinishMessage.setVisible(true);
            this.ballDespawn();
            this.timerEvent = this.time.addEvent({delay: 5000, callback: this.restartGame, callbackScope: this});
        }
        else{
            this.ballDespawn();
            this.timerEvent = this.time.addEvent({delay: 3000, callback: this.updateScore, callbackScope: this, args : [bodyA, bodyB]});
        }
    }
}

</script>
