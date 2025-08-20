<template>
  <q-page class="q-pa-md">

    <!-- Header -->
    <div class="row justify-between items-center q-mb-md">
      <div>
        <!-- <q-icon name="account_circle" size="xl"
          @Click="changePasswordDialog = true; changePasswordNew = ''; changePasswordOld = ''"
          style="cursor: pointer;"><q-tooltip>Change Password</q-tooltip></q-icon> -->
        <q-btn padding="0" round>
          <q-avatar size="40px">
            <q-icon name="person" />
          </q-avatar>
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="72px">
                  <q-icon name="person" />
                </q-avatar>
                <q-btn color="black" label="Change Username" push size="sm" v-close-popup
                  @Click="changeUsernameDialog = true; changePasswordNew = ''; changePasswordOld = ''"></q-btn>
                <q-btn color="black" label="Change Password" push size="sm" v-close-popup
                  @Click="changePasswordDialog = true; changePasswordNew = ''; changePasswordOld = ''"></q-btn>
              </div>
            </div>
          </q-menu>
        </q-btn>
        <q-dialog v-model="changePasswordDialog" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">Change Password</div>
              <div class="text-h8">{{ user.fullname }}</div>
            </q-card-section>
            <q-card-section>
              <q-input v-model="changePasswordOld" type="password" label="Old Password" />
              <q-input v-model="changePasswordNew" type="password" label="New Password" />
            </q-card-section>
            <q-card-actions>
              <q-btn flat label="Cancel" @click="changePasswordDialog = false" />
              <q-btn flat label="Save" color="primary" @click="updatePassword" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="changeUsernameDialog" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">Change Username</div>
              <div class="text-h8">{{ user.fullname }}</div>
            </q-card-section>
            <q-card-section>
              <q-input v-model="user.username" label="New Username" />
              <!-- validate with password -->
              <q-input v-model="changePasswordOld" type="password" label="Password" />
            </q-card-section>
            <q-card-actions>
              <q-btn flat label="Cancel" @click="changeUsernameDialog = false" />
              <q-btn flat label="Save" color="primary" @click="updateUsername" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <strong style="font-size: xx-large;">{{ user.fullname ?? 'ds' }}</strong>
      </div>
      <div style="font-size: 40px;"><strong style="cursor: pointer;" @click="setWindowNumber">WINDOW - {{
        user.window_number ?? ''
          }}<q-tooltip>Click to update Window Number</q-tooltip></strong></div>
      <q-btn icon="logout" label="Logout" color="negative" @click="logout" />
    </div>
    <!-- align center items -->
    <div class="text-h5 q-mb-md">Releasing Dashboard</div>

    <!-- Three Columns -->
    <div class="row q-col-gutter-md">

      <!-- TABBED: Waiting / called -->
      <div class="col-12 col-md-3">
        <q-card class="q-pa-md">
          <div style="font-style: italic;" align="center">Press F6 to change tab</div>
          <q-tabs v-model="tab" dense class="text-primary" active-color="primary" indicator-color="primary">
            <q-tab name="waiting" label="⏳ Waiting" />
            <q-tab name="called" label="📢 called" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>

            <!-- Waiting Tab -->
            <q-tab-panel name="waiting">
              <q-table :rows="waiting" :columns="columns" row-key="queue_id" flat dense bordered>
                <template v-slot:body-cell-action="props">
                  <q-td align="right">
                    <q-btn icon="campaign" color="primary" dense @click="callNext(props.row.queue_id)"
                      :disable="called.length >= 5" />
                    <q-tooltip>call attention</q-tooltip>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

            <!-- Called Tab -->
            <q-tab-panel name="called">
              <q-table :rows="called" :columns="columns" row-key="queue_id" flat dense bordered>
                <template v-slot:body-cell-action="props">
                  <q-td align="right">
                    <q-btn icon="play_arrow" color="primary" dense @click="serveNext(props.row)"
                      :disable="current !== null"><q-tooltip>
                        serving</q-tooltip></q-btn>
                    <q-btn icon="arrow_forward" color="positive" dense @click="skipClient(props.row)"><q-tooltip>
                        skip</q-tooltip></q-btn>
                    <q-btn icon="close" color="warning" dense @click="cancelQueue(props.row)"><q-tooltip>
                        cancel</q-tooltip></q-btn>

                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

          </q-tab-panels>
        </q-card>
      </div>

      <!-- NOW SERVING -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">🔴🟢 Now {{ current ? 'Serving' : 'Calling' }}</div>
          <div v-if="!current">
            <div v-if="called.length">
              <div class="row q-col-gutter-md">
                <div v-for="item in called" :key="item.queue_id" class="col-12 col-md-6">
                  <q-card class="q-pa-md q-mb-md">
                    <div class="text-h5">{{ item.ref_code || item.queue_number }} <q-icon name="campaign" /></div>
                    <div>Priority: {{ item.priority_level }} - {{ item.sl_category }}</div>
                    <q-btn color="primary" label="Serve" @click="serveNext(item)" class="q-mr-sm" />
                    <q-btn color="positive" label="Skip" @click="skipClient(item)" class="q-mr-sm" />
                    <q-btn color="warning" label="Cancel" @click="cancelQueue(item)" />
                  </q-card>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="text-grey-7">No called items to display.</div>
            </div>
          </div>
          <div v-else>
            <q-card class="q-pa-xl q-mb-md flex flex-center bg-primary" style="min-height: 250px;">

              <div class="text-white">
                <div class="text-h1 q-mb-md "><strong>{{ current.ref_code || current.queue_number }}</strong></div>
                <div class="text-subtitle2 q-mb-md" v-if="current.priority_level === 'SL'">Special
                  Priority Lane
                </div>
                <div class="text-subtitle2 q-mb-md">Priority: {{ current.priority_level }}</div>
                <div class="row q-col-gutter-md">
                  <q-btn color="positive" @click="markServed" class="q-mr-sm">(F10) <br>Served
                  </q-btn>
                  <q-btn color="warning" @click="skipClient(current), current = null" class="q-mr-sm">
                    (F11) <br> Skip
                  </q-btn>
                  <q-btn color="negative" @click="cancelQueue(current)">
                    (F12) <br>Cancel
                  </q-btn>
                </div>
              </div>
            </q-card>
          </div>
          <div v-if="!current">
            <q-btn class="q-mr-sm" color="green" label="Serve" @click="serveNext()" :disable="called.length === 0" />
            <q-btn class="q-mr-sm" color="blue" label="Call Next" @click="callNext()"
              :disable="called.length >= 5 || waiting.length === 0" />
            <q-btn class="q-mr-sm" color="orange" label="Skip All Called" @click="skipAllCalled()"
              :disable="called.length === 0" />
          </div>
        </q-card>
      </div>

      <!-- SKIPPED / history-->
      <div class="col-12 col-md-3">
        <q-card class="q-pa-md">
          <div style="font-style: italic;" align="center">Press F7 to change tab</div>
          <q-tabs v-model="rtab" dense class="text-primary" active-color="primary" indicator-color="primary">
            <q-tab name="skipped" label="⏸ Skipped" />
            <q-tab name="history" label="📄 History" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="rtab" animated>

            <!-- Skipped Tab -->
            <q-tab-panel name="skipped">
              <q-input dense debounce="300" v-model="skippedSearch" placeholder="Search..." class="q-mb-sm">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-table :rows="skipped" :columns="columnsSkipped" row-key="queue_id" flat dense bordered
                :filter="skippedSearch">
                <template v-slot:body-cell-action="props">
                  <q-td align="right">
                    <q-btn icon="refresh" color="info" dense @click="recall(props.row)" />
                    <q-tooltip>call attention</q-tooltip>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

            <!-- History Tab -->
            <q-tab-panel name="history">
              <q-table :rows="history" :columns="columnsHistory" row-key="queue_id" flat dense bordered />
            </q-tab-panel>

          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>


<script>
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { useCookies } from 'vue3-cookies'
import api from 'src/API/api'
import socket from 'src/socket'
import myDialog from 'src/plugins/myDialog'


export default defineComponent({
  name: 'ReleasingDashboard',
  setup() {
    const $q = useQuasar()
    const { cookies } = useCookies();
    return {
      $q,
      cookies,
      socket,
      myDialog
    }
  },
  data() {
    return {
      tab: 'called',
      rtab: 'skipped',
      current: null,
      waiting: [],
      called: [],
      skipped: [],
      skippedSearch: '',
      history: [],
      columns: [
        { name: 'queue_number', label: 'Queue #', field: row => row.ref_code || row.queue_number },
        { name: 'priority_level', label: 'Priority', field: 'priority_level' },
        { name: 'action', label: 'Action', field: 'action', sortable: false }
      ],
      columnsSkipped: [
        { name: 'queue_number', label: 'Queue #', field: row => row.ref_code || row.queue_number },
        { name: 'priority_level', label: 'Priority', field: 'priority_level' },
        { name: 'action', label: 'Action', field: 'action', sortable: false }
      ],
      columnsHistory: [
        { name: 'queue_number', label: 'Queue #', field: row => row.ref_code || row.queue_number, },
        { name: 'priority_level', label: 'Priority', field: 'priority_level' },
        { name: 'action', label: 'Status', field: 'action' },
        { name: 'served_at', label: 'Served At', field: 'time', },
      ],
      changePasswordDialog: false,
      changePasswordOld: '',
      changePasswordNew: '',
      user: {},
      changeUsernameDialog: false,
    }
  },

  methods: {

    handleKey(event) {
      if (event.key === 'F6') {
        this.tab = this.tab !== 'waiting' ? 'waiting' : 'called'
        event.preventDefault()
      } else if (event.key === 'F7') {
        this.rtab = this.rtab !== 'skipped' ? 'skipped' : 'history'
        event.preventDefault()
      }
    },

    async serveNext(item) {
      this.current = item ? item : this.called[0]
      try {
        let response = await api.servingQueue(this.user, this.current.queue_id)
        if (response.error) {
          this.$q.notify({ type: 'negative', message: response.error.data.message })
          return
        }
        this.current.status = 'serving'
        this.called = this.called.filter(item => item.status === 'called')
        this.$q.notify({ type: 'positive', message: `Now serving ${this.current.ref_code || this.current.queue_number}` })
        this.refreshAll()
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Failed to serve queue' })
        console.error('Error serving queue:', error)
      }
      // const { data } = await axios.post('/api/cashier/next')
      // this.current = data || null
    },

    async callNext(queue_id) {
      await api.getCallNext(this.user, 'Releasing', queue_id)
      this.refreshAll();
    },

    async markServed() {
      if (!this.current) return
      await api.servedQueue(this.user, this.current.queue_id)
      this.$q.notify({ type: 'positive', message: `Served ${this.current.ref_code || this.current.queue_number}` })
      this.current = null
      this.refreshAll()
    },
    async skipClient(row) {
      await api.skipQueue(this.user, row.queue_id)
      this.refreshAll()
    },
    //skip all called queues
    async skipAllCalled() {
      for (const item of this.called) {
        await api.skipQueue(this.user, item.queue_id)
      }
      this.$q.notify({ type: 'info', message: 'All called queues skipped' })
      this.current = null
      this.refreshAll()
    },
    async cancelQueue(row) {
      await api.cancelQueue(this.user, row.queue_id)
      this.$q.notify({ type: 'warning', message: `Cancelled ${row.ref_code || row.queue_number}` })
      this.current = null
      this.refreshAll()
    },
    async recall(row) {
      this.callNext(row.queue_id)
      this.$q.notify({ type: 'info', message: `Recalling ${row.ref_code || row.queue_number}` })
    },
    async refreshAll() {
      this.waiting = (await api.getWaitingToday('Releasing')).data
      this.history = (await api.getHistory(this.user)).data
      this.called = (await api.getCalledByUser(this.user)).data
      this.skipped = (await api.getAllSkippedToday('Releasing')).data
      this.current = (await api.getTodayCurrentServing(this.user, 'Releasing')).data || null
    },
    new_queue(data) {
      if (data.services_type !== 'Releasing') return
      // Add to waiting if not already there
      this.waiting.push(data)
    },
    called_queue(data) {
      // Remove from waiting if exists
      this.waiting = this.waiting.filter(item => item.queue_id !== data.queue_id)
      // Remove from skipped if exists
      this.skipped = this.skipped.filter(item => item.queue_id !== data.queue_id)
    },
    skipped_queue(data) {
      // Remove from called if exists
      this.called = this.called.filter(item => item.queue_id !== data.queue_id)
      // Add to skipped
      if (data.service_type === 'Releasing')
        this.skipped.push(data)
    },
    async refresh_skipped() {
      this.skipped = (await api.getSkippedByUser(this.user)).data
    },
    //update user password
    async updatePassword() {
      if (!this.changePasswordOld || !this.changePasswordNew) {
        this.$q.notify({ type: 'negative', message: 'Please fill in all fields' })
        return
      }
      try {
        let response = await api.updatePassword(this.user, this.changePasswordOld, this.changePasswordNew)
        if (response.error) {
          this.$q.notify({ type: 'negative', message: response.error.data.message })
          return
        }
        this.$q.notify({ type: 'positive', message: 'Password updated successfully' })
        this.changePasswordDialog = false
        this.changePasswordOld = ''
        this.changePasswordNew = ''
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Failed to update password' })
        console.error('Error updating password:', error)
      }
    },

    //update user username
    async updateUsername() {
      if (!this.user.username || !this.changePasswordOld) {
        this.$q.notify({ type: 'negative', message: 'Please fill in all fields' })
        return
      }
      try {
        let response = await api.updateUsername(this.user, this.changePasswordOld, this.user.username)
        if (response.error) {
          this.$q.notify({ type: 'negative', message: response.error.data.message })
          return
        }
        this.$q.notify({ type: 'positive', message: 'Username updated successfully' })
        this.changeUsernameDialog = false
        this.changePasswordOld = ''
        this.user.username = response.data.username
        this.cookies.set('_UID_', this.user, '1d') // Update cookie with new username
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Failed to update username' })
        console.error('Error updating username:', error)
      }
    },

    async setWindowNumber() {
      this.$q.dialog({
        title: 'Update Window Number',
        message: 'Enter your new window number:',
        prompt: {
          model: this.user.window_number || '',
          type: 'number',
          placeholder: 'e.g. 1, 2, 3...'
        },
        cancel: true,
        persistent: true,
        ok: {
          label: 'Update',
          handler: (val) => {
            if (val) {
              // Update user window number and save to cookies
              this.user.window_number = val
              this.cookies.set('_UID_', this.user, '1d')
              this.$q.notify({ type: 'positive', message: `Window number updated to ${val}` })
            }
          }
        }
      })
        .onOk((val) => {
          if (val) {

            console.log('Window number:', val)
            let response = api.setCashierWindowNumber(this.user, val)
            if (response.error) {
              this.$q.notify({ type: 'negative', message: response.error.data.message })
              return
            }

            this.user.window_number = val
            this.cookies.set('_UID_', this.user, '1d')
            //rerun setup to update user data
            console.log('User data updated:', this.user)
            this.$q.notify({ type: 'positive', message: `Window number updated to ${val}` })
          }
        })
        .onCancel(() => {
          this.$q.notify({ type: 'info', message: 'Window number update cancelled' })
        })
    },

    //logout function
    logout() {
      this.cookies.remove('_UID_');
      this.$q.notify({ type: 'info', message: 'Logged out' })
      this.$router.push({ name: 'login' });
    },
  },

  mounted() {
    this.user = this.cookies.get('_UID_') || {};
    this.refreshAll()
    console.log('user', this.user.role)
    window.addEventListener('keydown', this.handleKey)
    // socket handlers that refresh waiting list when emit 'refresh_waiting' is received
    this.socket.on('new_queue', (queue) => {
      this.new_queue(queue);
    })
    this.socket.on('called_queue', (queue) => {
      this.called_queue(queue);
    })
    this.socket.on('skipped_queue', (queue) => {
      this.skipped_queue(queue);
    })
    // const msg = new SpeechSynthesisUtterance("Testing tagalog speech synthesis, Tinatawag ang susunod na kliyente");
    // msg.lang = "fil-PH"; // or "fil-PH" for Filipino, "ar-SA" for Arabic, etc.
    // msg.rate = 1;       // speed (0.1 to 10)
    // msg.pitch = 2;      // pitch (0 to 2)
    // speechSynthesis.speak(msg);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKey)
  }
})
</script>

<style scoped>
.text-h5 {
  font-size: 2rem;
  font-weight: bold;
}
</style>
