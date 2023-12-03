<script>
    import { ref } from 'vue';
    import { getUserByUserName } from './api/get.call';

    export default {
        name: 'Modal',
        data() {
            return {
                currentUser: ref(null),
                message_text: '',
                channelName: '',
                password: '',
                selectedDuration: 1,
            };
        },
        emits: ['update:passwordCheckBox'],
        methods: {
            submitMuteForm(selectedDuration) {
                this.muteUserFromChannelInDB(this.channelNameMute, this.userMuted, selectedDuration);
                this.closeMuteModal();
            },

            updateCheckBox(value) {
                this.$emit('update:passwordCheckBox', value);
            },

            updateMessageText(value) {
                message_text.value = value;
                updateValue('message_text', value);
            },

            updateValue(propName, newValue) {
                this.$emit(`update:${propName}`, newValue);
            },
        },
        props: {
            modalStates: Object,
            privateMessages: Object,
            user: Object,

            modalMuteUser: Boolean,
            modalMessage: Boolean,
            passwordCheckBox: Boolean,

            currentUserName: String,
            friendName: String,
            parent: String,
            senderName: String,
            userName: String,
            userMuted: String,

            channelNameMute: String,
            currentChannelName: String,

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
                <form class="dialogModal" @submit.prevent="togglePasswordInput(currentChannelName, password)">
                    <label>Set password</label><br /><br />
                    <input type="checkbox" class="checkbox" :value="passwordCheckBox" @change="updateCheckBox($event.target.checked)" />
                    <p>{{ passwordCheckBox }}</p>
                    <input type="text" placeholder="Password" :value="password" @input="updateValue('password', $event.target.value)" class="input input-bordered input-sm w-full max-w-xs" />
                    <br/><br/>
                    <button class="btn glass">Apply changes</button>
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
                    <figure class="avatar">
                        <!-- <img :src="currentImageSrc"/> -->
                    </figure>
                </div>
                <div class="messages" ref="messagesContent">
                    <div class="messages-content">
                        <div v-if="privateMessages">
                            <div v-for="(pairMessages, pairIndex) in privateMessages" :key="pairIndex">
                                <div v-for="(message, index) in pairMessages" :key="index">
                                    <div v-if="message.senderName === senderName" class="message message-right">
                                        {{ message.messageContent }}
                                    </div>
                                    <div v-else class="message message-left">
                                        {{ message.messageContent }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                <div class="message-box">
                    <form class="message-form" @submit.prevent="createPrivateMessageInDB(userName, senderName, message_text)">
                        <input type="text" class="message-input" placeholder="Type message..." v-model="message_text" @keyup.enter="createPrivateMessageInDB(userName, senderName, message_text)">
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
        border-radius: 10px 10px 10px 0;
        font-size: 14px;
        line-height: 1.4;
        margin-left: 35px;
        position: relative;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    .messages::-webkit-scrollbar { width: 8px; }
    .messages::-webkit-scrollbar-thumb { background-color: rgba(0, 0, 0, 0.3); border-radius: 4px;}
    .messages .message.message-left { float: left; color: #fff; text-align: left; background: linear-gradient(120deg, #df9494, #777); }
    .messages .message.message-left::before { right: auto; left: 0; border-left: none; }
    .messages .message.message-right { float: right; color: #fff; text-align: right; background: linear-gradient(120deg, #a8c5b5, #257287); }
    .messages .message.message-right::before { left: auto; border-right: none; }
    .messages .message:last-child { margin-bottom: 30px; }
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