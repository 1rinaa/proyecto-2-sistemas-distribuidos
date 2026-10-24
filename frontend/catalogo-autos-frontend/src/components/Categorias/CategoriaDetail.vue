<template>
  <div
    class="modal"
    :class="{ show: visible }"
    style="display: block; background: rgba(0, 0, 0, 0.92)"
    v-if="visible"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- ===== HEADER ===== -->
        <div class="modal-header">
          <div class="modal-header-content">
            <span class="modal-badge">
              <i class="fas fa-tags"></i> Categoría Técnica
            </span>
            <h5 class="modal-title">
              <i class="fas fa-sliders-h text-gold"></i>
              {{
                categoria ? categoria.tipo_motor : "Detalles de la Categoría"
              }}
            </h5>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white"
            @click="$emit('cerrar')"
          ></button>
        </div>

        <!-- ===== BODY ===== -->
        <div class="modal-body" v-if="categoria">
          <div class="detail-info">
            <h2 class="detail-title">{{ categoria.tipo_motor }}</h2>

            <div class="detail-divider"></div>

            <!-- Especificaciones -->
            <div class="specs-grid">
              <div class="spec-card">
                <span class="spec-icon"><i class="fas fa-road"></i></span>
                <div>
                  <span class="spec-value">{{
                    categoria.traccion || "N/A"
                  }}</span>
                  <span class="spec-label"> Tracción</span>
                </div>
              </div>
              <div class="spec-card">
                <span class="spec-icon"
                  ><i class="fas fa-tachometer-alt"></i
                ></span>
                <div>
                  <span class="spec-value">{{
                    categoria.aceleracion_0_100 || "N/A"
                  }}</span>
                  <span class="spec-label"> 0-100 km/h</span>
                </div>
              </div>
              <div class="spec-card">
                <span class="spec-icon"
                  ><i class="fas fa-flag-checkered"></i
                ></span>
                <div>
                  <span class="spec-value">{{
                    categoria.velocidad_maxima || "N/A"
                  }}</span>
                  <span class="spec-label"> km/h</span>
                </div>
              </div>
            </div>

            <div class="detail-divider"></div>

            <!-- ✅ LISTA DE AUTOS (vertical) -->
            <div v-if="autosCategoria.length > 0" class="info-section">
              <h6 class="section-title">
                <i class="fas fa-car text-gold"></i> Autos con
                {{ categoria.tipo_motor }}
                <span class="autos-count">({{ autosCategoria.length }})</span>
              </h6>
              <div class="autos-list">
                <div
                  v-for="auto in autosCategoria"
                  :key="auto.id"
                  class="auto-list-item"
                  @click="verAuto(auto.id)"
                >
                  <div class="auto-list-image">
                    <img
                      :src="getAutoImageUrl(auto.imagen)"
                      :alt="auto.modelo"
                      @error="handleImageError"
                    />
                  </div>
                  <div class="auto-list-info">
                    <span class="auto-list-name">{{ auto.modelo }}</span>
                    <span class="auto-list-specs">
                      {{ auto.potencia }} HP · {{ auto.marca }}
                    </span>
                  </div>
                  <div class="auto-list-arrow">
                    <i class="fas fa-chevron-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== FOOTER ===== -->
        <div class="modal-footer">
          <button class="btn-close-modal" @click="$emit('cerrar')">
            <i class="fas fa-times"></i> Cerrar
          </button>
          <button
            v-if="isAuthenticated"
            class="btn-edit-modal"
            @click="handleEdit"
          >
            <i class="fas fa-pen"></i> Editar Categoría
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CategoriaDetail",
  props: {
    categoria: Object,
    autos: Array,
    visible: Boolean,
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    autosCategoria() {
      if (!this.categoria || !this.autos) return [];
      return this.autos.filter(
        (auto) => auto.categoria_id === this.categoria.id
      );
    },
  },
  methods: {
    handleEdit() {
      this.$emit("cerrar");
      this.$emit("editar", this.categoria);
    },
    verAuto(id) {
      this.$emit("ver-auto", id);
      this.$emit("cerrar");
    },
    getAutoImageUrl(imagen) {
      if (!imagen) return "/images/no-image.svg";
      const img = imagen.trim();
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
.modal-content {
  background: #0d0d1a !important;
  border: 1px solid rgba(255, 215, 0, 0.08) !important;
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
}

.modal-header {
  border-bottom: 1px solid rgba(255, 215, 0, 0.06) !important;
  padding: 16px 24px;
  background: rgba(255, 215, 0, 0.02);
}

.modal-header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-badge {
  font-size: 0.55rem;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #ffd700;
  background: rgba(255, 215, 0, 0.06);
  padding: 2px 12px;
  border-radius: 20px;
  width: fit-content;
  border: 1px solid rgba(255, 215, 0, 0.06);
}

.modal-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
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

.modal-body {
  padding: 20px 24px;
  background: #0d0d1a !important;
  max-height: 70vh;
  overflow-y: auto;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.detail-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 1.6rem;
  color: #fff;
  margin: 0;
}

.detail-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.08), transparent);
  margin: 6px 0;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.spec-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.spec-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.spec-value {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
  line-height: 1.2;
  margin-right: 4px;
}

.spec-label {
  font-size: 0.55rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.autos-count {
  color: #666;
  font-size: 0.7rem;
  font-weight: 400;
}

/* ✅ LISTA DE AUTOS VERTICAL */
.autos-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auto-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;
}

.auto-list-item:hover {
  background: rgba(255, 215, 0, 0.05);
  border-color: rgba(255, 215, 0, 0.1);
  transform: translateX(4px);
}

.auto-list-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  background: #0a0a0a;
  flex-shrink: 0;
}

.auto-list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.auto-list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.auto-list-name {
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: #fff;
}

.auto-list-specs {
  font-size: 0.7rem;
  color: #666;
}

.auto-list-arrow {
  color: #444;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.auto-list-item:hover .auto-list-arrow {
  color: #ffd700;
}

.modal-footer {
  border-top: 1px solid rgba(255, 215, 0, 0.06) !important;
  padding: 12px 24px;
  background: rgba(255, 215, 0, 0.01);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-close-modal {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  font-size: 0.6rem;
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
  gap: 6px;
  padding: 6px 20px;
  background: linear-gradient(135deg, #ffd700, #f0a500);
  color: #000;
  border: none;
  border-radius: 8px;
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.25);
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 10px;
  }

  .modal-header {
    padding: 12px 16px;
  }

  .modal-body {
    padding: 14px 16px;
    max-height: 80vh;
  }

  .detail-title {
    font-size: 1.2rem;
  }

  .specs-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    padding: 10px 16px;
    flex-direction: column;
  }

  .btn-close-modal,
  .btn-edit-modal {
    justify-content: center;
    width: 100%;
  }

  .auto-list-image {
    width: 40px;
    height: 40px;
  }

  .auto-list-name {
    font-size: 0.75rem;
  }
}
</style>
