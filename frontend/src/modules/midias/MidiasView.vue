<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { mediaThumb, useMedia } from "../../composables/useMedia.js";
import { tabClass } from "../../composables/useApi.js";

const router = useRouter();
const albumId = ref("Apollo");
const { query, results, loading, error, searched, handleSearch } = useMedia();

const openMedia = (item) => {
  const d = item.data?.[0];
  if (d?.nasa_id)
    router.push({ path: `/midias/${d.nasa_id}`, query: { title: d.title } });
};

const openAlbum = () => {
  const id = albumId.value.trim() || "Apollo";
  router.push(`/midias/album/${encodeURIComponent(id)}`);
};
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Mídias</h1>
      <p class="text-sm text-white/40">
        Biblioteca de imagens e vídeos da NASA.
      </p>
    </header>

    <div class="flex gap-2 mb-6">
      <button :class="tabClass(true)">Buscar</button>
      <button :class="tabClass(false)" @click="openAlbum">Álbuns</button>
    </div>

    <form @submit.prevent="handleSearch" class="flex gap-3 mb-6">
      <input
        v-model="query"
        placeholder="Ex: Apollo 11, Mars, Hubble..."
        class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
      />
      <button
        type="submit"
        class="px-5 py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-lg hover:bg-blue-500/30"
      >
        Buscar
      </button>
    </form>

    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">
      Falha ao carregar ({{ error }}).
    </p>
    <p
      v-else-if="searched && !results?.length"
      class="text-sm text-white/40 py-8"
    >
      Nenhuma mídia para "{{ query }}".
    </p>

    <div v-else-if="results?.length" class="grid grid-cols-4 gap-4">
      <div
        v-for="(item, i) in results.slice(0, 30)"
        :key="i"
        class="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden cursor-pointer hover:border-white/20"
        @click="openMedia(item)"
      >
        <div
          class="aspect-video bg-white/[0.03] flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="mediaThumb(item)"
            :src="mediaThumb(item)"
            :alt="item.data?.[0]?.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <span v-else class="text-white/20 text-xs">Sem prévia</span>
        </div>
        <div class="p-3">
          <p class="text-xs font-medium text-white/80 line-clamp-2">
            {{ item.data?.[0]?.title }}
          </p>
          <p class="text-[10px] text-white/35 mt-1">
            {{ item.data?.[0]?.date_created?.split("T")[0] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
