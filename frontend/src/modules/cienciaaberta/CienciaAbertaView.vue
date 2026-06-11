<script setup>
import { useRouter } from "vue-router";
import { itemKey, osdPagePath, OSDR_TABS, useOsdr } from '../../composables/useOsdr.js'
import { tabClass } from '../../composables/useApi.js'

const router = useRouter();
const {
  query,
  section,
  studies,
  total,
  selected,
  showRaw,
  meta,
  files,
  osdData,
  loading,
  error,
  osdLoading,
  osdError,
  loadStudies,
  selectStudy,
  pickSection,
} = useOsdr();
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Ciência Aberta</h1>
      <p class="text-sm text-white/40 max-w-xl">
        Estudos científicos publicados no repositório aberto da NASA (OSDR).
      </p>
    </header>

    <div class="flex gap-2 mb-6 flex-wrap">
      <button
        :class="tabClass(section === 'search')"
        @click="pickSection('search')"
      >
        Estudos
      </button>
      <button
        v-for="t in OSDR_TABS"
        :key="t.id"
        :class="tabClass(section === t.id)"
        @click="pickSection(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <template v-if="section === 'search'">
      <form @submit.prevent="loadStudies" class="flex gap-3 mb-6">
        <input
          v-model="query"
          placeholder="Buscar estudo (opcional)..."
          class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
        />
        <button
          type="submit"
          class="px-5 py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-lg hover:bg-blue-500/30"
        >
          Buscar
        </button>
      </form>

      <NasaLoader v-if="loading" message="Carregando estudos..." />
      <p v-else-if="error" class="text-sm text-red-400 py-16">
        Falha ao carregar ({{ error }}).
      </p>
      <p v-else-if="!studies.length" class="text-sm text-white/40 py-16">
        Nenhum estudo encontrado.
      </p>

      <div v-else class="flex gap-6 items-start">
        <div
          class="flex-1 min-w-0 rounded-xl border border-white/[0.08] overflow-hidden"
        >
          <div
            class="px-5 py-3 border-b border-white/[0.08] text-xs text-white/35"
          >
            {{ studies.length }} de {{ total.toLocaleString("pt-BR") }} estudos
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr
                class="border-b border-white/[0.08] text-left text-xs text-white/40 uppercase tracking-wider"
              >
                <th class="px-5 py-3">Estudo</th>
                <th class="px-5 py-3">Missão</th>
                <th class="px-5 py-3">Programa</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="study in studies"
                :key="study.id"
                class="border-b border-white/[0.05] cursor-pointer"
                :class="
                  selected?.id === study.id
                    ? 'bg-blue-500/10'
                    : 'hover:bg-white/[0.02]'
                "
                @click="selectStudy(study)"
              >
                <td class="px-5 py-3.5 font-medium max-w-sm">
                  <p class="line-clamp-2">{{ study.title }}</p>
                </td>
                <td class="px-5 py-3.5 text-white/55 text-xs whitespace-nowrap">
                  {{ study.mission ?? "—" }}
                </td>
                <td
                  class="px-5 py-3.5 text-white/55 text-xs max-w-[180px] truncate"
                >
                  {{ study.program ?? "—" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <aside
          v-if="selected"
          class="w-96 shrink-0 rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-white/[0.08]">
            <p class="text-[11px] uppercase tracking-widest text-white/35 mb-2">
              Detalhes
            </p>
            <h2 class="text-sm font-semibold leading-snug">
              {{ selected.title }}
            </h2>
          </div>
          <div class="px-5 py-4 space-y-3 text-xs">
            <div v-if="selected.mission">
              <p class="text-white/35 mb-0.5">Missão</p>
              <p class="text-white/70">{{ selected.mission }}</p>
            </div>
            <div v-if="selected.program">
              <p class="text-white/35 mb-0.5">Programa</p>
              <p class="text-white/70">{{ selected.program }}</p>
            </div>
            <div v-if="selected.area">
              <p class="text-white/35 mb-0.5">Área</p>
              <p class="text-white/70">{{ selected.area }}</p>
            </div>
            <div v-if="selected.description">
              <p class="text-white/35 mb-0.5">Resumo</p>
              <p class="text-white/60 leading-relaxed line-clamp-12">
                {{ selected.description }}
              </p>
            </div>
            <pre
              v-if="meta"
              class="text-[10px] text-white/40 overflow-auto max-h-32"
              >{{ JSON.stringify(meta, null, 2) }}</pre
            >
            <pre
              v-if="files"
              class="text-[10px] text-white/40 overflow-auto max-h-32"
              >{{ JSON.stringify(files, null, 2) }}</pre
            >
          </div>
          <div class="border-t border-white/[0.08]">
            <button
              type="button"
              class="w-full px-5 py-3 text-left text-xs text-white/45 hover:text-white/70"
              @click="showRaw = !showRaw"
            >
              {{ showRaw ? "Ocultar" : "Ver" }} dados brutos
            </button>
            <pre
              v-if="showRaw"
              class="px-5 pb-4 text-[10px] text-white/40 overflow-auto max-h-64"
              >{{ JSON.stringify(selected.raw, null, 2) }}</pre
            >
          </div>
        </aside>

        <div
          v-else
          class="w-96 shrink-0 rounded-xl border border-dashed border-white/[0.06] px-5 py-10 text-center text-xs text-white/30"
        >
          Selecione um estudo na lista.
        </div>
      </div>
    </template>

    <template v-else>
      <NasaLoader v-if="osdLoading" />
      <p v-else-if="osdError" class="text-sm text-red-400 py-16">
        Falha ao carregar ({{ osdError }}).
      </p>
      <div
        v-else-if="osdData?.length"
        class="rounded-xl border border-white/[0.08] overflow-hidden"
      >
        <table class="w-full text-sm">
          <thead>
            <tr
              class="border-b border-white/[0.08] text-left text-xs text-white/40 uppercase"
            >
              <th class="px-5 py-3">Nome</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in osdData.slice(0, 50)"
              :key="i"
              class="border-b border-white/[0.05] cursor-pointer hover:bg-white/[0.02]"
              @click="router.push(osdPagePath(section, item))"
            >
              <td class="px-5 py-3.5">{{ itemKey(item) ?? "—" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else-if="!osdLoading" class="text-sm text-white/40 py-8">
        Sem registros.
      </p>
    </template>
  </div>
</template>
