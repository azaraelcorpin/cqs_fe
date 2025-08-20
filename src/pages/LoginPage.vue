<template>
  <div>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="username">Username:</label>
        <input id="username" v-model="username" type="text" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import api from 'src/API/api'
import dialog from "src/plugins/myDialog"
import { useQuasar } from 'quasar'
import { useCookies } from "vue3-cookies";
import { ref } from 'vue';

export default defineComponent({
  name: 'TestPages',
  setup() {
    const $q = useQuasar()
    const { cookies } = useCookies();
    return {
      $q,
      cookies
    }
  },
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async onSubmit() {
      // Handle form submission logic here
      console.log('username:', this.username)
      console.log('password:', this.password)
      // Perform form submission logic here
      try {
        let response = await api.Login(this.username, this.password);
        console.log('pages', response.data)
        if (response.error) {
          dialog.negative(this.$q, response.error.statusText, response.error.data.message)
        } else {
          // Save credentials to local storage
          this.saveCredentials(response.data)
          // Redirect to the dashboard page
          if (response.data.role === 'cashier')
            this.$router.push({ name: 'cashierDashboard' });
          else if (response.data.role === 'releasing')
            this.$router.push({ name: 'releasingDashboard' });
          else if (response.data.role === 'admin')
            this.$router.push({ name: 'dashboard' });
        }
      } catch (error) {

      }
    },
    // save to cookies the user credentials with 1day expiration
    saveCredentials(data) {
      this.cookies.set('_UID_', JSON.stringify(data), '1d');
    }
  },
})
</script>
