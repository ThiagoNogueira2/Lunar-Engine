<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  src: String,
  alt: { type: String, default: '' },
  imgClass: { type: String, default: 'w-full h-full object-cover' },
})

const root = ref(null)
const show = ref(false)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        show.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '120px' },
  )
  if (root.value) observer.observe(root.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div ref="root" class="w-full aspect-square bg-white/[0.03]">
    <img v-if="show && src" :src="src" :alt="alt" :class="imgClass" decoding="async" loading="lazy" />
  </div>
</template>
