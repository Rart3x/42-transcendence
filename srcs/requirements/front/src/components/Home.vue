<script setup>
import { ref } from 'vue';

const gifVisible = ref(false);

const playGif = () => {
  gifVisible.value = true;
};

const stopGif = () => {
  gifVisible.value = false;
};

</script>

<template>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
    <nav class="Navbar">
    <ul>
      <li style="--i: 3" data-icon="&#xf11b">
        <a href="#game"> Game </a>
      </li>
      <li style="--i: 2" data-icon="&#xf086">
        <a href="#chat"> Chat </a>
      </li>
      <li style="--i: 1" data-icon="&#xe533">
        <a href="#about"> About </a>
      </li>
    </ul>
  </nav>
  <div>
    <h1 id="game" class="title"> GAME </h1>
    <div class="section">
     <router-link to="/game">
      <div v-if="gifVisible">
    <img
      src="https://i.imgur.com/qt4yZVL.gif"
      @mouseover="playGif"
      @mouseleave="stopGif"
      class="img"
    />
    </div>
    <div v-else>
    <img
      src="@/components/images/pong-wallpaper.jpg"
      @mouseover="playGif"
      @mouseleave="stopGif"
      class="img"
    />
    </div>
     </router-link>
     <div class="information">
       <p>Simply game, pong.</p>
       <p>You can click on image to play.</p>
     </div>
    </div>
    <h1 id="chat" class="title"> CHAT </h1>
    <div class="section">
    <router-link to="/chat"> 
      <img class="img" src="@/components/images/chat-img.jpg" />
    </router-link>
    <div class="information">
       <p>Chat with another people.</p>
       <p>You can click on image to access chat.</p>
     </div>
    </div>
    <h1 id="about"  class="title"> ABOUT </h1>
    <div class="section">
    <router-link to="/about">
      <img class="img" src="@/components/images/icon-pmt.png" />
    </router-link>
    <div class="information">
       <p>About us, like who are programming and design this website.</p>
       <p>You can click on image to access about page.</p>
     </div>
    </div>
  </div>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Oswald:400,700);
@import url(https://use.fontawesome.com/releases/v6.4.2/css/all.css);
@import url(https://fonts.googleapis.com/css2?family=Silkscreen&display=swap);
.section{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 300px 0px;
  flex-direction: column;
}

.title{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 0px 25px 0px;

  &:before,
  &:after {
    content: "";
    flex: 1;
    height: 1px;
    margin: 0 1em;
    box-shadow: 0 1px 0 black;
  }
  font-style: italic;
  font-family: 'Silkscreen', sans-serif;
}
.img{
  max-width: 50vw;
  max-height: 60vh;
  width: auto;
  height: auto;
}

.information{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Silkscreen', sans-serif;
}
ul {
  position: relative;
  transform: skewY(-15deg);
}

li {
  position: relative;
  list-style: none;
  width: 10vw;
  height: 6vh;
  padding: 15px;
  background: #3e3f46;
  z-index: calc(1 * var(--i));
  transition: 0.5s;
}

li:hover {
  background-color: #996fae;
  transform: translateX(50px);
}

li::before {
  font-family: "FontAwesome";
  font-size: 1.8vh;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  content: attr(data-icon);
  position: absolute;
  top: 0;
  left: -40px;
  width: 40px;
  height: 100%;
  background: #2e3133;
  transform-origin: right;
  transform: skewY(45deg);
  transition: 0.5s;
}
li::before::content{
  transform: skewY(90deg);
}
li:hover::before {
  background: #7b5190;
}

li::after {
  content: "";
  position: absolute;
  top: -40px;
  left: 0px;
  width: 100%;
  height: 40px;
  background: #35383e;
  transform-origin: bottom;
  transform: skewX(45deg);
  transition: 0.5s;
}

li:hover::after {
  background: #86589d;
}

li a {
  text-decoration: none;
  color: #999;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: 0.5s;
  font-size: 1.8vh;
}
li:hover a {
  color: #fff;
}

li:last-child::after {
  box-shadow: -120px -120px 20 px rgba(0, 0, 0, 0.25);
}

.Navbar{
  justify-content: left;
  position: fixed;
  top: 21vh;
  left: 1vw;
  opacity: .8;
}
.sign {
  width: 128;
  height: 32px;
  justify-self: flex-start;
  border-radius: 10px;
}
</style>
