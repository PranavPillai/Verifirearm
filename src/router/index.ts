import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Credential from "../views/Home.vue";
import SSOLogin from "../views/SSOLogin.vue";
import Health from "../views/HealthCredentialer.vue";
import Crime from "../views/CrimeCredentialer.vue";
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
    path: "/health",
    name: "Health",
    component: Health,
  },
  {
    path: "/connect",
    name: "Connect",
    component: Crime,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(routeGuard);

export default router;
