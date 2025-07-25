<template>
    <q-page class="q-pa-md kiosk-page" style="height: 100vh; overflow-y: auto;">
        <q-card class="q-pa-lg bg-secondary text-white" style="height: 100%;">
            <q-card-section>
                <div class="bg-secondary text-white q-pa-xl q-mb-md" style="padding-top: 20px;padding-bottom: 20px;">
                    <div class="text-h5 q-mb-md text-center">Cashier Queueing Kiosk</div>

                    <!-- 1. Transaction Type Buttons -->
                    <div class="q-mb-md">
                        <div class="row q-col-gutter-md">
                            <q-btn label="Payment" color="primary" :outline="transactionType !== 'Payment'"
                                :unelevated="transactionType === 'Payment'" @click="setTransactionType('Payment')"
                                class="col" icon="credit_card" />
                            <q-btn label="Disbursement" color="primary" :outline="transactionType !== 'Disbursement'"
                                :unelevated="transactionType === 'Disbursement'"
                                @click="setTransactionType('Disbursement')" class="col" icon="outbox" />
                        </div>
                    </div>
                </div>

                <!-- 2 & 3. Service and Category Selection -->
                <div class="q-mb-md">
                    <div class="row q-col-gutter-md">
                        <!-- Service List -->
                        <div class="col">
                            <label class="q-mb-sm">Service</label>
                            <q-list bordered style="max-height: 500px; overflow-y: auto;">
                                <q-item v-for="srv in filteredServices" :key="srv" clickable @click="service = srv">
                                    <q-item-section>
                                        <q-item-label :class="{ 'text-bold text-black': service === srv }">
                                            {{ srv }}
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>

                        <!-- Category List -->
                        <div class="col">
                            <label class="q-mb-sm">Category</label>
                            <q-list bordered>
                                <q-item v-for="cat in categoryOptions" :key="cat.value" clickable
                                    @click="category = cat.value">
                                    <q-item-section avatar>
                                        <q-icon :name="cat.icon" />
                                        <span style="font-size: 1.5em; margin-left: 4px;">{{ cat.emoji }}</span>
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label :class="{ 'text-bold text-black': category === cat.value }">
                                            {{ cat.label }}
                                        </q-item-label>
                                        <q-item-label caption>{{ cat.desc }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                    </div>
                </div>

                <!-- RFID or Fullname Input -->
                <div class="q-mb-md">
                    <label class="q-mb-sm">Identification</label>
                    <div class="row items-center q-col-gutter-md">
                        <q-btn label="Tap RFID" color="secondary" @click="tapRFID" class="col-auto" />
                        <span class="col-auto">or</span>
                        <q-input filled v-model="fullname" placeholder="Encode Fullname" class="col" autofocus />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="row justify-end q-gutter-sm">
                    <q-btn label="Submit" color="primary" @click="handleSubmit" />
                    <q-btn label="Clear" color="warning" @click="handleClear" />
                    <q-btn label="Cancel" color="negative" @click="handleCancel" />
                </div>
            </q-card-section>
        </q-card>

        <!-- SPL Validation Dialog -->
        <q-dialog v-model="showDialog" persistent>
            <q-card style="min-width: 400px">
                <q-form @submit="handleSubmit" ref="splForm">
                    <q-card-section class="text-h6">SPL Validation Required</q-card-section>

                    <q-card-section>
                        <p>Please tap the RFID of the attending personnel to validate.</p>
                        <q-input v-model="attendingPersonnelRFID" label="Attending Personnel RFID"
                            :rules="[rules.requiredField, rules.noSpace]" dense outlined autofocus />
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn label="Confirm" color="primary" type="submit" />
                        <q-btn label="Cancel" color="negative" type="button" @click="showDialog = false" />
                    </q-card-actions>
                </q-form>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script>
export default {
    name: 'KioskPage',
    data() {
        return {
            transactionType: 'Payment',
            service: '',
            category: 'Regular',
            fullname: '',
            attendingPersonnelRFID: '',
            showDialog: false,
            services: {
                Payment: [
                    'Tuition', 'Miscellaneous', 'Library Fee', 'Laboratory Fee', 'Graduation Fee',
                    'Entrance Exam Fee', 'ID Replacement', 'Athletic Fee', 'Medical Fee',
                    'Development Fee', 'Late Enrollment Fee', 'Registration Fee', 'Exam Fee',
                    'Uniform Fee', 'Insurance Fee'
                ],
                Disbursement: [
                    'Check Release', 'Reimbursement', 'Refund', 'Petty Cash', 'Allowance Release',
                    'Travel Fund', 'Honorarium', 'Cash Advance', 'Payroll', 'Loan Release',
                    'Grant Release', 'Other Disbursement'
                ]
            },
            rules: {
                noSpace: v => (!v || !v.includes(' ')) || 'No space allowed.',
                requiredField: v => !!v || 'Required field.'
            },
            categoryOptions: [
                { label: 'Regular', value: 'Regular', icon: 'person', emoji: '🧑', desc: 'General queue for all clients' },
                { label: 'Senior Citizens', value: 'Senior', icon: 'elderly', emoji: '👵', desc: 'Persons aged 60 and above (RA 9994)' },
                { label: 'Persons with Disability (PWD)', value: 'PWD', icon: 'accessible', emoji: '♿', desc: 'With valid PWD ID (RA 9442)' },
                { label: 'Pregnant Women', value: 'Pregnant', icon: 'pregnant_woman', emoji: '🤰', desc: 'Visibly pregnant or with certification' },
                { label: 'Persons with Infants or Toddlers', value: 'Infant', icon: 'child_care', emoji: '👶', desc: 'Carrying children (usually under 2 years old)' },
                { label: 'Persons with Health Conditions', value: 'Health', icon: 'local_hospital', emoji: '🏥', desc: 'Those needing immediate accommodation (e.g., chronic illness, medical emergencies)' },
                { label: 'Accompanied Dependents', value: 'Dependent', icon: 'group', emoji: '👨‍👩‍👧‍👦', desc: 'e.g., caregivers accompanying a PWD or senior' }
            ]
        };
    },
    computed: {
        filteredServices() {
            return this.transactionType ? this.services[this.transactionType] : [];
        }
    },
    methods: {
        setTransactionType(type) {
            this.transactionType = type;
            this.service = '';
        },
        tapRFID() {
            this.fullname = 'RFID-123456'; // Replace with actual RFID logic
        },
        handleSubmit() {
            if (this.category !== 'Regular' && !this.attendingPersonnelRFID) {
                this.showDialog = true;
            } else {
                alert('Form submitted!');
            }
        },
        handleSPLConfirm() {
            if (this.attendingPersonnelRFID) {
                this.showDialog = false;
                alert('SPL validated and form submitted!');
            }
        },
        handleSPLCancel() {
            this.attendingPersonnelRFID = '';
            this.showDialog = false;
        },
        handleClear() {
            this.transactionType = 'Payment';
            this.service = '';
            this.category = 'Regular';
            this.fullname = '';
            this.attendingPersonnelRFID = '';
        },
        handleCancel() {
            this.handleClear();
        }
    },
};
</script>

<style scoped>
.kiosk-page {
    padding: 20px;
}
</style>
