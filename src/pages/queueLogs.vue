<template>
  <q-page class="q-pa-sm">
    <q-inner-loading :showing="loading" style="z-index: 1000;">
      <q-spinner-gears size="90px" color="primary" />
    </q-inner-loading>

    <!-- Test button -->
    <!-- <q-btn @click="loading=!loading" style="  position: fixed;right: 1%; z-index: 1000;">
        loading test
      </q-btn> -->
    <!-- test button -->

    <q-card class="pa-1">

      <q-card-section class="container--fluid" style="height: 89vh;">
        <div class="text-h4">Queue Logs </div>
        <!-- employee list table  -->
        <q-table class="my-sticky-header-table" :grid="$q.screen.xs" :rows="queueList" :columns="header"
          row-key="timestamp" :rows-per-page-options="[10, 1, 15, 20, 25, 50, 0]" :filter="filter"
          :style="{ height: $q.screen.xs ? '90.5%' : '96.5%', 'overflow-y': 'auto' }"
          virtual-scroll-sticky-size-start="100">

          <template v-slot:top>
            <q-form @submit="fetchFilteredQueues" @reset="clearFilters"
              class="row q-col-gutter-sm items-center q-pa-sm">
              <q-input v-model="filterModel.queue_number" label="Client" dense outlined debounce="300" />
              <q-select v-model="filterModel.action" label="Action"
                :options="['', 'waiting', 'called', 'serving', 'served', 'skipped', 'cancelled']" style="width: 150px;"
                dense outlined emit-value map-options />

              <q-input v-model="filterModel.date" label="Date" dense outlined mask="####-##-##"
                placeholder="YYYY-MM-DD">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="filterModel.date" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-btn label="Search" color="primary" dense type="submit" icon="search" />
              <q-btn label="Clear" flat dense type="reset" />
            </q-form>
          </template>

        </q-table>
        <!-- end list table  -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import api from "src/API/api";
import dialog from "src/plugins/myDialog"
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'queueLogs',
  setup() {
    const $q = useQuasar();
    return {
      dialog
    }
  },

  methods: {
    test(evt, row) {
      console.log({ ...row })
      row.office = new Date().toUTCString()

    },

    async getQueueLogs() {
      try {
        this.loading = true;
        let response = await api.getQueueLogs();

        if (response.error) {
          dialog.negative(this.$q, response.error.statusText, response.error.data.message)
          this.loading = false
          return
        }
        this.queueList = response.data;
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    checkDateFormat(date) {
      // Check format using regex
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(date)) {
        return false; // Format is invalid
      }

      // Validate actual date values (e.g., not 2023-02-30)
      const parsed = new Date(date);
      const isValid = parsed instanceof Date && !isNaN(parsed);

      // Check that date reconstructed from parsed value matches input
      const [year, month, day] = date.split('-');
      return (
        isValid &&
        parsed.getFullYear() === parseInt(year) &&
        parsed.getMonth() + 1 === parseInt(month) &&
        parsed.getDate() === parseInt(day)
      );
    },

    async fetchFilteredQueues() {
      //setting the parameters
      let param = {
        action: this.filterModel.action === '' ? null : this.filterModel.action,
        priority_level: this.filterModel.priority_level === '' ? null : this.filterModel.priority_level,
        date: this.checkDateFormat(this.filterModel.date) ? this.filterModel.date : null,
        user_id: this.filterModel.user_id === '' ? null : this.filterModel.user_id,
        queue_number: this.filterModel.queue_number === '' ? null : this.filterModel.queue_number
      }

      try {
        this.loading = true;
        let response = await api.getQueueLogs(param);
        console.log('query', response)
        if (response.error) {
          dialog.negative(this.$q, response.error.statusText, response.error.data.message)
          this.queueList = []
        } else {
          this.queueList = response.data;
        }
        this.loading = false;
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    clearFilters() {
      this.filterModel = {
        action: '',
        priority_level: '',
        date: '',
        user_id: '',
        queue_number: ''
      }
    },
  },
  data() {
    return {
      testObj: {},
      filter: "",
      loading: false,
      newUserDialog: false,
      rules: {
        noSpace: v => (!v?.includes(' ')) || "No space allowed.",
        properWordStart: v => !v || /^[a-zA-Z_]/.test(v) || 'Must Start with letter.',
        notEmpty: (v) => (v && v.replaceAll(' ', '').length > 0) || "Empty Value.",
        noSpaceStart: (v) => (v && v.charAt(0) != ' ') || "No space allowed at start",
        noSpaceStartButAllowNullOrEmpty: (v) => (v === null || (v ?? '').length === 0) || (v && v.charAt(0) != ' ') || "No space allowed at start",
        requiredField: v => !!v || "Required field.",
        requiredSelection: v => !!v || "Required at least one selection",
        properEmail: v => !v || /^\w+([.-]?\w+)*@msugensan\.edu\.ph$/.test(v) || 'E-mail must be valid. Ex. juandelacruz@msugensan.edu.ph',
        matchPassword: v => v === this.form.password || "Does not match new password.",
        mobileNumber: v => !v || /^(09)\d{9}$/.test(v) || 'Mobile number must be valid. Ex. starts with (09) followed by xxxxxxxxx, where x = numeric character only',
        maxLength: (v) => (v && v.length <= 12) || "Max 12 characters",
        numbers: (v) => (!isNaN(v) && /^[0-9.]*$/.test(v)) || !v || "Must be positive numbers only",
        currency: v => (/^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/.test(v)) || (/^[1-9]\d*(((,\d{3}){2})?(\.\d{0,2})?)$/.test(v)) || (/^[0]\.\d{0,2}$/.test(v)) || v === "0.00" || v === "0" || 'Currency value only',
        date: v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Date must be in YYYY-MM-DD format',
        // float: (v) => ((!isNaN(this.StringToNumber(v)) && this.StringToNumber(v).indexOf('.') != -1) || (!isNaN(this.StringToNumber(v)) && /^[0-9]*$/.test(this.StringToNumber(v)))) || "Must be a number"
        ///^(09|\+639)\d{9}$/ <- if needed full philippine mobile number 
      },
      filterModel: {
        action: '',
        priority_level: '',
        date: '',
        user_id: '',
        queue_number: ''
      },
      header: [
        {
          name: 'date',
          label: 'Date',
          align: 'left',
          field: 'date',
          sortable: true
        },
        {
          name: 'time',
          label: 'Time',
          align: 'left',
          field: 'time',
          sortable: true
        },
        {
          name: 'user',
          label: 'user',
          align: 'left',
          field: 'fullname',
          sortable: true
        },
        {
          name: 'action',
          label: 'action',
          align: 'left',
          field: 'action',
          sortable: true
        },
        {
          name: 'queue_number',
          label: 'Client',
          align: 'left',
          field: 'queue_number',
          sortable: true
        },
        {
          name: 'services_type',
          label: 'Services',
          align: 'left',
          field: 'services_type',
          sortable: true
        },
      ],
      queueList: [],
    };
  },
  mounted() {
    this.filterModel.date = new Date().toISOString().split('T')[0]
    this.getQueueLogs();
  }
})
</script>
<style>
.custom-container {
  height: 89vh;
}

.my-sticky-header-table .q-table__middle {
  max-height: 89vh;
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  background-color: #ffffff;
  z-index: 1000;
}

.my-sticky-header-table thead tr:first-child th {
  position: sticky;
  top: 0;
}

.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}
</style>