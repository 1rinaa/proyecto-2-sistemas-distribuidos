<template>
  <div class="categoria-card">
    <div class="categoria-icon-wrapper">
      <div class="categoria-icon">
        <i class="fas fa-sliders-h"></i>
      </div>
    </div>

    <div class="categoria-body">
      <h5 class="categoria-title">
        {{ categoria.tipo_motor || "Sin especificar" }}
      </h5>

      <div class="categoria-specs">
        <span class="spec-tag" v-if="categoria.traccion">
          <i class="fas fa-road"></i> {{ categoria.traccion }}
        </span>
        <span class="spec-tag" v-if="categoria.aceleracion_0_100">
          <i class="fas fa-tachometer-alt"></i>
          {{ categoria.aceleracion_0_100 }}s
        </span>
        <span class="spec-tag" v-if="categoria.velocidad_maxima">
          <i class="fas fa-flag-checkered"></i>
          {{ categoria.velocidad_maxima }} km/h
        </span>
      </div>

      <!-- ✅ BOTONES MEJORADOS -->
      <div class="categoria-actions">
        <button class="btn-action btn-view" @click="$emit('ver', categoria)">
          <i class="fas fa-eye"></i>
          <span>Ver</span>
        </button>
        <button
          v-if="isAuthenticated"
          class="btn-action btn-edit"
          @click="$emit('editar', categoria)"
        >
          <i class="fas fa-pen"></i>
          <span>Editar</span>
        </button>
        <button
          v-if="isAuthenticated"
          class="btn-action btn-delete"
          @click="$emit('eliminar', categoria.id)"
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

export default {
  name: "CategoriaCard",
  props: {
    categoria: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
};
</script>

<style scoped>
/* ===== TARJETA PRINCIPAL ===== */
.categoria-card {
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

.categoria-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 215, 0, 0.2);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

/* ===== ICONO ===== */
.categoria-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.categoria-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.06);
  border: 1.5px solid rgba(255, 215, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #ffd700;
  transition: all 0.4s ease;
}

.categoria-card:hover .categoria-icon {
  background: rgba(255, 215, 0, 0.12);
  border-color: rgba(255, 215, 0, 0.3);
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.05);
}

/* ===== CUERPO ===== */
.categoria-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.categoria-title {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
  margin: 0;
  line-height: 1.3;
}

/* ===== ESPECIFICACIONES ===== */
.categoria-specs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin: 4px 0;
}

.spec-tag {
  font-size: 0.6rem;
  color: #aaa;
  background: rgba(255, 255, 255, 0.04);
  padding: 2px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.spec-tag i {
  color: #ffd700;
  font-size: 0.55rem;
}

/* ===== ACCIONES ===== */
.categoria-actions {
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
  .categoria-card {
    padding: 14px 12px 12px;
  }

  .categoria-icon {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }

  .categoria-title {
    font-size: 0.8rem;
  }

  .spec-tag {
    font-size: 0.55rem;
    padding: 2px 8px;
  }

  .btn-action {
    padding: 4px 8px;
    font-size: 0.5rem;
    min-height: 22px;
    max-width: 65px;
  }

  .btn-action i {
    font-size: 0.55rem;
  }
}
</style>
