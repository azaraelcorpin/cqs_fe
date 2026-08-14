
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import { useCookies } from "vue3-cookies";
import axios from 'axios'

const { cookies } = useCookies();
const api_url = process.env.VUE_APP_API_URL;
export default {
  async getAuthorization(_data) {
    return {};
    //  if(!_data){
    //   if(!cookies.get('_UID_')){
    //         cookies.remove('_UID_');
    //         localStorage.removeItem('routeParams');
    //         Swal.fire({
    //           title: 'The Session Timed Out',
    //           text: 'Please log in again',
    //           icon: 'error',
    //           confirmButtonText: 'OK'
    //         }).then((result) => {
    //           if (result.isConfirmed) {
    //             return
    //           }
    //         });
    //     return null;
    //   }
    // }
    //    let key = process.env.VUE_APP_PCR_KEY;
    //   key = CryptoJS.enc.Utf8.parse(key); // replace with your own secret key
    //   let iv = CryptoJS.lib.WordArray.random(16); // generate a random 16-byte IV
    //   const jsonData = JSON.stringify( _data??(cookies.get('_UID_')));
    //   const encryptedData = CryptoJS.AES.encrypt(jsonData, key,  {iv} ).toString();
    //   return {
    //     headers:{
    //       'X-IV': iv.toString(CryptoJS.enc.Base64),
    //       Authorization:'Bearer '+ encryptedData,
    //     }
    //   }
  },

  validateResponse(error) {
    let response = error.response
    console.log('res', response.data.message)
    if (response) {
      if (response.data && response.data.statusCode === '401') {
        localStorage.removeItem('routeParams');
        Swal.fire({
          title: 'Unauthorized',
          text: response.data.message + ' Please log in again',
          icon: 'error',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          timer: 5000,
        })
        setTimeout(function () {
          cookies.remove('_UID_');
        }, 1000); // 5000 milliseconds = 5 seconds
      }
    } else {
      Swal.fire({
        title: error.name,
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false,
      })
    }

  },

  //log in
  async Login(username, password) {
    var url = api_url + '/auth/login'
    const config = await this.getAuthorization();
    const body = {
      username: username,
      password: password
    }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('api', response);
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response }
    }
  },

  ///// test
  async test(userEmail) {
    var url = api_url + '/user/all'
    const config = await this.getAuthorization(userEmail);
    const body = {}
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      this.validateResponse(error.response)
      return { error: error.response }
    }
  },

  ///// generate session Id
  async generateSessionId(userEmail) {
    var url = api_url + '/user/getSessionId'
    const config = await this.getAuthorization(userEmail);
    const body = {}
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('generatedSessionId Error');
        return { error: response }
      }
    } catch (error) {
      console.log('error', error.message);
      return { error: error }
    }
  },

  ///// new User
  async newUser(param) {
    var url = api_url + '/admin/addUser'
    const config = await this.getAuthorization();
    const body = param;
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 201) {
        return response.data;
      } else {
        console.log('newUser Error');
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response }
    }
  },

  //// update User
  async updateUser(param) {
    var url = api_url + '/admin/updateUser'
    const config = await this.getAuthorization();
    const body = param
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('Update User Error');
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response }
    }
  },

  ///// Delete User
  async deleteUser(param) {
    var url = api_url + '/admin/removeUser'
    const config = await this.getAuthorization();
    const body = param
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('newUser Error');
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response }
    }
  },

  /// reset password to username
  async resetPasswordToUsername(param) {
    var url = api_url + '/auth/resetpw';
    const config = await this.getAuthorization();
    const body = param;
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('resetPasswordToUsername Error');
        return { error: response };
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response };
    }
  },

  //update password
  async updatePassword(user, old_password, new_password) {
    var url = api_url + '/auth/updatepw';
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      oldPassword: old_password,
      newPassword: new_password
    }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('updatePassword Error');
        return { error: response };
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response };
    }
  },

  //update username
  async updateUsername(user, new_username, password) {
    var url = api_url + '/auth/updateUsername';
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      newUsername: new_username,
      password: password
    }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('updateUsername Error');
        return { error: response };
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response };
    }
  },


  ///// getAllUser
  async getAllUser() {
    var url = api_url + '/admin/allUsers'
    const config = await this.getAuthorization();
    const body = {}
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  ///// getQueueList
  async getQueueList(param) {
    var url = api_url + '/queues/filter'
    const config = await this.getAuthorization();
    const body = param ?? { date: new Date().toISOString().split('T')[0] }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  //// get today user current serving
  async getTodayCurrentServing(user, services_type) {
    var url = api_url + '/queues/today-servingByUser'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      services_type: services_type ?? 'Payment'
    }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  //// get today current serving and called
  async getTodayCurrentServingAndCalled() {
    var url = api_url + '/queues/today-currentServingAndCalled'
    const config = await this.getAuthorization();
    const body = {}
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  ///// getQueueLogs
  async getQueueLogs(param) {
    var url = api_url + '/queues/filter-logs'
    const config = await this.getAuthorization();
    const body = param ?? { date: new Date().toISOString().split('T')[0] }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  async getHistory(param) {
    var url = api_url + '/queues/user-today-logs'
    const config = await this.getAuthorization();
    const body = param
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  async getWaitingToday(param) {
    var url = api_url + '/queues/waiting-today'
    const config = await this.getAuthorization();
    const body = { services_type: param ?? 'Payment' }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  async getCalledByUser(param) {
    var url = api_url + '/queues/calledByUser-today'
    const config = await this.getAuthorization();
    const body = param
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  async getCallNext(user, services_type, queue_id) {
    var url = api_url + '/queues/next'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      services_type: services_type ?? 'Payment',
      queue_id: queue_id || null,
    }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  async getAllServices() {
    var url = api_url + '/admin/services'
    const config = await this.getAuthorization();
    const body = {}
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log(response);
        return { error: response }
      }
    } catch (error) {
      console.log(error);
      this.validateResponse(error)
      return { error: error.response } ?? error
    }
  },

  async addService(param) {
    var url = api_url + '/admin/services/new'
    const config = await this.getAuthorization();
    const body = param
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 201) {
        return response.data;
      } else {
        console.log('addService Error');
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response }
    }
  },

  async updateService(param) {
    var url = api_url + '/admin/services/update'
    const config = await this.getAuthorization();
    const body = param
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('updateService Error');
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response }
    }
  },

  //deleteService
  async deleteService(param) {
    var url = api_url + '/admin/services/delete'
    const config = await this.getAuthorization();
    const body = param
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status == 200) {
        return response.data;
      } else {
        console.log('deleteService Error');
        return { error: response }
      }
    } catch (error) {
      console.log(error.response);
      return { error: error.response }
    }
  },

  //api createQueue
  async createQueue(param) {
    var url = api_url + '/queues/create'
    const config = await this.getAuthorization();
    const body = param;
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 201) {
        return response.data;
      } else {
        console.log('createQueue Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //api skip queue
  async skipQueue(user, queue_id) {
    var url = api_url + '/queues/skip'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      queue_id: queue_id,
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('skipQueue Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //get all skipped today
  async getAllSkippedToday(services_type) {
    var url = api_url + '/queues/skipped-today'
    const config = await this.getAuthorization();
    const body = {
      services_type: services_type ?? 'Payment',
    }
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('getAllSkippedToday Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //api served queue
  async servedQueue(user, queue_id) {
    var url = api_url + '/queues/served'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      queue_id: queue_id,
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('servedQueue Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //api cancel queue
  async cancelQueue(user, queue_id) {
    var url = api_url + '/queues/cancel'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      queue_id: queue_id,
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('cancelQueue Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //api set cashierWindowNumber
  async setCashierWindowNumber(user, window_number) {
    var url = api_url + '/cashier/setWindow'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      window_number: window_number,
    };
    try {
      const response = await axios.post(url, body, config);

      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('setCashierWindowNumber Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //api servingQueue
  async servingQueue(user, queue_id) {
    var url = api_url + '/queues/serving'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
      queue_id: queue_id,
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('servingQueue Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //api send notification and sound to overhead display
  async notifyOverheadDisplay(message) {
    console.log('notifyOverheadDisplay', message);
    var url = api_url + '/queues/speak'
    const config = await this.getAuthorization();
    const body = {
      message: message
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('notifyOverheadDisplay Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  // api for reload the overhead display
  async reloadOverheadDisplay() {
    var url = api_url + '/queues/reload-display'
    const config = await this.getAuthorization();
    const body = {};
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('reloadOverheadDisplay Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  // api for cashierlogout
  async cashierLogout(user) {
    var url = api_url + '/cashier/logout'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('cashierLogout Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  // api for cashier on break
  async cashierOnBreak(user) {
    var url = api_url + '/cashier/onBreak'
    const config = await this.getAuthorization();
    const body = {
      user_id: user.user_id,
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('cashierOnBreak Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  // get all cashier currently logged in
  async getAllCashierLoggedIn() {
    var url = api_url + '/cashier/logged-in'
    const config = await this.getAuthorization();
    const body = {};
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('getAllCashierLoggedIn Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  },

  //getClientByRFID
  async getClientByRFID(rfid) {
    var url = api_url + '/queues/client-by-rfid'
    const config = await this.getAuthorization();
    const body = {
      rfid: rfid,
    };
    try {
      const response = await axios.post(url, body, config);
      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        console.log('getClientByRFID Error');
        return { error: response }
      }
    } catch (error) {
      console.log('api', error);
      return { error: error.response ?? error }
    }
  }
}
