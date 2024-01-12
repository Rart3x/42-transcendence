<script>
  import Cookies from "js-cookie";
  import { getPastGameRoomsByUserId, getAllUserScore, getUserByUserName, getImage } from "./api/get.call";

  export default{
    name: 'History',
    data(){
      return {
        games: [],
        user: null,
        userScores: [],
        jwtToken: null,
        combinedData: null,
      }
    },
    methods: {
      timeAgo(timestamp) {
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
    },
    async mounted(){
      this.jwtToken = Cookies.get("Bearer");
      if (typeof this.jwtToken !== 'undefined')
        this.user = await getUserByUserName(this.userName, this.jwtToken);
      if (!this.user)
        window.location.href = "/";
      this.versusImage = "../images/vs.png";
      this.games = await getPastGameRoomsByUserId(this.user.userId, this.jwtToken);
      if (this.games){
        for (let i = 0; i < this.games.length; i++) {
          for (let j = 0; j < this.games[i].users.length; j++) {
            this.games[i].users[j].imageSrc = await getImage(this.games[i].users[j].image);
          }
          this.userScores.push(await getAllUserScore(this.games[i].id, this.jwtToken));
        }
        this.combinedData  = this.games.map((game, index) => {
            return {
              game: game,
              gameUserScores: this.userScores[index]
          }});
       }
    },
    props: {
      userName: {
        type: String,
        required: true
      },
      visitedProfile:{
        type: Boolean,
        required: true
      }
    }
  }
</script>

<template>
    <div v-if="combinedData && combinedData.length> 0" class="table grid grid-cols-4 overflow-y-auto">
      <table class="table table-fixed w-full">
        <tbody>
          <tr v-for="(item, index) in combinedData.slice().reverse()" :key="index" v-if="combinedData && user">
            <td :class="user.userId == item.game.score.winnerId ? 'bg-green-700 bg-opacity-50' : 'bg-red-700 bg-opacity-50'">
              <div >
                <label class="text-xl font-medium font-bold">
                  <span v-if="item.game.customGame" class="text-before"> CUSTOM </span>
                  <span v-else class="text-before font-bold"> NORMAL</span>
                </label>
                <br/>
                <label class="text-xl font-medium">
                  <span v-if="user.userId == item.game.score.winnerId">WIN 😎</span>
                  <span v-else>DEFEAT 😢</span>
                </label>
                <br/> <br/> <br/>
                <label class="text-xl font-light">
                  <span>{{ timeAgo(Date.parse(item.game.startDate)) }}</span>
                </label>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="table col-start-2 col-span-3">
        <tbody>
          <tr v-for="(item, index) in combinedData.slice().reverse()" :key="index" v-if="combinedData && user">
            <td :class="user.userId == item.game.score.winnerId ? 'bg-green-700 bg-opacity-50' : 'bg-red-700 bg-opacity-50'">
              <div class="collapse">
                <label for="collapse1" class="collapse-title text-xl font-medium">
                  <span class="text-before">
                    <label tabindex="0" class="btn btn-ghost">
                      <div class="avatar">
                        <div v-if="!item.game.score.winByAfk" class="w-20 mask mask-squircle"> 
                          <img v-if="user.userName == item.game.users[0].userName" :src="item.game.users[0].imageSrc" />
                          <img v-if="user.userName == item.game.users[1].userName" :src="item.game.users[1].imageSrc" />
                        </div>
                        <div v-else class="w-20 mask mask-squircle">
                          <span v-if="item.game.score.winnerId && item.game.score.winnerId == item.game.users[0].userId">
                            <img v-if="user.userName == item.game.users[0].userName" :src="item.game.users[0].imageSrc" />
                            <img v-if="user.userName == item.game.users[1].userName" :src="item.game.users[1].imageSrc" class="grayscale" />
                          </span>
                          <span v-else>
                            <img v-if="user.userName == item.game.users[0].userName" :src="item.game.users[0].imageSrc" class="grayscale"/>
                            <img v-if="user.userName == item.game.users[1].userName" :src="item.game.users[1].imageSrc" />
                          </span>
                        </div>
                      </div>
                      <span v-if="!item.game.score.winByAfk">
                        <span v-if="user.userName == item.game.users[0].userName" class="font-little font-bold">{{ item.game.users[0].userName }}</span>
                        <span v-if="user.userName == item.game.users[1].userName" class="font-little font-bold">{{ item.game.users[1].userName }}</span>
                      </span>
                      <span v-else>
                        <span v-if="item.game.score.winnerId == item.game.users[0].userId">
                          <span v-if="user.userName == item.game.users[0].userName" class="font-little font-bold">{{ item.game.users[0].userName }}</span>
                          <span v-if="user.userName == item.game.users[1].userName" class="font-little font-bold">{{ item.game.users[1].userName }}(AFK)</span>
                        </span>
                        <span v-else>
                          <span v-if="user.userName == item.game.users[0].userName" class="font-little font-bold">{{ item.game.users[0].userName }}(AFK)</span>
                          <span v-if="user.userName == item.game.users[1].userName" class="font-little font-bold">{{ item.game.users[1].userName }}</span>
                        </span>
                      </span>
                    </label>
                  </span>
                  <div class="avatar">
                    <label tabindex="0" class="btn btn-ghost btn-circle">
                      <div class="w-20 mask mask-squircle">
                        <img src="./images/vs.png" class="versus-image" />
                      </div>
                    </label>
                  </div>
                  <span class="text-after ">
                    <label tabindex="0" class="btn btn-ghost">
                      <div class="avatar">
                        <div v-if="!item.game.score.winByAfk" class="w-20 mask mask-squircle">
                          <img v-if="user.userName == item.game.users[0].userName" :src="item.game.users[1].imageSrc"/>
                          <img v-if="user.userName == item.game.users[1].userName" :src="item.game.users[0].imageSrc"/>
                        </div>
                        <div v-else class="w-20 mask mask-squircle">
                          <span v-if="item.game.score.winnerId && item.game.score.winnerId == item.game.users[0].userId">
                            <img  v-if="user.userName == item.game.users[0].userName" :src="item.game.users[1].imageSrc" class="grayscale"/>
                            <img  v-if="user.userName == item.game.users[1].userName" :src="item.game.users[0].imageSrc" />
                          </span>
                          <span v-else>
                            <img  v-if="user.userName == item.game.users[0].userName" :src="item.game.users[1].imageSrc" />
                            <img  v-if="user.userName == item.game.users[1].userName" :src="item.game.users[0].imageSrc" class="grayscale"/>
                          </span>
                        </div>
                      </div>
                      <span v-if="!item.game.score.winByAfk">
                        <span v-if="user.userName == item.game.users[0].userName" class="font-little font-bold">{{ item.game.users[1].userName }}</span>
                        <span v-if="user.userName == item.game.users[1].userName" class="font-little font-bold">{{ item.game.users[0].userName }}</span>
                      </span>
                      <span v-else-if="item.game.score.winnerId">
                        <span v-if="item.game.score.winnerId == item.game.users[0].userId">
                          <span v-if="user.userName == item.game.users[0].userName" class="font-little font-bold">{{ item.game.users[1].userName }}(AFK)</span>
                          <span v-if="user.userName == item.game.users[1].userName" class="font-little font-bold">{{ item.game.users[0].userName }}</span>
                        </span>
                        <span v-else>
                          <span v-if="user.userName == item.game.users[0].userName" class="font-little font-bold">{{ item.game.users[1].userName }}</span>
                          <span v-if="user.userName == item.game.users[1].userName" class="font-little font-bold">{{ item.game.users[0].userName }}(AFK)</span>
                        </span>
                      </span>
                    </label>
                  </span>
                </label>
                <input type="checkbox" id="collapse1" class="collapse-checkbox" />
                <div class="collapse-content flex flex-col items-center justify-center">
                  <p v-for="(score, idx) in item.gameUserScores" :key="idx" class="dark-row">
                    <span>
                      <span  v-if="idx == item.gameUserScores.length - 1 && user.userId == item.game.score.winnerId && user.userId == item.game.player2UserId" class="ml-auto text-lg font-bold">Final Score {{ score.scoreB }}  / {{ score.scoreA }}</span>
                      <span  v-else-if="idx == item.gameUserScores.length - 1 && user.userId == item.game.score.winnerId && user.userId == item.game.player1UserId" class="ml-auto text-lg font-bold">Final Score {{ score.scoreA }}  / {{ score.scoreB }}</span>
                      <span  v-else-if="idx == item.gameUserScores.length - 1 && user.userId != item.game.score.winnerId && user.userId == item.game.player2UserId" class="ml-auto text-lg font-bold">Final Score {{ score.scoreB }}  / {{ score.scoreA }}</span>
                      <span  v-else-if="idx == item.gameUserScores.length - 1 && user.userId != item.game.score.winnerId && user.userId == item.game.player1UserId" class="ml-auto text-lg font-bold">Final Score {{ score.scoreA }}  / {{ score.scoreB }}</span>
                      <span  v-else-if="!item.game.score.winByAfk && user.userId == score.scorerId && user.userId == item.game.player2UserId" class="ml-auto text-lg font-bold">  {{ score.scoreA }} / {{ score.scoreB }}
                      <span class="italic"> at {{ ((Date.parse(score.time) - Date.parse(item.game.startDate)) / 1000).toFixed(0) }}s</span>
                    </span>
                    <span  v-else-if="!item.game.score.winByAfk && user.userId == score.scorerId && user.userId == item.game.player1UserId" class="ml-auto text-lg font-bold">  {{ score.scoreB }} / {{ score.scoreA }}
                      <span class="italic"> at {{ ((Date.parse(score.time) - Date.parse(item.game.startDate)) / 1000).toFixed(0) }}s</span>
                    </span>
                    <span  v-else-if="!item.game.score.winByAfk && user.userId != score.scorerId && user.userId == item.game.player2UserId" class="ml-auto text-lg font-bold">  {{ score.scoreB }} / {{ score.scoreA }}
                      <span class="italic"> at {{ ((Date.parse(score.time) - Date.parse(item.game.startDate)) / 1000).toFixed(0) }}s</span>
                    </span>
                    <span  v-else-if="!item.game.score.winByAfk && user.userId != score.scorerId && user.userId == item.game.player1UserId" class="ml-auto text-lg font-bold">  {{ score.scoreA }} / {{ score.scoreB }}
                      <span class="italic"> at {{ ((Date.parse(score.time) - Date.parse(item.game.startDate)) / 1000).toFixed(0) }}s</span>
                    </span>
                    </span>
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="error_div"> <p> No game played! </p> </div>
</template>

<style scoped>
  .avatar { display: flex; align-items: center; justify-content: center; margin: 0 10px; }
  .collapse-title { display: flex; align-items: center; }
  .dark-row:hover { background-color: #364e6e; }
  .error_div { color: white; display: flex; justify-content: center; align-items: center; height: 50vh; font-family: monospace; }
  .error_div p::before {content: "😢 ";}
  .error_div p::after {content: " 😢";}
  .table { border-radius: unset; }
  .stats { border-radius: unset; }
  .text-before { margin-right: auto; }
  .text-after { margin-left: auto; }
  .versus-image { max-width: 100%; max-height: 100%;  }
</style>
