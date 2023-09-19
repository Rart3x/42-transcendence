<script setup>

import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';

</script>

<template>

    <div class="Navbar_container">
        <ol class="Navbar_list">
            <li>
                <RouterLink to="/Home" class="Navbar_content"> Home </RouterLink>
                <RouterLink to="/Game" class="Navbar_content"> Game </RouterLink>
                <RouterLink to="/About" class="Navbar_content"> About </RouterLink>
                <RouterLink to="/Profile" class="Navbar_content"> Profile </RouterLink>
            </li>
        </ol>
    </div>
</template>

<style scoped>

.Navbar_container{
    border-style:ridge;
    border-color:cornsilk;

    position: absolute;
    top: 2%;
    bottom: 88%;
    left: 5%;
    right: 5%;
}

.Navbar_list{
    list-style-type:none;
    text-align: center;
    position: absolute;
    top: 35%;
    bottom: 35%;
    left: 5%;
    right: 5%;
}

.Navbar_content{
    color:blueviolet;
    border-style:ridge;
    position: relative;
    padding: 1% 5% 1% 5%;

}
</style>
