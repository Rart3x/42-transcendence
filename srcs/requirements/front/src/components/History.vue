<script setup>
  import UserStatHeader from "./UserStatHeader.vue";
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getGameRoomByUserId, getUserByCookie, getAllScore } from "./api/get.call";

  let games = ref([]);
  let user = ref(null);
  let scores = ref([]);
  let versusImage = ref(null);

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));

    if (!user.value) window.location.href = "/";
    
    versusImage.value = "src/assets/vs.png";
    games.value = await getGameRoomByUserId(user.value.userId);

    for (let i = 0; i < games.value.length; i++) {
      for (let j = 0; j < games.value[i].users.length; j++) {
        const imagePath = "../assets/userImages/" + games.value[i].users[j].image;
        const image = await import(/* @vite-ignore */ imagePath);
        games.value[i].users[j].imageSrc = image.default;
      }
      scores.value.push(await getAllScore(games.value[i].id));
    }
  });

</script>

<template>
  <UserStatHeader v-if="user"
    :userName="user.userName"
    :gamePlayed="user.gamePlayed"
    :gameWon="user.gameWon"
    />

  <div class="overflow-x-auto min-h-screen bg-base-primary grid grid-cols-4 ">
    <div class="col-start-1">
      <table class="table-fixed w-full">
        <tbody>
          <tr v-for="(game, index) in games" :key="index" >
            <td> 
              <div :class="user.userId == scores[index][scores.length - 1].scorerId ? 'bg-green-700 h-36' : 'bg-red-700 h-36'">
                <label class="text-xl font-medium font-bold">
                  <span v-if="game.customGame" class="text-before"> CUSTOM </span>
                  <span v-else class="text-before font-bold"> NORMAL</span>
                </label>
                <br/>
                <label class="text-xl font-medium">
                  <span v-if="user.userId == scores[index][scores.length - 1].scorerId">WIN 😎</span>
                  <span v-else>DEFEAT 😢</span>
                </label>
                <br/> <br/> <br/>
                <label class="text-xl font-light">
                  <span>{{ game.startDate }}</span>
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="grid col-start-2 col-span-3">
      <div class="table">
          <table class="table">
            <tbody>
              <tr v-for="(game, index) in games" :key="index">
                <td :class="user.userId == scores[index][scores.length - 1].scorerId ? 'bg-green-700' : 'bg-red-700'">
                  <div class="collapse">
                    <label for="collapse1" class="collapse-title text-xl font-medium">
                      <span class="text-before">
                        <label tabindex="0" class="btn glass btn-ghost btn-circle">
                          <div class="avatar">
                            <div class="w-20 mask mask-squircle">
                              <img :src="game.users[0].imageSrc" />
                            </div>
                          </div>
                        <span class="font-medium font-bold">{{ game.users[0].userName }}</span>
                        </label>
                      </span>
                      <div class="avatar">
                        <label tabindex="0" class="btn btn-ghost btn-circle">
                          <div class="w-20 mask mask-squircle">
                            <img :src="versusImage" class="versus-image" />
                          </div>
                        </label>
                      </div>
                      <span class="text-after">
                        <label tabindex="0" class="btn glass btn-ghost btn-circle">
                          <div class="avatar">
                            <div class="w-20 mask mask-squircle">
                              <img :src="game.users[1].imageSrc" />
                            </div>
                          </div>
                          <span class="font-medium font-bold">{{ game.users[1].userName }}</span>
                        </label>
                      </span>
                    </label>
                    <input type="checkbox" id="collapse1" class="collapse-checkbox" />
                    <div class="collapse-content">
                      <p v-for="score in scores[index]" class="dark-row">
                        <div class="avatar">
                        <span class="text-before">
                          <span class="ml-auto text-lg font-bold">  {{ score.scoreA }} </span>
                        </span>
                        <span class="text-after">
                          <span class="mr-auto text-lg font-bold"> {{ score.scoreB }} </span>
                        </span>
                        </div>
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>
      </div>
  </div>
</template>

<style scoped>
  .dark-row:hover { background-color: #364e6e; }
  .stats { border-radius: unset; }
  .table{ border-radius: unset; }

  .collapse-title {
    display: flex;
    align-items: center;
  }

  .text-before { margin-right: auto; }
  .text-after { margin-left: auto; }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px;
  }

  .versus-image {
    max-width: 100%;
    max-height: 100%;
  }

</style>