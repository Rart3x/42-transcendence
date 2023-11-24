<script>
    export default {
    name: 'UserStatHeader',
    data() {
        return {
            message_text: '',
            channelName: '',
            password: '',
            passwordCheckBox: false,
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
    },
    props: {
        modalStates: Object,
        user: Object,

        currentUserName: String,
        friendName: String,
        userName: String,

        addFriendFromDB: Function,
        checkPassInDB: Function,
        closeModal: Function,
        createEmptyChannelInDB: Function,
        createChannelInDB: Function,
        createPrivateMessageInDB: Function,
        joinChannelInDB: Function,
        removeFriendFromDB: Function,
        togglePasswordInput: Function,

        },
    };
</script>

<template>
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
</template>