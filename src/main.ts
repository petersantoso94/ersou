import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import * as firebase from "firebase";

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

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
