// src/store/index.js
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

// Si se despliega en Netlify bajo el mismo dominio, la baseURL relativa "" funciona perfecto
const API_URL = process.env.VUE_APP_API_URL || "";
axios.defaults.baseURL = API_URL;

Vue.use(Vuex);

// Leer sesión previa de localStorage si existe
const savedToken = localStorage.getItem("token") || "";
let savedUser = null;
try {
  savedUser = JSON.parse(localStorage.getItem("user") || "null");
} catch (e) {
  savedUser = null;
}

// Configurar interceptor de solicitud para enviar el Bearer Token automáticamente
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const store = new Vuex.Store({
  state: {
    autos: [],
    fabricantes: [],
    categorias: [],
    loading: false,

    // Estado de Autenticación
    token: savedToken,
    user: savedUser,
    authLoading: false,
    authError: null,
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    authError: (state) => state.authError,
    authLoading: (state) => state.authLoading,
    getAutoById: (state) => (id) => {
      return state.autos.find((auto) => auto.id === id);
    },
  },
  mutations: {
    SET_AUTOS(state, autos) {
      state.autos = autos;
    },
    SET_FABRICANTES(state, fabricantes) {
      state.fabricantes = fabricantes;
    },
    SET_CATEGORIAS(state, categorias) {
      state.categorias = categorias;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    ADD_AUTO(state, auto) {
      state.autos.push(auto);
    },
    UPDATE_AUTO(state, auto) {
      const index = state.autos.findIndex((a) => a.id === auto.id);
      if (index !== -1) {
        Vue.set(state.autos, index, auto);
      }
    },
    DELETE_AUTO(state, id) {
      state.autos = state.autos.filter((a) => a.id !== id);
    },

    // Mutaciones de Autenticación
    SET_AUTH(state, { token, user }) {
      state.token = token;
      state.user = user;
      state.authError = null;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    CLEAR_AUTH(state) {
      state.token = "";
      state.user = null;
      state.authError = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    SET_AUTH_LOADING(state, loading) {
      state.authLoading = loading;
    },
    SET_AUTH_ERROR(state, error) {
      state.authError = error;
    },
  },
  actions: {
    // ==========================================
    // AUTENTICACIÓN
    // ==========================================
    async login({ commit }, credentials) {
      commit("SET_AUTH_LOADING", true);
      commit("SET_AUTH_ERROR", null);
      try {
        const response = await axios.post("/api/auth/login", credentials);
        const { token, user } = response.data;
        commit("SET_AUTH", { token, user });
        return response.data;
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          "Error al iniciar sesión. Verifique sus credenciales.";
        commit("SET_AUTH_ERROR", msg);
        throw new Error(msg);
      } finally {
        commit("SET_AUTH_LOADING", false);
      }
    },

    async register({ commit }, userData) {
      commit("SET_AUTH_LOADING", true);
      commit("SET_AUTH_ERROR", null);
      try {
        const response = await axios.post("/api/auth/register", userData);
        const { token, user } = response.data;
        commit("SET_AUTH", { token, user });
        return response.data;
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          "Error al registrar usuario.";
        commit("SET_AUTH_ERROR", msg);
        throw new Error(msg);
      } finally {
        commit("SET_AUTH_LOADING", false);
      }
    },

    logout({ commit }) {
      commit("CLEAR_AUTH");
    },

    async updateProfile({ commit }, profileData) {
      commit("SET_AUTH_LOADING", true);
      commit("SET_AUTH_ERROR", null);
      try {
        const response = await axios.put("/api/auth/profile", profileData);
        const { token, user } = response.data;
        commit("SET_AUTH", { token, user });
        return response.data;
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          "Error al actualizar el perfil.";
        commit("SET_AUTH_ERROR", msg);
        throw new Error(msg);
      } finally {
        commit("SET_AUTH_LOADING", false);
      }
    },

    // ==========================================
    // AUTOS
    // ==========================================
    async fetchAutos({ commit }) {
      commit("SET_LOADING", true);
      try {
        const response = await axios.get("/api/autos");
        commit("SET_AUTOS", response.data);
      } catch (error) {
        console.error("Error fetching autos:", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async createAuto({ dispatch }, auto) {
      try {
        const response = await axios.post("/api/autos", auto);
        await dispatch("fetchAutos");
        return response.data;
      } catch (error) {
        console.error("Error creating auto:", error);
        throw error;
      }
    },
    async updateAuto({ dispatch }, { id, auto }) {
      try {
        const response = await axios.put(`/api/autos/${id}`, auto);
        await dispatch("fetchAutos");
        return response.data;
      } catch (error) {
        console.error("Error updating auto:", error);
        throw error;
      }
    },
    async deleteAuto({ dispatch }, id) {
      try {
        await axios.delete(`/api/autos/${id}`);
        await dispatch("fetchAutos");
      } catch (error) {
        console.error("Error deleting auto:", error);
        throw error;
      }
    },

    // ==========================================
    // FABRICANTES
    // ==========================================
    async fetchFabricantes({ commit }) {
      try {
        const response = await axios.get("/api/fabricantes");
        commit("SET_FABRICANTES", response.data);
      } catch (error) {
        console.error("Error fetching fabricantes:", error);
      }
    },
    async createFabricante({ dispatch }, fabricante) {
      try {
        await axios.post("/api/fabricantes", fabricante);
        await dispatch("fetchFabricantes");
      } catch (error) {
        console.error("Error creating fabricante:", error);
        throw error;
      }
    },
    async updateFabricante({ dispatch }, { id, fabricante }) {
      try {
        await axios.put(`/api/fabricantes/${id}`, fabricante);
        await dispatch("fetchFabricantes");
      } catch (error) {
        console.error("Error updating fabricante:", error);
        throw error;
      }
    },
    async deleteFabricante({ dispatch }, id) {
      try {
        await axios.delete(`/api/fabricantes/${id}`);
        await dispatch("fetchFabricantes");
      } catch (error) {
        console.error("Error deleting fabricante:", error);
        throw error;
      }
    },

    // ==========================================
    // CATEGORÍAS
    // ==========================================
    async fetchCategorias({ commit }) {
      try {
        const response = await axios.get("/api/categorias");
        commit("SET_CATEGORIAS", response.data);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    },
    async createCategoria({ dispatch }, categoria) {
      try {
        await axios.post("/api/categorias", categoria);
        await dispatch("fetchCategorias");
      } catch (error) {
        console.error("Error creating categoria:", error);
        throw error;
      }
    },
    async updateCategoria({ dispatch }, { id, categoria }) {
      try {
        await axios.put(`/api/categorias/${id}`, categoria);
        await dispatch("fetchCategorias");
      } catch (error) {
        console.error("Error updating categoria:", error);
        throw error;
      }
    },
    async deleteCategoria({ dispatch }, id) {
      try {
        await axios.delete(`/api/categorias/${id}`);
        await dispatch("fetchCategorias");
      } catch (error) {
        console.error("Error deleting categoria:", error);
        throw error;
      }
    },
  },
});

export default store;
