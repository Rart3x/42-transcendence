<script lang="ts">
    import { Scene, GameObjects, DOM } from 'phaser'
    import { Socket } from 'socket.io-client';

    export default class LobbyScene extends Scene {
        UIElement : GameObjects.DOMElement;
        user: any;
        socket: Socket;
        gameRoom: any;
        endGameData: any;

        constructor(){
            //Call parent class constructor
            super({ key: 'EndGameScene' });
        }
        
        init(data : any){
            console.log("EndGameScene called")
            //Receive data from GameScene.vue once game is finish
            this.UIElement = data.UIElement;
            this.user = data.user;
            this.gameRoom = data.gameRoom;
            this.socket = data.socket;
            this.endGameData = data.endGameData;
        }

        destroyUI(){
            this.UIElement.destroy();
            // if (this.UIScorePlayer1 && this.UIScorePlayer2){
            //     this.UIScorePlayer1.destroy();
            //     this.UIScorePlayer2.destroy();
            // }
	    }


        createEndGameScreenHTML(){
			this.UIElement = this.add.dom(500, 400).createFromHTML(' \
				<div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y-8"> \
				<div class="row-start-1"> <h1 id="winLooseMessage" class="text-4xl font-bold dark:text-white ..."></h1> </div> \
				<div class="row-start-2 col-start-1 col-end-2"><button id="replayButton" class="btn btn-accent">Play again 0/2</button></div> \
				<div class="row-start-3 col-start-1 col-end-2"><button id="stopButton" class="btn btn-secondary">Stop</button></div> \
				</div> \
			')
        }

        setupEventListeners(){
            let playAgainButton = this.UIElement.node.querySelector("#replayButton") as HTMLElement;
            if (this.endGameData.opponentAfk == true){
                const replayButton = document.getElementById("replayButton");
                if (replayButton)
                replayButton.remove();
            }
            let stopButton = this.UIElement.node.querySelector("#stopButton") as HTMLElement;
            playAgainButton.addEventListener('click', () => {
                if (this.gameRoom && this.gameRoom.playAgain == true){
                    if (this.socket.id == this?.gameRoom?.player1SocketId){
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
                    this.socket.emit('playAgain', this.gameRoom.id);
                }
            });
            stopButton.addEventListener('click', () => {
                if (this.gameRoom){
                    this.socket.emit('stopPlay', this.gameRoom.id);
                }
                this.destroyUI();
                this.gameRoom = undefined;
                this.children.removeAll();
                this.scene.start('BootScene');
            });
        }


        setupSocketEvents(){
            this.socket.on('playAgain', () => {
                let playAgainButton = this.UIElement.node.querySelector("#replayButton") as HTMLElement;
                if (this.socket.id == this?.gameRoom?.player1SocketId){
                    this.gameRoom.player2PlayAgain = true;
                    if (this.gameRoom.player1PlayAgain){
                        playAgainButton.innerText = "Play again 2/2";
                    }
                    else{
                        playAgainButton.innerText = "Play again 1/2";
                    }
                }
                else if (this.gameRoom){
                    this.gameRoom.player1PlayAgain = true;
                    if (this.gameRoom.player2PlayAgain){
                        playAgainButton.innerText = "Play again 2/2";
                    }
                    else{
                        playAgainButton.innerText = "Play again 1/2";
                    }
                }
            });

            this.socket.on('playStop', () => {
                let playAgainButton = this.UIElement.node.querySelector("#replayButton") as HTMLElement;
                if (this.gameRoom)
                    this.gameRoom.playAgain = false;
            
                if (this.socket.id == this.gameRoom?.player1SocketId){
                    this.gameRoom.player2PlayAgain = false;
                    if (this.gameRoom.player1PlayAgain == true){
                        playAgainButton.innerText = "Play again 1/2";
                        playAgainButton.className = "btn btn-active no-animation btn-ghost";
                    }
                    else{
                        playAgainButton.innerText = "Play again 0/2";
                        playAgainButton.className = "btn btn-active no-animation btn-ghost";
                    }
                }
                else if (this.gameRoom?.player2SocketId){
                    this.gameRoom.player1PlayAgain = false;
                    if (this.gameRoom.player2PlayAgain == true){
                        playAgainButton.innerText = "Play again 1/2";
                        playAgainButton.className = "btn btn-active no-animation btn-ghost";
                    }
                    else{
                        playAgainButton.innerText = "Play again 0/2";
                        playAgainButton.className = "btn btn-active no-animation btn-ghost";
                    }
                }
                this.scene.start('BootScene');
            });

            this.socket.on('lobby', (data) => {
				this.UIElement.destroy();
                this.scene.start('LobbyScene', { user: this.user, gameRoomData: data, UIElement: this.UIElement, socket: this.socket });
			});
        }

        create(){
            this.createEndGameScreenHTML();
			this.destroyUI();

			let winLooseMessage = this.UIElement.node.querySelector("#winLooseMessage") as HTMLElement;
			
			var scoreWinner = this.endGameData.scoreWinner.toString();
			var scoreLooser = this.endGameData.scoreLooser.toString();

			if (this.gameRoom){
				if (this.user.userId == this.endGameData.winUserId){
					if (this.user.userId == this.gameRoom.player1UserId){
						if (this.endGameData.opponentAfk == false)
						  winLooseMessage.innerText = "You won against " + this.gameRoom.player2UserName + "\n " + scoreWinner + " - "  + scoreLooser;
						else 
						  winLooseMessage.innerText = "You won against " + this.gameRoom.player2UserName + "\n " + scoreWinner + " - "  + scoreLooser + " by afk";
					}
					else{
						if (this.endGameData.opponentAfk == false)
						  winLooseMessage.innerText = "You won against " + this.gameRoom.player1UserName + "\n " + scoreWinner + " - "  + scoreLooser;
						else 
						  winLooseMessage.innerText = "You won against " + this.gameRoom.player1UserName + "\n " + scoreWinner + " - "  + scoreLooser + " by afk";
					}
				}
				else{
					if (this.user.userId == this.gameRoom.player1UserId){
						if (this.endGameData.opponentAfk == false)
						  winLooseMessage.innerText = "You lost against " + this.gameRoom.player2UserName + "\n " + scoreLooser + " - "  + scoreWinner;
						else 
						  winLooseMessage.innerText = "You lost against " + this.gameRoom.player2UserName + "\n " + scoreLooser + " - "  + scoreWinner + " by afk";
					}
					else{
						if (this.endGameData.opponentAfk == false)
						  winLooseMessage.innerText = "You lost against " + this.gameRoom.player1UserName + "\n " + scoreLooser + " - "  + scoreWinner;
						else 
						  winLooseMessage.innerText = "You lost against " + this.gameRoom.player1UserName + "\n " + scoreLooser + " - "  + scoreWinner + " by afk";
					}
				}
                this.setupEventListeners();
                this.setupSocketEvents();
			}
        }
    }
</script>
