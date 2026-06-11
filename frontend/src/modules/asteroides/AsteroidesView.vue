<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useApi, tabClass } from "../../composables/useApi.js";

const router = useRouter();

const tab = ref("browse");
const startDate = ref("");
const endDate = ref("");

const tabs = [
  { id: "browse", label: "Catálogo" },
  { id: "feed", label: "Feed (por data)" },
];

const { data, loading, error, run } = useApi();

function loadTab(id) {
  tab.value = id;
  if (id === "browse") {
    run("/neo/browse", { transform: (d) => d.near_earth_objects ?? [] });
  } else {
    searchFeed();
  }
}

function searchFeed() {
  let path = "/neo/feed";
  const params = [];
  if (startDate.value) params.push(`start_date=${startDate.value}`);
  if (endDate.value) params.push(`end_date=${endDate.value}`);
  if (params.length) path += `?${params.join("&")}`;
  run(path, { transform: (d) => Object.values(d.near_earth_objects ?? {}).flat() });
}

function clearDates() {
  startDate.value = "";
  endDate.value = "";
  searchFeed();
}

// load initial tab
loadTab("browse");
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Asteroides</h1>
      <p class="text-sm text-white/40">NeoWs — catálogo e feed.</p>
    </header>

    <div class="flex gap-2 mb-6 flex-wrap">
      <button
        v-for="t in tabs"
        :key="t.id"
        :class="tabClass(tab === t.id)"
        @click="loadTab(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <div v-if="tab === 'feed'" class="flex items-end gap-3 mb-6 flex-wrap">
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] uppercase tracking-widest text-white/40">Data inicial</label>
        <input
          v-model="startDate"
          type="date"
          max="9999-12-31"
          class="bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-[11px] uppercase tracking-widest text-white/40">Data final</label>
        <input
          v-model="endDate"
          type="date"
          max="9999-12-31"
          class="bg-white/[0.05] border border-white/[0.12] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>
      <button
        class="text-xs px-4 py-2.5 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors"
        @click="searchFeed"
      >
        Buscar
      </button>
      <button
        v-if="startDate || endDate"
        class="text-xs px-4 py-2.5 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
        @click="clearDates"
      >
        Limpar
      </button>
      <p class="text-[10px] text-white/30 ml-2 self-center">Máx. 7 dias de intervalo</p>
    </div>

    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">
      Falha ao carregar ({{ error }}).
    </p>

    <div
      v-else-if="Array.isArray(data)"
      class="rounded-xl border border-white/[0.08] overflow-hidden"
    >
      <table class="w-full text-sm">
        <thead>
          <tr
            class="border-b border-white/[0.08] text-left text-xs text-white/40 uppercase tracking-wider"
          >
            <th class="px-5 py-3">Nome</th>
            <th class="px-5 py-3">Magnitude</th>
            <th class="px-5 py-3">Risco</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="a in data"
            :key="a.id"
            class="border-b border-white/[0.05] hover:bg-white/[0.03] cursor-pointer"
            @click="router.push(`/asteroides/${a.id}`)"
          >
            <td class="px-5 py-3.5 font-medium">{{ a.name }}</td>
            <td class="px-5 py-3.5 text-white/60">
              {{ a.absolute_magnitude_h }}
            </td>
            <td
              class="px-5 py-3.5 text-xs"
              :class="
                a.is_potentially_hazardous_asteroid
                  ? 'text-red-400'
                  : 'text-white/25'
              "
            >
              {{ a.is_potentially_hazardous_asteroid ? "Perigoso" : "—" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
