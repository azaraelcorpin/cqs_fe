<template>
  <q-page class="bg-grey-2 q-pa-md">

    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <div class="text-h4 text-weight-bold">
          Cashier Queue Dashboard
        </div>
        <div class="text-grey-7">
          July 15, 2026
        </div>
      </div>

      <div class="col-auto">
        <q-btn
          color="primary"
          icon="refresh"
          label="Refresh"
          unelevated
        />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="row q-col-gutter-md">

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

    </div>

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
              :key="cashier.name"
              class="q-mb-lg"
            >

              <div class="row justify-between">

                <div class="text-weight-medium">
                  {{ cashier.name }}
                </div>

                <div>
                  {{ cashier.clients }} Clients
                </div>

              </div>

              <q-linear-progress
                rounded
                size="10px"
                color="green"
                :value="cashier.clients / 50"
              />

            </div>

          </q-card-section>

        </q-card>

      </div>

    </div>

    <!-- Bottom -->

    <div class="row q-col-gutter-md q-mt-md">

      <!-- Activity -->

      <div class="col-lg-6 col-xs-12">

        <q-card flat bordered>

          <q-card-section>

            <div class="text-h6">
              Recent Activities
            </div>

          </q-card-section>

          <q-separator />

          <q-list separator>

            <q-item
              v-for="log in logs"
              :key="log.id"
            >

              <q-item-section avatar>

                <q-avatar
                  :color="log.color"
                  text-color="white"
                  :icon="log.icon"
                />

              </q-item-section>

              <q-item-section>

                <q-item-label>
                  {{ log.message }}
                </q-item-label>

                <q-item-label caption>
                  {{ log.time }}
                </q-item-label>

              </q-item-section>

            </q-item>

          </q-list>

        </q-card>

      </div>

      <!-- Today's Queue -->

      <div class="col-lg-6 col-xs-12">

        <q-card flat bordered>

          <q-card-section>

            <div class="text-h6">
              Today's Queue Overview
            </div>

          </q-card-section>

          <q-separator />

          <q-markup-table flat>

            <thead>

            <tr>

              <th>Queue</th>

              <th>Status</th>

              <th>Cashier</th>

            </tr>

            </thead>

            <tbody>

            <tr
              v-for="queue in queues"
              :key="queue.no"
            >

              <td>{{ queue.no }}</td>

              <td>

                <q-badge
                  :color="queue.color"
                >
                  {{ queue.status }}
                </q-badge>

              </td>

              <td>{{ queue.cashier }}</td>

            </tr>

            </tbody>

          </q-markup-table>

        </q-card>

      </div>

    </div>
      <VueApexCharts
  
        height="350"
        :options="chartOptions"
        :series="series"
      />

  </q-page>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
export default {
  name: 'DashboardPage',
  components: {
    VueApexCharts
  },

  data() {
    return {
      totalClients: 156,

      cards: [
        {
          title: 'Total Clients',
          value: 156,
          color: 'primary',
          icon: 'groups'
        },
        {
          title: 'Served',
          value: 142,
          color: 'green',
          icon: 'check_circle'
        },
        {
          title: 'Waiting',
          value: 7,
          color: 'orange',
          icon: 'schedule'
        },
        {
          title: 'Cancelled',
          value: 7,
          color: 'red',
          icon: 'cancel'
        }
      ],

      queueStatus: [
        {
          label: 'Served',
          value: 142,
          color: 'green'
        },
        {
          label: 'Waiting',
          value: 7,
          color: 'orange'
        },
        {
          label: 'Skipped',
          value: 4,
          color: 'purple'
        },
        {
          label: 'Cancelled',
          value: 3,
          color: 'red'
        }
      ],

      services: [
        {
          name: 'Transcript / Document Fee',
          count: 74
        },
        {
          name: 'Scholarship / TES',
          count: 38
        },
        {
          name: 'Tuition Fee',
          count: 24
        },
        {
          name: 'Graduation Fee',
          count: 20
        }
      ],

      cashiers: [
        {
          name: 'Cashier 1001',
          clients: 46
        },
        {
          name: 'Cashier 1002',
          clients: 39
        },
        {
          name: 'Cashier 1003',
          clients: 33
        },
        {
          name: 'Cashier 1004',
          clients: 24
        }
      ],

      logs: [
        {
          id: 1,
          icon: 'check',
          color: 'green',
          message: 'CBL-001 has been served',
          time: '03:21 PM'
        },
        {
          id: 2,
          icon: 'call',
          color: 'primary',
          message: 'CBL-002 called',
          time: '03:18 PM'
        },
        {
          id: 3,
          icon: 'schedule',
          color: 'orange',
          message: 'CBL-005 waiting',
          time: '03:12 PM'
        },
        {
          id: 4,
          icon: 'close',
          color: 'red',
          message: 'CBL-003 cancelled',
          time: '02:59 PM'
        }
      ],

      queues: [
        {
          no: 'CBL-001',
          status: 'Served',
          cashier: '1001',
          color: 'green'
        },
        {
          no: 'CBL-002',
          status: 'Serving',
          cashier: '1002',
          color: 'blue'
        },
        {
          no: 'CBL-003',
          status: 'Waiting',
          cashier: '-',
          color: 'orange'
        },
        {
          no: 'CBL-004',
          status: 'Skipped',
          cashier: '1003',
          color: 'purple'
        },
        {
          no: 'CBL-005',
          status: 'Cancelled',
          cashier: '1001',
          color: 'red'
        }
      ],
      series: [74, 38, 24, 20, 10],

      chartOptions: {
        chart: {
          type: 'donut',
          toolbar: {
            show: false
          }
        },
  plotOptions: {
  pie: {
    donut: {
      size: '70%',

      labels: {
        show: true,

        total: {
          show: true,
          showAlways: true,
          label: 'Today',

          formatter: function (w) {
            return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' Clients'
          }
        }
      }
    }
  }
},

        labels: [
          'Transcript',
          'Scholarship',
          'Tuition',
          'Graduation',
          'Others'
        ],

        legend: {
          position: 'bottom',
          fontSize: '14px'
        },

        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + '%'
          }
        },

        tooltip: {
          y: {
            formatter: function (value) {
              return value + ' Clients'
            }
          }
        },

        stroke: {
          width: 2,
          colors: ['#fff']
        },

        colors: [
          '#1976D2',
          '#26A69A',
          '#F9A825',
          '#EF5350',
          '#7E57C2'
        ]
      }
    }
  },

  computed: {
    servedPercentage() {
      return (142 / this.totalClients) * 100
    }
  },

  methods: {
    refreshDashboard() {
      console.log('Refreshing dashboard...')
      // Later, call your API here
    }
  },

  mounted() {
    console.log('Dashboard Loaded')
    // Load dashboard data here later
  }
}
</script>