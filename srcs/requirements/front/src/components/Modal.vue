<script>
    import Alert from './Alert.vue';
    import { ref } from 'vue';
    import { getUserByUserName, getImage } from './api/get.call';

    export default {
        name: 'Modal',
        components: {
            Alert,
        },
        data() {
            return {
                currentUser: ref(null),
                message_text: '',
                channelName: '',
                password: '',
                passwordCheckBox: false,
                selectedDuration: 1,
                senderImageSrc: null,

                setPassSuccess: false,
                setPassFailed: false,

                unsetPassSuccess: false,
                unsetPassFailed: false,
            };
        },
        emits: ['update:passwordCheckBox'],
        methods: {
            async createPrivateMessageInModal(userName, senderName, message_text) {
                await this.createPrivateMessageInDB(userName, senderName, message_text);
                this.message_text = '';
            },
            async loadSenderImage(senderName) {
                const user = await getUserByUserName(senderName, this.$props.jwtToken);
                if (user)
                    this.senderImageSrc = await getImage(user.image, this.$props.jwtToken);
            },

            submitMuteForm(selectedDuration) {
                this.muteUserFromChannelInDB(this.channelNameMute, this.userMuted, selectedDuration);
                this.closeMuteModal();
            },

            updateCheckBox(isChecked) {
                this.passwordCheckBox = isChecked;
            },

            updateValue(propName, newValue) {
                this.$emit(`update:${propName}`, newValue);
            },
        },
        props: {
            modalStates: Object,
            privateMessages: Object,
            user: Object,

            modalCheckPass: Boolean,
            modalMessage: Boolean,
            modalMuteUser: Boolean,

            parent: String,
            userMuted: String,

            channelNameMute: String,
            currentChannelName: String,
            currentUserName: String,
            friendName: String,
            senderName: String,
            userName: String,

            addFriendFromDB: Function,
            checkPassInDB: Function,
            closeModal: Function,
            closeMessageModal: Function,
            closeMuteModal: Function,
            createEmptyChannelInDB: Function,
            createChannelInDB: Function,
            createPrivateMessageInDB: Function,
            joinChannelInDB: Function,
            sendMessage: Function,
            muteUserFromChannelInDB: Function,
            removeFriendFromDB: Function,
            togglePasswordInput: Function,

            jwtToken: String,
        },
        watch: {
            senderName(newSenderName) {
                this.loadSenderImage(newSenderName);
            },
        },
    };
</script>

<template>
    <Alert 
        :setPassSuccess="setPassSuccess"
        :setPassFailed="setPassFailed"
        :unsetPassSuccess="unsetPassSuccess"
        :unsetPassFailed="unsetPassFailed"
    />
    <div v-if="parent === 'checkPass'">
        <!--Check Pass Modal-->
        <dialog ref="modalCheckPass" class="modal modal-bottom sm:modal-middle" :open="modalCheckPass">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModalChannel" @submit.prevent="checkPassInDB(password)" style="text-align: center;">
                    <label>Enter <b>{{ $route.params.channelName }}</b> password</label><br><br>
                    <input type="password" placeholder="Password" v-model="password" class="input input-bordered input-sm w-full max-w-xs" />
                    <br><br>
                    <button class="btn">Submit</button>
                </form>
            </div>
        </dialog>
    </div>
    <div v-if="parent === 'userProfile'">
        <!--Channel Modal-->
        <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalChannel" @keydown.esc="closeModal('modalChannel')">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class ="dialogModal" method="dialog" @submit.prevent="createChannelInDB(channelName, user.userName, currentUserName)">
                    <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" />
                    <button class="btn glass">Send Invitation to {{ currentUserName }}</button>
                </form>
            </div>
        </dialog>
        <!--Manage Channel Modal-->
        <dialog id="modalManageChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalManageChannel" @keydown.esc="closeModal('modalManageChannel')">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModal" @submit.prevent="togglePasswordInput(currentChannelName, password, passwordCheckBox)">
                    <div v-if="passwordCheckBox">
                        <label>Set password</label>
                        <br/><br/>
                        <input type="checkbox" class="checkbox" v-model="passwordCheckBox"/>
                        <br/><br/>
                        <input type="password" placeholder="Password" v-model="password" class="input input-bordered input-sm w-full max-w-xs" />
                        <br/><br/>
                        <button class="btn glass">Set {{ currentChannelName }} password</button>
                        <br/><br/>
                    </div>
                    <div v-else>
                        <label>Unset password</label>
                        <br/><br/>
                        <input type="checkbox" class="checkbox" v-model="passwordCheckBox"/>
                        <br/><br/>
                        <button class="btn glass">Unset {{ currentChannelName }} password</button>
                    </div>
                </form>
            </div>
        </dialog>
    </div>
    <!--Private Message Modal-->
    <div v-if="parent === 'drawer'" >
        <dialog id="modalMessage" class="modal modal-bottom sm:modal-middle" :open="modalMessage" @keydown.esc="closeMessageModal">
            <div class="chat">
                <div class="chat-title">
                    <h1>{{ senderName }}</h1>
                    <router-link :to="`/profile/` + senderName">
                        <figure class="avatar">
                            <img :src="senderImageSrc" />
                        </figure>
                    </router-link>
                </div>
                <div class="messages" ref="messagesContent">
                    <div class="messages-content">
                        <div v-if="privateMessages">
                            <div v-for="(pairMessages, pairIndex) in privateMessages" :key="pairIndex">
                                <div v-for="(message, index) in pairMessages" :key="index">
                                    <div v-if="message.senderName === userName && message.receiverName === senderName && message.messageContent" class="message message-right">
                                        {{ message.messageContent }}
                                    </div>
                                    <div v-else-if="message.senderName === senderName && message.receiverName === userName && message.messageContent" class="message message-left">
                                        {{ message.messageContent }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="message-box">
                    <form class="message-form" @submit.prevent="createPrivateMessageInModal(userName, senderName, message_text)">
                        <input type="text" class="message-input" placeholder="/game to game" v-model="message_text">
                        <button type="submit" class="message-submit">Send</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>
    <!--Mute User Modal-->
    <div v-if="parent === 'channel'">
        <dialog id="modalMuteUser" class="modal modal-bottom sm:modal-middle" :open="modalMuteUser" @keydown.esc="closeMuteModal()">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModal" @submit.prevent="submitMuteForm(selectedDuration)">
                    <label> <input type="number" v-model="selectedDuration" class="input input-bordered input-sm w-full max-w-xs" /></label>
                    <br><br>
                    <input type="submit" value="Mute" class="btn glass btn-warning">
                </form>
            </div>
        </dialog>
    </div>
</template>

<style scoped>
    .modal { background-color: rgba(0, 0, 0, 0.5);  backdrop-filter: blur(5px); }
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
        backdrop-filter: blur(5px);
    }
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
    .chat-title h2 { font-weight: normal; font-size: 14px; margin: 0; padding: 0; }
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
    .messages {
        flex: 1 1 auto;
        color: rgba(255, 255, 255, .6);
        overflow: hidden;
        position: relative;
        width: 100%;
        overflow-y: auto;
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
        font-size: 1.3vh;
        line-height: 1.4;
        margin-left: 1vh;
        position: relative;
    }
    .messages::-webkit-scrollbar { width: 1vh; }
    .messages::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.3); border-radius: 5px;}
    .messages .message.message-left { float: left; color: #fff; text-align: left; background: linear-gradient(120deg, #df9494, #777); border-radius: 10px 10px 10px 0; }
    .messages .message.message-left::before { right: auto; border-left: none; }
    .messages .message.message-right { float: right; color: #fff; text-align: right; background: linear-gradient(120deg, #a8c5b5, #257287); border-radius: 10px 10px 0 10px; }
    .messages .message.message-right::before { left: auto; border-right: none; }
    .messages .message:last-child { margin-bottom: 8px; }
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
    .message-box .message-submit:hover { background: #5a8; }
</style>