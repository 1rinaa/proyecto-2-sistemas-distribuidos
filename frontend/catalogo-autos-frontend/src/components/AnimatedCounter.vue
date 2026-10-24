<template>
  <div class="counter-wrapper">
    <span class="counter-number">{{ displayValue }}</span>
    <span class="counter-label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "AnimatedCounter",
  props: {
    end: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 2000,
    },
  },
  data() {
    return {
      currentValue: 0,
      displayValue: 0,
    };
  },
  mounted() {
    this.animateValue();
  },
  methods: {
    animateValue() {
      const start = 0;
      const end = this.end;
      const duration = this.duration;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Función de easing para que sea más suave
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(easeOutQuart * (end - start) + start);

        this.displayValue = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          this.displayValue = end;
        }
      };

      requestAnimationFrame(updateCounter);
    },
  },
};
</script>

<style scoped>
.counter-wrapper {
  text-align: center;
}

.counter-number {
  display: block;
  font-family: "Orbitron", sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffd700, #f0a500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
}

.counter-label {
  display: block;
  font-size: 0.9rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-top: 5px;
  font-family: "Rajdhani", sans-serif;
  font-weight: 600;
}

@media (max-width: 768px) {
  .counter-number {
    font-size: 2.5rem;
  }
}
</style>
