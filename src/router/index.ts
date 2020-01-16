import Vue from "vue";
import VueRouter from "vue-router";
// import Landing from "../views/Landing.vue";
import { getCurrentUser } from "@/main"
import store from "@/store"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Landing",
    component: () => import(/* webpackChunkName: "landing" */ "../views/Landing.vue" /* webpackPreload: true */)
  },
  {
    path: "/home",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue" /* webpackPreload: true */)
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
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.name === "Home" && (!store.getters["User/User"].loggedIn || !await getCurrentUser())) {
    router.replace({ name: "Login" })
    return
  }
  if (to.name === "Login" && (store.getters["User/User"].loggedIn || await getCurrentUser())) {
    router.replace({ name: "Home" })
    return
  }
  next();
});

export default router;
