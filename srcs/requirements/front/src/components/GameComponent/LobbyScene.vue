<script lang="ts">
    import { Scene, GameObjects, DOM } from 'phaser';
    import { Socket } from 'socket.io-client';
    import { getImage} from '../api/get.call';
    import GameRoom from "../../gameRoom/gameRoom";
    import EventBus from '../../services/event-bus';
import store from '../../store/store';

    export default class LobbyScene extends Scene {

        //Class variables
        UIElement : GameObjects.DOMElement;
        UIScorePlayer1: GameObjects.DOMElement;
        UIScorePlayer2: GameObjects.DOMElement;
        user: any;
        socket: Socket;
        gameRoom: any;
        EventHandler: any;

        constructor(){
            //Call parent class constructor
            super({ key: 'LobbyScene' });
        }

        init(data : any){
            this.user = data.user;
            this.socket = data.socket;
            this.UIElement = data.UIElement;
            this.enterLobby(data.gameRoomData);
            this.EventHandler = EventBus.getInstance();
        }

        destroyUI(){
            this.UIElement.destroy();
            if (this.UIScorePlayer1 && this.UIScorePlayer2){
                this.UIScorePlayer1.destroy();
                this.UIScorePlayer2.destroy();
            }
	    }

        createLobbyHTML(){
            this.UIElement = this.add.dom(400, 400).createFromHTML('\
                <div class="container flex flex-col w-full items-center justify-center h-screen gap-y-16">\
                    <div class="flex flex-row space-x-96 items-center">\
                        <div class="avatar">\
                            <div id="userProfile1" class="avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"></div>\
                        </div>\
                        <div class="avatar">\
                            <div id="userProfile2" class="avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"></div>\
                        </div>\
                    </div>\
                    <div class="flex flex-row space-x-96 items-center">\
                        <div> \
                            <h1 id="player1Name" class="text-4xl font-bold dark:text-white"></h1> \
                        </div> \
                        <div> \
                            <h1 id="player2Name" class="text-4xl font-bold dark:text-white"></h1> \
                        </div> \
                    </div> \
                    <div class="flex flex-row space-x-96 items-center">\
                        <div> \
                            <button id="isReadyButtonPlayer1" class="btn  btn-active no-animation btn-secondary"> Not ready</button> \
                        </div> \
                        <div > \
                            <button id="isReadyButtonPlayer2" class="btn btn-active no-animation btn-secondary"> Not ready</button> \
                        </div> \
                    </div> \
                    <div> \
                        <button id="startButton"class="btn btn-primary ml-5">START</button>\
                    </div> \
                    <div>\
                        <button id="leaveButton"class="btn btn-error ml-5">LEAVE</button>\
                    </div> \
                </div>'
            );
        }

        setProfileNames(player1UserName: string, player2UserName: string){
            const userProfile1 = this.UIElement.node.querySelector("#userProfile1");
            const userProfile2 = this.UIElement.node.querySelector("#userProfile2");

            const userProfile1Name = this.UIElement.node.querySelector("#player1Name") as HTMLElement;
            const userProfile2Name = this.UIElement.node.querySelector("#player2Name") as HTMLElement;

            if (player1UserName.length > 10)
                player1UserName = player1UserName.slice(0, 8) + '..';
            if (player2UserName.length > 10)
                player2UserName = player2UserName.slice(0, 8) + '..';

            if (this.socket.id == this.gameRoom.player1SocketId){
                userProfile1Name.innerText = player1UserName;
                userProfile2Name.innerText = player2UserName;
            }
            else{
                userProfile2Name.innerText = player2UserName;
                userProfile1Name.innerText = player1UserName;
            }
        }

        async setProfilePictures(player1Image: string, player2Image: string){
            const imagePlayer1 = await getImage(player1Image);
            const imagePlayer2 = await getImage(player2Image);
            const self = this;

            let img : HTMLImageElement;
            let img2 : HTMLImageElement;
            if (!this.textures.exists('userImage1')){
                img = new Image();
                if (imagePlayer1){
                    img.src = imagePlayer1
                }
            }

            if (!this.textures.exists('userImage2')){
                img2 = new Image();
                if (imagePlayer2){
                    img2.src = imagePlayer2;
                }
            }

            this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                if (imagePlayer1)
                    DOM.AddToDOM(img, 'userProfile1');
                if (imagePlayer2)
                    DOM.AddToDOM(img2, 'userProfile2');
            });
        
            this.load.start();
        }

        setupLobby(player1UserName: string, player2UserName: string, player1Image: string, player2Image: string){
            this.setProfileNames(player1UserName, player2UserName);
            this.setProfilePictures(player1Image, player2Image);
        }

        setupSocketEvents(){
            const self = this;
            this.socket.on('otherPlayerReady', () => {
                let otherPlayerProfile : any;
                let otherPlayerReadyButton : any;

                if (this.socket && self.gameRoom){
                    if (this.socket.id == self.gameRoom.player1SocketId){
                        otherPlayerProfile = this.UIElement.node.querySelector("#userProfile2");
                        otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;
                    }
                    else if (this.socket.id == self.gameRoom.player2SocketId){
                        otherPlayerProfile = this.UIElement.node.querySelector("#userProfile1");
                        otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
                    }
                }
                if (otherPlayerReadyButton){
                    otherPlayerReadyButton.innerText = 'Ready';
                    otherPlayerReadyButton.className = 'btn no-animation btn-active btn-accent';
                }
                if (otherPlayerProfile){
                    otherPlayerProfile.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
                }
            });

            this.socket.on('otherPlayerNotReady', () => {
                let otherPlayerProfile : any;
                let otherPlayerReadyButton : any;

                if (this.socket && self.gameRoom){
                    if (this.socket.id == self.gameRoom?.player1SocketId){
                        self.gameRoom.player2Ready = false;
                        otherPlayerProfile = this.UIElement.node.querySelector("#userProfile2");
                        otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;
                    }
                    else if (this.socket.id == self.gameRoom?.player2SocketId){
                        self.gameRoom.player1Ready = false;
                        otherPlayerProfile = this.UIElement.node.querySelector("#userProfile1");
                        otherPlayerReadyButton = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
                    }
                }

                if (otherPlayerReadyButton){
                    otherPlayerReadyButton.innerText = 'Not ready';
                    otherPlayerReadyButton.className = 'btn no-animation  btn-secondary';
                }
                if (otherPlayerProfile){
                    otherPlayerProfile.className = 'avatar w-24 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2';
                }
            });
            this.socket.on('otherPlayerLeaveLobby', () => {
                this.children.removeAll();
                this.destroyUI();
                this.removeSocketEvents();
                store.dispatch('setInvitedFalse');
                setTimeout(() => {
                    this.scene.start('BootScene');
                }, 500);
            });

            this.socket.on('init', () => {
                this.removeSocketEvents();
                this.scene.start('GameScene', { user: this.user, gameRoom: this.gameRoom, UIElement: this.UIElement, socket: this.socket });
            });
        }

        removeSocketEvents(){
            this.socket.off('otherPlayerLeaveLobby');
            this.socket.off('otherPlayerNotReady');
            this.socket.off('otherPlayerReady');
            this.socket.off('init');
        }

        setupEventListeners(){
            const self = this;

            const userProfile1 = this.UIElement.node.querySelector("#userProfile1");
            const userProfile2 = this.UIElement.node.querySelector("#userProfile2");

            let startButton = this.UIElement.node.querySelector('#startButton') as HTMLElement;
            let leaveButton = this.UIElement.node.querySelector('#leaveButton') as HTMLElement;

            let isReadyButtonPlayer1 = this.UIElement.node.querySelector('#isReadyButtonPlayer1') as HTMLElement;
            let isReadyButtonPlayer2 = this.UIElement.node.querySelector('#isReadyButtonPlayer2') as HTMLElement;

            leaveButton.addEventListener('click', function() {
                if (self.gameRoom){
                    self.socket.emit('playerLeaveLobby', self.gameRoom.id);
                    self.UIElement.destroy();
                    self.removeSocketEvents();
                    store.dispatch('setInvitedFalse');
                    setTimeout(() => {
                        self.scene.start('BootScene');
                    }, 500);
                }
            });

            startButton.addEventListener('click', function() {
                if (self.socket.id == self.gameRoom?.player2SocketId){
                    if (self.gameRoom.player2Ready == false){
                        self.gameRoom.player2Ready = true;
                        isReadyButtonPlayer2.innerText = 'Ready';
                        isReadyButtonPlayer2.className = 'btn no-animation btn-active btn-accent';
                        if (userProfile2){
                            userProfile2.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2';
                        }
                        self.socket.emit('playerReady', self.gameRoom.id);
                    }
                    else{
                        self.gameRoom.player2Ready = false;
                        isReadyButtonPlayer2.innerText = 'Not ready';
                        isReadyButtonPlayer2.className = 'btn no-animation  btn-secondary';
                        if (userProfile2){
                            userProfile2.className = 'avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ...';
                        }
                        self.socket.emit('playerNotReady', self.gameRoom.id);
                    }
                }
                else if (self.socket.id == self.gameRoom?.player1SocketId){
                    if (self.gameRoom.player1Ready == false){
                        self.gameRoom.player1Ready = true;
                        isReadyButtonPlayer1.innerText = 'Ready';
                        isReadyButtonPlayer1.className = 'btn no-animation btn-active btn-accent';
                        if (userProfile1){
                            userProfile1.className = 'avatar w-24 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2 ...';
                        }
                        self.socket.emit('playerReady', self.gameRoom.id);
                    }
                    else{
                        self.gameRoom.player1Ready = false;
                        isReadyButtonPlayer1.innerText = 'Not ready';
                        isReadyButtonPlayer1.className = 'btn no-animation  btn-secondary';
                        if (userProfile1){
                            userProfile1.className = 'avatar w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 ...';
                        }
                        self.socket.emit('playerNotReady', self.gameRoom.id);
                    }
                }
            });
        }

        async enterLobby(data : any){
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
                data.player2UserName
            );
            this.createLobbyHTML();
            this.setupLobby(data.player1UserName, data.player2UserName, data.player1Image, data.player2Image);
            this.setupEventListeners();
            this.setupSocketEvents();      
        }
    }
</script>
