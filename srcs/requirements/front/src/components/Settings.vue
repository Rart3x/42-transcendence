<script setup>
    import { updateImage, updateUsername } from './api/post.call';
    import { getUserByCookie } from './api/get.call';
    import { onMounted, ref } from 'vue';
    import Cookies from 'js-cookie';

    let user = ref(null);
    let selectedFile = ref(null);
    const newUserName = ref("");
    const userName = ref("");

    const handleSubmit = async () => {
        await updateUsername(user.userName, newUserName.value);
        window.location.href = "/settings";
    }

    const uploadImage = async () => {

        if (!selectedFile.value) {
            alert('error: please select a file');
            return;
        }
        await updateImage(user.userName, selectedFile.value);
        window.location.href = "/settings";
    }

    onMounted(async () => {
        user.value = await getUserByCookie(Cookies.get("_authToken"));
        if (!user.value)
            window.location.href = "/";
        userName.value = user.value.displayName;
    });

</script>

<template>
    <div class="form-control w-full max-w-xs">
        <form @submit.prevent="handleSubmit">
            <label>Please select your new username :</label><br />
            <input type="text" id="newUserName" v-model="newUserName" :placeholder="userName" class="input input-bordered w-full max-w-xs" />
            <button class="btn">Send</button>
        </form>
    </div>
    <div class="divider"></div> 
    <div class="form-control w-full max-w-xs">
        <label>Please select your new profile image : </label>
        <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
        <button class="btn" @click="uploadImage">Upload</button>
    </div>
</template>