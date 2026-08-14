```vue
<template>
  <Teleport to="body">
    <div class="login-page">

      <!-- Background decoration -->
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>

      <q-card class="login-card">

        <!-- Header -->
        <q-card-section class="text-center q-pb-none">
          <q-avatar
            size="90px"
            color="primary"
            text-color="white"
            icon="account_balance"
          />

          <div class="text-h5 text-weight-bold q-mt-md">
            Cashier Queueing System
          </div>

          <div class="text-grey-7 text-subtitle2 q-mt-xs">
            Please sign in to continue
          </div>
        </q-card-section>

        <!-- Login Form -->
        <q-card-section>

          <q-input
            outlined
            rounded
            v-model="username"
            label="Username"
            autocomplete="username"
            class="q-mb-md"
            @keyup.enter="onSubmit"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            outlined
            rounded
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            autocomplete="current-password"
            @keyup.enter="onSubmit"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>

            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

        </q-card-section>

        <!-- Login Button -->
        <q-card-actions class="q-pa-md">

          <q-btn
            color="primary"
            class="full-width"
            size="lg"
            rounded
            unelevated
            :loading="loading"
            icon="login"
            label="Sign In"
            @click="onSubmit"
          />

        </q-card-actions>

        <q-separator />

        <!-- Footer -->
        <q-card-section class="text-center text-grey-7 text-caption">

          <div class="text-weight-medium">
            Mindanao State University – General Santos
          </div>

          <div>
            Cashier Queueing System v1.0
          </div>

        </q-card-section>

      </q-card>

    </div>
  </Teleport>
</template>

<script>
import { defineComponent } from 'vue'
import api from 'src/API/api'
import dialog from 'src/plugins/myDialog'
import { useQuasar } from 'quasar'
import { useCookies } from 'vue3-cookies'

export default defineComponent({
  name: 'LoginPage',

  setup() {
    const $q = useQuasar()
    const { cookies } = useCookies()

    return {
      $q,
      cookies
    }
  },

  data() {
    return {
      username: '',
      password: '',

      showPassword: false,
      rememberMe: true,
      loading: false
    }
  },

  methods: {

    async onSubmit() {

      if (!this.username || !this.password) {
        dialog.negative(
          this.$q,
          'Validation',
          'Please enter your username and password.'
        )
        return
      }

      this.loading = true

      try {

        const response = await api.Login(
          this.username,
          this.password
        )

        if (response.error) {

          dialog.negative(
            this.$q,
            response.error.statusText,
            response.error.data.message
          )

        } else {

          this.saveCredentials(response.data)

          if (response.data.role === 'cashier') {
            this.$router.push({ name: 'cashierDashboard' })
          }
          else if (response.data.role === 'releasing') {
            this.$router.push({ name: 'releasingDashboard' })
          }
          else if (response.data.role === 'admin') {
            this.$router.push({ name: 'dashboard' })
          }

        }

      } catch (err) {

        dialog.negative(
          this.$q,
          'Login Failed',
          'Unable to connect to the server.'
        )

      } finally {

        this.loading = false

      }

    },

    saveCredentials(data) {
      this.cookies.set('_UID_', JSON.stringify(data), '1d')
    }

  }

})
</script>

<style scoped>

.login-page{
    position:fixed;
    inset:0;
    display:flex;
    justify-content:center;
    align-items:center;
    overflow:hidden;
    background:linear-gradient(135deg,#1565C0,#42A5F5,#64B5F6);
    z-index:99999;
}

.login-card{
    width:430px;
    max-width:95%;
    border-radius:20px;
    box-shadow:0 20px 60px rgba(0,0,0,.25);
    animation:fadeIn .5s ease;
    backdrop-filter:blur(5px);
}

.bg-circle{
    position:absolute;
    border-radius:50%;
    opacity:.18;
    background:white;
}

.bg-circle-1{
    width:350px;
    height:350px;
    top:-100px;
    left:-100px;
}

.bg-circle-2{
    width:450px;
    height:450px;
    bottom:-180px;
    right:-150px;
}

@keyframes fadeIn{

    from{
        opacity:0;
        transform:translateY(30px);
    }

    to{
        opacity:1;
        transform:translateY(0);
    }

}

</style>
```
