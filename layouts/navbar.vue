<template>
  <div class="container">
    <div class="card">
      <Menubar :model="items" :pt="ptMenuBar" class="pt-5">
        <template #start>
          <a href="/" class="flex items-center gap-1">
            <img src="../assets/img/logo.png" alt="logo" class="h-10 w-auto rounded-md" />
            <img src="../assets/img/title.png" alt="logo" class="h-8 w-auto rounded-md pr-3" />
          </a>
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
          <a v-ripple class="flex items-center" v-bind="props.action">
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
            <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
          </a>
        </template>
        <template #end>
          <div class="flex items-center gap-4">
            <button class="cursor-pointer text-prime-vue-error bg-red-100 p-2 rounded-lg px-4" @click="logout">Logout</button>
            <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
          </div>
        </template>
      </Menubar>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue";

const { clear } = useUserSession()

const ptMenuBar = {
  root:"!border-0"
}

const items = ref([
  {
    label: 'Nos offres',
    href: '/offers',
    icon: 'pi pi-search',
  }
]);

const logout = async function (){
  await clear()
  navigateTo("/auth")
}
</script>
