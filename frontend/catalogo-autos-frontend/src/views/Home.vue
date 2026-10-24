<template>
  <div class="home fade-in">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <div class="hero-content">
              <span class="badge-premium mb-3">
                <i class="fas fa-crown"></i> Colección 2024
              </span>
              <h1 class="hero-title">
                Descubre los<br />
                <span class="text-gold">Superdeportivos</span><br />
                más exclusivos
              </h1>
              <p class="hero-text">
                Explora nuestro catálogo de autos de ensueño. Cada vehículo ha
                sido seleccionado por su rendimiento, diseño y exclusividad.
              </p>

              <!-- Contadores Animados -->
              <div class="hero-stats">
                <AnimatedCounter :end="autosCount" label="Autos" />
                <AnimatedCounter :end="fabricantesCount" label="Marcas" />
                <AnimatedCounter :end="categoriasCount" label="Categorías" />
              </div>

              <div class="hero-actions">
                <router-link to="/autos" class="btn-hero btn-hero-primary">
                  <span class="btn-text">Explorar Autos</span>
                  <span class="btn-icon"
                    ><i class="fas fa-arrow-right"></i
                  ></span>
                </router-link>
                <router-link
                  to="/fabricantes"
                  class="btn-hero btn-hero-secondary"
                >
                  <span class="btn-text">Ver Marcas</span>
                  <span class="btn-icon"
                    ><i class="fas fa-arrow-right"></i
                  ></span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image-wrapper">
              <div class="hero-image-glow"></div>
              <Carousel3D :images="carouselImages" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Section -->
    <section class="featured-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <span class="section-tag">Destacados</span>
          <h2 class="section-title">
            <span class="text-gold">Autos</span> de Élite
          </h2>
          <!-- ===== TEXTO MÁS CLARO ===== -->
          <p class="hero-subtitle">
            Los más potentes y exclusivos de nuestra colección
          </p>
        </div>
        <div class="row g-4">
          <div
            class="col-md-4 mb-4"
            v-for="auto in featuredAutos"
            :key="auto.id"
          >
            <div class="card-premium">
              <div class="card-image-wrapper">
                <img
                  :src="getAutoImageUrl(auto.imagen)"
                  class="card-image"
                  :alt="auto.modelo"
                  @error="handleImageError"
                />
                <div class="card-power-badge">
                  <i class="fas fa-tachometer-alt"></i> {{ auto.potencia }} HP
                </div>
                <div class="card-overlay">
                  <router-link to="/autos" class="btn-overlay">
                    <i class="fas fa-arrow-right"></i>
                  </router-link>
                </div>
              </div>
              <div class="card-body">
                <div class="card-brand">
                  <i class="fas fa-building"></i>
                  {{ auto.marca || auto.fabricante_nombre }}
                </div>
                <h5 class="card-title">{{ auto.modelo }}</h5>
                <div class="card-specs">
                  <span class="spec-item" v-if="auto.tipo_motor">
                    <i class="fas fa-cog"></i> {{ auto.tipo_motor }}
                  </span>
                  <span class="spec-item" v-if="auto.traccion">
                    <i class="fas fa-road"></i> {{ auto.traccion }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AnimatedCounter from "@/components/AnimatedCounter.vue";
import Carousel3D from "@/components/Carousel3D.vue";

export default {
  name: "HomePage",
  components: {
    AnimatedCounter,
    Carousel3D,
  },
  data() {
    return {
      carouselImages: [
        {
          url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
          alt: "Bugatti Superdeportivo",
          title: "Bugatti Bolide",
          subtitle: "1825 HP de pura adrenalina",
        },
        {
          url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
          alt: "Lamborghini Superdeportivo",
          title: "Lamborghini Revuelto",
          subtitle: "Híbrido V12 de 1001 HP",
        },
        {
          url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          alt: "Ferrari Superdeportivo",
          title: "Ferrari Daytona SP3",
          subtitle: "V12 atmosférico de 840 HP",
        },
        {
          url: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800",
          alt: "Porsche Superdeportivo",
          title: "Porsche 918 Spyder",
          subtitle: "Híbrido V8 de 877 HP",
        },
      ],
    };
  },
  computed: {
    ...mapState(["autos", "fabricantes", "categorias"]),
    autosCount() {
      return this.autos.length || 20;
    },
    fabricantesCount() {
      return this.fabricantes.length || 17;
    },
    categoriasCount() {
      return this.categorias.length || 19;
    },
    featuredAutos() {
      return this.autos.slice(0, 3);
    },
  },
  methods: {
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
  mounted() {
    this.$store.dispatch("fetchAutos");
    this.$store.dispatch("fetchFabricantes");
    this.$store.dispatch("fetchCategorias");
  },
};
</script>

<style scoped>
/* ===== HERO SECTION ===== */
.hero-section {
  padding: 40px 0 20px;
  position: relative;
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-content {
  max-width: 600px;
}

.badge-premium {
  display: inline-block;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  color: #ffd700;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-family: "Orbitron", sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.badge-premium i {
  margin-right: 8px;
}

.hero-title {
  font-family: "Orbitron", sans-serif;
  font-size: 3.8rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
}

.hero-text {
  font-size: 1.15rem;
  color: #aaa;
  margin-bottom: 30px;
  line-height: 1.8;
}

.hero-stats {
  display: flex;
  gap: 50px;
  margin-bottom: 35px;
}

/* ===== TEXTO MÁS CLARO ===== */
.hero-subtitle {
  font-size: 1.1rem;
  color: #cccccc !important;
  font-weight: 300;
  letter-spacing: 1px;
  max-width: 500px;
  margin: 0 auto;
}

/* ===== BOTONES HERO ===== */
.hero-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 30px;
  border-radius: 50px;
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  border: none;
  cursor: pointer;
}

.btn-hero .btn-text {
  position: relative;
  z-index: 2;
}

.btn-hero .btn-icon {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-hero:hover .btn-icon {
  transform: translateX(6px);
}

/* Botón Primario */
.btn-hero-primary {
  background: linear-gradient(135deg, #ffd700, #f0a500);
  color: #000 !important;
  box-shadow: 0 4px 25px rgba(255, 215, 0, 0.25);
}

.btn-hero-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
  z-index: 1;
}

.btn-hero-primary:hover::before {
  left: 100%;
}

.btn-hero-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 40px rgba(255, 215, 0, 0.4);
  color: #000 !important;
}

/* Botón Secundario */
.btn-hero-secondary {
  background: transparent;
  color: #ffd700 !important;
  border: 2px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
}

.btn-hero-secondary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 215, 0, 0.05);
  border-radius: 50px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.btn-hero-secondary:hover::before {
  opacity: 1;
}

.btn-hero-secondary:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: #ffd700;
  box-shadow: 0 8px 40px rgba(255, 215, 0, 0.15);
  color: #ffd700 !important;
}

/* ===== IMAGEN HERO ===== */
.hero-image-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.hero-image-glow {
  position: absolute;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.15), transparent 60%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

/* ===== TARJETAS ===== */
.section-header {
  position: relative;
}

.section-tag {
  display: inline-block;
  background: rgba(255, 215, 0, 0.08);
  color: #ffd700;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-family: "Orbitron", sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.section-title {
  font-family: "Orbitron", sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px;
}

.card-premium {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 215, 0, 0.06);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: 100%;
  backdrop-filter: blur(10px);
  position: relative;
}

.card-premium:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 215, 0, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 240px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.card-premium:hover .card-image {
  transform: scale(1.08);
}

.card-power-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: #ffd700;
  padding: 6px 16px;
  border-radius: 30px;
  font-family: "Orbitron", sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(255, 215, 0, 0.15);
  z-index: 2;
}

.card-power-badge i {
  margin-right: 6px;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card-premium:hover .card-overlay {
  opacity: 1;
}

.btn-overlay {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700, #f0a500);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  text-decoration: none;
  transition: all 0.3s ease;
  transform: scale(0.8);
}

.card-premium:hover .btn-overlay {
  transform: scale(1);
}

.btn-overlay:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
  color: #000;
}

.card-body {
  padding: 22px 24px 24px;
}

.card-brand {
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.card-brand i {
  color: #ffd700;
  margin-right: 6px;
}

.card-title {
  font-family: "Orbitron", sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.card-specs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.spec-item {
  font-size: 0.7rem;
  color: #999;
  background: rgba(255, 255, 255, 0.04);
  padding: 3px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.spec-item i {
  color: #ffd700;
  margin-right: 4px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .hero-title {
    font-size: 2.8rem;
  }

  .hero-stats {
    gap: 30px;
  }

  .hero-image-glow {
    width: 500px;
    height: 500px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-stats {
    gap: 15px;
    flex-wrap: wrap;
  }

  .hero-image-glow {
    width: 300px;
    height: 300px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-hero {
    justify-content: center;
  }

  .section-title {
    font-size: 2rem;
  }

  .card-image-wrapper {
    height: 200px;
  }

  .hero-subtitle {
    font-size: 0.95rem;
    color: #cccccc !important;
    padding: 0 15px;
  }
}
</style>
