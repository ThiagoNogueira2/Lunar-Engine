<script setup>
import { useRouter } from "vue-router";
import { useTabs, tabClass } from "../../composables/useApi.js";

const router = useRouter();
const { tab, tabs, data, loading, error, load } = useTabs([
  {
    id: "browse",
    label: "Catálogo",
    path: "/neo/browse",
    transform: (d) => d.near_earth_objects ?? [],
  },
  {
    id: "feed",
    label: "Feed",
    path: "/neo/feed",
    transform: (d) => Object.values(d.near_earth_objects ?? {}).flat(),
  },
]);
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
        @click="load(t.id)"
      >
        {{ t.label }}
      </button>
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
