<template>
  <div
    class="modal"
    :class="{ show: visible }"
    style="display: block; background: rgba(0, 0, 0, 0.92)"
    v-if="visible"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">
        <!-- ===== HEADER ===== -->
        <div class="modal-header">
          <div class="modal-header-content">
            <span class="modal-badge">
              <i class="fas fa-crown"></i> Superdeportivo
            </span>
            <h5 class="modal-title">
              <i class="fas fa-car-side text-gold"></i>
              {{ auto ? auto.modelo : "Detalles del Auto" }}
            </h5>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('cerrar')"
          ></button>
        </div>

        <!-- ===== BODY ===== -->
        <div class="modal-body" v-if="auto">
          <div class="row g-4">
            <!-- Columna Izquierda - Imagen -->
            <div class="col-lg-6">
              <div class="image-container">
                <div class="image-glow"></div>
                <img
                  :src="getImagenUrl()"
                  class="detail-image"
                  :alt="auto.modelo"
                  @error="handleImageError"
                />
                <div class="image-badge">
                  <i class="fas fa-tachometer-alt"></i>
                  {{ auto.potencia || 0 }} HP
                </div>
              </div>
            </div>

            <!-- Columna Derecha - Información -->
            <div class="col-lg-6">
              <div class="detail-info">
                <div class="detail-header">
                  <h2 class="detail-title">{{ auto.modelo }}</h2>
                  <span class="detail-year">{{ auto.anio || "N/A" }}</span>
                </div>

                <p class="detail-brand">
                  <i class="fas fa-building text-gold"></i>
                  {{ obtenerMarca() }}
                </p>

                <div class="detail-divider"></div>

                <!-- Especificaciones principales -->
                <div class="specs-grid">
                  <div class="spec-card">
                    <span class="spec-icon"
                      ><i class="fas fa-tachometer-alt"></i
                    ></span>
                    <div class="spec-info">
                      <span class="spec-value">{{ auto.potencia || 0 }}</span>
                      <span class="spec-label">HP</span>
                    </div>
                  </div>
                  <div class="spec-card">
                    <span class="spec-icon"
                      ><i class="fas fa-flag-checkered"></i
                    ></span>
                    <div class="spec-info">
                      <span class="spec-value">{{
                        auto.velocidad_maxima || "N/A"
                      }}</span>
                      <span class="spec-label">km/h</span>
                    </div>
                  </div>
                  <div class="spec-card" v-if="auto.aceleracion_0_100">
                    <span class="spec-icon"
                      ><i class="fas fa-stopwatch"></i
                    ></span>
                    <div class="spec-info">
                      <span class="spec-value">{{
                        auto.aceleracion_0_100
                      }}</span>
                      <span class="spec-label">0-100 km/h</span>
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- Fabricante -->
                <div v-if="auto.fabricante_nombre" class="info-section">
                  <h6 class="section-title">
                    <i class="fas fa-industry text-gold"></i> Fabricante
                  </h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Nombre</span>
                      <span class="info-value">{{
                        auto.fabricante_nombre
                      }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">País</span>
                      <span class="info-value">{{ auto.pais || "N/A" }}</span>
                    </div>
                    <div class="info-item" v-if="auto.sitio_web">
                      <span class="info-label">Sitio Web</span>
                      <a
                        :href="'https://' + auto.sitio_web"
                        target="_blank"
                        class="info-link"
                      >
                        {{ auto.sitio_web }}
                        <i class="fas fa-external-link-alt"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div class="detail-divider"></div>

                <!-- Especificaciones técnicas -->
                <div v-if="auto.tipo_motor" class="info-section">
                  <h6 class="section-title">
                    <i class="fas fa-cog text-gold"></i> Especificaciones
                    Técnicas
                  </h6>
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="info-label">Tipo Motor</span>
                      <span class="info-value">{{ auto.tipo_motor }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Tracción</span>
                      <span class="info-value">{{
                        auto.traccion || "N/A"
                      }}</span>
                    </div>
                    <div class="info-item" v-if="auto.aceleracion_0_100">
                      <span class="info-label">0-100 km/h</span>
                      <span class="info-value"
                        >{{ auto.aceleracion_0_100 }}s</span
                      >
                    </div>
                    <div class="info-item" v-if="auto.velocidad_maxima">
                      <span class="info-label">Vel. Máxima</span>
                      <span class="info-value"
                        >{{ auto.velocidad_maxima }} km/h</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== FOOTER ===== -->
        <div class="modal-footer">
          <button class="btn-close-modal" @click="$emit('cerrar')">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
          <button
            v-if="isAuthenticated"
            class="btn-edit-modal"
            @click="handleEdit"
          >
            <i class="fas fa-pen"></i>
            Editar Auto
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AutoDetail",
  props: {
    auto: Object,
    visible: Boolean,
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
      const img = event.target;
      if (img.src !== "/images/no-image.svg") {
        img.src = "/images/no-image.svg";
      }
    },
    obtenerMarca() {
      if (this.auto) {
        return this.auto.marca || this.auto.fabricante_nombre || "Sin marca";
      }
      return "Sin marca";
    },
    handleEdit() {
      this.$emit("cerrar");
      this.$emit("editar", this.auto);
    },
  },
};
</script>

<style scoped>
/* ===== MODAL CONTENT ===== */
.modal-content {
  background: #0d0d1a !important;
  border: 1px solid rgba(255, 215, 0, 0.08) !important;
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
}

/* ===== HEADER ===== */
.modal-header {
  border-bottom: 1px solid rgba(255, 215, 0, 0.06) !important;
  padding: 20px 30px;
  background: rgba(255, 215, 0, 0.02);
}

.modal-header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-badge {
  font-size: 0.6rem;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.06);
  padding: 2px 14px;
  border-radius: 20px;
  width: fit-content;
  border: 1px solid rgba(255, 215, 0, 0.06);
}

.modal-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: #fff !important;
  margin: 0;
}

.text-gold {
  color: #ffd700;
}

.btn-close-white {
  filter: invert(1);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.btn-close-white:hover {
  opacity: 1;
}

/* ===== BODY ===== */
.modal-body {
  padding: 30px;
  background: #0d0d1a !important;
}

/* ===== IMAGEN ===== */
.image-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
  background: #0a0a0a;
}

.image-glow {
  position: absolute;
  inset: -50px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.08), transparent 60%);
  animation: pulseGlow 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes pulseGlow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 2;
}

.image-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 3;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: #ffd700;
  padding: 6px 16px;
  border-radius: 30px;
  font-family: "Orbitron", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(255, 215, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.image-badge i {
  font-size: 0.7rem;
}

/* ===== DETAIL INFO ===== */
.detail-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: #fff;
  margin: 0;
}

.detail-year {
  font-family: "Orbitron", sans-serif;
  font-size: 0.8rem;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.08);
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.08);
}

.detail-brand {
  color: #aaa;
  font-size: 1rem;
  margin: 0;
}

.detail-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.08), transparent);
  margin: 8px 0;
}

/* ===== SPECS GRID ===== */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.spec-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.spec-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.spec-info {
  display: flex;
  flex-direction: column;
}

.spec-value {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  line-height: 1.2;
}

.spec-label {
  font-size: 0.6rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== INFO SECTION ===== */
.info-section {
  margin-top: 4px;
}

.section-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  color: #ffd700;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.info-label {
  font-size: 0.6rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.9rem;
  color: #ddd;
  font-weight: 500;
}

.info-link {
  color: #ffd700;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.info-link:hover {
  color: #fff;
  text-decoration: underline;
}

.info-link i {
  font-size: 0.6rem;
}

/* ===== FOOTER ===== */
.modal-footer {
  border-top: 1px solid rgba(255, 215, 0, 0.06) !important;
  padding: 16px 30px;
  background: rgba(255, 215, 0, 0.01);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-close-modal {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.1);
}

.btn-edit-modal {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  background: linear-gradient(135deg, #ffd700, #f0a500);
  color: #000;
  border: none;
  border-radius: 10px;
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.25);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .modal-body {
    padding: 20px;
  }

  .detail-title {
    font-size: 1.6rem;
  }

  .specs-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 10px;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 16px;
  }

  .detail-title {
    font-size: 1.4rem;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    padding: 14px 20px;
    flex-direction: column;
  }

  .btn-close-modal,
  .btn-edit-modal {
    justify-content: center;
    width: 100%;
  }

  .image-container {
    aspect-ratio: 16/9;
  }
}
</style>
