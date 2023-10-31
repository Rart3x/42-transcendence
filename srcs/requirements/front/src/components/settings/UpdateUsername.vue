<script setup>
    import { updateUsername } from './api/post.call';
    
    const newUserName = ref("");
    const userName = ref("");

    const handleSubmit = async () => {
        await updateUsername(user.userName, newUserName.value);
        window.location.href = "/UpdateUsername";
    }

</script>

<template>
    <div class="form-control w-full max-w-xs">
        <form @submit.prevent="handleSubmit">
            <label>Please select your new username :</label>
            <input type="text" id="newUserName" v-model="newUserName" :placeholder="userName" class="input input-bordered w-full max-w-xs" />
            <button class="btn">Send</button>
        </form>
    </div>
</template>