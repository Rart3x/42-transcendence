<script setup>

import { ref } from 'vue';

let id = 0

const newName = ref('')
const newPass = ref('')

const name = ref([])
const pass = ref([])

function addUser(){
  addName();
  addPass();
}

function addName() {
  name.value.push({ id: id++, text: newName.value })
  newName.value = ''
}

function addPass() {
  pass.value.push({ id: id++, text: newPass.value })
  newPass.value = ''
}

function removeItem(item) {
  name.value = name.value.filter((t) => t !== item)
  pass.value = pass.value.filter((t) => t !== item)
}

</script>

<template>
  <form @submit.prevent="addUser">
    <input v-model="newName">
    <input v-model="newPass">
  <button>Add Name</button>    
  </form>
  <ul>
    <li v-for="item in name" :key="item.id">
      {{ item.text }}
      <button @click="removeItem(item)">X</button>
    </li>
    <li v-for="item in pass" :key="item.id">
      {{ item.text }}
      <button @click="removeItem(item)">X</button>
    </li>
  </ul>
</template>