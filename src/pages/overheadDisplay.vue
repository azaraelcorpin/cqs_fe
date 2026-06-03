<template>
  <q-page padding class="bg-grey-2">
    <div class="row q-col-gutter-md">
      <!-- NOW SERVING -->
      <div class="col-3">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-primary text-white text-center text-h5">
            NOW SERVING
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="(window, index) in nowServing" :key="'ns-' + index">
              <q-item-section>
                <div class="text-h6">
                  window {{ window.window }}:
                  <span :class="{
                    'text-green-9': window.status === 'serving',
                    'text-blue-9': window.status === 'available',
                    'text-grey-7': window.status === 'Offline'
                  }">
                    {{ window.number || window.status }}
                  </span>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- RECENTLY CALLED -->
      <div class="col-9">
        <q-card flat bordered class="full-height">
          <q-card-section class="bg-secondary text-white text-center text-h5">
            RECENTLY CALLED
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="(window, index) in recentlyCalled" :key="'rc-' + index">
              <q-item-section>
                <div class="text-h6">
                  window {{ window.window }}:
                  <span v-for="(num, i) in window.numbers" :key="'num-' + i" class="q-mr-sm">
                    <span :class="num !== '--' ? 'text-yellow-10' : 'text-grey-7'">
                      {{ num }}
                    </span>
                  </span>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Announcements -->
    <q-banner class="bg-dark text-white q-mt-md" dense>
      <template v-slot:avatar>
        <q-icon name="campaign" @click="speak(announcementText)" />
      </template>
      <marquee>{{ announcementText }}</marquee>
    </q-banner>
  </q-page>
</template>

<script>
import axios from 'axios'
import api from 'src/API/api'
import socket from 'src/socket'

export default {
  name: 'OverheadDisplay',

  data() {
    return {
      nowServing: [
        { window: 1, number: null, status: 'Offline' },
        { window: 2, number: null, status: 'Offline' },
        { window: 3, number: null, status: 'Offline' },
        { window: 4, number: null, status: 'Offline' }
      ],
      recentlyCalled: [
        { window: 1, numbers: ['A104', 'A103', 'A102', 'A101', 'Aw00'] },
        { window: 2, numbers: ['B209', 'B208', 'B207', 'B206', 'B205'] },
        { window: 3, numbers: ['--', '--', '--', '--', '--'] },
        { window: 4, numbers: ['--', '--', '--', '--', '--'] }
      ],
      announcements: [
        'Please proceed to the indicated window when your number is called.',
        'Payment cut-off is at 4:30 PM.',
        'Thank you for your cooperation.'
      ],

    }
  },
  methods: {
    speak(text) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn('Text-to-speech not supported.');
      }
    },

    async initializeData() {
      let currentCashier = await api.getAllCashierLoggedIn();
      let res = await api.getTodayCurrentServingAndCalled();
    console.log('overhead', currentCashier.data)

    if(currentCashier.error) {
     console.error('Failed to fetch data:', currentCashier.error);
      return;
    }
    if(res.error) {
     console.error('Failed to fetch data:', res.error);
      res.data = [];
    }
    let data = res.data;
    let cashierData =[...new Set(currentCashier.data)];
    this.nowServing = cashierData.map(cashier => {
      let current = data.find(item => item.window_number === cashier.window_number && item.status === 'serving');
      return {
        window: cashier.window_number,
        number: current ? current.queue_number : null,
        status: cashier.status
      };
    });
    console.log('now serving', this.nowServing)
    // get a list of distinct windows from the data and sort them
    let windows = [...new Set(data.map(item => item.window_number))].sort((a, b) => a - b);
    // update nowServing and recentlyCalled based on the fetched data
    // this.nowServing = data.map(window_number => {
    //   let current = data.find(item => item.window_number === window_number && item.status === 'serving');
    //   return {
    //     window: window_number,
    //     number: current ? current.queue_number : null,
    //     status: current ? 'Serving' : 'Available'
    //   };
    // });
    // For recently called, we will take the last 5 numbers for each window, sorted by
    this.recentlyCalled = cashierData.map(cashier => {
      let calledNumbers = data
        .filter(item => item.window_number === cashier.window_number && item.status === 'called')
        .sort((a, b) => new Date(a.last_update_on) - new Date(b.last_update_on)) // sort by last_update_on ascending
        .slice(0, 5) // take the last 5 called numbers
        .map(item => item.queue_number);
      return {
        window: cashier.window_number,
        numbers: calledNumbers.length > 0 ? calledNumbers : ['--', '--', '--', '--', '--']
      };
    });
    },

    async callNextSpeech(temp) {
      await this.initializeData();
      let client = temp
      if (!client) {
        this.$q.notify({ type: 'warning', message: 'No client to call' })
        return
      }
      // get the current window number from the recently called list using client.queue_number to find the window number from numbers

      let window = this.recentlyCalled.find(w => w.numbers.includes(client.queue_number))?.window || 'unknown';

      const msg = new SpeechSynthesisUtterance(`Calling ${client.ref_code || client.queue_number} at window ${window}`);
      msg.lang = "en-US"; // or "fil-PH" for Filipino, "ar-SA" for Arabic, etc.
      msg.rate = 0.8;       // speed (0.1 to 10)
      msg.pitch = 0.5;      // pitch (0 to 2)
      speechSynthesis.speak(msg);
      this.$q.notify({ type: 'info', message: `Calling ${client.ref_code || client.queue_number} at window ${window}` })
    },

    // servingSpeech(temp)
    async servingSpeech(temp) {
      await this.initializeData();
      let client = temp
      if (!client) {
        this.$q.notify({ type: 'warning', message: 'No client to call' })
        return
      }
        // get the current window number from the recently called list using client.queue_number to find the window number from numbers

      let window = this.nowServing.find(w => w.number === client.queue_number)?.window || 'unknown';
      const msg = new SpeechSynthesisUtterance(`Now serving ${client.ref_code || client.queue_number} at window ${window}`);
      msg.lang = "en-US"; // or "fil-PH" for Filipino, "ar-SA" for Arabic, etc.
      msg.rate = 0.8;       // speed (0.1 to 10)
      msg.pitch = 0.5;      // pitch (0 to 2)
      speechSynthesis.speak(msg);
      this.$q.notify({ type: 'success', message: `Now serving ${client.ref_code || client.queue_number} at window ${window}` })
    },

    announcementSpeech(temp) {
      const msg = new SpeechSynthesisUtterance(temp);
      msg.lang = "en-US"; // or "fil-PH" for Filipino, "ar-SA" for Arabic, etc.
      msg.rate = 0.8;       // speed (0.1 to 10)
      msg.pitch = 0.5;      // pitch (0 to 2)
      speechSynthesis.speak(msg);
      this.$q.notify({ type: 'info', message: temp })
    },
  },


  async mounted() {
    await this.initializeData();
    console.log('mounted overhead display, initializing socket listeners')
      socket.off('called_queue') // remove old
      socket.on('called_queue', (queue) => {
          this.callNextSpeech(queue);
        })
      socket.off('serving_queue') // remove old
      socket.on('serving_queue', (queue) => {
          this.servingSpeech(queue);
        })
      socket.off('announcement') // remove old
      socket.on('announcement', (announcement) => {
          this.announcementSpeech(announcement.message);
        })
      socket.off('refresh_data') // remove old
      socket.on('refresh_data', async () => {
          await this.initializeData();
        })
  },

  computed: {
    announcementText() {
      return this.announcements.join('   •   ')
    }
  }
}
</script>

<style scoped>
.full-height {
  height: calc(100vh - 100px);
}

marquee {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
