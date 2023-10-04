<script setup></script>

<template>
  <div class="profile_pictures_container">
    <div class="profile_picture">
      <img class="image" src="@/components/images/fsanna.jpg"/>
      <div class="normal">
        <div class="text">Fsanna</div>
      </div>
      <div class="hover">
        <div class="text">Barman</div>
      </div>
    </div>
    <div class="profile_picture">
      <img class="image" src="@/components/images/kramjatt.jpg"/>
      <div class="normal">
        <div class="text">Kramjatt</div>
      </div>
      <div class="hover">
        <div class="text">Responsable Frigo</div>
      </div>
    </div>
    <div class="profile_picture">
      <img class="image" src="@/components/images/nicarpen.jpg"/>
      <div class="normal">
        <div class="text">Nicarpen</div>
      </div>
      <div class="hover">
        <div class="text">PL sur Dofus</div>
      </div>
    </div>
    <div class="profile_picture">
      <img class="image" src="@/components/images/dguillau.jpg"/>
      <div class="normal">
        <div class="text">Dguillau</div>
      </div>
      <div class="hover">
        <div class="text">Dev jeu qui sait pas ce qu'il fait</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile_pictures_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.profile_picture {
  position: relative;
  width: 20vw;
}
.profile_picture .image {
  width: 100%;
}
.profile_picture .text {
  color: #fff;
  font-size: 30px;
  line-height: 1.5em;
  text-shadow: 2px 2px 2px #000;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
.profile_picture .hover {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: .5s ease;
}
.profile_picture:hover .hover {
  opacity: 1;
}

.profile_picture .normal {
  transition: .5s ease;
}
.profile_picture:hover .normal {
  opacity: 0;
}
.profile_picture .hover {
  background-color: rgba(0,0,0,0.5);
}
</style>