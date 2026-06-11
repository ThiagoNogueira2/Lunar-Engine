<script setup>
import { DONKI_TABS, donkiId, donkiNote, donkiStart } from '../../composables/donki.js'
import { tabClass, useTabs } from '../../composables/useApi.js'

const { tab, tabs, data, loading, error, load } = useTabs(DONKI_TABS);
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Clima Espacial</h1>
      <p class="text-sm text-white/40">
        DONKI — todos os endpoints de clima espacial.
      </p>
    </header>

    <div class="flex gap-2 mb-6 flex-wrap">
      <button
        v-for="t in tabs"
        :key="t.id"
        :class="tabClass(tab === t.id)"
        @click="load(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">
      Falha ao carregar ({{ error }}).
    </p>
    <p v-else-if="!data?.length" class="text-sm text-white/40 py-8">
      Sem eventos nesta categoria.
    </p>

    <div v-else class="rounded-xl border border-white/[0.08] overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr
            class="border-b border-white/[0.08] text-left text-xs text-white/40 uppercase tracking-wider"
          >
            <th class="px-5 py-3">ID</th>
            <th class="px-5 py-3">Início</th>
            <th class="px-5 py-3">Observação</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in data.slice(0, 30)"
            :key="i"
            class="border-b border-white/[0.05] hover:bg-white/[0.02]"
          >
            <td class="px-5 py-3 text-xs font-mono text-white/40">
              {{ donkiId(item, i) }}
            </td>
            <td class="px-5 py-3 text-white/60 text-xs">
              {{ donkiStart(item) }}
            </td>
            <td class="px-5 py-3 text-white/50 text-xs truncate max-w-md">
              {{ donkiNote(item) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
