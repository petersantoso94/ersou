import Vue from "vue";
import VueRouter from "vue-router";
import Landing from "../views/Landing.vue";
import firebase from "firebase"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing
  },
  {
    path: "/home",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Login.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name === "Home" && (!firebase.auth().currentUser || !firebase.auth().currentUser!.uid)) {
    router.replace({ name: "Login" })
    return
  }
  if (to.name === "Login" && (firebase.auth().currentUser && firebase.auth().currentUser!.uid)) {
    router.replace({ name: "Home" })
    return
  }
  next();
});

export default router;
