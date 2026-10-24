<template>
  <div class="fabricantes-view fade-in">
    <!-- ===== BREADCRUMBS ===== -->
    <div class="breadcrumb-wrapper">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">
              <i class="fas fa-home"></i> Inicio
            </router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <i class="fas fa-industry"></i> Marcas
          </li>
        </ol>
      </nav>
    </div>

    <!-- ===== HEADER ===== -->
    <div class="catalog-header">
      <div class="header-content">
        <span class="section-tag">Fabricantes</span>
        <h1 class="catalog-title">
          Marcas <span class="text-gold">de Élite</span>
        </h1>
        <p class="catalog-subtitle">
          Los fabricantes más exclusivos del mundo automotriz
        </p>
      </div>
      <div class="header-actions">
        <button
          v-if="isAuthenticated"
          class="btn-add"
          @click="mostrarForm = !mostrarForm"
        >
          <i class="fas fa-plus"></i>
          {{ mostrarForm ? "Cancelar" : "Agregar Marca" }}
        </button>
      </div>
    </div>

    <!-- ===== FORMULARIO ===== -->
    <div v-if="mostrarForm" class="form-wrapper">
      <FabricanteForm
        :fabricanteEditando="editandoFab"
        @guardar="guardarFabricante"
        @cancelar="cancelarEdicion"
      />
    </div>

    <!-- ===== GRID DE FABRICANTES ===== -->
    <div v-if="fabricantes.length > 0" class="fabricantes-grid">
      <div class="grid-item" v-for="f in fabricantes" :key="f.id">
        <FabricanteCard
          :fabricante="f"
          @editar="editarFabricante"
          @eliminar="eliminarFabricante"
          @ver="verFabricante"
        />
      </div>
    </div>

    <!-- ===== EMPTY STATE ===== -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-industry"></i>
      </div>
      <h3>No hay marcas registradas</h3>
      <p>Agrega tu primera marca usando el botón "Agregar Marca"</p>
    </div>

    <FabricanteDetail
      :fabricante="fabricanteSeleccionado"
      :autos="autos"
      :visible="mostrarDetalle"
      @cerrar="mostrarDetalle = false"
      @editar="editarFabricante"
      @ver-auto="verAuto"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import FabricanteCard from "@/components/Fabricantes/FabricanteCard.vue";
import FabricanteForm from "@/components/Fabricantes/FabricanteForm.vue";
import FabricanteDetail from "@/components/Fabricantes/FabricanteDetail.vue";

export default {
  name: "FabricantesView",
  components: {
    FabricanteCard,
    FabricanteForm,
    FabricanteDetail,
  },
  data() {
    return {
      mostrarForm: false,
      editandoFab: null,
      mostrarDetalle: false,
      fabricanteSeleccionado: null,
    };
  },
  computed: {
    ...mapState(["fabricantes", "autos"]),
    ...mapGetters(["isAuthenticated"]),
  },
  mounted() {
    this.fetchFabricantes();
    this.fetchAutos();
  },
  methods: {
    ...mapActions([
      "fetchFabricantes",
      "fetchAutos",
      "createFabricante",
      "updateFabricante",
      "deleteFabricante",
    ]),

    verFabricante(fabricante) {
      this.fabricanteSeleccionado = fabricante;
      this.mostrarDetalle = true;
    },

    verAuto(id) {
      // Redirigir a la vista de autos con el ID seleccionado
      this.$router.push({ path: "/autos", query: { auto: id } });
    },

    // ✅ Abrir formulario para editar
    editarFabricante(fabricante) {
      console.log("📝 Editando fabricante:", fabricante); // Debug
      this.editandoFab = fabricante;
      this.mostrarForm = true;
    },

    // ✅ Guardar (crear o actualizar)
    async guardarFabricante(data) {
      try {
        if (this.editandoFab) {
          console.log("🔄 Actualizando fabricante:", this.editandoFab.id, data); // Debug
          // Actualizar fabricante existente
          await this.updateFabricante({
            id: this.editandoFab.id,
            fabricante: data,
          });
        } else {
          // Crear nuevo fabricante
          await this.createFabricante(data);
        }
        this.mostrarForm = false;
        this.editandoFab = null;
      } catch (error) {
        console.error("❌ Error guardando fabricante:", error);
        alert("Error al guardar la marca");
      }
    },

    // ✅ Cancelar edición
    cancelarEdicion() {
      this.mostrarForm = false;
      this.editandoFab = null;
    },

    // ✅ Eliminar fabricante
    async eliminarFabricante(id) {
      if (confirm("¿Eliminar esta marca?")) {
        try {
          await this.deleteFabricante(id);
        } catch (error) {
          console.error("❌ Error eliminando fabricante:", error);
          alert("Error al eliminar la marca");
        }
      }
    },
  },
};
</script>

<style scoped>
/* ===== BREADCRUMBS ===== */
.breadcrumb-wrapper {
  margin-bottom: 25px;
}

.breadcrumb {
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.06);
  backdrop-filter: blur(10px);
}

.breadcrumb-item {
  font-family: "Rajdhani", sans-serif;
  font-weight: 400;
  font-size: 0.9rem;
  color: #888;
}

.breadcrumb-item a {
  color: #aaa;
  text-decoration: none;
  transition: all 0.3s ease;
}

.breadcrumb-item a:hover {
  color: #ffd700;
}

.breadcrumb-item i {
  margin-right: 6px;
  color: #ffd700;
}

.breadcrumb-item.active {
  color: #ffd700;
  font-weight: 600;
}

.breadcrumb-item + .breadcrumb-item::before {
  color: #555;
  content: "›";
  font-size: 1.2rem;
}

/* ===== HEADER ===== */
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 25px 30px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.05);
  flex-wrap: wrap;
  gap: 15px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-tag {
  display: inline-block;
  background: rgba(255, 215, 0, 0.08);
  color: #ffd700;
  padding: 3px 14px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-family: "Orbitron", sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  width: fit-content;
}

.catalog-title {
  font-family: "Orbitron", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.catalog-subtitle {
  color: #888;
  font-size: 0.95rem;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
}

.btn-add {
  background: linear-gradient(135deg, #ffd700, #f0a500);
  color: #000;
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
}

.btn-add i {
  font-size: 0.9rem;
}

/* ===== FORMULARIO ===== */
.form-wrapper {
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

/* ===== GRID ===== */
.fabricantes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.grid-item {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

.grid-item:nth-child(1) {
  animation-delay: 0.05s;
}
.grid-item:nth-child(2) {
  animation-delay: 0.1s;
}
.grid-item:nth-child(3) {
  animation-delay: 0.15s;
}
.grid-item:nth-child(4) {
  animation-delay: 0.2s;
}
.grid-item:nth-child(5) {
  animation-delay: 0.25s;
}
.grid-item:nth-child(6) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 4rem;
  color: #333;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #fff;
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .catalog-header {
    flex-direction: column;
    padding: 20px;
  }

  .header-actions {
    width: 100%;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .catalog-title {
    font-size: 1.6rem;
  }

  .fabricantes-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .fabricantes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
