import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Credential from "../views/Home.vue";
import DMV from '../views/DMV.vue';
import SSOLogin from "../views/SSOLogin.vue";
import Health from "../views/HealthCredentialer.vue";
import Crime from "../views/CrimeCredentialer.vue";
import BackgroundCheck from '../views/BackgroundChecker.vue';
import { routeGuard } from "../helpers/RouteGaurd";

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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/health",
    name: "Health",
    component: Health,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/crime",
    name: "Crime",
    component: Crime,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/background",
    name: "Background Check",
    component: BackgroundCheck,
    meta: {
      requiresAuth: true,
    },
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(routeGuard);

export default router;
