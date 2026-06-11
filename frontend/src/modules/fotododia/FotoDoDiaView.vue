<script setup>
import { useApi } from '../../composables/useApi.js'

const { data: apod, loading, error } = useApi({ immediate: true, url: '/apod' })
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Foto do Dia</h1>
      <p class="text-sm text-white/40">Astronomy Picture of the Day — NASA APOD.</p>
    </header>

    <NasaLoader v-if="loading" />

    <p v-else-if="error" class="text-sm text-red-400 py-16">Falha ao carregar os dados ({{ error }}).</p>

    <template v-else-if="apod">
      <div class="grid grid-cols-2 gap-6 max-w-8xl items-stretch ">
        <div class="relative h-full min-h-0 rounded-xl border border-white/[0.08] overflow-hidden">
          <img
            v-if="apod.media_type === 'image'"
            :src="apod.url"
            :alt="apod.title"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <iframe
            v-else-if="apod.media_type === 'video'"
            :src="apod.url"
            class="absolute inset-0 h-full w-full"
            allowfullscreen
          />
        </div>

        <div class="flex flex-col gap-4 h-full min-h-0">
          <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Título</p>
            <p class="text-xl font-bold">{{ apod.title }}</p>
          </div>
          <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Data</p>
            <p class="text-sm text-white/80">{{ apod.date }}</p>
          </div>
          <div v-if="apod.copyright" class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
            <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Crédito</p>
            <p class="text-sm text-white/80">{{ apod.copyright }}</p>
          </div>
          <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 flex-1 min-h-0 overflow-y-auto">
            <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Descrição</p>
            <p class="text-sm text-white/70 leading-relaxed">{{ apod.explanation }}</p>
          </div>
          <a
            v-if="apod.hdurl"
            :href="apod.hdurl"
            target="_blank"
            class="flex items-center gap-1.5 text-xs border border-white/15 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors w-fit"
          >
            Ver imagem em HD
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5v4.5" />
            </svg>
          </a>
        </div>
      </div>
    </template>
  </div>
</template>
