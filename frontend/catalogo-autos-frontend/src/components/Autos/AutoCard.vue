<template>
  <div class="auto-card">
    <!-- Badge de potencia -->
    <div class="auto-badge">
      <i class="fas fa-tachometer-alt"></i> {{ auto.potencia || 0 }} HP
    </div>

    <!-- Imagen del auto -->
    <div class="auto-image-wrapper">
      <img
        :src="getImagenUrl()"
        class="auto-image"
        :alt="auto.modelo"
        @error="handleImageError"
      />
      <div class="auto-overlay">
        <button class="btn-overlay" @click="$emit('ver', auto.id)">
          <i class="fas fa-arrow-right"></i>
          <span>Ver Detalles</span>
        </button>
      </div>
    </div>

    <!-- Información del auto -->
    <div class="auto-body">
      <div class="auto-header">
        <h5 class="auto-title">{{ auto.modelo }}</h5>
        <span class="auto-year">{{ auto.anio || "N/A" }}</span>
      </div>

      <p class="auto-brand">
        <i class="fas fa-building text-gold"></i>
        {{ auto.marca || auto.fabricante_nombre || "Sin marca" }}
      </p>

      <!-- Especificaciones -->
      <div class="auto-specs">
        <span class="spec-item" v-if="auto.tipo_motor">
          <i class="fas fa-cog"></i> {{ auto.tipo_motor }}
        </span>
        <span class="spec-item" v-if="auto.traccion">
          <i class="fas fa-road"></i> {{ auto.traccion }}
        </span>
        <span class="spec-item" v-if="auto.velocidad_maxima">
          <i class="fas fa-flag-checkered"></i> {{ auto.velocidad_maxima }} km/h
        </span>
      </div>

      <!-- Acciones -->
      <div class="auto-actions">
        <button class="btn-action btn-view" @click="$emit('ver', auto.id)">
          <i class="fas fa-eye"></i>
          <span>Ver</span>
        </button>
        <button
          v-if="isAuthenticated"
          class="btn-action btn-edit"
          @click="$emit('editar', auto)"
        >
          <i class="fas fa-pen"></i>
        </button>
        <button
          v-if="isAuthenticated"
          class="btn-action btn-delete"
          @click="$emit('eliminar', auto.id)"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AutoCard",
  props: {
    auto: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    getImagenUrl() {
      if (!this.auto || !this.auto.imagen) {
        return "/images/no-image.svg";
      }
      const img = this.auto.imagen.trim();
      if (
        img.startsWith("http://") ||
        img.startsWith("https://") ||
        img.startsWith("/")
      ) {
        return img;
      }
      return `/images/autos/${img}`;
    },
    handleImageError(event) {
      event.target.src = "/images/no-image.svg";
    },
  },
};
</script>

<style scoped>
/* ===== TARJETA PRINCIPAL ===== */
.auto-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.auto-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 215, 0, 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* ===== BADGE ===== */
.auto-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background: linear-gradient(135deg, #ffd700, #c9a800);
  color: #000;
  font-family: "Orbitron", sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  letter-spacing: 0.5px;
}

.auto-badge i {
  margin-right: 4px;
  font-size: 0.65rem;
}

/* ===== IMAGEN ===== */
.auto-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
  flex-shrink: 0;
}

.auto-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.auto-card:hover .auto-image {
  transform: scale(1.05);
}

/* ===== OVERLAY ===== */
.auto-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.35s ease;
}

.auto-card:hover .auto-overlay {
  opacity: 1;
}

.btn-overlay {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  color: #fff;
  border: 1.5px solid #ffd700;
  padding: 10px 28px;
  border-radius: 50px;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: scale(0.9);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
}

.auto-card:hover .btn-overlay {
  transform: scale(1);
}

.btn-overlay:hover {
  background: linear-gradient(135deg, #ffd700, #f0a500);
  color: #000;
  border-color: #ffd700;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.25);
  transform: scale(1.05);
}

.btn-overlay i {
  font-size: 0.9rem;
  transition: transform 0.35s ease;
}

.btn-overlay:hover i {
  transform: translateX(5px);
}

/* ===== CUERPO ===== */
.auto-body {
  padding: 16px 18px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.auto-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.auto-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
  margin: 0;
}

.auto-year {
  font-family: "Orbitron", sans-serif;
  font-size: 0.7rem;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.08);
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.auto-brand {
  color: #999;
  font-size: 0.85rem;
  margin: 0 0 8px 0;
}

.text-gold {
  color: #ffd700;
}

/* ===== ESPECIFICACIONES ===== */
.auto-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 6px 0 14px;
}

.spec-item {
  font-size: 0.65rem;
  color: #888;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  white-space: nowrap;
}

.spec-item i {
  color: #ffd700;
  margin-right: 3px;
  font-size: 0.6rem;
}

/* ===== ACCIONES ===== */
.auto-actions {
  display: flex;
  gap: 6px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  font-size: 0.7rem;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 30px;
}

.btn-action i {
  font-size: 0.7rem;
}

.btn-action span {
  font-size: 0.6rem;
  letter-spacing: 0.5px;
}

/* Botón Ver - Ocupa más espacio */
.btn-view {
  flex: 2;
  background: rgba(255, 215, 0, 0.08);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.08);
}

.btn-view:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.02);
  border-color: rgba(255, 215, 0, 0.3);
}

/* Botón Editar */
.btn-edit {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  color: #aaa;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-edit:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Botón Eliminar */
.btn-delete {
  flex: 1;
  background: rgba(255, 50, 50, 0.06);
  color: #ff6b6b;
  border: 1px solid rgba(255, 50, 50, 0.06);
}

.btn-delete:hover {
  background: rgba(255, 50, 50, 0.15);
  color: #ff4444;
  transform: scale(1.05);
  border-color: rgba(255, 50, 50, 0.2);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .auto-image-wrapper {
    height: 180px;
  }

  .auto-title {
    font-size: 0.9rem;
  }

  .auto-body {
    padding: 14px 14px 16px;
  }

  .btn-action {
    font-size: 0.6rem;
    padding: 5px 8px;
    min-height: 28px;
  }

  .btn-action i {
    font-size: 0.65rem;
  }

  .btn-view span {
    display: none;
  }

  .btn-view {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .auto-image-wrapper {
    height: 200px;
  }
}
</style>
