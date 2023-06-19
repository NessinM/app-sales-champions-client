import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store";

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/View_auth_login.vue"),
      meta: {
        isRequiredAuth: false,
        title: "Iniciar sesión",
      },
    },
    {
      path: "/forgot-password-recovery",
      name: "forgot-password-recovery",
      component: () => import("@/views/View_auth_forgot_password.vue"),
      meta: {
        isRequiredAuth: false,
        title: "¿Olvidaste tu contraseña?",
      },
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/View_dashboard.vue"),
      meta: {
        isRequiredAuth: true,
        title: "Dashboard",
      },
    },
    {
      path: "/customer-manager",
      name: "customer-manager",
      component: () => import("@/views/View_customer_manager.vue"),
      meta: {
        isRequiredAuth: true,
        title: "Administrador de clientes",
      },
    },
    {
      path: "/event-manager",
      name: "event-manager",
      component: () => import("@/views/View_app_event_manager.vue"),
      meta: {
        isRequiredAuth: true,
        title: "Programacion de eventos",
      },
    },
    {
      path: "/seguimiento-de-usuarios",
      name: "seguimiento-de-usuarios",
      component: () => import("@/views/View_app_seguimiento_de_usuarios.vue"),
      meta: {
        isRequiredAuth: true,
        title: "Administrador de clientes",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "page-not-found",
      component: () => import("@/views/View_app_error_page_404.vue"),
      meta: {
        isRequiredAuth: true,
        title: "Pagina no encontrada",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { getSessionUserLogged } = useAuthStore();
  if (to.meta.isRequiredAuth && !getSessionUserLogged) return next("/login");

  if (
    !to.meta.isRequiredAuth &&
    getSessionUserLogged &&
    (to.name === "login" || to.name === "forgot-password-recovery")
  )
    return next("/");

  next();
});

router.afterEach((to) => {
  document.title = `${to.meta.title}` || "";
});

export default router;
