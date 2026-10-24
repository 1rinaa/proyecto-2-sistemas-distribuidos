<template>
  <div class="autos-view fade-in">
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
            <i class="fas fa-car-side"></i> Catálogo de Autos
          </li>
        </ol>
      </nav>
    </div>

    <!-- ===== HEADER ===== -->
    <div class="catalog-header">
      <div class="header-content">
        <span class="section-tag">Colección 2024</span>
        <h1 class="catalog-title">
          Catálogo de <span class="text-gold">Autos</span>
        </h1>
        <p class="catalog-subtitle">
          Descubre nuestra colección de superdeportivos de élite
        </p>
        <div class="stat-pill">
          <i class="fas fa-car"></i>
          <span>{{ autosFiltrados.length }}</span>
          <small>Autos</small>
        </div>
      </div>
      <div class="header-actions">
        <button
          v-if="isAuthenticated"
          class="btn-add"
          @click="mostrarFormulario = !mostrarFormulario"
        >
          <i class="fas fa-plus"></i>
          {{ mostrarFormulario ? "Cancelar" : "Agregar Auto" }}
        </button>
      </div>
    </div>

    <!-- ===== FILTROS Y BÚSQUEDA ===== -->
    <div class="filters-section">
      <div class="filters-row">
        <!-- Buscador -->
        <div class="search-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar por modelo, marca..."
            @input="applyFilters"
          />
          <button v-if="searchQuery" class="search-clear" @click="clearSearch">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Filtro por Marca -->
        <div class="filter-group">
          <label>Marca</label>
          <select
            v-model="selectedMarca"
            @change="applyFilters"
            class="filter-select"
          >
            <option value="">Todas las marcas</option>
            <option v-for="m in marcasDisponibles" :key="m" :value="m">
              {{ m }}
            </option>
          </select>
        </div>

        <!-- Filtro por Categoría -->
        <div class="filter-group">
          <label>Categoría</label>
          <select
            v-model="selectedCategoria"
            @change="applyFilters"
            class="filter-select"
          >
            <option value="">Todas las categorías</option>
            <option
              v-for="c in categoriasDisponibles"
              :key="c.id"
              :value="c.id"
            >
              {{ c.tipo_motor }}
            </option>
          </select>
        </div>

        <!-- Limpiar filtros -->
        <button
          v-if="filtrosActivos"
          class="btn-clear-filters"
          @click="clearFilters"
        >
          <i class="fas fa-undo"></i> Limpiar filtros
        </button>
      </div>
    </div>

    <!-- ===== FORMULARIO ===== -->
    <div v-if="mostrarFormulario" class="form-wrapper">
      <AutoForm
        :fabricantes="fabricantes"
        :categorias="categorias"
        :autoEditando="autoEditando"
        @guardar="handleGuardarAuto"
        @cancelar="cancelarEdicion"
      />
    </div>

    <!-- ===== GRID DE AUTOS ===== -->
    <div v-if="!loading && autosFiltrados.length > 0" class="autos-grid">
      <div class="grid-item" v-for="auto in autosFiltrados" :key="auto.id">
        <AutoCard
          :auto="auto"
          @ver="verAuto"
          @editar="editarAuto"
          @eliminar="eliminarAuto"
        />
      </div>
    </div>

    <!-- ===== LOADING ===== -->
    <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando autos...</p>
    </div>

    <!-- ===== EMPTY STATE ===== -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-car-side"></i>
      </div>
      <h3>No se encontraron autos</h3>
      <p>{{ mensajeVacio }}</p>
      <button v-if="filtrosActivos" class="btn-gold mt-3" @click="clearFilters">
        <i class="fas fa-undo"></i> Limpiar filtros
      </button>
    </div>

    <!-- ===== MODAL DETALLES ===== -->
    <AutoDetail
      :auto="autoSeleccionado"
      :visible="mostrarDetalle"
      @cerrar="mostrarDetalle = false"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import AutoCard from "@/components/Autos/AutoCard.vue";
import AutoForm from "@/components/Autos/AutoForm.vue";
import AutoDetail from "@/components/Autos/AutoDetail.vue";

export default {
  name: "AutosView",
  components: {
    AutoCard,
    AutoForm,
    AutoDetail,
  },
  data() {
    return {
      // Estado del formulario
      mostrarFormulario: false,
      mostrarDetalle: false,
      autoEditando: null,
      autoSeleccionado: null,

      // Filtros y búsqueda
      searchQuery: "",
      selectedMarca: "",
      selectedCategoria: "",
      autosFiltrados: [],
    };
  },
  computed: {
    ...mapState(["autos", "fabricantes", "categorias", "loading"]),
    ...mapGetters(["isAuthenticated"]),

    totalPotencia() {
      return this.autosFiltrados.reduce(
        (sum, auto) => sum + (auto.potencia || 0),
        0
      );
    },

    // Marcas disponibles para el filtro (obtenidas de los autos)
    marcasDisponibles() {
      const marcas = new Set();
      this.autos.forEach((auto) => {
        if (auto.marca) marcas.add(auto.marca);
        if (auto.fabricante_nombre) marcas.add(auto.fabricante_nombre);
      });
      return Array.from(marcas).sort();
    },

    // Categorías disponibles para el filtro
    categoriasDisponibles() {
      return this.categorias || [];
    },

    // Verificar si hay filtros activos
    filtrosActivos() {
      return this.searchQuery || this.selectedMarca || this.selectedCategoria;
    },

    // Mensaje para el estado vacío
    mensajeVacio() {
      if (this.searchQuery) {
        return `No se encontraron autos con "${this.searchQuery}"`;
      }
      if (this.selectedMarca) {
        return `No hay autos de la marca "${this.selectedMarca}"`;
      }
      if (this.selectedCategoria) {
        const cat = this.categorias.find(
          (c) => c.id === parseInt(this.selectedCategoria)
        );
        return `No hay autos en la categoría "${cat?.tipo_motor || ""}"`;
      }
      return "No hay autos en el catálogo";
    },
  },
  mounted() {
    this.fetchAutos();
    this.fetchFabricantes();
    this.fetchCategorias();
  },
  watch: {
    autos: {
      immediate: true,
      handler() {
        this.applyFilters();
      },
    },
  },
  methods: {
    ...mapActions([
      "fetchAutos",
      "fetchFabricantes",
      "fetchCategorias",
      "createAuto",
      "updateAuto",
      "deleteAuto",
    ]),

    // ===== FILTROS =====
    applyFilters() {
      if (!this.autos || this.autos.length === 0) {
        this.autosFiltrados = [];
        return;
      }

      let filtered = [...this.autos];

      // Búsqueda por texto
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter((auto) => {
          return (
            auto.modelo?.toLowerCase().includes(query) ||
            auto.marca?.toLowerCase().includes(query) ||
            auto.fabricante_nombre?.toLowerCase().includes(query) ||
            auto.tipo_motor?.toLowerCase().includes(query)
          );
        });
      }

      // Filtro por marca
      if (this.selectedMarca) {
        filtered = filtered.filter((auto) => {
          return (
            auto.marca === this.selectedMarca ||
            auto.fabricante_nombre === this.selectedMarca
          );
        });
      }

      // Filtro por categoría
      if (this.selectedCategoria) {
        filtered = filtered.filter(
          (auto) => auto.categoria_id === parseInt(this.selectedCategoria)
        );
      }

      this.autosFiltrados = filtered;
    },

    clearSearch() {
      this.searchQuery = "";
      this.applyFilters();
    },

    clearFilters() {
      this.searchQuery = "";
      this.selectedMarca = "";
      this.selectedCategoria = "";
      this.applyFilters();
    },

    // ===== CRUD =====
    async handleGuardarAuto(autoData) {
      try {
        if (this.autoEditando) {
          await this.updateAuto({ id: this.autoEditando.id, auto: autoData });
        } else {
          await this.createAuto(autoData);
        }
        this.mostrarFormulario = false;
        this.autoEditando = null;
      } catch (error) {
        console.error("Error guardando auto:", error);
        alert("Error al guardar el auto");
      }
    },

    editarAuto(auto) {
      this.autoEditando = auto;
      this.mostrarFormulario = true;
    },

    cancelarEdicion() {
      this.mostrarFormulario = false;
      this.autoEditando = null;
    },

    async eliminarAuto(id) {
      if (confirm("¿Estás seguro de eliminar este auto?")) {
        try {
          await this.deleteAuto(id);
        } catch (error) {
          console.error("Error eliminando auto:", error);
          alert("Error al eliminar el auto");
        }
      }
    },

    async verAuto(id) {
      try {
        const response = await fetch(`/api/autos/${id}`);
        const data = await response.json();
        this.autoSeleccionado = data;
        this.mostrarDetalle = true;
      } catch (error) {
        console.error("Error cargando detalles:", error);
        alert("Error al cargar los detalles del auto");
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
  margin-bottom: 20px;
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

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  margin-top: 6px;
  padding: 6px 157px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.stat-pill i {
  color: #ffd700;
  font-size: 0.8rem;
}

.stat-pill span {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
}

.stat-pill small {
  font-size: 0.6rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
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

/* ===== FILTROS ===== */
.filters-section {
  margin-bottom: 25px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.05);
}

.filters-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 15px;
}

/* Buscador */
.search-wrapper {
  position: relative;
  flex: 2;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 40px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  font-family: "Rajdhani", sans-serif;
  transition: all 0.3s ease;
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.06);
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.05);
  outline: none;
}

.search-input::placeholder {
  color: #555;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.search-clear:hover {
  color: #fff;
}

/* Filtros */
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 140px;
}

.filter-group label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: "Orbitron", sans-serif;
}

.filter-select {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #fff;
  font-size: 0.85rem;
  font-family: "Rajdhani", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}

.filter-select:focus {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.05);
  outline: none;
}

.filter-select option {
  background: #1a1a2e;
  color: #fff;
}

/* Botón limpiar filtros */
.btn-clear-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
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
  white-space: nowrap;
}

.btn-clear-filters:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.1);
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

/* ===== GRID DE AUTOS ===== */
.autos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
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

/* ===== LOADING ===== */
.loading-state {
  text-align: center;
  padding: 60px 0;
}

.loading-state .spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 215, 0, 0.1);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #888;
  font-size: 1rem;
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

  .header-stats {
    flex-wrap: wrap;
  }

  .filters-row {
    flex-direction: column;
  }

  .search-wrapper,
  .filter-group {
    width: 100%;
    min-width: unset;
  }

  .btn-clear-filters {
    width: 100%;
    justify-content: center;
  }

  .autos-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .autos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
