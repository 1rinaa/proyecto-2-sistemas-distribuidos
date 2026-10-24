<template>
  <transition name="snackbar-slide">
    <div
      v-if="toast.show"
      class="snackbar-container"
      :class="`toast-${toast.type}`"
      role="alert"
    >
      <div class="snackbar-content">
        <div class="snackbar-icon">
          <i v-if="toast.type === 'success'" class="fas fa-check-circle"></i>
          <i v-else-if="toast.type === 'error'" class="fas fa-times-circle"></i>
          <i
            v-else-if="toast.type === 'warning'"
            class="fas fa-exclamation-triangle"
          ></i>
          <i v-else class="fas fa-info-circle"></i>
        </div>
        <div class="snackbar-text">
          <span class="snackbar-title">{{ getTitle() }}</span>
          <span class="snackbar-message">{{ toast.message }}</span>
        </div>
        <button
          class="snackbar-close"
          @click="hideToast"
          aria-label="Cerrar notificación"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Barra de progreso con temporizador -->
      <div
        class="snackbar-progress"
        :style="{ animationDuration: `${toast.duration}ms` }"
      ></div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "SnackbarToast",
  computed: {
    ...mapState(["toast"]),
  },
  methods: {
    ...mapActions(["hideToast"]),
    getTitle() {
      switch (this.toast.type) {
        case "success":
          return "¡Operación Exitosa!";
        case "error":
          return "Atención";
        case "warning":
          return "Aviso";
        default:
          return "Información";
      }
    },
  },
};
</script>

<style scoped>
.snackbar-container {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 99999;
  min-width: 320px;
  max-width: 440px;
  background: rgba(18, 18, 22, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  pointer-events: auto;
}

.snackbar-content {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  gap: 14px;
}

.snackbar-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.snackbar-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.snackbar-title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.snackbar-message {
  font-size: 0.92rem;
  color: #e5e7eb;
  line-height: 1.35;
}

.snackbar-close {
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.snackbar-close:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

/* Tipos */
.toast-success {
  border-left: 4px solid #10b981;
}
.toast-success .snackbar-icon,
.toast-success .snackbar-title {
  color: #10b981;
}
.toast-success .snackbar-progress {
  background: linear-gradient(90deg, #10b981, #ffd700);
}

.toast-error {
  border-left: 4px solid #ef4444;
}
.toast-error .snackbar-icon,
.toast-error .snackbar-title {
  color: #ef4444;
}
.toast-error .snackbar-progress {
  background: #ef4444;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}
.toast-warning .snackbar-icon,
.toast-warning .snackbar-title {
  color: #f59e0b;
}
.toast-warning .snackbar-progress {
  background: #f59e0b;
}

.toast-info {
  border-left: 4px solid #3b82f6;
}
.toast-info .snackbar-icon,
.toast-info .snackbar-title {
  color: #3b82f6;
}
.toast-info .snackbar-progress {
  background: #3b82f6;
}

/* Barra de progreso */
.snackbar-progress {
  height: 3px;
  width: 100%;
  animation-name: progressLinear;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes progressLinear {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Transición animada */
.snackbar-slide-enter-active,
.snackbar-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.snackbar-slide-enter {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}

.snackbar-slide-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}

@media (max-width: 576px) {
  .snackbar-container {
    left: 16px;
    right: 16px;
    bottom: 20px;
    min-width: auto;
    max-width: none;
  }
}
</style>
