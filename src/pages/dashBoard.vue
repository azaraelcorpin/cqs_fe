<template>
  <q-page padding>
    <h2 class="text-h5 q-mb-md">Queue Summary - Today</h2>

    <q-table
    class="my-sticky-header-table"
    :grid="$q.screen.xs"
      :rows="users"
      :columns="columns"
      row-key="id"
      :filter="filter"
      flat
      bordered
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense flat icon="edit" color="primary"
            @click="editUser(props.row)"
          />
          <q-btn
            dense flat icon="delete" color="negative"
            @click="deleteUser(props.row.id)"
          />
        </q-td>
      </template>
        <template v-slot:top>

            <q-space />
            <q-input dense debounce="300" color="primary" v-model="filter" placeholder="Search">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
            </q-input>
        </template>      
    </q-table>

    <div v-if="selectedUser" class="q-mt-md">
      <q-banner dense class="bg-grey-2 text-primary">
        Selected: {{ selectedUser.name }}
      </q-banner>
    </div>
  </q-page>
</template>

<script>
import { filter } from 'lodash';

export default {
  name: 'UserTablePage',

  data() {
    return {
      users: [
                { id: 1, name: 'Alice', email: 'alice@example.com' },
                { id: 2, name: 'Bob', email: 'bob@example.com' },
                { id: 3, name: 'Charlie', email: 'charlie@example.com' }
            ],
      selectedUser: null,
      columns:  [
            {
              name: 'email',
              label: 'Email',
              align: 'left',
              field: 'email',
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
              name: 'position',
              label: 'Office - Position',
              align: 'left',
              field: 'position',
              format: (value) => { return value??'Inactive';},
              sortable: true
            },
            {
              name: 'action',
              label: 'Action',
              align: 'center',
            },
          ],
      filter:''
    };
  },

  methods: {
    editUser(user) {
      this.selectedUser = user;
      this.$q.notify({
        type: 'info',
        message: `Editing: ${user.name}`
      });
    },

    deleteUser(id) {
      this.users = this.users.filter(u => u.id !== id);
      this.$q.notify({
        type: 'negative',
        message: 'User deleted'
      });
    }
  }
};
</script>
