<script setup>
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getUserByCookie } from "./api/get.call";

  let user = ref(null);

  let versusImage;

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));

    if (!user.value) window.location.href = "/";

    versusImage = "src/assets/vs.png";

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
                <div class="collapse bg-base-200">
                  <label for="collapse1" class="collapse-title text-xl font-medium">
                    <span class="text-before">Keny</span>
                    <div class="avatar">
                      <label tabindex="0" class="btn btn-ghost btn-circle">
                        <div class="w-15 mask mask-squircle">
                          <img :src="versusImage" class="versus-image" />
                        </div>
                      </label>
                    </div>
                    <span class="text-after">Dams</span>
                  </label>
                  <input type="checkbox" id="collapse1" class="collapse-checkbox" />
                  <div class="collapse-content">
                    <p class="dark-row">Contenu 1</p>
                    <p class="dark-row">Contenu 2</p>
                    <p class="dark-row">Contenu 3</p>
                  </div>
                </div>

                <div class="collapse bg-base-200">
                  <label for="collapse1" class="collapse-title text-xl font-medium">
                    <span class="text-before">Keny</span>
                    <div class="avatar">
                      <label tabindex="0" class="btn btn-ghost btn-circle">
                        <div class="w-15 mask mask-squircle">
                          <img :src="versusImage" class="versus-image" />
                        </div>
                      </label>
                    </div>
                    <span class="text-after">Nico</span>
                  </label>
                  <input type="checkbox" id="collapse1" class="collapse-checkbox" />
                  <div class="collapse-content">
                    <p class="dark-row">Contenu 1</p>
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