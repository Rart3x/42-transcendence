<script lang="ts">
    //Imports
    import { Scene, GameObjects } from 'phaser'
    import store from '../../store/store.js';
    import Cookies from 'js-cookie';
    import { getUserByUserId } from '../api/get.call';
    import { Socket } from 'socket.io-client';

    export default class BootScene extends Scene {
    
        //Class variables
        UIElement : GameObjects.DOMElement;
        user: any;
        socket: Socket;

        constructor(){
            //Call parent class constructor
            super({ key: 'BootScene' });
        }

        async init(){
            //Set reference folder from where we'll load textures, images, ...
            this.load.setPath(".");
            if (store.state.socket)
                this.socket = store.state.socket;
            else
                return ;
            const cookieUserId = Cookies.get('UserId');
            const cookieJWT = Cookies.get('Bearer');
            if (typeof cookieUserId !== 'undefined' && typeof cookieJWT !== 'undefined'){
                this.user = await getUserByUserId(Number(cookieUserId), cookieJWT);
                if (!this.user)
                    return ;
            }
        }

        createGamePageHTML(){
            this.UIElement = this.add.dom(500, 400).createFromHTML(' \
                <div class="grid grid-rows-6 justify-items-center ..."> \
                    <div class="row-start-1  ..."><button id="multiplayerButton" class="btn btn-primary ml-5 ...">Multiplayer</button></div> \
                    <div class="row-start-6 ...">Press <kbd class="kbd kbd-sm">F11</kbd> to go full screen</div> \
                </div> \
            ');
        }

        createLocalGameLoadingHTML(){
            this.UIElement = this.add.dom(500, 400).createFromHTML(' \
                <div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y 8 ..."> \
                    <div class="row-start-1 col-start-2 col-end-3 ..."> \
                        <h1 class="text-lg font-bold dark:text-white ...">Creating the game...</h1> \
                    </div> \
                    <div class="row-start-2 col-start-2 col-end-3 ..."> \
                        <span class=" loading loading-dots loading-lg"></span> \
                    </div> \
                </div>\
            ');
        }

        createChooseGameModeHTML(){
            this.UIElement = this.add.dom(500, 400).createFromHTML(' \
                <div id="parent" class="grid grid-rows-3 grid-cols-5 justify-items-center ..."> \
                    <div class="row-start-1 col-start-3 ..."> \
                        <h1 class="text-lg font-bold dark:text-white ...">Choose a game mode</h1> \
                    </div> \
                    <div class="row-start-3 col-start-2 ..."> \
                        <button id="choseCustomGameMode" class="btn btn-primary ml-5 ..n.">Custom</button> \
                    </div> \
                    <div class="row-start-3 col-start-4 ..."> \
                        <button id="choseNormalGameMode" class="btn btn-primary ml-5 ...">Normal</button> \
                    </div> \
                </div>'
            );
        }

        createMatchmakingHTML(){
            this.UIElement = this.add.dom(500, 400).createFromHTML(' \
            <div class="grid grid-rows-2 grid-cols-3 justify-items-center gap-y 8 ..."> \
                <div class="row-start-1 col-start-2 col-end-3 ..."> \
                    <h1 class="text-lg font-bold dark:text-white ...">Looking for a game</h1> \
                </div> \
                <div class="row-start-2 col-start-2 col-end-3 ..."> \
                    <span class=" loading loading-dots loading-lg"></span> \
                </div> \
            </div>');
        }

        setupEventListeners(self: any){
            let multiplayerButton = this.UIElement.node.querySelector('#multiplayerButton') as HTMLElement;
            multiplayerButton.addEventListener('click', function() {
                self.UIElement.destroy();  
                self.createChooseGameModeHTML();
                const parentElement = document.getElementById('parent') as HTMLElement;
                parentElement.addEventListener('click', function(event) {
                    if (event && event.target){
                        const target = event.target as HTMLButtonElement;
                        if (target.id == "choseCustomGameMode" || target.id == "choseNormalGameMode"){
                            if (target.id == "choseCustomGameMode"){
                                self.UIElement.destroy();
                                self.socket.emit('playerJoinCustomQueue', self.user.userId);
                            }
                            else{
                                self.UIElement.destroy();
                                self.socket.emit('playerJoinNormalQueue', self.user.userId);
                            }
                            self.createMatchmakingHTML();
                        }
                    }
                });
            });
        }

        setupInputListeners(self : any){
            if (self.input.keyboard){
                const fullScreenKey = self.input.keyboard.addKey('F11');
                fullScreenKey.on('down', function (){
                    if (this.scale.isFullscreen)
                        this.scale.stopFullscreen();
                    else
                        this.scale.startFullscreen();
                }, this);
            }
        }
    
        setupEventSocketListeners(){
            this.socket.on('modalOpen', () => {
                if (this.input)
                    this.input.keyboard.enabled = false;
                
            });
            this.socket.on('modalClose', () => {
                if (this.input)
                    this.input.keyboard.enabled = true;
            });

            this.socket.on('lobby', (data : any) => {
				this.UIElement.destroy();
                this.socket.off('lobby');
                this.scene.stop('BootScene');
                this.scene.start('LobbyScene', { user: this.user, gameRoomData: data, UIElement: this.UIElement, socket: this.socket });
			});
        }

        gamePage(){
            //Keep reference of the instance this for arrow functions
            let self = this;
            let invited = store.state.invited;
            //Reset the value
            store.dispatch('setInvitedFalse');
            this.setupInputListeners(self);
            if (invited)
                this.createLocalGameLoadingHTML();
            else {
                this.createGamePageHTML();
                this.setupEventListeners(self);
            }
            this.setupEventSocketListeners();
        }

        create(){
            this.gamePage()
        }
        
    }
</script>
