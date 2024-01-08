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
        
        async init(data : any){
            //Receive data from GameScene.vue once game is finish
            this.user = data.user;
            this.gameRoom = data.gameRoom;
            this.socket = data.socket;
            this.endGameData = data.endGameData;
        }

        createEndGameScreenHTML(){
            this.UIElement = this.add.dom(450, 400).createFromHTML('\
            <div class="flex flex-col items-center justify-center min-h-screen">\
                <div id="winLooseMessage" class="text-lg font-bold dark:text-white mb-4"></div>\
                <button id="replayButton" class="btn btn-accent">Play again 0/2</button>\
                <button id="stopButton" class="btn btn-secondary mt-4">Stop</button>\
            </div>');
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
                this.children.removeAll();
                this.UIElement.destroy();
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
                else if (this.gameRoom.player2SocketId){
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
            });

            this.socket.on('lobby', (data) => {
				this.UIElement.destroy();
                this.scene.start('LobbyScene', { user: this.user, gameRoomData: data, UIElement: this.UIElement, socket: this.socket });
			});
        }

        create(){
            this.createEndGameScreenHTML();

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
