<script setup>
  import UserStatHeader from "./UserStatHeader.vue";
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getGameRoomByUserId, getUserByCookie, getAllScore } from "./api/get.call";

  let games = ref([]);
  let user = ref(null);
  let scores = ref([]);
  let versusImage;

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));

    if (!user.value) window.location.href = "/";
    
    versusImage = "src/assets/vs.png";
    games.value = await getGameRoomByUserId(user.value.userId);

    for (let i = 0; i < games.value.length; i++){
      scores.value.push(await getAllScore(games.value[i].score.id));
    }
  });

</script>

<template>
  <UserStatHeader v-if="user"
    :userName="user.userName"
    :gamePlayed="user.gamePlayed"
    :gameWon="user.gameWon"
    />

  <div>
    <div class="overflow-x-auto min-h-screen bg-base-200">
      <div class="grid-container">
        <div class="table">
          <table class="table">
            <tbody>
              <tr v-for="(game, index) in games" :key="index">
                <td>
                  <div class="collapse bg-base-200">
                    <label for="collapse1" class="collapse-title text-xl font-medium">
                      <span v-if="game.customGame" class="text-before"> CUSTOM </span>
                      <span v-else class="text-before"> NORMAL </span>
                      <span class="text-before" >  {{ 1 }} </span>
                      <span>{{ game.users[0].userName }}</span>
                      <div class="avatar">
                        <label tabindex="0" class="btn btn-ghost btn-circle">
                          <div class="w-15 mask mask-squircle">
                            <img :src="versusImage" class="versus-image" />
                          </div>
                        </label>
                      </div>
                      <span >{{ game.users[1].userName }}</span>
                      <span class="text-after"> {{ 1 }} </span>
                    </label>
                    <input type="checkbox" id="collapse1" class="collapse-checkbox" />
                    <div class="collapse-content">
                      <p v-for="score in scores[index]" class="dark-row flex flex-row">
                        <span class="ml-auto">  {{ score.scoreA }} </span>
                        <span class="mr-auto"> {{ score.scoreB }} </span>
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