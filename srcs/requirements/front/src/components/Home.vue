<script setup></script>

<template>
  <body>
    <div class="head">
    <h1>PMT</h1>
    </div>
    <nav class="Navbar">
    <ul>
      <li style="--i: 5" data-icon="&#xf015">
        <a href="#home"> Home </a>
      </li>
      <li style="--i: 4" data-icon="&#xf11b">
        <a href="#game"> Game </a>
      </li>
      <li style="--i: 3" data-icon="&#xf03a">
        <a href="#chat"> Chat </a>
      </li>
      <li style="--i: 2" data-icon="&#xe533">
        <a href="#about"> About </a>
      </li>
      <li style="--i: 1" data-icon="@">
        <a href="#sign"> Sign in </a>
      </li>
    </ul>
  </nav>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>

  <div>
    <section id="home"> <h1>Home</h1> </section>
    <section id="game"> Game </section>
    <section id="chat"> Chat </section>
    <section id="about"> About </section>
    <section id="sign"> Sign in  </section>
  </div>
  </body>
</template>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Oswald:400,700);
@import url(https://use.fontawesome.com/releases/v6.4.2/css/all.css);

body{
  display: flex;
  justify-content: center;
  flex-direction: column;
}
ul {
  position: relative;
  transform: skewY(-15deg);
}

li {
  position: relative;
  list-style: none;
  width: 200px;
  padding: 15px;
  background: #3e3f46;
  z-index: calc(1 * var(--i));
  transition: 0.5s;
}

li:hover {
  background-color: #996fae;
  transform: translateX(-50px);
}

li::before {
  font-family: "FontAwesome";
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
}
li:hover a {
  color: #fff;
}

li:last-child::after {
  box-shadow: -120px -120px 20 px rgba(0, 0, 0, 0.25);
}

.Navbar{
  display: flex;
  justify-content: left;
  padding: 10vh 0vw 10vh 3vw;
}

.head{
  display: flex;
  justify-content: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 2vh 0vw 2vh 0vw;
}
 @media (max-width: 1024px) {
  .Navbar{
    padding: 10vh 0vw 10vh 12vw;
  }
}

</style>
