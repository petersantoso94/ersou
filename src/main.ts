import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import * as firebase from 'firebase/app';
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import store from "./store"

Vue.config.productionTip = false
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBOPNzr2Bn3YyFWxxIkujRDBvRpUlzjSbo",
  authDomain: "ersou-7f810.firebaseapp.com",
  databaseURL: "https://ersou-7f810.firebaseio.com",
  projectId: "ersou-7f810",
  storageBucket: "ersou-7f810.appspot.com",
  messagingSenderId: "511732216816",
  appId: "1:511732216816:web:8b6249a4fa746c7e2da335",
  measurementId: "G-89M88808X6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      unsubscribe();
      store.dispatch("User/fetchUser", user);
      resolve(user);
    }, reject);
  })
};

export const db = firebase.firestore()
export const storageRef = firebase.storage().ref()

Vue.use(require('vue-moment'))

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
