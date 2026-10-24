<template>
  <div class="form-card">
    <div class="form-header">
      <div class="form-header-content">
        <h5>
          <i class="fas fa-car"></i>
          {{ autoEditando ? "Editar" : "Nuevo" }} Auto
        </h5>
        <span class="form-badge">
          {{ autoEditando ? " Editando" : " Nuevo" }}
        </span>
      </div>
    </div>

    <div class="form-body">
      <!-- Primera fila -->
      <div class="form-row">
        <div class="form-group">
          <label>Modelo <span class="required">*</span></label>
          <input
            class="form-control"
            v-model="localAuto.modelo"
            placeholder="Ej: Bolide"
          />
        </div>
        <div class="form-group">
          <label>Marca <span class="required">*</span></label>
          <input
            class="form-control"
            v-model="localAuto.marca"
            placeholder="Ej: Bugatti"
          />
        </div>
      </div>

      <!-- Segunda fila -->
      <div class="form-row">
        <div class="form-group">
          <label>Año</label>
          <input
            class="form-control"
            v-model="localAuto.anio"
            placeholder="2024"
            type="number"
          />
        </div>
        <div class="form-group">
          <label>Potencia (HP)</label>
          <input
            class="form-control"
            v-model="localAuto.potencia"
            placeholder="1500"
            type="number"
          />
        </div>
        <div class="form-group">
          <label>URL de Imagen</label>
          <input
            class="form-control"
            v-model="localAuto.imagen"
            placeholder="https://ejemplo.com/auto.jpg"
          />
        </div>
      </div>

      <!-- Tercera fila -->
      <div class="form-row">
        <div class="form-group">
          <label>Fabricante</label>
          <select class="form-select" v-model="localAuto.fabricante_id">
            <option value="">Seleccionar Fabricante</option>
            <option v-for="f in fabricantes" :key="f.id" :value="f.id">
              {{ f.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select class="form-select" v-model="localAuto.categoria_id">
            <option value="">Seleccionar Categoría</option>
            <option v-for="c in categorias" :key="c.id" :value="c.id">
              {{ c.tipo_motor }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-footer">
      <button class="btn-submit" @click="guardar">
        <i class="fas fa-save"></i>
        {{ autoEditando ? "Actualizar Auto" : "Crear Auto" }}
      </button>
      <button class="btn-cancel" @click="$emit('cancelar')">
        <i class="fas fa-times"></i>
        Cancelar
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AutoForm",
  props: {
    fabricantes: Array,
    categorias: Array,
    autoEditando: Object,
  },
  data() {
    return {
      localAuto: {
        modelo: "",
        marca: "",
        anio: "",
        potencia: "",
        imagen: "",
        fabricante_id: "",
        categoria_id: "",
      },
    };
  },
  watch: {
    autoEditando: {
      immediate: true,
      handler(val) {
        if (val) {
          this.localAuto = { ...val };
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.localAuto = {
        modelo: "",
        marca: "",
        anio: "",
        potencia: "",
        imagen: "",
        fabricante_id: "",
        categoria_id: "",
      };
    },
    guardar() {
      if (!this.localAuto.modelo || !this.localAuto.marca) {
        alert("Modelo y marca son obligatorios");
        return;
      }
      this.$emit("guardar", {
        modelo: this.localAuto.modelo,
        marca: this.localAuto.marca,
        anio: parseInt(this.localAuto.anio) || 0,
        potencia: parseInt(this.localAuto.potencia) || 0,
        imagen: this.localAuto.imagen || "",
        fabricante_id: parseInt(this.localAuto.fabricante_id) || 1,
        categoria_id: parseInt(this.localAuto.categoria_id) || 1,
      });
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
  padding: 18px 24px;
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
  font-size: 1rem;
  color: #fff;
  margin: 0;
}

.form-header h5 i {
  color: #ffd700;
  margin-right: 8px;
}

.form-badge {
  font-size: 0.65rem;
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
  padding: 20px 24px 16px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: "Orbitron", sans-serif;
}

.form-group .required {
  color: #ffd700;
}

.form-control,
.form-select {
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

.form-control:focus,
.form-select:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.05);
  color: #fff;
  outline: none;
}

.form-control::placeholder {
  color: #555;
}

.form-select option {
  background: #1a1a2e;
  color: #fff;
}

/* ===== FOOTER ===== */
.form-footer {
  padding: 14px 24px 20px;
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
  font-size: 0.75rem;
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
  font-size: 0.7rem;
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
    padding: 16px 16px 12px;
  }

  .form-header {
    padding: 14px 16px;
  }

  .form-footer {
    padding: 12px 16px 16px;
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    justify-content: center;
    width: 100%;
  }
}
</style>
