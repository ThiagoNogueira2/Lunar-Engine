<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { apiFetch, useTabs, tabClass } from "../../composables/useApi.js";

const route = useRoute();
const r = route.params.rover;
const date = ref("");
const minDate = ref("");
const maxDate = ref("");
const solPhotos = ref([]);
const roverName = {
  curiosity: "Curiosity",
  perseverance: "Perseverance",
  opportunity: "Opportunity",
  spirit: "Spirit",
};

const { tab, tabs, data, loading, error, load } = useTabs([
  {
    id: "latest",
    label: "Recentes",
    path: `/mars-rovers/${r}/latest-photos`,
    transform: (d) => d.latest_photos ?? d.photos ?? [],
  },
  { id: "manifest", label: "Manifesto", path: `/mars-rovers/${r}/manifesto` },
]);

const manifest = () => data.value?.photo_manifest;

function switchTab(id) {
  date.value = "";
  solPhotos.value = [];
  load(id);
}

watch(data, (d) => {
  const m = d?.photo_manifest;
  if (tab.value !== "manifest" || !m) return;
  minDate.value = m.landing_date ?? "";
  maxDate.value = m.max_date ?? "";
  if (!date.value || date.value < minDate.value || date.value > maxDate.value)
    date.value = maxDate.value;
});

watch(date, async (d) => {
  if (!d) return;
  solPhotos.value =
    (await apiFetch(`/mars-rovers/${r}/photos?earth_date=${d}`)).photos ?? [];
});
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <BackButton />
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">{{ roverName[r] ?? r }}</h1>
      <p class="text-sm text-white/40">Fotos do rover em Marte.</p>
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

    <div v-else-if="tab === 'latest'" class="grid grid-cols-4 gap-4">
      <p v-if="!data?.length" class="col-span-4 text-sm text-white/40 py-8">
        Nenhuma foto recente.
      </p>
      <div
        v-for="photo in data?.slice(0, 24)"
        :key="photo.id"
        class="rounded-xl border border-white/[0.08] overflow-hidden"
      >
        <img
          :src="photo.img_src"
          :alt="photo.camera?.full_name"
          class="w-full aspect-square object-cover"
          loading="lazy"
        />
        <p class="p-3 text-xs truncate">
          {{ photo.camera?.full_name }} · Sol {{ photo.sol }}
        </p>
      </div>
    </div>

    <template v-else-if="manifest()">
      <input
        v-model="date"
        type="date"
        :min="minDate"
        :max="maxDate"
        class="mb-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-white/20 [color-scheme:dark]"
      />
      <p v-if="minDate && maxDate" class="text-xs text-white/35 mb-6">
        Datas disponíveis: {{ minDate }} até {{ maxDate }}
      </p>
      <div class="grid grid-cols-4 gap-4">
        <p
          v-if="!solPhotos.length"
          class="col-span-4 text-sm text-white/40 py-8"
        >
          Nenhuma foto nesta data.
        </p>
        <div
          v-for="photo in solPhotos.slice(0, 24)"
          :key="photo.id"
          class="rounded-xl border border-white/[0.08] overflow-hidden"
        >
          <img
            :src="photo.img_src"
            :alt="photo.camera?.full_name"
            class="w-full aspect-square object-cover"
            loading="lazy"
          />
          <p class="p-3 text-xs truncate">
            {{ photo.camera?.full_name }} · Sol {{ photo.sol }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
