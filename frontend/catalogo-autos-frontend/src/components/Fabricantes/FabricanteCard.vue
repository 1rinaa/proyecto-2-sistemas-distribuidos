<template>
  <div class="fabricante-card">
    <div class="fabricante-icon-wrapper">
      <div class="fabricante-icon">
        <img
          v-if="logoSlug && !logoFailed"
          :src="getLogoUrl()"
          :alt="fabricante.nombre"
          class="fabricante-logo"
          @error="handleLogoError"
        />
        <div v-else class="fabricante-fallback-icon">
          <svg viewBox="0 0 24 24" class="car-icon">
            <path
              d="M4.2 15.5v-1.7c0-.4.1-.7.3-1l1.7-2.6c.3-.5.9-.8 1.5-.8h8.6c.6 0 1.2.3 1.5.8l1.7 2.6c.2.3.3.6.3 1v1.7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
            <path
              d="M6.3 9.9l.9-2.5c.2-.6.8-1 1.4-1h6.8c.6 0 1.2.4 1.4 1l.9 2.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
            <path
              d="M3.6 14.3h16.8"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linecap="round"
            />
            <path
              d="M3.6 14.3v2.3c0 .4.3.7.7.7h1.2c.4 0 .7-.3.7-.7v-1.1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
            <path
              d="M20.4 14.3v2.3c0 .4-.3.7-.7.7h-1.2c-.4 0-.7-.3-.7-.7v-1.1"
              fill="none"
              stroke="currentColor"
              stroke-width="1.3"
              stroke-linejoin="round"
            />
            <circle
              cx="7.6"
              cy="14.3"
              r="1.15"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
            />
            <circle
              cx="16.4"
              cy="14.3"
              r="1.15"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="fabricante-body">
      <h5 class="fabricante-title">{{ fabricante.nombre }}</h5>

      <div class="fabricante-info">
        <p class="fabricante-detail" v-if="fabricante.pais">
          <i class="fas fa-map-marker-alt text-gold"></i>
          {{ fabricante.pais }}
        </p>
        <p class="fabricante-detail" v-if="fabricante.anio_fundacion">
          <i class="fas fa-calendar-alt text-gold"></i>
          Fundado en {{ fabricante.anio_fundacion }}
        </p>
        <a
          :href="'https://' + fabricante.sitio_web"
          target="_blank"
          class="fabricante-link"
          v-if="fabricante.sitio_web"
        >
          <i class="fas fa-globe"></i> {{ fabricante.sitio_web }}
        </a>
      </div>

      <!-- ✅ BOTONES MEJORADOS -->
      <div class="fabricante-actions">
        <button class="btn-action btn-view" @click="$emit('ver', fabricante)">
          <i class="fas fa-eye"></i>
          <span>Ver</span>
        </button>
        <button
          v-if="isAuthenticated"
          class="btn-action btn-edit"
          @click="$emit('editar', fabricante)"
        >
          <i class="fas fa-pen"></i>
          <span>Editar</span>
        </button>
        <button
          v-if="isAuthenticated"
          class="btn-action btn-delete"
          @click="$emit('eliminar', fabricante.id)"
        >
          <i class="fas fa-trash"></i>
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const SLUG_OVERRIDES = {
  "mercedes benz": "mercedes",
  "mercedes-benz": "mercedes",
  "rolls royce": "rollsroyce",
  "rolls-royce": "rollsroyce",
  "land rover": "landrover",
  "alfa romeo": "alfaromeo",
  "aston martin": "astonmartin",
  "general motors": "generalmotors",
  "great wall": "greatwallmotors",
  byd: "byd",
  "mg motor": "mg",
};

export default {
  name: "FabricanteCard",
  props: {
    fabricante: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      logoFailed: false,
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    logoSlug() {
      if (!this.fabricante?.nombre) return null;
      const normalized = this.fabricante.nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (SLUG_OVERRIDES[normalized]) return SLUG_OVERRIDES[normalized];
      return normalized.replace(/[^a-z0-9]/g, "");
    },
  },
  watch: {
    "fabricante.nombre"() {
      this.logoFailed = false;
    },
  },
  methods: {
    getLogoUrl() {
      return `https://cdn.simpleicons.org/${this.logoSlug}/ffd700`;
    },
    handleLogoError() {
      this.logoFailed = true;
    },
  },
};
</script>

<style scoped>
/* ===== TARJETA PRINCIPAL ===== */
.fabricante-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 20px 16px 16px;
}

.fabricante-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 215, 0, 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* ===== ICONO / LOGO ===== */
.fabricante-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.fabricante-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 215, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  overflow: hidden;
}

.fabricante-card:hover .fabricante-icon {
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.2);
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.05);
}

.fabricante-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 14px;
  transition: transform 0.3s ease;
  background: transparent !important;
}

.fabricante-card:hover .fabricante-logo {
  transform: scale(1.08);
}

.fabricante-fallback-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  opacity: 0.85;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.fabricante-card:hover .fabricante-fallback-icon {
  transform: scale(1.08) rotate(8deg);
  opacity: 1;
}

.car-icon {
  width: 40px;
  height: 40px;
}

/* ===== CUERPO ===== */
.fabricante-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fabricante-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
  margin: 0;
}

/* ===== INFORMACIÓN ===== */
.fabricante-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 4px 0 8px;
}

.fabricante-detail {
  font-size: 0.75rem;
  color: #aaa;
  margin: 0;
}

.fabricante-detail i {
  color: #ffd700;
  width: 16px;
}

.fabricante-link {
  font-size: 0.7rem;
  color: #ffd700;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.fabricante-link:hover {
  color: #fff;
  text-decoration: underline;
}

.text-gold {
  color: #ffd700;
}

/* ===== ACCIONES - BOTONES MÁS PEQUEÑOS Y PROPORCIONADOS ===== */
.fabricante-actions {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 5px 10px;
  border: none;
  border-radius: 6px;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 26px;
  flex: 1;
  max-width: 80px;
}

.btn-action i {
  font-size: 0.65rem;
}

.btn-action span {
  font-size: 0.5rem;
}

.btn-view {
  background: rgba(255, 215, 0, 0.08);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.06);
}

.btn-view:hover {
  background: rgba(255, 215, 0, 0.18);
  transform: scale(1.03);
}

.btn-edit {
  background: rgba(255, 255, 255, 0.05);
  color: #aaa;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-edit:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: scale(1.03);
}

.btn-delete {
  background: rgba(255, 50, 50, 0.06);
  color: #ff6b6b;
  border: 1px solid rgba(255, 50, 50, 0.06);
}

.btn-delete:hover {
  background: rgba(255, 50, 50, 0.15);
  color: #ff4444;
  transform: scale(1.03);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .fabricante-icon {
    width: 60px;
    height: 60px;
  }

  .car-icon {
    width: 32px;
    height: 32px;
  }

  .fabricante-title {
    font-size: 0.85rem;
  }

  .btn-action {
    padding: 4px 8px;
    font-size: 0.5rem;
    min-height: 22px;
    max-width: 70px;
  }

  .btn-action i {
    font-size: 0.55rem;
  }
}
</style>
