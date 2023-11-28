<script>
import { getUserByUserName } from './api/get.call';

    export default {
    name: 'UserStatHeader',
    data() {
        return {
            message_text: '',
            channelName: '',
            password: '',
            passwordCheckBox: false,
            selectedDuration1: 1,
            selectedDuration2: 1,
            selectedDuration3: 1,
            selectedDuration4: 1,
        };
    },
    methods: {
        updateValue(propName, newValue) {
            this.$emit(`update:${propName}`, newValue);
        },

        updateMessageText(value) {
            message_text.value = value;
            updateValue('message_text', value);
        },

        submitMuteForm() {
            let selectedDuration = 1;
            
            if (this.selectedDuration1 === true)
            selectedDuration = 1;
            else if (this.selectedDuration2 === true)
                selectedDuration = 3;
            else if (this.selectedDuration3 === true)
                selectedDuration = 5;
            else if (this.selectedDuration4 === true)
                selectedDuration = 10;

            this.muteUserFromChannelInDB(this.channelNameMute, this.userMuted, selectedDuration);
            this.closeMuteModal();
        }
    },
    props: {
        modalStates: Object,
        user: Object,

        modalMuteUser: Boolean,
        modalMessage: Boolean,

        currentUserName: String,
        friendName: String,
        parent: String,
        userName: String,
        userMuted: String,

        channelNameMute: String,

        addFriendFromDB: Function,
        checkPassInDB: Function,
        closeModal: Function,
        closeMuteModal: Function,
        createEmptyChannelInDB: Function,
        createChannelInDB: Function,
        createPrivateMessageInDB: Function,
        joinChannelInDB: Function,
        muteUserFromChannelInDB: Function,
        removeFriendFromDB: Function,
        togglePasswordInput: Function,
        },
    };
</script>

<template>
    <div v-if="parent === 'userProfile'">
        <!--Channel Modal-->
        <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalChannel.value" @keydown.esc="closeModal('modalChannel')">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class ="dialogModal" method="dialog" @submit.prevent="createChannelInDB(channelName, user.userName, currentUserName)">
                    <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" />
                    <button class="btn glass">Send Invitation to {{ currentUserName }}</button>
                </form>
            </div>
        </dialog>
        <!--Check Pass Modal-->
        <dialog ref="modalCheckPass" class="modal modal-bottom sm:modal-middle" @keydown.esc="closeModal('modalManageChannel')">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModalChannel" @submit.prevent="checkPassInDB(password)">
                    <label>Enter <b>{{ $route.params.channelName }}</b> password</label><br><br>
                    <input type="text" placeholder="Password" v-model="password" class="input input-bordered input-sm w-full max-w-xs" />
                    <br><br>
                    <button class="btn">Submit</button>
                </form>
            </div>
        </dialog>
        <!--Manage Channel Modal-->
        <dialog id="modalManageChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalManageChannel.value" @keydown.esc="closeModal('modalManageChannel')">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModal" @submit.prevent="togglePasswordInput(channelName, password, passwordCheckBox)">
                    <label>Set password</label><br><br>
                    <input type="checkbox" class="checkbox" :value="passwordCheckBox" @input="updateValue('passwordCheckBox', $event.target.value)" />
                    <input type="text" placeholder="Password" :value="password" @input="updateValue('password', $event.target.value)" class="input input-bordered input-sm w-full max-w-xs" />
                    <br><br>
                    <button class="btn glass">Apply changes</button>
                </form>
            </div>
        </dialog>
        <!--Private Message Modal-->
        <dialog v-if="user" id="modalMessage" class="modal modal-bottom sm:modal-middle" :open="modalMessage" @keydown.esc="closeModal('modalMessage')">
            <div class="chat">
                <div class="chat-title">
                    <h1>{{ currentUserName}}</h1>
                    <figure class="avatar">
                        <img src="https://3.bp.blogspot.com/-SkCpQ54YfbA/WB3aD_kQMiI/AAAAAAAAKlE/w-6wZTBhdXUbPl-ziauSgBoPqw72qFnygCK4B/s1600/media-20160723.jpg" alt="JdB"/>
                    </figure>
                </div>
                <div class="messages">
                    <div class="messages-content"></div>
                </div>
                <div class="message-box">
                    <form class="dialogModal" method="dialog" @submit.prevent="createPrivateMessageInDB(userName, currentUserName, message_text)">
                        <input type="text" v-model="message_text" class="message-input" placeholder="Send a message..." @input="updateValue('message_text', $event.target.value)" />
                        <button type="submit" class="message-submit">Send</button>
                    </form>
                </div>
                </div>
                <div class="bg"></div>
        </dialog>
    </div>
    <div>
    <!--Mute User Modal-->
        <dialog id="modalMuteUser" class="modal modal-bottom sm:modal-middle" :open="modalMuteUser" @keydown.esc="closeMuteModal()">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModal" @submit.prevent="submitMuteForm()">
                    <label> <input type="checkbox" value="1" v-model="selectedDuration1" class="checkbox checkbox-xs" /> 1 minute </label>
                    <label> <input type="checkbox" value="3" v-model="selectedDuration2" class="checkbox checkbox-sm" /> 3 minutes </label>
                    <label> <input type="checkbox" value="5" v-model="selectedDuration3" class="checkbox checkbox-md" /> 5 minutes </label>
                    <label> <input type="checkbox" value="10" v-model="selectedDuration4" class="checkbox checkbox-lg" /> 10 minutes</label>
                    <br><br>
                    <input type="submit" value="Mute" class="btn glass btn-warning">
                </form>
        </div>
    </dialog>
    </div>
</template>

<style>
    *, *::before, *::after {
    box-sizing: border-box;
    }
    html,
    body {height: 100%;}
    body {
    background: linear-gradient(135deg, #2af, #044f48, #2a7561);
    background-size: cover;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    line-height: 1.3;
    overflow: hidden;
    }
    /* Chat */
    .chat {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 80vh;
    max-height: 500px;
    z-index: 2;
    overflow: hidden;
    box-shadow: 0 0px 15px 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    }

    /* Chat title */
    .chat-title {
    flex: 0 1 45px;
    position: relative;
    z-index: 2;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    text-transform: uppercase;
    text-align: left;
    padding: 10px 10px 10px 50px;
    }
    .chat-title h1,
    .chat-title h2 {
    font-weight: normal;
    font-size: 14px;
    margin: 0;
    padding: 0;
    }
    .chat-title h2 {
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
    letter-spacing: 1px;
    }
    .chat-title .avatar {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 9px;
    border-radius: 30px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 2px solid rgba(255, 255, 255, 0.24);
    }
    .chat-title .avatar img {
    width: 130%;
    height: 100%;
    position: absolute;
    left: -2px;
    bottom: 0;
    top:0
    }

    /* Messages */
    .messages {
    flex: 1 1 auto;
    color: rgba(255, 255, 255, .6);
    overflow: hidden;
    position: relative;
    width: 100%;
    }
    .messages .messages-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 101%;
    width: 100%;
    }
    .messages .message {
    clear: both;
    float: left;
    padding: 6px 10px 7px;
    border-radius: 10px 10px 10px 0;
    background: rgba(0, 0, 0, 0.3);
    margin: 8px 0;
    font-size: 14px;
    line-height: 1.4;
    margin-left: 35px;
    position: relative;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    .messages .message .timestamp {
    position: absolute;
    bottom: -15px;
    font-size: 9px;
    color: rgba(255, 255, 255, 0.3);
    }
    .messages .message::before {
    content: '';
    position: absolute;
    bottom: -6px;
    border-top: 6px solid rgba(0, 0, 0, 0.3);
    left: 0;
    border-right: 7px solid transparent;
    }
    .messages .message .avatar {
    position: absolute;
    z-index: 1;
    bottom: -15px;
    left: -35px;
    border-radius: 30px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 2px solid rgba(255, 255, 255, 0.24);
    }
    .messages .message .avatar img {
    width: 130%;
    height: 100%;
    position: absolute;
    left:-2px
    }
    .messages .message.message-personal {
    float: right;
    color: #fff;
    text-align: right;
    background: linear-gradient(120deg, #248A52, #257287);
    border-radius: 10px 10px 0 10px;
    }
    .messages .message.message-personal::before {
    left: auto;
    right: 0;
    border-right: none;
    border-left: 5px solid transparent;
    border-top: 4px solid #257287;
    bottom: -4px;
    }
    .messages .message:last-child {
    margin-bottom: 30px;
    }
    .messages .message.new {
    transform: scale(0);
    transform-origin: 0 0;
    animation: bounce 500ms linear both;
    }
    .messages .message.loading::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    z-index: 2;
    margin-top: 4px;
    animation: ball 0.45s cubic-bezier(0, 0, 0.15, 1) alternate infinite;
    border: none;
    animation-delay: .15s;
    }
    .messages .message.loading span {
    display: block;
    font-size: 0;
    width: 20px;
    height: 10px;
    position: relative;
    }
    .messages .message.loading span::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    z-index: 2;
    margin-top: 4px;
    animation: ball 0.45s cubic-bezier(0, 0, 0.15, 1) alternate infinite;
    margin-left: -7px;
    }
    .messages .message.loading span::after {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    display: block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    z-index: 2;
    margin-top: 4px;
    animation: ball 0.45s cubic-bezier(0, 0, 0.15, 1) alternate infinite;
    margin-left: 7px;
    animation-delay: .3s;
    }

    /* Message Box */
    .message-box {
    flex: 0 1 40px;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    padding: 10px;
    position: relative;
    }
    .message-box .message-input {
    background: none;
    border: none;
    outline: none !important;
    resize: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    height: 22px;
    margin: 0;
    margin-left:10px;
    padding-right: 20px;
    width: 265px;
    max-width: 270px;
    }
    .message-box textarea:focus:-webkit-placeholder {
    color: transparent;
    }
    .message-box .message-submit {
    position: absolute;
    z-index: 1;
    top: 9px;
    right: 10px;
    color: #fff;
    border: none;
    background: rgb(34,170,255);
    font-size: 12px;
    text-transform: uppercase;
    line-height: 1;
    padding: 6px 10px;
    border-radius: 10px;
    outline: none !important;
    transition: background .2s ease;
    }
    .message-box .message-submit:hover {
    background: #5a8;
    }

    /* Custom Srollbar */
    .mCSB_scrollTools {
    margin: 1px -3px 1px 0;
    opacity: 0;
    }
    .mCSB_inside > .mCSB_container {
    margin-right: 0px;
    padding: 0 10px;
    }
    .mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
    background-color: rgba(0, 0, 0, 0.5) !important;
    }

    /* Bounce */
    @keyframes bounce{
        0%{transform:matrix3d(0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1)}
        4.7%{transform:matrix3d(.45,0,0,0,0,.45,0,0,0,0,1,0,0,0,0,1)}
    9.41%{transform:matrix3d(.883,0,0,0,0,.883,0,0,0,0,1,0,0,0,0,1)}
    14.11%{transform:matrix3d(1.141,0,0,0,0,1.141,0,0,0,0,1,0,0,0,0,1)}
    18.72%{transform:matrix3d(1.212,0,0,0,0,1.212,0,0,0,0,1,0,0,0,0,1)}
    24.32%{transform:matrix3d(1.151,0,0,0,0,1.151,0,0,0,0,1,0,0,0,0,1)}
    29.93%{transform:matrix3d(1.048,0,0,0,0,1.048,0,0,0,0,1,0,0,0,0,1)}
    35.54%{transform:matrix3d(.979,0,0,0,0,.979,0,0,0,0,1,0,0,0,0,1)}
    41.04%{transform:matrix3d(.961,0,0,0,0,.961,0,0,0,0,1,0,0,0,0,1)}
    52.15%{transform:matrix3d(.991,0,0,0,0,.991,0,0,0,0,1,0,0,0,0,1)}
    63.26%{transform:matrix3d(1.007,0,0,0,0,1.007,0,0,0,0,1,0,0,0,0,1)}
    85.49%{transform:matrix3d(.999,0,0,0,0,.999,0,0,0,0,1,0,0,0,0,1)}
        100%{transform:matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)}
    }
    @keyframes ball{
    from{transform:translateY(0) scaleY(.8)}
        to{transform:translateY(-10px)}
    }
</style>