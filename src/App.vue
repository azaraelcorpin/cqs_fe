<template>
  <!-- <router-view /> -->
  <div>
    <main-layout>
      <router-view />
    </main-layout>
  </div>
</template>

<script>
import { defineComponent, watch } from 'vue'
import MainLayout from './layouts/MainLayout.vue';
import socket from './socket';


export default defineComponent({
  name: 'App',
  components: {
    MainLayout,
  },
  mounted() {
    // Log when the app is mounted
    console.log('App mounted');
  },
})
</script>
