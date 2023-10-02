<script>
import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
    player1;
    player2;
    ball;
    left_side;
    right_side;
    upper_side;
    lower_side;
    score_p1;
    score_p2;
    score_txt_p1;
    score_txt_p2;
    bounce;
    enhanced_bot_deviation = 0;
    initial_bot_deviation = 0;
    timerEvent;

    preload(){
        this.load.setPath('src/assets');
        this.load.bitmapFont('atari', 'atari-smooth.png', 'atari-smooth.xml');
        this.load.audio('theme', 'tvari-seoul-arcade-163807.mp3',);
        this.load.audio('bounce', 'SwitchClickOldDbx PE1090906.mp3');
        this.load.image('ball','ball-pink.png');
        this.load.image('red', 'red.png');
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();
    }

    create(){
        //map middle line
        const graphics = this.add.graphics({ fillStyle: { color: 0xffffffff } });
        const point = new Phaser.Math.Vector2(500, 20);
        // this.game.scale.pageAlignHorizontally = true;
        // this.game.scale.pageAlignVertically = true;
        // this.game.scale.refresh();
        for (let offset = 20; offset < 800; offset+=20)
        {
            point.y = offset;
            graphics.fillPointShape(point, 10);
        }
        //map limits
        this.left_side = this.add.rectangle(20, 400, 10, 770, 0xffffffff);
        this.right_side = this.add.rectangle(980, 400, 10, 770, 0xffffffff);
        this.upper_side = this.add.rectangle(500, 10,970, 10, 0xffffffff);
        this.lower_side = this.add.rectangle(500, 790, 970, 10, 0xffffffff);
        const music = this.sound.add('theme');
        this.bounce = this.sound.add('bounce');
        // music.play();
        this.left_side.name = "left_side";
        this.right_side.name = "right_side";
        this.score_txt_p1 = this.add.bitmapText(440, 40, 'atari', '', 35);
        this.score_txt_p2 = this.add.bitmapText(520, 40, 'atari', '', 35);
        this.score_txt_p1.setText("0");
        this.score_txt_p2.setText("0");
        this.score_p1 = 0;
        this.score_p2 = 0;
        this.physics.add.existing(this.left_side, true);
        this.physics.add.existing(this.right_side, true);
        this.physics.add.existing(this.upper_side, true);
        this.physics.add.existing(this.lower_side, true);
        //defining a deathzone
        //players are represented by 10x50 rectangle are identify by labels
        this.player1 = this.add.rectangle(50, 300, 10,50, 0xffffffff);
        this.player2 = this.add.rectangle(950, 300, 10, 50, 0xffffffff);
        this.player1.name = "player1";
        this.player2.name = "player2";
        //add a physics body to players
        this.physics.add.existing(this.player1, true);
        this.physics.add.existing(this.player2, true);
        this.ball = this.physics.add.sprite(0, 0, 'ball');
        //set collision between both player and the ball
        //onHit is a callback to modify the velocity of the ball when hitting a player paddel
        //velocity = speed and direction vector
        this.physics.add.collider(this.ball, this.player1, this.onHit, undefined, this);
        this.physics.add.collider(this.ball, this.player2, this.onHit, undefined, this);
        this.physics.add.collider(this.ball, this.left_side, this.pointScoreTimer, undefined, this);
        this.physics.add.collider(this.ball, this.right_side, this.pointScoreTimer, undefined, this);
        this.physics.add.collider(this.ball, this.upper_side, this.bounceSound, undefined, this);
        this.physics.add.collider(this.ball, this.lower_side, this.bounceSound, undefined, this);
        this.physics.add.collider(this.player1, this.upper_side);
        this.physics.add.collider(this.player2, this.lower_side);
        this.ball.body.x = this.ball.x;
        this.ball.body.y = this.ball.y;
        const emitter = this.add.particles(this.ball.body.x, this.ball.body.y, 'red', {
            speed: 100,
            scale: { start: 0.2, end: 0.3 },
            blendMode: 'ADD',
        });
        //deadzone of the particules = walls
        const zone = new Phaser.Geom.Rectangle(20, 20, 960, 760);
        emitter.addDeathZone({ type: 'edge', source: zone});
        this.initialBallState();
        //set the collision and bouncing with the world
        this.ball.body.setBounce(1).setCollideWorldBounds(true);
        this.ball.body.setMaxSpeed(500);
        emitter.startFollow(this.ball);
        this.input.on('pointermove', function(pointer){
            this.player1.body.y = pointer.worldY;
            this.player1.y = pointer.worldY + 25;
        }, this);
        //left,right,up,down
        this.physics.world.setBoundsCollision(false, false, true, true);

    }

    pointScoreTimer(ball, wall){
        ball.setPosition(500, Phaser.Math.Between(0, 500));
        ball.setVelocity(0, 0);
        if (wall.name == "left_side"){
            this.score_p2++;
        }
        else{
            this.score_p1++;
        }
        var score_stringify = this.score_p1 + "";
        this.score_txt_p1.setText(score_stringify);
        score_stringify = this.score_p2 + "";
        this.score_txt_p2.setText(score_stringify);
        this.timerEvent = this.time.addEvent({delay: 3000, callback: this.pointScore, callbackScope: this, args: [ball, wall]});
    }

    pointScore(ball, wall) {
        const randomPos  = Phaser.Math.Between(120, 150);
        wall.name == "left_side" ? this.ball.setVelocity(300, randomPos) : this.ball.setVelocity(-300, randomPos);
        this.enhanced_bot_deviation = 0;
    };

    bounceSound(){
        this.bounce.play();
    }

    initialBallState(){
        //Spawn the ball at a random position in the middle of the map
        this.ball.setPosition(500, Phaser.Math.Between(0, 500));
        this.ball.scale = 0.05;
        //First ball start randomly to either one of the side
        //then it will spawn in direction of the player who won last ball
        if (Phaser.Math.Between(0, 1) % 2 == 0){
            this.ball.setVelocity(-300, Phaser.Math.Between(120, 150));
        }
        else{
            this.ball.setVelocity(300, Phaser.Math.Between(120, 150));
        }
    }

    onHit(ball, player) {
        var delta = 0;
        this.bounce.play();
        //Ball hit top of the paddle
        if (player.y > ball.y + 5){
            delta = player.y - ball.y;
            //If the player make a good play then the game rewards him by adding randomness to the bot's next shot,
            //in addition of the initial randomness we give to the bot.
            if (player.name == "player1"){
                this.enhanced_bot_deviation = delta * Phaser.Math.Between(0.95, 1.05);
                this.initial_bot_deviation = 5 * Phaser.Math.Between(0.80, 1.20);
            }
            ball.body.setVelocityY(-10 * delta);
        }
        //Ball hit bot of the paddle
        else if (player.y < ball.y - 5)
        {
            delta = ball.y - player.y;
            if (player.name == "player1"){
                this.enhanced_bot_deviation = delta * Phaser.Math.Between(0.95, 1.05);
                this.initial_bot_deviation = 5 * Phaser.Math.Between(0.80, 1.20);
            }
            ball.body.setVelocityY(10 * delta);
        }
        //The case when one of the player hit the ball on the middle of the paddle, in this case we add a default randomness to the shot
        else
        {
            let deviation = 30 * Math.random() ;
            ball.body.setVelocityY(deviation);
        }
    }

    update(time, delta) {
        this.player2.y = this.ball.y + this.enhanced_bot_deviation + this.initial_bot_deviation;
        //Because player body start at the middle of the sprite
        this.player2.body.y = this.player2.y - 25;
        if (this.score_p2 == 3 || this.score_p1 == 3)
        {
            const gameFinishMsg = this.add.bitmapText(320, 450, 'atari', '', 35);
            gameFinishMsg.setText("Game finish")
            this.game.pause();
        }
    }
}

</script>
