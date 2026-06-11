<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <button
    @click="router.back()"
    class="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-6 transition-colors group"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="group-hover:-translate-x-0.5 transition-transform"
    >
      <path d="M10 12L6 8l4-4" />
    </svg>
    Voltar
  </button>
</template>
