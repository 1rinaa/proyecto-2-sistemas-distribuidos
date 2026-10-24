// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AutosView from "../views/AutosView.vue";
import FabricantesView from "../views/FabricantesView.vue";
import CategoriasView from "../views/CategoriasView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ProfileView from "../views/ProfileView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/autos",
    name: "Autos",
    component: AutosView,
  },
  {
    path: "/fabricantes",
    name: "Fabricantes",
    component: FabricantesView,
  },
  {
    path: "/categorias",
    name: "Categorias",
    component: CategoriasView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
