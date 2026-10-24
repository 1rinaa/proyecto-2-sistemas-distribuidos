<template>
  <div class="carousel-wrapper">
    <div class="carousel-container">
      <div
        class="carousel-track"
        :style="{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="carousel-slide"
        >
          <img :src="image.url" :alt="image.alt" class="carousel-image" />
          <div class="carousel-overlay">
            <h3>{{ image.title }}</h3>
            <p>{{ image.subtitle }}</p>
          </div>
        </div>
      </div>

      <!-- Indicadores -->
      <div class="carousel-indicators">
        <button
          v-for="(image, index) in images"
          :key="index"
          class="indicator-dot"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></button>
      </div>

      <!-- Flechas -->
      <button class="carousel-arrow prev" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="carousel-arrow next" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Carousel3D",
  props: {
    images: {
      type: Array,
      required: true,
      default: () => [],
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 4000,
    },
  },
  data() {
    return {
      currentIndex: 0,
      timer: null,
    };
  },
  mounted() {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  },
  beforeUnmount() {
    this.stopAutoPlay();
  },
  methods: {
    goToSlide(index) {
      this.currentIndex = index;
      this.resetAutoPlay();
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.resetAutoPlay();
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
      this.resetAutoPlay();
    },
    startAutoPlay() {
      this.timer = setInterval(() => {
        this.nextSlide();
      }, this.interval);
    },
    stopAutoPlay() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    resetAutoPlay() {
      if (this.autoPlay) {
        this.stopAutoPlay();
        this.startAutoPlay();
      }
    },
  },
};
</script>

<style scoped>
/* ===== CONTENEDOR PRINCIPAL ===== */
.carousel-wrapper {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  aspect-ratio: 16/9;
  background: #0a0a0a;
  width: 100%;
  max-width: 100%;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  will-change: transform;
  flex-shrink: 0;
}

.carousel-slide {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
  min-width: 0;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ===== OVERLAY ===== */
.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  color: #fff;
  pointer-events: none;
}

.carousel-overlay h3 {
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 5px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  color: #ffffff;
}

.carousel-overlay p {
  color: #ddd;
  margin: 0;
  font-size: 1rem;
  font-weight: 300;
}

/* ===== INDICADORES ===== */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator-dot.active {
  background: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transform: scale(1.2);
}

.indicator-dot:hover {
  background: rgba(255, 215, 0, 0.6);
}

/* ===== FLECHAS ===== */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-arrow:hover {
  background: rgba(255, 215, 0, 0.25);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
  transform: translateY(-50%) scale(1.1);
  border-color: rgba(255, 215, 0, 0.3);
}

.carousel-arrow.prev {
  left: 15px;
}

.carousel-arrow.next {
  right: 15px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .carousel-arrow {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .carousel-overlay h3 {
    font-size: 1.2rem;
  }

  .carousel-overlay p {
    font-size: 0.85rem;
  }

  .carousel-overlay {
    padding: 20px;
  }
}
</style>
