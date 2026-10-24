<template>
  <div class="profile-view fade-in">
    <div class="container py-4">
      <!-- Breadcrumbs -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-gold">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/autos" class="text-gold"> Catálogo </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <i class="fas fa-user-circle"></i> Mi Perfil
          </li>
        </ol>
      </nav>

      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="profile-card">
            <!-- Header de Perfil Sobrio -->
            <div class="profile-header">
              <div class="profile-avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="profile-info">
                <h2 class="profile-name">
                  {{ currentUser ? currentUser.nombre : "Mi Perfil" }}
                </h2>
                <div class="profile-meta">
                  <span class="role-badge">
                    <i class="fas fa-shield-alt me-1"></i>
                    {{
                      currentUser && currentUser.rol === "admin"
                        ? "Administrador"
                        : "Usuario"
                    }}
                  </span>
                  <span class="email-badge">
                    <i class="fas fa-envelope me-1 text-gold"></i>
                    {{ currentUser ? currentUser.correo : "" }}
                  </span>
                </div>
              </div>
            </div>

            <div class="divider-subtle my-4"></div>

            <!-- Alertas de estado -->
            <div
              v-if="successMsg"
              class="alert alert-success d-flex align-items-center mb-4"
            >
              <i class="fas fa-check-circle me-2 fs-5"></i>
              <div>{{ successMsg }}</div>
            </div>

            <div
              v-if="errorMsg || authError"
              class="alert alert-danger d-flex align-items-center mb-4"
            >
              <i class="fas fa-exclamation-circle me-2 fs-5"></i>
              <div>{{ errorMsg || authError }}</div>
            </div>

            <!-- Formulario Limpio -->
            <form @submit.prevent="guardarCambios" class="profile-form">
              <!-- SECCIÓN 1: DATOS PERSONALES -->
              <div class="form-section">
                <h4 class="section-title">
                  <i class="fas fa-id-card text-gold me-2"></i> Datos de la
                  Cuenta
                </h4>

                <div class="row g-3 mt-1">
                  <div class="col-md-6">
                    <label class="form-label" for="nombre"
                      >Nombre Completo</label
                    >
                    <div class="input-wrapper">
                      <i class="fas fa-user input-icon"></i>
                      <input
                        id="nombre"
                        v-model="nombre"
                        type="text"
                        required
                        class="form-input"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="correo"
                      >Correo Electrónico (No modificable)</label
                    >
                    <div class="input-wrapper">
                      <i class="fas fa-envelope input-icon"></i>
                      <input
                        id="correo"
                        :value="currentUser ? currentUser.correo : ''"
                        type="email"
                        disabled
                        class="form-input disabled-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN 2: CAMBIAR CONTRASEÑA -->
              <div class="form-section mt-4">
                <h4 class="section-title">
                  <i class="fas fa-lock text-gold me-2"></i> Seguridad y
                  Contraseña
                </h4>
                <p class="section-hint">
                  Deja estos campos en blanco si solo deseas actualizar tu
                  nombre.
                </p>

                <div class="row g-3 mt-1">
                  <div class="col-12">
                    <label class="form-label" for="passwordActual"
                      >Contraseña Actual</label
                    >
                    <div class="input-wrapper">
                      <i class="fas fa-key input-icon"></i>
                      <input
                        id="passwordActual"
                        v-model="passwordActual"
                        :type="showPass ? 'text' : 'password'"
                        class="form-input"
                        placeholder="Requerida solo si vas a cambiar tu contraseña"
                        autocomplete="current-password"
                      />
                      <button
                        type="button"
                        class="btn-eye"
                        @click="showPass = !showPass"
                        title="Mostrar/Ocultar"
                      >
                        <i
                          :class="showPass ? 'fas fa-eye-slash' : 'fas fa-eye'"
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="passwordNuevo"
                      >Nueva Contraseña</label
                    >
                    <div class="input-wrapper">
                      <i class="fas fa-unlock-alt input-icon"></i>
                      <input
                        id="passwordNuevo"
                        v-model="passwordNuevo"
                        :type="showPass ? 'text' : 'password'"
                        minlength="6"
                        class="form-input"
                        placeholder="Mínimo 6 caracteres"
                        autocomplete="new-password"
                      />
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label" for="passwordConfirmar"
                      >Confirmar Nueva Contraseña</label
                    >
                    <div class="input-wrapper">
                      <i class="fas fa-check-circle input-icon"></i>
                      <input
                        id="passwordConfirmar"
                        v-model="passwordConfirmar"
                        :type="showPass ? 'text' : 'password'"
                        class="form-input"
                        placeholder="Repite la nueva contraseña"
                        autocomplete="new-password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- BOTONES DE ACCIÓN -->
              <div class="action-buttons mt-4 pt-2">
                <button type="submit" class="btn-save" :disabled="authLoading">
                  <span
                    v-if="authLoading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  <i v-else class="fas fa-save me-2"></i>
                  <span>{{
                    authLoading ? "Guardando..." : "Guardar Cambios"
                  }}</span>
                </button>

                <router-link to="/autos" class="btn-cancel">
                  <i class="fas fa-arrow-left me-1"></i> Volver al Catálogo
                </router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "ProfileView",
  data() {
    return {
      nombre: "",
      passwordActual: "",
      passwordNuevo: "",
      passwordConfirmar: "",
      showPass: false,
      successMsg: "",
      errorMsg: "",
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    ...mapState(["authLoading", "authError"]),
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push("/login");
      return;
    }
    if (this.currentUser && this.currentUser.nombre) {
      this.nombre = this.currentUser.nombre;
    }
  },
  methods: {
    ...mapActions(["updateProfile"]),
    async guardarCambios() {
      this.successMsg = "";
      this.errorMsg = "";

      if (!this.nombre.trim()) {
        this.errorMsg = "El nombre no puede estar vacío.";
        return;
      }

      if (this.passwordNuevo) {
        if (!this.passwordActual) {
          this.errorMsg = "Debes ingresar tu contraseña actual para cambiarla.";
          return;
        }
        if (this.passwordNuevo.length < 6) {
          this.errorMsg =
            "La nueva contraseña debe tener al menos 6 caracteres.";
          return;
        }
        if (this.passwordNuevo !== this.passwordConfirmar) {
          this.errorMsg = "Las nuevas contraseñas no coinciden.";
          return;
        }
      }

      try {
        const payload = {
          nombre: this.nombre.trim(),
        };

        if (this.passwordNuevo) {
          payload.passwordActual = this.passwordActual;
          payload.passwordNuevo = this.passwordNuevo;
        }

        const res = await this.updateProfile(payload);
        this.successMsg = res.message || "Perfil actualizado con éxito.";
        this.passwordActual = "";
        this.passwordNuevo = "";
        this.passwordConfirmar = "";
      } catch (err) {
        this.errorMsg = err.message || "Error al actualizar los datos.";
      }
    },
  },
};
</script>

<style scoped>
.profile-view {
  min-height: calc(100vh - 140px);
  padding: 20px 0 40px;
  background: #0a0a0a;
}

.profile-card {
  background: rgba(18, 18, 22, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.12);
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
}

.breadcrumb {
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.08);
  font-family: "Rajdhani", sans-serif;
  font-size: 0.9rem;
}

.breadcrumb-item a {
  text-decoration: none;
}

.breadcrumb-item.active {
  color: #aaa;
}

/* Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.08);
  border: 1px solid rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #ffd700;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-family: "Orbitron", sans-serif;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.role-badge {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: #ffd700;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
}

.email-badge {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #aaa;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-family: "Rajdhani", sans-serif;
}

.divider-subtle {
  height: 1px;
  background: rgba(255, 215, 0, 0.1);
}

/* Secciones */
.form-section {
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  font-family: "Orbitron", sans-serif;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}

.section-hint {
  font-family: "Rajdhani", sans-serif;
  color: #777;
  font-size: 0.85rem;
  margin: 4px 0 0;
}

.form-label {
  color: #ccc;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: "Rajdhani", sans-serif;
  margin-bottom: 4px;
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
  padding: 10px 40px 10px 40px;
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

.disabled-input {
  background: rgba(255, 255, 255, 0.02) !important;
  color: #777 !important;
  cursor: not-allowed;
}

.btn-eye {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 4px;
}

.btn-eye:hover {
  color: #ffd700;
}

/* Botones */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-save {
  padding: 11px 26px;
  background: linear-gradient(135deg, #ffd700, #c9a800);
  border: none;
  border-radius: 10px;
  color: #000;
  font-family: "Orbitron", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 215, 0, 0.25);
  background: linear-gradient(135deg, #ffe033, #d4af00);
}

.btn-save:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 11px 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #aaa;
  text-decoration: none;
  font-family: "Rajdhani", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
</style>
