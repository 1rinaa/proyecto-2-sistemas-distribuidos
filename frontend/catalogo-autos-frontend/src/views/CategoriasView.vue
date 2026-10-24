<template>
  <div class="categorias-view fade-in">
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
            <i class="fas fa-sliders-h"></i> Categorías
          </li>
        </ol>
      </nav>
    </div>

    <!-- ===== HEADER ===== -->
    <div class="catalog-header">
      <div class="header-content">
        <span class="section-tag">Clasificación</span>
        <h1 class="catalog-title">
          Categorías <span class="text-gold">Técnicas</span>
        </h1>
        <p class="catalog-subtitle">
          Especificaciones técnicas de los motores y rendimiento
        </p>
      </div>
      <div class="header-actions">
        <button
          v-if="isAuthenticated"
          class="btn-add"
          @click="mostrarForm = !mostrarForm"
        >
          <i class="fas fa-plus"></i>
          {{ mostrarForm ? "Cancelar" : "Agregar Categoría" }}
        </button>
      </div>
    </div>

    <!-- ===== FORMULARIO ===== -->
    <div v-if="mostrarForm" class="form-wrapper">
      <CategoriaForm
        :categoriaEditando="editandoCat"
        @guardar="guardarCategoria"
        @cancelar="cancelarEdicion"
      />
    </div>

    <!-- ===== GRID DE CATEGORÍAS ===== -->
    <div v-if="categorias.length > 0" class="categorias-grid">
      <div class="grid-item" v-for="c in categorias" :key="c.id">
        <CategoriaCard
          :categoria="c"
          @editar="editarCategoria"
          @eliminar="eliminarCategoria"
          @ver="verCategoria"
        />
      </div>
    </div>

    <!-- ===== EMPTY STATE ===== -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-sliders-h"></i>
      </div>
      <h3>No hay categorías registradas</h3>
      <p>Agrega tu primera categoría usando el botón "Agregar Categoría"</p>
    </div>

    <CategoriaDetail
      :categoria="categoriaSeleccionada"
      :autos="autos"
      :visible="mostrarDetalle"
      @cerrar="mostrarDetalle = false"
      @editar="editarCategoria"
      @ver-auto="verAuto"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import CategoriaCard from "@/components/Categorias/CategoriaCard.vue";
import CategoriaForm from "@/components/Categorias/CategoriaForm.vue";
import CategoriaDetail from "@/components/Categorias/CategoriaDetail.vue";

export default {
  name: "CategoriasView",
  components: {
    CategoriaCard,
    CategoriaForm,
    CategoriaDetail,
  },
  data() {
    return {
      mostrarForm: false,
      editandoCat: null,
      mostrarDetalle: false,
      categoriaSeleccionada: null,
    };
  },
  computed: {
    ...mapState(["categorias", "autos"]),
    ...mapGetters(["isAuthenticated"]),
  },
  mounted() {
    this.fetchCategorias();
    this.fetchAutos();
  },
  methods: {
    ...mapActions([
      "fetchCategorias",
      "fetchAutos",
      "createCategoria",
      "updateCategoria",
      "deleteCategoria",
    ]),

    verCategoria(categoria) {
      this.categoriaSeleccionada = categoria;
      this.mostrarDetalle = true;
    },

    verAuto(id) {
      this.$router.push({ path: "/autos", query: { auto: id } });
    },

    // Abrir formulario para editar
    editarCategoria(categoria) {
      this.editandoCat = categoria;
      this.mostrarForm = true;
    },

    // Guardar (crear o actualizar)
    async guardarCategoria(data) {
      try {
        if (this.editandoCat) {
          // Actualizar categoría existente
          await this.updateCategoria({
            id: this.editandoCat.id,
            categoria: data,
          });
        } else {
          // Crear nueva categoría
          await this.createCategoria(data);
        }
        this.mostrarForm = false;
        this.editandoCat = null;
      } catch (error) {
        console.error("Error guardando categoría:", error);
        alert("Error al guardar la categoría");
      }
    },

    // Cancelar edición
    cancelarEdicion() {
      this.mostrarForm = false;
      this.editandoCat = null;
    },

    // Eliminar categoría
    async eliminarCategoria(id) {
      if (confirm("¿Eliminar esta categoría?")) {
        try {
          await this.deleteCategoria(id);
        } catch (error) {
          console.error("Error eliminando categoría:", error);
          alert("Error al eliminar la categoría");
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
.categorias-grid {
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

  .categorias-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .categorias-grid {
    grid-template-columns: 1fr;
  }
}
</style>
