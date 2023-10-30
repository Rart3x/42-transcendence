<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getUserByCookie, getUserByUserId } from "./api/get.call";
  import { addFriend, updateUsername, updateImage } from './api/post.call';

  const friendName = ref("");
  const newUserName = ref("");
  const userName = ref("");

  let imageSrc = ref(null);
  let selectedFile = ref(null);
  let user = ref(null);

  const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
  }

  const handleSubmit = async () => {
    await updateUsername(user.userName, newUserName.value);
    window.location.href = "/Profile";
  }

  onMounted(async () => {
    user = await getUserByCookie(Cookies.get("_authToken"));
    if (!user)
      window.location.href = "/";
    userName.value = user.displayName;
    let imagePath = "../assets/userImages/" + user.image;
    import(/* @vite-ignore */imagePath).then((image) => {
      imageSrc.value = image.default;
    });
  });

  const uploadImage = async () => {
    if (!selectedFile.value) {
      alert('Please select an image file.');
      return;
    }
    await updateImage(user.userName, selectedFile.value);
    window.location.href = "/Profile";
  }

</script>

<template>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@3.9.4/dist/full.css" rel="stylesheet" type="text/css" />
  <!--Stats-->
  <div class="stats shadow">
    <div class="stat">
      <div class="stat-figure text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </div>
      <div class="stat-title">Total Games</div>
      <div class="stat-value">0</div><!-- Requete pour le nombre de games -->
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      </div>
      <div class="stat-title">Total Victorys</div>
      <div class="stat-value">0</div><!-- Requete pour le nombre de victoire -->
    </div>
    
    <div class="stat">
      <div class="stat-figure text-secondary">
        <div class="rounded-image">
          <img :src="imageSrc" alt="User Image" />
        </div>
      </div>
      <div class="stat-title">% Victorys</div>
      <div class="stat-value">0%</div><!-- Calcul victoire, une fois le calcul fait, rouge si -50, jaune -70 sinon vert%-->
    </div>
  </div>
  <div class="form-control w-full max-w-xs">
    <form @submit.prevent="handleSubmit">
      <label>New username : </label>
      <input type="text" id="newUserName" v-model="newUserName" :placeholder="userName">
      <button class="btn">Send</button>
    </form>
  </div>
  <br>
  <div class="form-control w-full max-w-xs">
    <label>Upload image : </label>
    <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
    <button class="btn" @click="uploadImage">Upload</button>
  </div>


  <!-- <div id="addFriend">
    <form @submit.prevent="addFriend(userName, friendName)">
      <label for="friendName">Add Friend</label>
      <br>
      <input type="text" id="friendName" v-model="friendName">
      <button class="btn btn-default">Send</button>
    </form>
  </div> -->

  <!--Friends List (faire boucle de generation du tableau avec requetes recuperant tout les user de la FriendList)-->
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>
          </th>
          <th></th>
          <th>Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>
            <label>
              <input type="checkbox" class="checkbox" /><!--On click redirige vers le profile avec une route dediee-->
            </label>
          </th>
          <td>
            <div class="flex items-center space-x-3">
              <div class="rounded-image">
                <img :src="imageSrc" alt="User Image" />
              </div>
            </div>
          </td>
          <td> {{ userName }} </td><!--Voir si userName saffiche pas pck l'API fonctionne pas atm-->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.rounded-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
}

.rounded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>