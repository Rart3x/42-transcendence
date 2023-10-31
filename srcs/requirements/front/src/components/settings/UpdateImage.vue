<script setup>
    import { updateImage } from './api/post.call';

    const uploadImage = async () => {

        if (!selectedFile.value) {
            alert('error: please select a file');
            return;
        }
        await updateImage(user.userName, selectedFile.value);
        window.location.href = "/Profile";
  }

</script>

<template>
    <div class="form-control w-full max-w-xs">
        <label>Upload image : </label>
        <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
        <button class="btn" @click="uploadImage">Upload</button>
    </div>
</template>