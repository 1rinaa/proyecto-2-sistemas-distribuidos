<template>
  <div class="auth-view fade-in">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Encabezado Sobrio y Minimalista -->
        <div class="auth-header">
          <div class="auth-icon-badge">
            <i class="fas fa-user-plus"></i>
          </div>
          <h2 class="auth-title">
            Crear <span class="text-gold">Cuenta</span>
          </h2>
          <p class="auth-subtitle">
            Regístrate para poder gestionar y editar el catálogo de autos
          </p>
        </div>

        <!-- Alertas -->
        <div v-if="localError || authError" class="auth-alert alert-danger">
          <i class="fas fa-times-circle"></i>
          <span>{{ localError || authError }}</span>
        </div>

        <!-- Formulario Limpio -->
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="nombre">Nombre Completo</label>
            <div class="input-wrapper">
              <i class="fas fa-user input-icon"></i>
              <input
                id="nombre"
                v-model="nombre"
                type="text"
                required
                placeholder="Tu nombre completo"
                class="form-input"
                autocomplete="name"
              />
            </div>
          </div>

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

          <div class="row g-2">
            <div class="col-md-6">
              <div class="form-group">
                <label for="password">Contraseña</label>
                <div class="input-wrapper">
                  <i class="fas fa-key input-icon"></i>
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    placeholder="Mínimo 6 car."
                    class="form-input"
                    autocomplete="new-password"
                  />
                  <button
                    type="button"
                    class="btn-toggle-pass"
                    @click="showPassword = !showPassword"
                    title="Mostrar/Ocultar"
                  >
                    <i
                      :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                    ></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label for="confirmPassword">Confirmar Clave</label>
                <div class="input-wrapper">
                  <i class="fas fa-check-circle input-icon"></i>
                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="Repite la clave"
                    class="form-input"
                    autocomplete="new-password"
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="authLoading">
            <span
              v-if="authLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            <i v-else class="fas fa-user-check me-2"></i>
            <span>{{ authLoading ? "Registrando..." : "Registrarse" }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <span>¿Ya tienes una cuenta registrada?</span>
          <router-link to="/login" class="link-gold">
            Iniciar Sesión <i class="fas fa-arrow-right ms-1"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "RegisterView",
  data() {
    return {
      nombre: "",
      correo: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      localError: "",
    };
  },
  computed: {
    ...mapState(["authLoading", "authError"]),
  },
  methods: {
    ...mapActions(["register"]),
    async handleRegister() {
      this.localError = "";

      if (this.password !== this.confirmPassword) {
        this.localError = "Las contraseñas no coinciden.";
        return;
      }

      if (this.password.length < 6) {
        this.localError = "La contraseña debe tener al menos 6 caracteres.";
        return;
      }

      try {
        await this.register({
          nombre: this.nombre,
          correo: this.correo,
          password: this.password,
        });
        this.$router.push("/autos");
      } catch (err) {
        // Error manejado en Vuex
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
  max-width: 440px;
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

.auth-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 18px;
}

.alert-danger {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.25);
  color: #ff6b6b;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
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

.btn-toggle-pass {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 4px;
}

.btn-toggle-pass:hover {
  color: #ffd700;
}

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
}

.link-gold:hover {
  color: #ffe033;
}
</style>
