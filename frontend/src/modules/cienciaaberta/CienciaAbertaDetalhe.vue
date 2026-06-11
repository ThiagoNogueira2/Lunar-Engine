<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  OSDR_TYPE_LABELS,
  osdDetailRows,
  osdDetailTitle,
  osdLinkedItem,
  osdParentLinks,
  osdRows,
} from '../../composables/useOsdr.js'
import { useApi } from '../../composables/useApi.js'

const route = useRoute()
const { data: item, loading, error } = useApi({
  immediate: true,
  url: () => `/osdr/${route.params.type}/${route.params.id}`,
})

const typeLabel = computed(() => OSDR_TYPE_LABELS[route.params.type] ?? route.params.type)
const rows = computed(() => osdDetailRows(item.value))
const parents = computed(() => osdParentLinks(item.value?.parents))
const vehicle = computed(() => osdLinkedItem(item.value?.vehicle))

const blocks = computed(() => {
  const i = item.value
  if (!i) return []
  return [
    { title: 'Versões', items: i.hardware_version ?? [], name: (v) => v.versionName, desc: (v) => v.versionDescription },
    { title: 'Campos do experimento', items: i.fields ?? [], name: (v) => v.title },
    { title: 'Tratamentos', items: i.treatments ?? [] },
    { title: 'Componentes', items: i.components ?? [] },
    { title: 'Arquivos', items: i.files ?? [] },
  ].filter((b) => b.items.length)
})
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">Falha ao carregar os dados ({{ error }}).</p>

    <template v-else-if="item">
      <header class="mb-8">
        <span class="text-xs px-2 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 mb-3 inline-block">{{ typeLabel }}</span>
        <h1 class="text-3xl font-bold mb-2 leading-snug">{{ osdDetailTitle(item) }}</h1>
        <p class="text-sm text-white/40">ID: {{ item.identifier ?? item.fields?.[0]?.osID ?? route.params.id }}</p>
      </header>

      <div v-if="item.description" class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 mb-6">
        <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Descrição</p>
        <p class="text-sm text-white/65 leading-relaxed whitespace-pre-line">{{ item.description }}</p>
      </div>

      <div v-if="rows.length" class="rounded-xl border border-white/[0.08] overflow-hidden mb-6">
        <p class="px-5 py-4 border-b border-white/[0.08] text-[11px] uppercase tracking-widest text-white/40">Detalhes</p>
        <table class="w-full text-xs">
          <tbody>
            <tr v-for="row in rows" :key="row.key" class="border-b border-white/[0.04] last:border-0">
              <td class="px-5 py-3 text-white/40 w-1/3">{{ row.label }}</td>
              <td class="px-5 py-3 text-white/70">
                <router-link v-if="row.link" :to="`/ciencia-aberta/${row.link.type}/${row.link.id}`" class="text-blue-400 hover:underline">{{ row.link.id }}</router-link>
                <template v-else-if="row.links">
                  <router-link v-for="link in row.links" :key="`${link.type}-${link.id}`" :to="`/ciencia-aberta/${link.type}/${encodeURIComponent(link.id)}`" class="text-blue-400 hover:underline mr-2">{{ link.id }}</router-link>
                </template>
                <span v-else class="whitespace-pre-line">{{ row.value }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="vehicle" class="rounded-xl border border-white/[0.08] overflow-hidden mb-6">
        <p class="px-5 py-4 border-b border-white/[0.08] text-[11px] uppercase tracking-widest text-white/40">Veículo</p>
        <div class="px-5 py-4">
          <router-link :to="`/ciencia-aberta/${vehicle.type}/${vehicle.id}`" class="text-sm text-blue-400 hover:underline">{{ vehicle.id }}</router-link>
        </div>
      </div>

      <div v-for="block in blocks" :key="block.title" class="rounded-xl border border-white/[0.08] overflow-hidden mb-6">
        <p class="px-5 py-4 border-b border-white/[0.08] text-[11px] uppercase tracking-widest text-white/40">{{ block.title }}</p>
        <div v-for="(entry, i) in block.items" :key="i" class="px-5 py-4 border-b border-white/[0.05] last:border-0">
          <p v-if="block.name?.(entry)" class="text-sm font-medium mb-2">{{ block.name(entry) }}</p>
          <p v-if="block.desc?.(entry)" class="text-xs text-white/55 leading-relaxed whitespace-pre-line mb-3">{{ block.desc(entry) }}</p>
          <table v-if="osdRows(entry).length" class="w-full text-xs">
            <tbody>
              <tr v-for="row in osdRows(entry)" :key="row.key" class="border-b border-white/[0.04] last:border-0">
                <td class="py-2 pr-4 text-white/35 w-1/3">{{ row.label }}</td>
                <td class="py-2 text-white/60 whitespace-pre-line break-all">{{ row.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="parents.length" class="rounded-xl border border-white/[0.08] overflow-hidden">
        <p class="px-5 py-4 border-b border-white/[0.08] text-[11px] uppercase tracking-widest text-white/40">Relacionados</p>
        <div class="px-5 py-4 flex flex-wrap gap-2">
          <router-link
            v-for="link in parents"
            :key="`${link.type}-${link.id}`"
            :to="`/ciencia-aberta/${link.type}/${encodeURIComponent(link.id)}`"
            class="text-xs px-2.5 py-1 rounded border border-white/10 text-blue-300 hover:bg-white/[0.04]"
          >
            {{ OSDR_TYPE_LABELS[link.type] ?? link.type }}: {{ link.id }}
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
