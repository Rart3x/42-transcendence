<script>
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
                <form class ="dialogModal" method="dialog" @submit.prevent="createChannelInDB(channelName, currentUserName, currentUserName)">
                    <input type="text" placeholder="Channel's name" :value="channelName" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
                    <button class="btn glass">Send Invitation to {{ currentUserName }}</button>
                </form>
            </div>
        </dialog>
        <!--Check Pass Modal-->
        <dialog ref="modalCheckPass" class="modal modal-bottom sm:modal-middle" @keydown.esc="closeModal('modalManageChannel')">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModalChannel" @submit.prevent="checkPassInDB(password)">
                    <label>Enter <b>{{ $route.params.channelName }}</b> password</label><br><br>
                    <input type="text" placeholder="Password" :value="password" class="input input-bordered input-sm w-full max-w-xs" />
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
        <dialog v-if="user" id="modalMessage" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalMessage.value" @keydown.esc="closeModal('modalMessage')">
            <div class="modal-box w-11/12 max-w-5xl">
                <form class="dialogModal" method="dialog" @submit.prevent="createPrivateMessageInDB(userName, currentUserName, message_text)">
                    <input type="text" v-model="message_text" class="input input-bordered input-sm w-full max-w-xs" @input="updateValue('message_text', $event.target.value)" />
                    <br><br>
                    <button class="btn glass">Send Message to {{ currentUserName }}</button>
                </form>
            </div>
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