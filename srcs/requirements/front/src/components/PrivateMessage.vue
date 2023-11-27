<script setup>
  import Alert from "./Alert.vue";
  import Modal from "./Modal.vue";
  import UserStatHeader from "./UserStatHeader.vue";
  import Cookies from "js-cookie";
  import { onMounted, ref } from "vue";
  import { getPrivateMessages, getUserByCookie } from "./api/get.call";
  import { useRoute, useRouter } from "vue-router";

	let user = ref();
  let messages = ref();

  const route = useRoute();
  const router = useRouter();

  onMounted(async () => {
    user.value = await getUserByCookie(Cookies.get("_authToken"));

    if (!user.value)
      router.push("/");

    messages.value = await getPrivateMessages(route.params.senderName, route.params.receiverName);

    if (messages.value) {
      const imagePath = "../assets/userImages/" + user.value.image;
      const image = await import(/* @vite-ignore */ imagePath);
      user.value.imageSrc = image.default;

      const receiverImagePath = "../assets/userImages/" + messages.value.receiver.image;
      const receiverImage = await import(/* @vite-ignore */ receiverImagePath);
      messages.value.receiver.imageSrc = receiverImage.default;
    }
  });
</script>

<template>
  <UserStatHeader v-if="user"
    :userName="user.userName"
    :gamePlayed="user.gamePlayed"
    :gameWon="user.gameWon"
  />
  <div class="overflow-x-auto min-h-screen bg-base-200 font-mono">
    <div class="chat-box" style="text-align: center">
      <div class="chat-messages">
        <div v-if="messages && messages.messageHistory" v-for="(message, index) in messages.messageHistory" :key="index" class="message">
          <div class="message-row">
            <div v-if="message.senderName === user.userName">
              <div class="chat chat-start">
                <router-link :to="`/profile/` + messages.receiver.userName">
                  <label tabindex="0" class="btn btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle">
                        <img :src="messages.receiver.imageSrc" />
                      </div>
                    </div>
                  </label>
                </router-link>
                <div class="chat-bubble chat-bubble-primary"> {{ message }} </div>
              </div>
            </div>
            <div v-else>
              <div class="chat chat-end">
                <div class="chat-bubble chat-bubble-primary"> {{ message }} </div>
                <router-link :to="`/profile/` + user.userName">
                  <label tabindex="0" class="btn btn-ghost btn-circle">
                    <div class="avatar">
                      <div class="w-15 mask mask-squircle">
                        <img :src="user.imageSrc" />
                      </div>
                    </div>
                  </label>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>