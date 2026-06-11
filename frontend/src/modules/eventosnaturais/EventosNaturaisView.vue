<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { tabClass, useFetchDetail, useTabs } from '../../composables/useApi.js'

const router = useRouter()
const search = ref('')
const selectedId = ref(null)
const { detail, load: loadDetail, clear } = useFetchDetail()
const { tab, tabs, data, loading, error, load } = useTabs([
  {
    id: 'events',
    label: 'Eventos',
    path: '/eonet/events?limit=100',
    transform: (d) => d.events ?? [],
  },
  {
    id: 'categories',
    label: 'Categorias',
    path: '/eonet/categories',
    transform: (json) => (Array.isArray(json) ? json : json.categories ?? []).map((c) => ({
      id: c.id ?? c.categoryId,
      title: c.title ?? c.categoryTitle,
    })),
  },
  {
    id: 'layers',
    label: 'Camadas',
    path: '/eonet/layers',
    transform: (json) => (Array.isArray(json) ? json : json.categories ?? []).flatMap((c) =>
      (c.layers ?? []).map((l) => ({ id: l.serviceTypeId ?? '—', title: l.name })),
    ),
  },
])

const categoryColors = {
  Wildfires: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "Severe Storms": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Volcanoes: "text-red-400 bg-red-500/10 border-red-500/20",
  Floods: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  Earthquakes: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

const categoryClass = (event) =>
  categoryColors[event.categories?.[0]?.title] ??
  "text-white/40 bg-white/5 border-white/10";

const filtered = () =>
  (data.value ?? []).filter(
    (e) =>
      e.title?.toLowerCase().includes(search.value.toLowerCase()) ||
      e.categories?.[0]?.title
        ?.toLowerCase()
        .includes(search.value.toLowerCase())
  );

const switchTab = (id) => {
  selectedId.value = null;
  clear();
  load(id);
};
const openCategory = async (item) => {
  selectedId.value = item.id;
  clear();
  await loadDetail(`/eonet/categories/${item.id}`);
};
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Eventos Naturais</h1>
      <p class="text-sm text-white/40">
        EONET — eventos, categorias e camadas.
      </p>
    </header>

    <div class="flex gap-2 mb-6 flex-wrap">
      <button
        v-for="t in tabs"
        :key="t.id"
        :class="tabClass(tab === t.id)"
        @click="switchTab(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">
      Falha ao carregar ({{ error }}).
    </p>

    <template v-else-if="tab === 'events'">
      <input
        v-model="search"
        placeholder="Buscar por nome ou categoria..."
        class="w-full mb-5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
      />
      <div class="rounded-xl border border-white/[0.08] overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr
              class="border-b border-white/[0.08] text-left text-xs text-white/40 uppercase tracking-wider"
            >
              <th class="px-5 py-3">Evento</th>
              <th class="px-5 py-3">Categoria</th>
              <th class="px-5 py-3">Data</th>
              <th class="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in filtered().slice(0, 60)"
              :key="event.id"
              class="border-b border-white/[0.05] hover:bg-white/[0.02] cursor-pointer"
              @click="router.push(`/eventos-naturais/${event.id}`)"
            >
              <td class="px-5 py-3.5 font-medium">{{ event.title }}</td>
              <td class="px-5 py-3.5">
                <span
                  class="text-xs px-2 py-0.5 rounded border"
                  :class="categoryClass(event)"
                  >{{ event.categories?.[0]?.title ?? "—" }}</span
                >
              </td>
              <td class="px-5 py-3.5 text-white/50 text-xs">
                {{ event.geometry?.[0]?.date?.split("T")[0] ?? "—" }}
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="text-xs px-2 py-0.5 rounded border"
                  :class="
                    event.closed
                      ? 'text-white/30 bg-white/5 border-white/10'
                      : 'text-green-400 bg-green-500/10 border-green-500/20'
                  "
                  >{{ event.closed ? "Encerrado" : "Ativo" }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div
      v-else-if="data?.length"
      class="rounded-xl border border-white/[0.08] overflow-hidden"
    >
      <table class="w-full text-sm">
        <thead>
          <tr
            class="border-b border-white/[0.08] text-left text-xs text-white/40 uppercase tracking-wider"
          >
            <th class="px-5 py-3">{{ tab === "layers" ? "Tipo" : "ID" }}</th>
            <th class="px-5 py-3">
              {{ tab === "layers" ? "Nome" : "Título" }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in data"
            :key="item.id + item.title"
            class="border-b border-white/[0.05] hover:bg-white/[0.02]"
            :class="[
              tab === 'categories' && 'cursor-pointer',
              selectedId === item.id && 'bg-blue-500/10',
            ]"
            @click="tab === 'categories' && openCategory(item)"
          >
            <td class="px-5 py-3 font-mono text-xs text-white/40">
              {{ item.id }}
            </td>
            <td class="px-5 py-3">{{ item.title ?? "—" }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="detail" class="mt-6 space-y-4">
      <div>
        <h2 class="text-lg font-semibold">{{ detail.title }}</h2>
        <p
          v-if="detail.description"
          class="text-sm text-white/50 mt-1 max-w-3xl"
        >
          {{ detail.description }}
        </p>
      </div>
      <div
        v-if="detail.events?.length"
        class="rounded-xl border border-white/[0.08] overflow-hidden"
      >
        <table class="w-full text-sm">
          <thead>
            <tr
              class="border-b border-white/[0.08] text-left text-xs text-white/40 uppercase tracking-wider"
            >
              <th class="px-5 py-3">Evento</th>
              <th class="px-5 py-3">Data</th>
              <th class="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="event in detail.events"
              :key="event.id"
              class="border-b border-white/[0.05] hover:bg-white/[0.02] cursor-pointer"
              @click="router.push(`/eventos-naturais/${event.id}`)"
            >
              <td class="px-5 py-3.5 font-medium">{{ event.title }}</td>
              <td class="px-5 py-3.5 text-white/50 text-xs">
                {{ event.geometry?.[0]?.date?.split("T")[0] ?? "—" }}
              </td>
              <td class="px-5 py-3.5">
                <span
                  class="text-xs px-2 py-0.5 rounded border"
                  :class="
                    event.closed
                      ? 'text-white/30 bg-white/5 border-white/10'
                      : 'text-green-400 bg-green-500/10 border-green-500/20'
                  "
                  >{{ event.closed ? "Encerrado" : "Ativo" }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-sm text-white/40">
        Nenhum evento ativo nesta categoria.
      </p>
    </div>
  </div>
</template>
