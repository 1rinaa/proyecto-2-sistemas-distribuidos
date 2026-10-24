<template>
  <div id="app">
    <!-- Navbar Premium con línea de luz -->
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <div class="brand-wrapper">
            <div class="brand-icon">
              <svg viewBox="0 0 100 100" class="speedometer-icon">
                <path
                  d="M 15 70 A 40 40 0 0 1 85 70"
                  fill="none"
                  stroke="#ffd700"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="25"
                  stroke="#ffd700"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  class="needle"
                />
                <circle cx="50" cy="50" r="3" fill="#ffd700" />
                <!-- Más ticks -->
                <line
                  x1="20"
                  y1="65"
                  x2="23"
                  y2="58"
                  stroke="#ffd700"
                  stroke-width="1.5"
                />
                <line
                  x1="30"
                  y1="48"
                  x2="35"
                  y2="44"
                  stroke="#ffd700"
                  stroke-width="1.5"
                />
                <line
                  x1="65"
                  y1="44"
                  x2="70"
                  y2="48"
                  stroke="#ffd700"
                  stroke-width="1.5"
                />
                <line
                  x1="77"
                  y1="58"
                  x2="80"
                  y2="65"
                  stroke="#ffd700"
                  stroke-width="1.5"
                />
              </svg>
            </div>
          </div>
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/autos">
                <i class="fas fa-gem"></i> Autos
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/fabricantes">
                <i class="fas fa-compass"></i> Marcas
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/categorias">
                <i class="fas fa-sliders-h"></i> Categorías
              </router-link>
            </li>

            <!-- Elementos de Autenticación con JWT -->
            <template v-if="isAuthenticated">
              <li class="nav-item ms-lg-3 my-2 my-lg-0">
                <router-link
                  to="/profile"
                  class="user-pill text-decoration-none"
                  title="Ver y editar mi perfil"
                >
                  <i class="fas fa-user-circle text-gold me-1"></i>
                  <span>{{
                    currentUser ? currentUser.nombre : "Usuario"
                  }}</span>
                  <i class="fas fa-cog ms-2 text-muted-gold"></i>
                </router-link>
              </li>
              <li class="nav-item ms-lg-2">
                <button
                  class="btn-logout"
                  @click="handleLogout"
                  title="Cerrar Sesión"
                >
                  <i class="fas fa-sign-out-alt me-1"></i> Salir
                </button>
              </li>
            </template>
            <template v-else>
              <li class="nav-item ms-lg-3">
                <router-link class="btn-nav-login" to="/login">
                  <i class="fas fa-sign-in-alt me-1"></i> Ingresar
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <!-- Línea de luz amarilla difuminada -->
      <div class="navbar-glow"></div>
    </nav>

    <main class="main-content">
      <router-view />
      <SnackbarToast />
    </main>

    <!-- Footer completo -->
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5 class="footer-brand">
              <i class="fas fa-tachometer-alt text-gold"></i>
              Auto<span class="text-gold">Elite</span>
            </h5>
            <p class="footer-description">
              Catálogo de autos superdeportivos. Velocidad y exclusividad en un
              solo lugar.
            </p>
          </div>
          <div class="col-md-4 mb-3">
            <h6 class="footer-title">Universidad</h6>
            <p class="footer-text">
              <i class="fas fa-university"></i> Universidad Nacional de Costa
              Rica<br />
              <i class="fas fa-user-graduate"></i> Irina Rivera Chavarría<br />
              <i class="fas fa-code"></i> Sistemas Distribuidos
            </p>
          </div>
          <div class="col-md-4 mb-3">
            <h6 class="footer-title">Enlaces</h6>
            <ul class="footer-links">
              <li><router-link to="/autos">Autos</router-link></li>
              <li><router-link to="/fabricantes">Marcas</router-link></li>
              <li><router-link to="/categorias">Categorías</router-link></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="mb-0">© 2024 AutoElite — Todos los derechos reservados</p>
          <small class="text-muted">
            Universidad Nacional de Costa Rica · Sistemas Distribuidos
          </small>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import SnackbarToast from "@/components/Common/SnackbarToast.vue";

export default {
  name: "App",
  components: {
    SnackbarToast,
  },
  computed: {
    ...mapGetters(["isAuthenticated", "currentUser"]),
  },
  methods: {
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout();
      this.$toast.info("Has cerrado sesión correctamente.");
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap");

// Variables
$gold: #ffd700;
$gold-dark: #c9a800;
$dark-bg: #0a0a0a;

/* ===== FORZAR SIN SCROLL HORIZONTAL ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  overflow-x: hidden !important;
  width: 100% !important;
  max-width: 100% !important;
}

body {
  overflow-x: hidden !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #0a0a0a !important;
}

#app {
  overflow-x: hidden !important;
  width: 100% !important;
  max-width: 100% !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
}

// ===== NAVBAR CON LÍNEA DE LUZ =====
.navbar {
  background: rgba(10, 10, 10, 0.95) !important;
  backdrop-filter: blur(20px);
  padding: 12px 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  position: relative;
}

/* Línea de luz amarilla difuminada */
.navbar-glow {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.05) 20%,
    rgba(255, 215, 0, 0.6) 40%,
    rgba(255, 215, 0, 0.8) 50%,
    rgba(255, 215, 0, 0.6) 60%,
    rgba(255, 215, 0, 0.05) 80%,
    transparent 100%
  );
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.3), 0 0 80px rgba(255, 215, 0, 0.1);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.05);
  }
}

// ===== LOGO VELOCÍMETRO SOLO CONTORNO =====
.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
}

.brand-icon:hover {
  transform: rotate(15deg) scale(1.05);
}

.speedometer-icon {
  width: 44px;
  height: 44px;
}

.speedometer-icon .needle {
  transform-origin: 50px 50px;
  animation: needleMove 2.5s ease-in-out infinite;
}

@keyframes needleMove {
  0%,
  100% {
    transform: rotate(-15deg);
  }
  25% {
    transform: rotate(30deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(25deg);
  }
}

.brand-text {
  font-family: "Orbitron", sans-serif;
  font-weight: 900;
  font-size: 1.6rem;
  color: #fff;
  letter-spacing: 3px;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.1);
}

.text-gold {
  color: $gold;
}

.nav-link {
  font-family: "Orbitron", sans-serif;
  font-weight: 400;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #aaa !important;
  padding: 8px 20px !important;
  transition: all 0.3s ease;

  i {
    margin-right: 8px;
    color: $gold;
  }

  &:hover {
    color: #fff !important;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
  }

  &.router-link-active {
    color: $gold !important;
  }
}

// ===== MAIN CONTENT =====
.main-content {
  flex: 1;
  padding-top: 80px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
  background: #0a0a0a;
}

@media (min-width: 768px) {
  .main-content {
    padding-left: 40px;
    padding-right: 40px;
  }
}

// ===== FOOTER COMPLETO =====
.footer {
  background: rgba(10, 10, 10, 0.95);
  border-top: 1px solid rgba(255, 215, 0, 0.08);
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-brand {
  font-family: "Orbitron", sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.footer-description {
  color: #888;
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-title {
  font-family: "Orbitron", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: $gold;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 15px;
}

.footer-text {
  color: #888;
  font-size: 0.9rem;
  line-height: 2;
}

.footer-text i {
  color: $gold;
  width: 25px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #888;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: $gold;
  padding-left: 5px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 20px;
  margin-top: 20px;
  text-align: center;
}

.footer-bottom p {
  color: #aaa;
  font-size: 0.85rem;
}

.footer-bottom small {
  font-size: 0.75rem;
  letter-spacing: 1px;
}

// ===== ESTILOS GLOBALES =====
.text-gold {
  color: $gold !important;
}

.btn-gold {
  background: linear-gradient(135deg, $gold, $gold-dark);
  color: #000 !important;
  border: none;
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 25px;
  border-radius: 30px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
    color: #000 !important;
  }
}

.btn-outline-gold {
  color: $gold !important;
  border: 2px solid $gold;
  background: transparent;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 15px;
  border-radius: 30px;
  transition: all 0.3s ease;

  &:hover {
    background: $gold;
    color: #000 !important;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
  }
}

@media (max-width: 768px) {
  .brand-icon {
    width: 36px;
    height: 36px;
  }

  .speedometer-icon {
    width: 36px;
    height: 36px;
  }

  .brand-text {
    font-size: 1.2rem;
  }

  .main-content {
    padding-top: 70px;
    padding-left: 15px;
    padding-right: 15px;
  }
}

/* ===== ESTILOS DE AUTENTICACIÓN NAVBAR ===== */
.user-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 20px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 215, 0, 0.18);
    border-color: #ffd700;
    color: #fff;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
    transform: translateY(-1px);
  }

  .text-muted-gold {
    color: rgba(255, 215, 0, 0.6);
    font-size: 0.75rem;
  }
}

.btn-logout {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #bbb;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(220, 53, 69, 0.2);
    border-color: rgba(220, 53, 69, 0.4);
    color: #ff6b6b;
  }
}

.btn-nav-login {
  display: inline-flex;
  align-items: center;
  padding: 7px 18px !important;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.15),
    rgba(255, 165, 0, 0.1)
  );
  border: 1px solid rgba(255, 215, 0, 0.35);
  border-radius: 20px;
  color: #ffd700 !important;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #ffd700, #ffa500);
    color: #000 !important;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
    transform: translateY(-1px);
  }
}
</style>
