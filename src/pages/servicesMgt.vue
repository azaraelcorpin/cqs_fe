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
        <div class="text-h4">Services Management </div>
        <!-- new Employee dialog -->
        <q-dialog v-model="newServicesDialog" persistent>
          <q-card :style="{ width: $q.screen.xs ? '100%' : '50%' }">
            <q-form @submit="newServices" @reset="newServicesReset">
              <q-inner-loading :showing="loading" label="Updating Record..." label-class="text-black"
                label-style="font-size: 1.1em" color="black" style="z-index: 1000;">
              </q-inner-loading>
              <q-page-container style="padding:10px;">
                <div class="text-h5" style="margin: 5px;">{{ !NEW_SERVICES.id ? 'New ' : 'Update '
                }}
                  Service</div>
                <!-- type -->
                <q-select label="Type" filled dense outlined class="q-pa-sm" color="primary" v-model="NEW_SERVICES.type"
                  :options="['Payment', 'Disbursement']">
                </q-select>
                <!-- category -->
                <q-input required label="Category" dense outlined class="q-pa-sm" color="primary"
                  v-model="NEW_SERVICES.category" :rules="[rules.properWordStart, rules.requiredField]">
                </q-input>

                <div>
                  <q-radio v-model="NEW_SERVICES.active" :val="true" label="Active" />
                  <q-radio v-model="NEW_SERVICES.active" :val="false" label="Inactive" />
                </div>
                <div style="display: flex; justify-content: flex-end;">
                  <q-btn class="q-ma-md" color="primary" v-if="NEW_SERVICES.id" type="submit">Update</q-btn>
                  <q-btn class="q-ma-md" color="primary" v-else type="submit">Save</q-btn>
                  <q-btn class="q-ma-md" type="reset">Cancel</q-btn>
                </div>

              </q-page-container>
            </q-form>
          </q-card>
        </q-dialog>
        <!-- end dialog -->
        <!-- employee list table  -->
        <q-table class="my-sticky-header-table" :grid="$q.screen.xs" :rows="servicesList" :columns="header" row-key="id"
          :rows-per-page-options="[10, 1, 15, 20, 25, 50, 0]" :filter="filter"
          :style="{ height: $q.screen.xs ? '90.5%' : '96.5%', 'overflow-y': 'auto' }"
          virtual-scroll-sticky-size-start="100">
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn color="positive" icon="edit" round flat @click="showUpdateServicesDialog(props.row)"></q-btn>
              <q-btn color="negative" icon="delete" round flat :disabled="props.row.position"
                @click="deleteServices(props.row)"></q-btn>
            </q-td>
          </template>
          <template v-slot:top>
            <q-btn push color="primary"
              @click=" newServicesReset(), newServicesDialog = !newServicesDialog, NEW_SERVICES.created_at = 'admin'">New
              Services</q-btn>
            <q-space />
            <q-input dense debounce="300" color="primary" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
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
  name: 'userMgt',
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

    async resetPassword() {
      try {

        dialog.confirm(this.$q, "Confirmation", "Would you like to reset password of this user?")
          .onOk(async () => {
            this.loading = true;
            let response = await api.resetPasswordToUsername(this.NEW_SERVICES);
            if (response.error) {
              dialog.negative(this.$q, response.error.statusText, response.error.data.message)
            } else {
              this.loading = false;
              dialog.positive(this.$q, 'Updated', response.message).onOk(() => {
                this.getAllServices();
                this.newServicesReset();
              });
            }
            this.loading = false;
          })
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    async getAllServices() {
      try {
        this.loading = true;
        let response = await api.getAllServices();
        this.servicesList = response.data;
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    async newServices() {
      if (this.NEW_SERVICES.id) {
        this.updateServices()
      } else {
        try {
          this.loading = true;
          this.NEW_SERVICES.password = this.NEW_SERVICES.category;
          let response = await api.addService(this.NEW_SERVICES);
          if (response.error) {
            dialog.negative(this.$q, response.error.statusText, response.error.data.message)
          } else {
            console.log(response)
            dialog.positive(this.$q, 'Created', response.message).onOk(() => {
              this.newServicesReset();
              this.getAllServices();
            });
          }

        } catch (error) {
          console.log('error', error)
        }
        this.loading = false;
      }
    },

    async updateServices() {
      try {

        dialog.confirm(this.$q, "Confirmation", "Would you like to update this service?")
          .onOk(async () => {
            this.loading = true;
            let response = await api.updateService(this.NEW_SERVICES);
            if (response.error) {
              dialog.negative(this.$q, response.error.statusText, response.error.data.message)
            } else {
              this.loading = false;
              dialog.positive(this.$q, 'Updated', response.message).onOk(() => {
                this.getAllServices();
                this.newServicesReset();
              });
            }
            this.loading = false;
          })
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    async deleteServices(param) {
      try {

        dialog.confirm(this.$q, "Confirmation", "Would you like to delete " + param.category + "?")
          .onOk(async () => {
            this.loading = true;
            let response = await api.deleteService(param);
            console.log('deleteServices', response)
            if (response.error) {
              dialog.negative(this.$q, response.error.statusText, response.error.data.message)
            } else {
              dialog.positive(this.$q, 'Deleted', response.message).onOk(() => {
                this.getAllServices();
              });
            }
            this.loading = false;
          })
          .onCancel(() => {
            return
          })

      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    showUpdateServicesDialog(row) {
      this.testObj = row;
      let tmp = { ...row };
      this.NEW_SERVICES.id = tmp.id;
      this.NEW_SERVICES.type = tmp.type;
      this.NEW_SERVICES.category = tmp.category;
      this.NEW_SERVICES.created_at = tmp.created_at;
      this.NEW_SERVICES.active = tmp.active;
      this.newServicesDialog = true;
    },

    newServicesReset() {
      this.NEW_SERVICES = {
        id: null,
        type: null,
        category: null,
        created_at: null,
        active: true,
      }
      this.newServicesDialog = false;
    }
  },

  data() {
    return {
      testObj: {},
      filter: "",
      loading: false,
      newServicesDialog: false,
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
        // float: (v) => ((!isNaN(this.StringToNumber(v)) && this.StringToNumber(v).indexOf('.') != -1) || (!isNaN(this.StringToNumber(v)) && /^[0-9]*$/.test(this.StringToNumber(v)))) || "Must be a number"
        ///^(09|\+639)\d{9}$/ <- if needed full philippine mobile number
      },
      NEW_SERVICES: {
        id: null,
        type: null,
        category: null,
        created_at: null,
        active: true,
      },
      header: [
        {
          name: 'type',
          label: 'Type',
          align: 'left',
          field: 'type',
          sortable: true
        },
        {
          name: 'category',
          label: 'Category',
          align: 'left',
          field: 'category',
          sortable: true
        },
        {
          name: 'created_at',
          label: 'Created At',
          align: 'left',
          field: 'created_at',
          sortable: true
        },
        {
          name: 'status',
          label: 'Status',
          align: 'left',
          field: 'active',
          format: (value) => { return value ? 'Active' : 'Inactive'; },
          sortable: true
        },
        {
          name: 'action',
          label: 'Action',
          align: 'center',
        },
      ],
      servicesList: [],
    };
  },
  mounted() {
    this.getAllServices();
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
