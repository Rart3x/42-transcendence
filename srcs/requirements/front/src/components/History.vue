<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getAllChannels, getAllFriends, getUserByCookie, getGameRoomByRoomId } from "./api/get.call";

  let user = ref(null);

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));
    
    if (!user.value) window.location.href = "/";

  });

</script>

<template>
  <!--Stats-->
  <div class="stats shadow">
    <!--Username-->
    <div class="stat">
      <div class="stat-figure text-primary">
      </div>
      <div class="stat-title">Username</div>
      <div v-if="user" class="stat-value">{{ user.userName }}</div>
    </div>
    <!--Games total-->
    <div class="stat">
      <div class="stat-figure text-primary">
      </div>
      <div class="stat-title">Games Total</div>
      <div class="stat-value">0</div>
    </div>
    <!--Games won-->
    <div class="stat">
      <div class="stat-figure text-secondary">
      </div>
      <div class="stat-title">Games won</div>
      <div class="stat-value">0</div>
    </div>
    <!--Username-->
    <div class="stat">
      <div class="stat-figure text-secondary">
      </div>
      <div class="stat-title">Winrate</div>
      <div class="stat-value">0%</div>
    </div>
  </div>

  <div class="overflow-x-auto">
    <div class="grid-container">
      <div class="table">
        <table class="table">
          <tbody>
            <tr>
              <td>
                <div class="collapse collapse-arrow bg-base-200">
                  <input type="checkbox" id="collapse1" class="collapse-checkbox" />
                  <label for="collapse1" class="collapse-title text-xl font-medium">
                    Partie A - Keny VS Dams
                  </label>
                  <div class="collapse-content">
                    <p>Contenu 1</p>
                  </div>
                </div>
                <div class="collapse collapse-arrow bg-base-200">
                  <input type="checkbox" id="collapse2" class="collapse-checkbox" />
                  <label for="collapse2" class="collapse-title text-xl font-medium">
                    Partie A - Keny VS Nico
                  </label>
                  <div class="collapse-content">
                    <p>Contenu 2</p>
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
  .stats { border-radius: unset; }
  .table{ border-radius: unset; }
</style>