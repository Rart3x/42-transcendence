<script setup></script>

<template>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
    <body>
        <div class="box">
            <span style="--i:1;"><img src="./images/fsanna.jpg" alt=""></span>
            <span style="--i:2;"><img src="./images/kramjatt.jpg" alt=""></span>
            <span style="--i:3;"><img src="./images/nicarpen.jpg" alt=""></span>
            <span style="--i:4;"><img src="./images/dguillau.jpg" alt=""></span>
        </div>
    </body>
</template>

<style scoped>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url(./images/kramjatt.jpg);
    background-size: cover;
}
.box {
    position: relative;
    width: 200px;
    height: 200px;
    transform-style: preserve-3d;
    animation: animate 20s linear infinite;
}

@keyframes animate {
    0% {
        transform: perspective(1000px) rotateY(0deg);
    }
    100% {
        transform: perspective(1000px) rotateY(360deg);
    }
}
.box span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: center;
    transform-style: preserve-3d;
    transform: rotateY(calc(var(--i)* 90deg)) translateZ(400px);
    -webkit-box-reflect: below 0px linear-gradient(transparent,transparent, #0004);
}
.box span img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

</style>