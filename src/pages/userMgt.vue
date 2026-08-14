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
        <div class="text-h4">User Management </div>
        <!-- new Employee dialog -->
        <q-dialog v-model="newUserDialog" persistent>
          <q-card :style="{ width: $q.screen.xs ? '100%' : '50%' }">
            <q-form @submit="newUser" @reset="newUserReset">
              <q-inner-loading :showing="loading" label="Updating Record..." label-class="text-black"
                label-style="font-size: 1.1em" color="black" style="z-index: 1000;">
              </q-inner-loading>
              <q-page-container style="padding:10px;">
                <div class="text-h5" style="margin: 5px;">{{ !NEW_USER.user_id ? 'New ' : 'Update ' }} User</div>
                <!-- lname -->
                <q-input required label="Fullname" dense outlined class="q-pa-sm" color="primary"
                  v-model="NEW_USER.fullname" :rules="[rules.noSpaceStart, rules.requiredField]" @update:model-value="() => {
                    if (!NEW_USER.user_id) {
                      let _username = NEW_USER.fullname
                      NEW_USER.username = _username.toLowerCase().replaceAll(' ', '')
                    }
                  }">
                </q-input>
                <!-- fname -->
                <q-input required label="Username" dense outlined class="q-pa-sm" color="primary"
                  v-model="NEW_USER.username" :rules="[rules.noSpace, rules.requiredField]" :disable="true">
                </q-input>
                <!-- mname -->
                <q-select label="Role" filled dense outlined class="q-pa-sm" color="primary" v-model="NEW_USER.role"
                  :options="['admin', 'cashier', 'releasing', 'pl-validator']">
                </q-select>

                <q-input v-if="NEW_USER.role === 'cashier'" label="Window Number" filled dense outlined class="q-pa-sm"
                  color="primary" v-model="NEW_USER.window_number" :rules="[rules.numbers, rules.requiredField]">
                </q-input>

                <q-input v-if="NEW_USER.user_id" label="RFID" filled dense outlined class="q-pa-sm"
                  color="primary" v-model="NEW_USER.rfid" :rules="[rules.numbers]">
                </q-input>

                <div v-if="NEW_USER.user_id">
                  <q-radio v-model="NEW_USER.is_active" :val="true" label="Active" />
                  <q-radio v-model="NEW_USER.is_active" :val="false" label="Inactive" />
                </div>

                <q-btn v-if="NEW_USER.user_id" @click="resetPassword">reset password</q-btn>

                <div style="display: flex; justify-content: flex-end;">
                  <q-btn class="q-ma-md" color="primary" v-if="NEW_USER.user_id" type="submit">Update</q-btn>
                  <q-btn class="q-ma-md" color="primary" v-else type="submit">Save</q-btn>
                  <q-btn class="q-ma-md" type="reset">Cancel</q-btn>
                </div>

              </q-page-container>
            </q-form>
          </q-card>
        </q-dialog>
        <!-- end dialog -->
        <!-- employee list table  -->
        <q-table class="my-sticky-header-table" :grid="$q.screen.xs" :rows="userList" :columns="header"
          row-key="user_id" :rows-per-page-options="[10, 1, 15, 20, 25, 50, 0]" :filter="filter"
          :style="{ height: $q.screen.xs ? '90.5%' : '96.5%', 'overflow-y': 'auto' }"
          virtual-scroll-sticky-size-start="100">
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <q-btn color="positive" icon="edit" round flat @click="showUpdateUserDialog(props.row)"></q-btn>
              <q-btn color="negative" icon="delete" round flat :disabled="props.row.position"
                @click="deleteUser(props.row)"></q-btn>
            </q-td>
          </template>
          <template v-slot:top>
            <q-btn push color="primary"
              @click=" newUserReset(), newUserDialog = !newUserDialog, NEW_USER.role = 'admin'">New User</q-btn>
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
            let response = await api.resetPasswordToUsername(this.NEW_USER);
            if (response.error) {
              dialog.negative(this.$q, response.error.statusText, response.error.data.message)
            } else {
              this.loading = false;
              dialog.positive(this.$q, 'Updated', response.message).onOk(() => {
                this.getAllUser();
                this.newUserReset();
              });
            }
            this.loading = false;
          })
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    async getAllUser() {
      try {
        this.loading = true;
        let response = await api.getAllUser();
        this.userList = response.data;
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    async newUser() {
      if (this.NEW_USER.user_id) {
        this.updateEmployee()
      } else {
        try {
          this.loading = true;
          this.NEW_USER.password = this.NEW_USER.username;
          let response = await api.newUser(this.NEW_USER);
          if (response.error) {
            dialog.negative(this.$q, response.error.statusText, response.error.data.message)
          } else {
            console.log(response)
            dialog.positive(this.$q, 'Created', response.message).onOk(() => {
              this.newUserReset();
              this.getAllUser();
            });
          }

        } catch (error) {
          console.log('error', error)
        }
        this.loading = false;
      }
    },

    async updateEmployee() {
      try {

        dialog.confirm(this.$q, "Confirmation", "Would you like to update this user?")
          .onOk(async () => {
            this.loading = true;
            let response = await api.updateUser(this.NEW_USER);
            if (response.error) {
              dialog.negative(this.$q, response.error.statusText, response.error.data.message)
            } else {
              this.loading = false;
              dialog.positive(this.$q, 'Updated', response.message).onOk(() => {
                this.getAllUser();
                this.newUserReset();
              });
            }
            this.loading = false;
          })
      } catch (error) {
        console.log('error', error)
      }
      this.loading = false;
    },

    async deleteUser(param) {
      try {

        dialog.confirm(this.$q, "Confirmation", "Would you like to delete " + param.username + "?")
          .onOk(async () => {
            this.loading = true;
            let response = await api.deleteUser(param);
            console.log('deleteUser', response)
            if (response.error) {
              dialog.negative(this.$q, response.error.statusText, response.error.data.message)
            } else {
              dialog.positive(this.$q, 'Deleted', response.message).onOk(() => {
                this.getAllUser();
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

    showUpdateUserDialog(row) {
      this.testObj = row;
      let tmp = { ...row };
      this.NEW_USER.user_id = tmp.user_id;
      this.NEW_USER.fullname = tmp.fullname;
      this.NEW_USER.username = tmp.username;
      this.NEW_USER.role = tmp.role;
      this.NEW_USER.is_active = tmp.is_active;
      this.NEW_USER.password = tmp.password;
      this.NEW_USER.window_number = tmp.window_number ?? null;
      this.newUserDialog = true;
    },

    newUserReset() {
      this.NEW_USER = {
        id: null,
        email: null,
        lname: null,
        fname: null,
        mname: null,
        email: null,
        window_number: null,
      }
      this.newUserDialog = false;
    }
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
        // float: (v) => ((!isNaN(this.StringToNumber(v)) && this.StringToNumber(v).indexOf('.') != -1) || (!isNaN(this.StringToNumber(v)) && /^[0-9]*$/.test(this.StringToNumber(v)))) || "Must be a number"
        ///^(09|\+639)\d{9}$/ <- if needed full philippine mobile number
      },
      NEW_USER: {
        user_id: null,
        username: null,
        fullname: null,
        role: null,
        is_active: null,
        password: null,
        window_number: null,
      },
      header: [
        {
          name: 'user_id',
          label: 'User ID',
          align: 'left',
          field: 'user_id',
          sortable: true
        },
        {
          name: 'username',
          label: 'Username',
          align: 'left',
          field: 'username',
          sortable: true
        },
        {
          name: 'fullname',
          label: 'Fullname',
          align: 'left',
          field: 'fullname',
          sortable: true
        },
        {
          name: 'role',
          label: 'Role',
          align: 'left',
          field: 'role',
          sortable: true
        },
        {
          name: 'status',
          label: 'Status',
          align: 'left',
          field: 'is_active',
          format: (value) => { return value ? 'Active' : 'Inactive'; },
          sortable: true
        },
        {
          name: 'rfid',
          label: 'RFID',
          align: 'left',
          field: 'rfid',
          sortable: true
        },
        {
          name: 'action',
          label: 'Action',
          align: 'center',
        },
      ],
      userList: [],
    };
  },
  mounted() {
    this.getAllUser();
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
