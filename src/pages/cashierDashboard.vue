<template>
    <q-page class="q-pa-md">

        <!-- Header -->
        <div class="row justify-between items-center q-mb-md">
            <div>
                <q-icon name="account_circle" size="xl" />
                <strong style="font-size: xx-large;">{{ user.fullname ?? 'ds' }}</strong>
            </div>
            <div style="font-size: 40px;"><strong style="cursor: pointer;">WINDOW - {{ user.window_number ?? ''
                    }}<q-tooltip>Click to update Window Number</q-tooltip></strong></div>
            <q-btn icon="logout" label="Logout" color="negative" @click="logout" />
        </div>

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
                                        <q-btn icon="campaign" color="primary" dense @click="callSpecific(props.row)" />
                                        <q-tooltip>call attention</q-tooltip>
                                    </q-td>
                                </template>
                            </q-table>
                        </q-tab-panel>

                        <!-- History Tab -->
                        <q-tab-panel name="called">
                            <q-table :rows="called" :columns="columns" row-key="queue_id" flat dense bordered>
                                <template v-slot:body-cell-action="props">
                                    <q-td align="right">
                                        <q-btn icon="play_arrow" color="primary" dense
                                            @click="callSpecific(props.row)"><q-tooltip>
                                                serving</q-tooltip></q-btn>
                                        <q-btn icon="arrow_forward" color="primary" dense
                                            @click="callSpecific(props.row)"><q-tooltip>
                                                skip</q-tooltip></q-btn>
                                        <q-btn icon="close" color="primary" dense
                                            @click="callSpecific(props.row)"><q-tooltip>
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
                                        <div class="text-h5">{{ item.queue_number }} <q-icon name="campaign" /></div>
                                        <div>Priority: {{ item.priority_level }}</div>
                                        <q-btn color="primary" label="Serve" @click="callSpecific(item)"
                                            class="q-mr-sm" />
                                        <q-btn color="positive" label="Skip" @click="callSpecific(item)"
                                            class="q-mr-sm" />
                                        <q-btn color="warning" label="Cancel" @click="callSpecific(item)" />
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
                                <div class="text-h1 q-mb-md "><strong>{{ current.queue_number }}</strong></div>
                                <div class="text-subtitle2 q-mb-md" v-if="current.priority_level === 'SL'">Special
                                    Priority Lane
                                </div>
                                <div class="text-subtitle2 q-mb-md">Priority: {{ current.priority_level }}</div>
                                <div class="row q-col-gutter-md">
                                    <q-btn color="positive"
                                        @click="() => { this.current.status = 'served'; this.skipped.push(this.current); this.current = null }"
                                        class="q-mr-sm">(F10) <br>Served
                                    </q-btn>
                                    <q-btn color="warning" @click="skipClient" class="q-mr-sm">
                                        (F11) <br> Skip
                                    </q-btn>
                                    <q-btn color="negative" @click="callSpecific(current)">
                                        (F12) <br>Cancel
                                    </q-btn>
                                </div>
                            </div>
                        </q-card>
                    </div>
                    <div v-if="!current">
                        <q-btn class="q-mr-sm" color="green" label="Serve" @click="serveNext()" />
                        <q-btn class="q-mr-sm" color="blue" label="Call Next" @click="callNext()" />
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
                            <q-table :rows="skipped" :columns="columnsSkipped" row-key="queue_id" flat dense bordered>
                                <template v-slot:body-cell-action="props">
                                    <q-btn icon="refresh" color="info" dense @click="recall(props.row)" />
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
import axios from 'axios'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { useCookies } from 'vue3-cookies'
import api from 'src/API/api'


export default defineComponent({
    name: 'CashierDashboard',
    setup() {
        const $q = useQuasar()
        const { cookies } = useCookies();
        const user = cookies.get('_UID_')
        return {
            $q,
            cookies,
            user
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
            history: [],
            columns: [
                { name: 'queue_number', label: 'Queue #', field: 'queue_number' },
                { name: 'priority_level', label: 'Priority', field: 'priority_level' },
                { name: 'action', label: 'Action', field: 'action', sortable: false }
            ],
            columnsSkipped: [
                { name: 'queue_number', label: 'Queue #', field: 'queue_number' },
                { name: 'priority_level', label: 'Priority', field: 'priority_level' },
                { name: 'skipped_at', label: 'Skipped At', field: 'skipped_at' },
                { name: 'action', label: 'Action', field: 'action', sortable: false }
            ],
            columnsHistory: [
                { name: 'queue_number', label: 'Queue #', field: 'queue_number' },
                { name: 'priority_level', label: 'Priority', field: 'priority_level' },
                { name: 'action', label: 'Status', field: 'action' },
                { name: 'served_at', label: 'Served At', field: 'time' }
            ],
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
            this.current.status = 'serving'
            this.called = this.called.filter(item => item.status === 'called')
            // const { data } = await axios.post('/api/cashier/next')
            // this.current = data || null
        },

        async callNext() {
            await api.getCallNext(this.user)
            this.refreshAll();
        },

        async markServed() {
            if (!this.current) return
            await axios.post('/api/cashier/serve', { queue_id: this.current.queue_id })
            this.current = null
            this.refreshAll()
        },
        async skipClient() {
            if (!this.current) return
            await axios.post('/api/cashier/skip', { queue_id: this.current.queue_id })
            this.current = null
            this.refreshAll()
        },
        async callSpecific(row) {
            await axios.post('/api/cashier/next', { specific_id: row.queue_id })
            this.refreshAll()
        },
        async recall(row) {
            await axios.post('/api/cashier/recall', { queue_id: row.queue_id })
            this.refreshAll()
        },
        async refreshAll() {
            this.waiting = (await api.getWaitingToday('Payment')).data
            this.history = (await api.getHistory(this.user)).data
            this.called = (await api.getCalledByUser(this.user)).data
            // this.skipped = (await axios.get('/api/cashier/history')).data
        },
        logout() {
            this.cookies.remove('_UID_');
            this.$q.notify({ type: 'info', message: 'Logged out' })
            this.$router.push({ name: 'login' });
        }
    },

    mounted() {
        this.refreshAll()
        console.log('user', this.user.role)
        window.addEventListener('keydown', this.handleKey)
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
