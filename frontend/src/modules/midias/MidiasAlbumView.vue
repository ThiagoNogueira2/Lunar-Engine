<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mediaParseError, mediaThumb } from '../../composables/useMedia.js'
import { tabClass, useApi } from '../../composables/useApi.js'

const route = useRoute();
const router = useRouter();
const albumId = ref(route.params.id);

watch(
  () => route.params.id,
  (id) => {
    albumId.value = id;
    run(`/images/album/${encodeURIComponent(id)}`, {
      transform: (d) => d.collection?.items ?? [],
    });
  }
);

const {
  data: items,
  loading,
  error,
  run,
} = useApi({
  immediate: true,
  url: () => `/images/album/${route.params.id}`,
  transform: (d) => d.collection?.items ?? [],
});

const openAlbum = () => {
  const id = albumId.value.trim() || "Apollo";
  if (id !== route.params.id) {
    router.push(`/midias/album/${encodeURIComponent(id)}`);
    return;
  }
  run(`/images/album/${encodeURIComponent(id)}`, {
    transform: (d) => d.collection?.items ?? [],
  });
};

const openMedia = (item) => {
  const d = item.data?.[0];
  if (d?.nasa_id)
    router.push({ path: `/midias/${d.nasa_id}`, query: { title: d.title } });
};
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <BackButton />
    <header class="mb-8">
      <h1 class="text-2xl font-bold mb-1">Mídias</h1>
      <p class="text-sm text-white/40">
        Biblioteca de imagens e vídeos da NASA.
      </p>
    </header>

    <div class="flex gap-2 mb-6">
      <button :class="tabClass(false)" @click="router.push('/midias')">
        Buscar
      </button>
      <button :class="tabClass(true)">Álbuns</button>
    </div>

    <form @submit.prevent="openAlbum" class="flex gap-3 mb-6">
      <input
        v-model="albumId"
        placeholder="ID do álbum (ex: Apollo, Mars_2020_Perseverance)"
        class="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/20"
      />
      <button
        type="submit"
        class="px-5 py-2.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm rounded-lg hover:bg-blue-500/30"
      >
        Abrir álbum
      </button>
    </form>

    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">
      {{ mediaParseError(error) }}
    </p>
    <p v-else-if="!items?.length" class="text-sm text-white/40 py-16">
      Álbum vazio.
    </p>

    <template v-else>
      <p class="text-xs text-white/40 mb-4">
        {{ items.length }} mídias · {{ route.params.id }}
      </p>
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(item, i) in items"
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
              {{ item.data?.[0]?.media_type ?? "—" }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
