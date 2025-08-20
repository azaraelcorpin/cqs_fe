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
            <q-item v-for="(counter, index) in nowServing" :key="'ns-' + index">
              <q-item-section>
                <div class="text-h6">
                  Counter {{ counter.counter }}:
                  <span :class="{
                    'text-green-9': counter.status === 'Serving',
                    'text-blue-9': counter.status === 'Available',
                    'text-grey-7': counter.status === 'Offline'
                  }">
                    {{ counter.number || counter.status }}
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
            <q-item v-for="(counter, index) in recentlyCalled" :key="'rc-' + index">
              <q-item-section>
                <div class="text-h6">
                  Counter {{ counter.counter }}:
                  <span v-for="(num, i) in counter.numbers" :key="'num-' + i" class="q-mr-sm">
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
export default {
  name: 'OverheadDisplay',

  data() {
    return {
      nowServing: [
        { counter: 1, number: 'A105', status: 'Serving' },
        { counter: 2, number: 'B210', status: 'Serving' },
        { counter: 3, number: null, status: 'Available' },
        { counter: 4, number: null, status: 'Offline' }
      ],
      recentlyCalled: [
        { counter: 1, numbers: ['A104', 'A103', 'A102', 'A101', 'A100'] },
        { counter: 2, numbers: ['B209', 'B208', 'B207', 'B206', 'B205'] },
        { counter: 3, numbers: ['--', '--', '--', '--', '--'] },
        { counter: 4, numbers: ['--', '--', '--', '--', '--'] }
      ],
      announcements: [
        'Please proceed to the indicated counter when your number is called.',
        'Payment cut-off is at 4:30 PM.',
        'Thank you for your cooperation.'
      ]
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
    }
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
