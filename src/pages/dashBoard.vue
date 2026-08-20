<template>
  <q-page class="bg-grey-2 q-pa-md">

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold">
          Cashier Queue Dashboard
        </div>
        <div class="text-grey-7" style="font-size: 14px; width: 20%;">

          <q-input
            v-model="date"
            label="Date"
            outlined
            readonly
          >
            <template #append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date" mask="YYYY-MM-DD">

                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Close"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Refresh"
          @click="refreshDashboard"
          unelevated
          :loading="loading"
        />
      </div>
    </div>

    <!-- KPI Cards -->
    <!-- <div class="row q-col-gutter-md">

      <div
        class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
        v-for="card in cards"
        :key="card.title"
      >
        <q-card flat bordered>

          <q-card-section class="row items-center">

            <q-avatar
              :color="card.color"
              text-color="white"
              :icon="card.icon"
            />

            <div class="q-ml-md">

              <div class="text-grey">
                {{ card.title }}
              </div>

              <div class="text-h4 text-weight-bold">
                {{ card.value }}
              </div>

            </div>

          </q-card-section>

        </q-card>
      </div>

    </div> -->

    <div class="row q-col-gutter-md q-mt-md">

      <!-- Queue Status -->
      <div class="col-lg-4 col-md-6 col-xs-12">

        <q-card flat bordered>

          <q-card-section>
            <div class="text-h6">
              Queue Status
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>

            <div
              v-for="item in queueStatus"
              :key="item.label"
              class="q-mb-md"
            >

              <div class="row justify-between">
                <div>{{ item.label }}</div>
                <div class="text-weight-bold">
                  {{ item.value }}
                </div>
              </div>

              <q-linear-progress
                rounded
                size="12px"
                :value="item.value / totalClients"
                :color="item.color"
              />

            </div>

          </q-card-section>

        </q-card>

      </div>

      <!-- Service Categories -->
      <div class="col-lg-4 col-md-6 col-xs-12">

        <q-card flat bordered>

          <q-card-section>
            <div class="text-h6">
              Top Services
            </div>
          </q-card-section>

          <q-separator />

          <q-list separator>

            <q-item
              v-for="service in services"
              :key="service.name"
            >

              <q-item-section>

                <q-item-label>
                  {{ service.name }}
                </q-item-label>

                <q-item-label caption>
                  {{ service.count }} Clients
                </q-item-label>

              </q-item-section>

              <q-item-section side>

                <q-badge
                  color="primary"
                  rounded
                >
                  {{ service.count }}
                </q-badge>

              </q-item-section>

            </q-item>

          </q-list>

        </q-card>

      </div>

      <!-- Cashier Performance -->
      <div class="col-lg-4 col-md-12 col-xs-12">

        <q-card flat bordered>

          <q-card-section>
            <div class="text-h6">
              Cashier Performance
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>

            <div
              v-for="cashier in cashiers"
              :key="cashier.user_id"
              class="q-mb-lg"
            >

              <div class="row justify-between">

                <div class="text-weight-medium">
                  {{ cashier.user_id }}
                </div>

                <div>
                  {{ cashier.count }} Clients
                </div>

              </div>

              <q-linear-progress
                rounded
                size="10px"
                color="green"
                :value="cashier.count / 50"
              />

            </div>

          </q-card-section>

        </q-card>

      </div>

    </div>

    <!-- Bottom -->

    <div class="row q-col-gutter-md q-mt-md">

      <!-- Activity -->


    </div>
      <VChart
        :option="option"
        style="height: 400px; width: 100%;"
      />
  </q-page>
</template>

<script>
import api from "src/API/api";
import dialog from "src/plugins/myDialog"
import { useQuasar } from 'quasar'
import VChart from 'vue-echarts'

import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
])



export default {
  name: 'DashboardPage',
  components: {
    VChart
  },

  setup() {
    const $q = useQuasar();
    return {
      dialog
    }
  },

  data() {
    return {
      loading: false,
      timer: null,
      date: new Date().toISOString().substr(0, 10),
      totalClients: 156,

      // cards: [
      //   {
      //     title: 'Total Clients',
      //     value: 156,
      //     color: 'primary',
      //     icon: 'groups'
      //   },
      //   {
      //     title: 'Served',
      //     value: 142,
      //     color: 'green',
      //     icon: 'check_circle'
      //   },
      //   {
      //     title: 'Waiting',
      //     value: 7,
      //     color: 'orange',
      //     icon: 'schedule'
      //   },
      //   {
      //     title: 'Cancelled',
      //     value: 7,
      //     color: 'red',
      //     icon: 'cancel'
      //   }
      // ],

      // serving
      // called

      queueStatus: [
        {
          label: 'served',
          value: 0,
          color: 'green'
        },
        {
          label: 'serving',
          value: 0,
          color: 'blue'
        },
        {
          label: 'called',
          value: 0,
          color: 'teal'
        },
        {
          label: 'waiting',
          value: 0,
          color: 'orange'
        },
        {
          label: 'skipped',
          value: 0,
          color: 'purple'
        },
        {
          label: 'cancelled',
          value: 0,
          color: 'red'
        }
      ],

      services: [],

      cashiers: [],

      option : {
          title: {
            text: '0',
            subtext: 'Total Served Clients',
            left: '49.5%',
            top: '44%',
            textAlign: 'center'
          },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },

        legend: {
          bottom: 0,
          left: 'center',
        },

          series: [
            {
              name: 'Clients',
              radius: ['40%', '70%'],
              type: 'pie',
              label: {
                show: false,
                formatter: '{b}: {c} ({d}%)'
              },
              // data: apiData.map(item => ({
              //   name: item.college,
              //   value: item.total
              // }))
              data: [
                { value: 1048, name: 'College of Engineering' },
                { value: 735, name: 'College of Arts and Sciences' },
                { value: 580, name: 'College of Business Administration' },
                { value: 484, name: 'College of Education' },
                { value: 300, name: 'College of Nursing' }
              ]
            }
          ]
        },

    }
  },

  computed: {
    servedPercentage() {
      return (142 / this.totalClients) * 100
    }
  },

  methods: {
    async refreshDashboard() {
      this.loading = true
      console.log('Refreshing dashboard...')
      // Later, call your API here
      try{
        let response = await api.getDashboardData(this.date)
        if (response.error) {
          dialog.negative(this.$q, response.error.statusText, response.error.data.message)
          return
        }
        // this.queueStatus = response.data.statusCount
        let statusCount = response.data.statusCount
        //map the status count to the queueStatus array
        this.queueStatus.forEach(item => {
          let status = statusCount.find(status => status.status === item.label)
          console.log('Status:', status)
          if (status) {
            item.value = status.count
          } else {
            item.value = 0
          }
        })

        this.services = response.data.topServices
        this.cashiers = response.data.cashierPerformance
        this.option.title.text = this.queueStatus.find(item => item.label === 'served').value.toString();
        this.option.series[0].data = this.services.map(service => ({
          name: service.name,
          value: service.count
        }))
        this.loading = false
      } catch (error) {
        dialog.negative(this.$q, 'Error', 'Failed to fetch dashboard data')
        this.loading = false
      }
    }

    // create a method that will refresh the dashboard data every 5 minutes like cron job
    // setInterval(() => {
  },

  mounted() {
    console.log('Dashboard Loaded')
    this.date = new Date().toISOString().substr(0, 10)
    // Load dashboard data here later
    this.timer = setInterval(() => {
      this.refreshDashboard();
    }, 300000); // 5 minutes in milliseconds
  },
  unmounted() {
    // Clear the interval when the component is unmounted
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  watch: {
    date(newDate) {
      this.refreshDashboard();
      // Call your API here to fetch data for the new date
    }
  },
}
</script>
