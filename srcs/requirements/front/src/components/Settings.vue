<script setup>
    import { updateImage, updateUsername, updateA2F } from './api/post.call';
    import { getUserByCookie } from './api/get.call';
    import { onMounted, ref } from 'vue';
    import Cookies from 'js-cookie';
    import qrcode from 'qrcode';

    let user = ref(null);
    let selectedFile = ref(null);
    let newUserName = ref("");
    let userName = ref("");
    let dataURL = ref(null);

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

    const changeA2F = async () => {
        console.log(user.value.userName);
        user.value.A2F = !user.value.A2F;
        user.value = await updateA2F(user.value.userName, user.value.A2F);
        dataURL = ref(null);
        if (user.value.A2F)
            dataURL.value = await qrcode.toDataURL(user.value.A2FUrl);
    }

    onMounted(async () => {
        user.value = await getUserByCookie(Cookies.get("_authToken"));
        if (!user.value)
            window.location.href = "/";
        userName.value = user.value.displayName;
        console.log(user.value.A2F);
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
    <div class="divider"></div> 
    <div class="form-control">
        <label>2FA : </label>
        <button v-if="user && user.value && user.value.A2F" class="btn" @click="changeA2F">Disable</button>
        <button v-else class="btn" @click="changeA2F">Enable</button>
        <img v-if="dataURL" :src="dataURL" class="qrcode" />
    </div>
</template>


<style>
body {
    height: 100vh;
}

.qrcode {
    width: 40vw;
    height: 40vw;
}

</style>