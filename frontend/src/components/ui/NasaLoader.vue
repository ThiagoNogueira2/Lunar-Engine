<script setup>
defineProps({
  message: { type: String, default: 'Carregando...' },
})

const stars = [
  { left: '12%', top: '8%', delay: '0s' },
  { left: '72%', top: '15%', delay: '-0.4s' },
  { left: '45%', top: '25%', delay: '-0.8s' },
  { left: '85%', top: '40%', delay: '-1.2s' },
  { left: '20%', top: '55%', delay: '-0.2s' },
  { left: '60%', top: '65%', delay: '-0.6s' },
  { left: '8%', top: '78%', delay: '-1s' },
  { left: '78%', top: '82%', delay: '-1.4s' },
  { left: '38%', top: '88%', delay: '-0.3s' },
  { left: '55%', top: '45%', delay: '-0.9s' },
  { left: '28%', top: '35%', delay: '-1.1s' },
  { left: '90%', top: '58%', delay: '-0.5s' },
]
</script>

<template>
  <div class="loader">
    <div class="scene" aria-hidden="true">
      <span
        v-for="(star, i) in stars"
        :key="i"
        class="star"
        :style="{ left: star.left, top: star.top, animationDelay: star.delay }"
      />

      <div class="rocket-wrap">
        <svg class="rocket" viewBox="0 0 48 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24 4C24 4 14 22 14 38V52L10 58H38L34 52V38C34 22 24 4 24 4Z"
            fill="#e8eaf0"
          />
          <path
            d="M14 52L10 58L14 62L18 56L14 52Z"
            fill="#4d9fff"
          />
          <path
            d="M34 52L38 58L34 62L30 56L34 52Z"
            fill="#4d9fff"
          />
          <path
            d="M18 56H30L28 64H20L18 56Z"
            fill="#3a7fd4"
          />
          <circle cx="24" cy="30" r="6" fill="#071426" stroke="#4d9fff" stroke-width="1.5" />
          <circle cx="24" cy="30" r="3" fill="#4d9fff" opacity="0.5" />
          <path
            d="M24 4L22 14H26L24 4Z"
            fill="#ffffff"
          />
        </svg>

        <div class="exhaust">
          <span class="flame flame--outer" />
          <span class="flame flame--inner" />
          <span
            v-for="(offset, i) in [-8, -3, 3, 8]"
            :key="i"
            class="particle"
            :style="{ '--offset': `${offset}px`, animationDelay: `${i * -0.2}s` }"
          />
        </div>
      </div>
    </div>

    <p class="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 4rem 0;
}

.scene {
  position: relative;
  width: 100px;
  height: 130px;
  overflow: hidden;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  animation: twinkle 2s ease-in-out infinite;
}

.rocket-wrap {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 48px;
  transform: translateX(-50%);
  animation: fly 2.4s ease-in-out infinite;
}

.rocket {
  display: block;
  width: 48px;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(77, 159, 255, 0.35));
}

.exhaust {
  position: absolute;
  left: 50%;
  bottom: -2px;
  transform: translateX(-50%);
  width: 20px;
  height: 36px;
}

.flame {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  transform-origin: center top;
}

.flame--outer {
  width: 14px;
  height: 28px;
  background: linear-gradient(to bottom, #ffb347, #ff6b35, transparent);
  animation: flame-outer 0.15s ease-in-out infinite alternate;
}

.flame--inner {
  width: 8px;
  height: 18px;
  background: linear-gradient(to bottom, #fff5a0, #ffd700, transparent);
  animation: flame-inner 0.1s ease-in-out infinite alternate;
}

.particle {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #ff8c42;
  animation: particle 0.8s ease-out infinite;
  animation-delay: calc(var(--i) * -0.2s);
}

.message {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

@keyframes fly {
  0% {
    transform: translateX(-50%) translateY(60px) rotate(-12deg);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  50% {
    transform: translateX(-50%) translateY(20px) rotate(4deg);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(-70px) rotate(-6deg);
    opacity: 0;
  }
}

@keyframes flame-outer {
  from {
    transform: translateX(-50%) scaleY(1) scaleX(1);
    opacity: 0.9;
  }
  to {
    transform: translateX(-50%) scaleY(1.25) scaleX(0.85);
    opacity: 1;
  }
}

@keyframes flame-inner {
  from {
    transform: translateX(-50%) scaleY(0.9);
  }
  to {
    transform: translateX(-50%) scaleY(1.15);
  }
}

@keyframes particle {
  0% {
    transform: translateX(-50%) translateY(0) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translateX(calc(-50% + (var(--i) - 2.5) * 6px)) translateY(28px) scale(0);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.4);
  }
}
</style>
