<script>
    export default {
    name: 'UserStatHeader',
    props: {
        channel: Object,
        modalStates: Object,
        user: Object,

        currentUserName: String,
        userName: String,

        addFriendFromDB: Function,
        createEmptyChannelInDB: Function,
        createChannelInDB: Function,
        createPrivateMessageInDB: Function,
        joinChannelInDB: Function,
        removeFriendFromDB: Function,
        togglePasswordInput: Function,
    },
}


</script>

<template>
    <!--Channel Modal-->
    <dialog id="modalChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalChannel.value" @keydown.esc="closeModal('modalChannel')">
        <div class="modal-box w-11/12 max-w-5xl">
            <form class ="dialogModal" method="dialog" @submit.prevent="createChannelInDB(channelName, userName, currentUserName)">
            <input type="text" placeholder="Channel's name" v-model="channelName" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
            <button class="btn glass">Send Invitation</button>
            </form>
        </div>
    </dialog>
    <!--Private Message Modal-->
    <dialog v-if="user" id="modalMessage" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalMessage.value" @keydown.esc="closeModal('modalMessage')">
        <div class="modal-box w-11/12 max-w-5xl">
            <form class="dialogModal" method="dialog" @submit.prevent="createPrivateMessageInDB(userName, user.userName, message_text)">
            <input type="text" v-model="message_text" class="input input-bordered input-sm w-full max-w-xs" /><br><br>
            </form>
        </div>
    </dialog>
    <!--Manage Channel Modal-->
    <dialog id="modalManageChannel" class="modal modal-bottom sm:modal-middle" :open="modalStates.modalManageChannel.value" @keydown.esc="closeModal('modalManageChannel')">
        <div class="modal-box w-11/12 max-w-5xl">
            <form class="dialogModal" @submit.prevent="togglePasswordInput(channel.channelName, password, passwordCheckBox)">
            <label>Set password</label><br><br>
            <input type="checkbox" class="checkbox" v-model="passwordCheckBox"><br><br>
            <input type="text" placeholder="Password" v-model="password" class="input input-bordered input-sm w-full max-w-xs" />
            <br>
            <button class="btn glass">Apply changes</button>
            </form>
        </div>
    </dialog>
</template>