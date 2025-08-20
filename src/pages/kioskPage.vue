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
                :unelevated="transactionType === 'Payment'" @click="setTransactionType('Payment')" class="col"
                icon="credit_card" />
              <q-btn label="Releasing" color="primary" :outline="transactionType !== 'Releasing'"
                :unelevated="transactionType === 'Releasing'" @click="setTransactionType('Releasing')" class="col"
                icon="outbox" />
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
                <q-item v-for="cat in categoryOptions" :key="cat.value" clickable @click="category = cat.value">
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

        <!-- RFID or Fullname Input  and Contact Number-->
        <div class="row q-col-gutter-md">
          <div class="col">
            <label class="q-mb-sm">Identification</label>
            <div class="row items-center q-col">
              <q-btn label="Tap RFID" color="secondary" @click="tapRFID" class="col-auto" />
              <span class="col-auto">or</span>
              <q-input filled v-model="fullname" placeholder="Encode Fullname" class="col" autofocus
                ref="identification" />
            </div>
          </div>
          <!-- <div class="col">
            <label class="q-mb-sm">Contact Number <i>(Optional)</i></label>
            <q-input filled v-model="contact_number" placeholder="Enter Email Address" class="col" />
          </div> -->
        </div>

        <!-- Action Buttons -->
        <div class="row justify-end q-gutter-sm">
          <div>
            <div class="text-h5 text-black text-bold">
              Transaction
            </div>
            <div class="text-subtitle1 text-white">
              {{ transactionType }} - {{ service }} - {{ category }}
            </div>
          </div>
          <q-space />
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
          <q-card-section class="text-h6 text-center">Special Lane Validation Required</q-card-section>
          <q-card-section class="text-h4 text-center">{{ category }}</q-card-section>
          <q-card-section>
            <!-- <p>Please tap the RFID of the attending personnel to validate.</p> -->
            <div class="flex flex-center q-mb-md">
              <q-spinner-radio color="primary" size="60px" style="transform: rotate(-45deg);align-self: center;" />
            </div>
            <q-input input-class="text-white" v-model="attendingPersonnelRFID"
              label="Please tap the RFID of the attending personnel to validate."
              :rules="[rules.requiredField, rules.noSpace]" autofocus />
          </q-card-section>

          <q-card-actions align="right">
            <!-- <q-btn label="Confirm" color="primary" type="submit" /> -->
            <q-btn label="Cancel" color="negative" type="button" @click="showDialog = false" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Tap RFID Dialog -->
    <q-dialog v-model="tapRFIDDialog">
      <q-card style="min-width: 400px">
        <q-form @submit="handleTapRFIDDialogClose" ref="rfidForm">
          <q-card-section class="text-h6">Identification Required</q-card-section>
          <div class="flex flex-center q-mb-md">
            <q-spinner-radio color="primary" size="60px" style="transform: rotate(-45deg);align-self: center;" />
          </div>
          <q-card-section>
            <q-input input-class="text-white" v-model="rfidData" label="Please tap your RFID."
              :rules="[rules.requiredField]" autofocus />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Confirm" color="primary" type="submit" />
            <q-btn label="Cancel" color="negative" type="button" @click="tapRFIDDialog = false" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <!-- Thermal Stub Template -->


  </q-page>
</template>

<script>
import api from 'src/API/api';
import { defineComponent } from 'vue';
import myDialog from 'src/plugins/myDialog';
import { date } from 'quasar';
import axios from 'axios';

export default defineComponent({
  name: 'KioskPage',
  data() {
    return {
      transactionType: 'Payment',
      service: '',
      category: 'Regular',
      fullname: '',
      contact_number: '',
      attendingPersonnelRFID: '',
      showDialog: false,
      tapRFIDDialog: false,
      rfidData: '',
      services: {
        Payment: [
          'Tuition', 'Miscellaneous', 'Library Fee', 'Laboratory Fee', 'Graduation Fee',
          'Entrance Exam Fee', 'ID Replacement', 'Athletic Fee', 'Medical Fee',
          'Development Fee', 'Late Enrollment Fee', 'Registration Fee', 'Exam Fee',
          'Uniform Fee', 'Insurance Fee'
        ],
        Releasing: [
          'Check Release', 'Reimbursement', 'Refund', 'Petty Cash', 'Allowance Release',
          'Travel Fund', 'Honorarium', 'Cash Advance', 'Payroll', 'Loan Release',
          'Grant Release', 'Other Releasing'
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
        { label: 'Persons with Infants or Toddlers', value: 'with Infant', icon: 'child_care', emoji: '👶', desc: 'Carrying children (usually under 2 years old)' },
        { label: 'Persons with Health Conditions', value: 'Health Condition', icon: 'local_hospital', emoji: '🏥', desc: 'Those needing immediate accommodation (e.g., chronic illness, medical emergencies)' },
        { label: 'Accompanied Dependents', value: 'Accompanied Dependent', icon: 'group', emoji: '👨‍👩‍👧‍👦', desc: 'e.g., caregivers accompanying a PWD or senior' }
      ],
      print_queueNumber: '',
      print_clientCategory: '',
      print_date: null,
      print_time: null,
      print_service_type: '',
      print_service_category: ''
    };
  },
  computed: {
    filteredServices() {
      return this.transactionType ? this.services[this.transactionType] : [];
    }
  },
  mounted() {
    this.getServices();
  },
  methods: {

    async getServices() {
      // Fetch services from an API or database if needed
      // For now, we use the hardcoded services in data()
      let fetchedServices = (await api.getAllServices()).data;
      let Payment = fetchedServices.filter(s => s.type === 'Payment').map(s => s.category);
      let Releasing = fetchedServices.filter(s => s.type === 'Releasing').map(s => s.category);
      this.services = { Payment, Releasing };

    },

    setTransactionType(type) {
      this.transactionType = type;
      this.service = '';
    },
    tapRFID() {
      this.tapRFIDDialog = true;
      this.$refs.rfidFullname.focus();
    },
    async handleSubmit() {
      if (!this.service) {
        myDialog.negative(this.$q, 'Incomplete', 'Please select a service.');
        return;
      }
      if (!this.fullname) {
        myDialog.negative(this.$q, 'Incomplete', 'Please provide identification.');
        //set fucos to fullname input
        this.$refs.identification.focus();
        return;
      }
      if (this.category !== 'Regular' && !this.attendingPersonnelRFID) {
        this.showDialog = true;
      } else {
        let x = {
          fullname: this.fullname,
          priority_level: this.category !== 'Regular' ? 'SL' : 'BL',
          ref_user_id: this.attendingPersonnelRFID || null,
          services_type: this.transactionType,
          services_category: this.service,
          sl_category: this.category,
        }
        try {
          let response = await api.createQueue(x);
          console.log('response', response);
          if (response.error) {
            myDialog.negative(this.$q, response.error.statusText ?? response.error.name, response.error.message);
          } else {
            console.log(response)
            this.print_queueNumber = response.data.queue_number;
            this.print_clientCategory = response.data.sl_category;
            this.print_date = response.data.date;
            this.print_time = response.data.time;
            this.print_service_type = response.data.services_type;
            this.print_service_category = response.data.services_category;

            myDialog.positive(this.$q, 'Created', 'Your Q-No: ' + response.data.queue_number).onOk(() => {
              this.printStub();
              this.handleClear();
              this.showDialog = false;
              this.tapRFIDDialog = false;
              this.rfidData = '';
            });

          }

        } catch (error) {
          console.log('error', error)
        }
      }
    },
    async printStub() {
      // String printerName = "EPSON TM-T82X Receipt"; // null -> default printer
      //         String queue = payload.getOrDefault("queue", "CBL 001");
      //         String category = payload.getOrDefault("category", "Senior Citizen");
      //         String service_type = payload.getOrDefault("service_type", "Payment");
      //         String service_category = payload.getOrDefault("service_category", "Cashier");
      //         String message = payload.getOrDefault("message", "Please proceed to the counter when your number is called.");
      //         String datetime = payload.getOrDefault("datetime", "08/08/2025, 10:35 AM");
      // send to localhost:8080/api/print using await axios.post method
      const payload = {
        queue: this.print_queueNumber,
        category: this.print_clientCategory,
        service_type: this.print_service_type,
        service_category: this.print_service_category,
        datetime: date.formatDate(this.print_date, 'MM/DD/YYYY') + ', ' + this.print_time,
        message: 'Please proceed to the counter when your number  is called.'
      };


      try {
        const printResponse = await axios.post('http://localhost:8080/api/print', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (printResponse.status === 200) {
          console.log('Print successful:', printResponse.data);
          // Optionally, show a success message or handle the response
          myDialog.positive(this.$q, 'Print Success', 'Queue stub printed successfully.');
        } else {
          console.error('Print failed:', printResponse.statusText);
          myDialog.negative(this.$q, 'Print Error', 'Failed to print the queue stub.');
        }
      } catch (error) {
        console.error('Error printing queue stub:', error);
        myDialog.negative(this.$q, 'Print Error', 'An error occurred while printing the queue stub.');
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
    },
    handleTapRFIDDialogClose() {
      this.tapRFIDDialog = false;
    }
  },
});
</script>

<style scoped>
.kiosk-page {
  padding: 20px;
}

.print-stub {
  width: 260px;
  padding: 10px;
  font-family: monospace;
  border: 1px dashed #000;
  display: none;
}

.center {
  text-align: center;
  margin: 4px 0;
}

.bold {
  font-weight: bold;
}

.large {
  font-size: 18px;
}

.xlarge {
  font-size: 28px;
  font-weight: bold;
}

.medium {
  font-size: 16px;
}

.small {
  font-size: 12px;
}

@media print {
  .print-stub {
    display: block;
  }
}
</style>
