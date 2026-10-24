<template>
  <div class="form-card">
    <div class="form-header">
      <div class="form-header-content">
        <h5>
          <i class="fas fa-sliders-h"></i>
          {{ editando ? "Editar" : "Nueva" }} Categoría
        </h5>
        <span class="form-badge">
          {{ editando ? "✏️ Editando" : "✨ Nueva" }}
        </span>
      </div>
    </div>

    <div class="form-body">
      <div class="form-row">
        <div class="form-group">
          <label>Tipo de Motor <span class="required">*</span></label>
          <input
            class="form-control"
            v-model="localCat.tipo_motor"
            placeholder="Ej: V8 biturbo, W16, Eléctrico"
          />
        </div>
        <div class="form-group">
          <label>Tracción</label>
          <input
            class="form-control"
            v-model="localCat.traccion"
            placeholder="Ej: AWD, RWD, FWD"
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Aceleración 0-100 (seg)</label>
          <input
            class="form-control"
            v-model.number="localCat.aceleracion_0_100"
            placeholder="Ej: 2.5"
            type="number"
            step="0.1"
          />
        </div>
        <div class="form-group">
          <label>Velocidad Máxima (km/h)</label>
          <input
            class="form-control"
            v-model.number="localCat.velocidad_maxima"
            placeholder="Ej: 350"
            type="number"
          />
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button class="btn-submit" @click="guardar">
        <i class="fas fa-save"></i>
        {{ editando ? "Actualizar Categoría" : "Crear Categoría" }}
      </button>
      <button class="btn-cancel" @click="cancelar">
        <i class="fas fa-times"></i>
        Cancelar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoriaForm",
  props: {
    categoriaEditando: Object,
  },
  data() {
    return {
      localCat: {
        tipo_motor: "",
        traccion: "",
        aceleracion_0_100: null,
        velocidad_maxima: null,
      },
      editando: false,
    };
  },
  watch: {
    categoriaEditando: {
      immediate: true,
      handler(val) {
        if (val) {
          this.localCat = { ...val };
          this.editando = true;
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.localCat = {
        tipo_motor: "",
        traccion: "",
        aceleracion_0_100: null,
        velocidad_maxima: null,
      };
      this.editando = false;
    },
    guardar() {
      if (!this.localCat.tipo_motor) {
        alert("El tipo de motor es obligatorio");
        return;
      }
      this.$emit("guardar", {
        tipo_motor: this.localCat.tipo_motor,
        traccion: this.localCat.traccion || "",
        aceleracion_0_100: Number(this.localCat.aceleracion_0_100) || 0,
        velocidad_maxima: Number(this.localCat.velocidad_maxima) || 0,
      });
    },
    cancelar() {
      this.resetForm();
      this.$emit("cancelar");
    },
  },
};
</script>

<style scoped>
/* ===== FORMULARIO ===== */
.form-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.08);
  overflow: hidden;
  margin-bottom: 30px;
  animation: slideDown 0.4s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== HEADER ===== */
.form-header {
  padding: 16px 24px;
  background: rgba(255, 215, 0, 0.03);
  border-bottom: 1px solid rgba(255, 215, 0, 0.06);
}

.form-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.form-header h5 {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
  margin: 0;
}

.form-header h5 i {
  color: #ffd700;
  margin-right: 8px;
}

.form-badge {
  font-size: 0.6rem;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  padding: 3px 14px;
  border-radius: 20px;
  background: rgba(255, 215, 0, 0.08);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.08);
}

/* ===== BODY ===== */
.form-body {
  padding: 18px 24px 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: "Orbitron", sans-serif;
}

.form-group .required {
  color: #ffd700;
}

.form-control {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
  font-family: "Rajdhani", sans-serif;
  transition: all 0.3s ease;
  width: 100%;
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.05);
  color: #fff;
  outline: none;
}

.form-control::placeholder {
  color: #555;
}

/* ===== FOOTER ===== */
.form-footer {
  padding: 12px 24px 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
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

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.25);
}

.btn-submit i {
  font-size: 0.8rem;
}

.btn-cancel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: transparent;
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.1);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .form-body {
    padding: 14px 16px 10px;
  }

  .form-header {
    padding: 12px 16px;
  }

  .form-footer {
    padding: 10px 16px 14px;
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    justify-content: center;
    width: 100%;
  }
}
</style>
