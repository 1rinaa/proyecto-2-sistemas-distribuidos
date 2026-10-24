<template>
  <div class="auth-view fade-in">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Encabezado Sobrio y Minimalista -->
        <div class="auth-header">
          <div class="auth-icon-badge">
            <i class="fas fa-lock"></i>
          </div>
          <h2 class="auth-title">
            Iniciar <span class="text-gold">Sesión</span>
          </h2>
          <p class="auth-subtitle">
            Ingresa a tu cuenta para administrar el catálogo
          </p>
        </div>

        <!-- Alerta de sesión expirada -->
        <div v-if="sesionExpirada" class="auth-alert alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Sesión expirada por seguridad. Inicie sesión de nuevo.</span>
        </div>

        <!-- Alerta de error -->
        <div v-if="authError" class="auth-alert alert-danger">
          <i class="fas fa-times-circle"></i>
          <span>{{ authError }}</span>
        </div>

        <!-- Formulario Limpio -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope input-icon"></i>
              <input
                id="correo"
                v-model="correo"
                type="email"
                required
                placeholder="ejemplo@correo.com"
                class="form-input"
                autocomplete="email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <i class="fas fa-key input-icon"></i>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Tu contraseña"
                class="form-input"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="btn-toggle-pass"
                @click="showPassword = !showPassword"
                title="Mostrar/Ocultar contraseña"
              >
                <i
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                ></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="authLoading">
            <span
              v-if="authLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i v-else class="fas fa-sign-in-alt me-2"></i>
            <span>{{ authLoading ? "Ingresando..." : "Iniciar Sesión" }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <span>¿No tienes una cuenta aún?</span>
          <router-link to="/register" class="link-gold">
            Crear cuenta <i class="fas fa-arrow-right ms-1"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "LoginView",
  data() {
    return {
      correo: "",
      password: "",
      showPassword: false,
    };
  },
  computed: {
    ...mapState(["authLoading", "authError"]),
    sesionExpirada() {
      return this.$route.query.expired === "1";
    },
  },
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      try {
        await this.login({
          correo: this.correo,
          password: this.password,
        });
        this.$toast.success("¡Inicio de sesión exitoso! Bienvenido.");
        const redirectPath = this.$route.query.redirect || "/autos";
        this.$router.push(redirectPath);
      } catch (err) {
        this.$toast.error(this.authError || "Error al iniciar sesión");
      }
    },
  },
};
</script>

<style scoped>
.auth-view {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #0a0a0a;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 16px;
  padding: 36px 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-icon-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 50%;
  color: #ffd700;
  font-size: 1.25rem;
  margin-bottom: 14px;
}

.auth-title {
  font-family: "Orbitron", sans-serif;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.text-gold {
  color: #ffd700;
}

.auth-subtitle {
  font-family: "Rajdhani", sans-serif;
  color: #888;
  font-size: 0.95rem;
  margin: 0;
}

/* Alertas */
.auth-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 18px;
}

.alert-warning {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.25);
  color: #ffc107;
}

.alert-danger {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.25);
  color: #ff6b6b;
}

/* Formulario */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.form-group label {
  font-family: "Rajdhani", sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  color: #ccc;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #666;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.form-input {
  width: 100%;
  padding: 11px 40px 11px 40px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #fff;
  font-family: "Rajdhani", sans-serif;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.06);
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.15);
}

.form-input:focus ~ .input-icon {
  color: #ffd700;
}

.btn-toggle-pass {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s ease;
}

.btn-toggle-pass:hover {
  color: #ffd700;
}

/* Botón Submit */
.btn-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ffd700, #c9a800);
  border: none;
  border-radius: 10px;
  color: #000;
  font-family: "Orbitron", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 215, 0, 0.25);
  background: linear-gradient(135deg, #ffe033, #d4af00);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Footer */
.auth-footer {
  margin-top: 22px;
  text-align: center;
  font-family: "Rajdhani", sans-serif;
  font-size: 0.9rem;
  color: #888;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.link-gold {
  color: #ffd700;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.link-gold:hover {
  color: #ffe033;
}
</style>
