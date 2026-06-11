<script setup>
import { useRoute } from "vue-router";
import {
  mediaAssetFiles,
  mediaAssetUrl,
  mediaIsVideo,
  mediaVideoUrl,
} from "../../composables/useMedia.js";
import { useApi } from "../../composables/useApi.js";

const route = useRoute();

const {
  data: asset,
  loading,
  error,
} = useApi({
  immediate: true,
  url: () => `/images/asset/${route.params.id}`,
});

const title = () => route.query.title ?? route.params.id;
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">
      Falha ao carregar ({{ error }}).
    </p>

    <template v-else-if="asset">
      <header class="mb-6">
        <h1 class="text-2xl font-bold mb-1 leading-snug">{{ title() }}</h1>
        <p class="text-sm text-white/40">{{ route.params.id }}</p>
      </header>

      <div class="flex gap-6 items-start max-w-6xl">
        <div
          class="flex-1 min-w-0 rounded-xl border border-white/[0.08] overflow-hidden"
        >
          <video
            v-if="mediaIsVideo(asset) && mediaVideoUrl(asset)"
            :src="mediaVideoUrl(asset)"
            controls
            class="w-full"
          />
          <img
            v-else-if="mediaAssetUrl(asset)"
            :src="mediaAssetUrl(asset)"
            :alt="title()"
            class="w-full"
            loading="lazy"
          />
          <p v-else class="p-8 text-sm text-white/40 text-center">
            Prévia indisponível.
          </p>
        </div>

        <div
          v-if="mediaAssetFiles(asset).length"
          class="w-72 shrink-0 rounded-xl border border-white/[0.08] overflow-hidden"
        >
          <p
            class="px-4 py-3 border-b border-white/[0.08] text-[11px] uppercase tracking-widest text-white/40"
          >
            Arquivos
          </p>
          <ul
            class="divide-y divide-white/[0.05] max-h-[28rem] overflow-y-auto"
          >
            <li v-for="href in mediaAssetFiles(asset).slice(0, 12)" :key="href">
              <a
                :href="href"
                target="_blank"
                class="block px-4 py-2.5 text-xs text-blue-400 hover:bg-white/[0.02] truncate"
                >{{ href.split("/").pop() }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
