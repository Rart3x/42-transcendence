<script setup>
  import UserStatHeader from "./UserStatHeader.vue";
  import Cookies from "js-cookie";
  import { onMounted, ref, computed } from "vue";
  import { getPastGameRoomsByUserId, getUserByCookie, getAllScore, getUserByUserName, getGameWinner } from "./api/get.call";

  let games = ref([]);
  let user = ref(null);
  let scores = ref([]);
  let versusImage = ref(null);
  let winners = ref([]);

  const props = defineProps({
    userName: {
      type: String,
      required: true
    }
  });

  const timeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = now.getTime() - past.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    if (seconds > 0) return `${seconds} seconds ago`;
    return "Just now";
  }

  const combinedData = computed(() => {
   return games.value.map((game, index) => {
     return {
       game: game,
       winner: winners.value[index],
       scores: scores.value[index]
     };
   });
  });

  onMounted(async () => {
    user.value = await getUserByUserName(props.userName);

    if (!user.value) window.location.href = "/";
  
    versusImage.value = "../src/assets/vs.png";
    games.value = await getPastGameRoomsByUserId(user.value.userId);
    if (!games.value) window.location.href = "/";

    for (let i = 0; i < games.value.length; i++) {
      for (let j = 0; j < games.value[i].users.length; j++) {
        const imagePath = "../assets/userImages/" + games.value[i].users[j].image;
        const image = await import(/* @vite-ignore */ imagePath);
        games.value[i].users[j].imageSrc = image.default;
      }
      scores.value.push(await getAllScore(games.value[i].id));
      winners.value.push(await getGameWinner(games.value[i].id));
    }
  });
</script>

<template>
  <div class="overflow-x-auto min-h-screen bg-base-200">
    <div class="table grid grid-cols-4">
      <table class="table table-fixed w-full">
        <tbody>
          <tr v-for="(item, index) in combinedData.slice().reverse()" :key="index" >
            <td :class="user.userId == item.winner.winnerId ? 'bg-green-700 bg-opacity-50' : 'bg-red-700 bg-opacity-50'">
              <div >
                <label class="text-xl font-medium font-bold">
                  <span v-if="item.game.customGame" class="text-before"> CUSTOM </span>
                  <span v-else class="text-before font-bold"> NORMAL</span>
                </label>
                <br/>
                <label class="text-xl font-medium">
                  <span v-if="user.userId == item.winner.winnerId">WIN 😎</span>
                  <span v-else>DEFEAT 😢</span>
                </label>
                <br/> <br/> <br/>
                <label class="text-xl font-light">
                  <span>{{ timeAgo( Date.parse(item.game.startDate)) }}</span>
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        <table class="table col-start-2 col-span-3">
          <tbody>
            <tr v-for="(item, index) in combinedData.slice().reverse()" :key="index">
              <td :class="user.userId == item.winner.winnerId ? 'bg-green-700 bg-opacity-50' : 'bg-red-700 bg-opacity-50'">
                <div class="collapse">
                  <label for="collapse1" class="collapse-title text-xl font-medium">
                    <span class="text-before">
                      <label tabindex="0" class="btn glass btn-ghost btn-circle">
                        <div class="avatar">
                          <div class="w-20 mask mask-squircle">
                            <img v-if="user.userName == item.game.users[0].userName" :src="item.game.users[0].imageSrc" />
                            <img v-if="user.userName == item.game.users[1].userName" :src="item.game.users[1].imageSrc" />
                          </div>
                        </div>
                        <span v-if="user.userName == item.game.users[0].userName" class="font-medium font-bold">{{ item.game.users[0].userName }}</span>
                        <span v-if="user.userName == item.game.users[1].userName" class="font-medium font-bold">{{ item.game.users[1].userName }}</span>
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
                            <img v-if="user.userName == item.game.users[0].userName" :src="item.game.users[1].imageSrc" />
                            <img v-if="user.userName == item.game.users[1].userName" :src="item.game.users[0].imageSrc" />
                          </div>
                        </div>
                        <span v-if="user.userName == item.game.users[0].userName" class="font-medium font-bold">{{ item.game.users[1].userName }}</span>
                        <span v-if="user.userName == item.game.users[1].userName" class="font-medium font-bold">{{ item.game.users[0].userName }}</span>
                      </label>
                    </span>
                  </label>
                  <input type="checkbox" id="collapse1" class="collapse-checkbox" />
                  <div class="collapse-content flex flex-col items-center justify-center">
                    <p v-for="(score, idx) in item.scores" :key="idx" class="dark-row">
                      <span>  
                        <span  v-if="user.userName == item.game.users[0].userName && idx == item.scores.length - 1" class="ml-auto text-lg font-bold">Final Score {{ score.scoreA }}  / {{ score.scoreB }}</span>
                        <span  v-else-if="user.userName == item.game.users[1].userName && idx == item.scores.length - 1" class="ml-auto text-lg font-bold">Final Score {{ score.scoreA }}  / {{ score.scoreB }}</span>
                        <span  v-else-if="user.userName == item.game.users[0].userName" class="ml-auto text-lg font-bold">  {{ score.scoreA }}  / {{ score.scoreB }}<span class="italic"> at {{ ((Date.parse(score.time) - Date.parse(item.game.startDate)) / 1000).toFixed(0) }}s</span></span>
                        <span  v-else class="ml-auto text-lg font-bold">  {{ score.scoreB }} / {{ score.scoreA }} <span class="italic"> at {{ ((Date.parse(score.time) - Date.parse(item.game.startDate)) / 1000).toFixed(0) }}s</span></span>
                      </span>
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<style scoped>
  .dark-row:hover { background-color: #364e6e; }
  .stats { border-radius: unset; }
  .table{ border-radius: unset; }

  .collapse-title { display: flex; align-items: center; }

  .text-before { margin-right: auto; }
  .text-after { margin-left: auto; }

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px;
  }

  .versus-image { max-width: 100%; max-height: 100%;  }
</style>
