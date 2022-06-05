import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Credential from "../views/Home.vue";
import SSOLogin from "../views/SSOLogin.vue";
<<<<<<< HEAD
import DMV from "../views/DMV.vue";
import Health from "../views/HealthCredentialer.vue"

const { VUE_APP_CONTEXT_NAME } = process.env;
=======
import { routeGuard } from "../helpers/RouteGaurd";
>>>>>>> 7621129185d5da92bfdaf99a44a3b0652804676d

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Credential,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/connect",
    name: "Connect",
    component: SSOLogin,
  },
  {
    path: "/dmv",
    name: "DMV",
    component: DMV,
  },
  {
    path: "/health",
    name: "Health",
    component: Health,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(routeGuard);

export default router;
