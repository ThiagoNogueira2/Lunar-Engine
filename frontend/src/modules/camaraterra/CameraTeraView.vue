<script setup>
import LazyImg from '../../components/ui/LazyImg.vue'
import { epicDateOf, epicImageUrl, useEpic } from '../../composables/useEpic.js'
import { tabClass } from '../../composables/useApi.js'

const { tab, tabs, data, loading, error, dateDetail, mode, isDates, dateKind, switchTab, loadDate } = useEpic()
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Câmera da Terra</h1>
      <p class="text-sm text-white/40">EPIC — natural e enhanced.</p>
    </header>

    <div class="flex gap-2 mb-6 flex-wrap">
      <button v-for="t in tabs" :key="t.id" :class="tabClass(tab === t.id)" @click="switchTab(t.id)">{{ t.label }}</button>
    </div>

    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">Falha ao carregar ({{ error }}).</p>

    <div v-else-if="data?.length" class="grid grid-cols-4 gap-4">
      <template v-if="isDates()">
        <button
          v-for="d in data.slice(0, 32)"
          :key="epicDateOf(d)"
          class="text-xs text-white/50 px-3 py-2 rounded-lg border border-white/[0.08] hover:border-white/20 text-left"
          @click="loadDate(d)"
        >{{ epicDateOf(d) }}</button>
      </template>
      <template v-else>
        <div v-for="img in data.slice(0, 8)" :key="img.identifier" class="rounded-xl border border-white/[0.08] overflow-hidden">
          <LazyImg :src="epicImageUrl(img, mode())" :alt="img.caption" />
          <p class="p-3 text-xs text-white/60 truncate">{{ img.caption }}</p>
        </div>
      </template>
    </div>

    <div v-if="dateDetail?.length" class="mt-6 grid grid-cols-4 gap-4">
      <div v-for="img in dateDetail.slice(0, 6)" :key="img.identifier" class="rounded-xl border border-white/[0.08] overflow-hidden">
        <LazyImg :src="epicImageUrl(img, dateKind())" :alt="img.caption" />
      </div>
    </div>
  </div>
</template>
