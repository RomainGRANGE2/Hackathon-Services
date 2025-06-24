<script setup>
const { clear } = useUserSession()

definePageMeta({
  middleware: ["auth"],
});

const logout = async function (){
  await clear()
  navigateTo("/auth")
}
</script>
<template>
  <div class="container">
    <p class="cursor-pointer" @click="logout">Logout</p>
    <p>INDEX</p>
  </div>
</template>