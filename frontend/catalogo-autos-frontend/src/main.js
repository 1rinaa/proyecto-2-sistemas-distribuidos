// src/main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Font Awesome
import "@fortawesome/fontawesome-free/css/all.min.css";

Vue.config.productionTip = false;

// URL base de API (relativa en Netlify para que use las funciones serverless)
Vue.prototype.$apiUrl = process.env.VUE_APP_API_URL || "";

// Interceptor de respuesta para manejar expiración de token (401)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest =
        error.config &&
        error.config.url &&
        error.config.url.includes("/api/auth/login");

      if (!isLoginRequest) {
        // Token expirado o inválido: limpiar sesión y redirigir al login
        store.dispatch("logout");
        if (router.currentRoute.path !== "/login") {
          router.push({ path: "/login", query: { expired: "1" } });
        }
      }
    }
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
