<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../../composables/useApi.js'

const route = useRoute()
const { data: project, loading, error } = useApi({
  immediate: true,
  url: () => `/techport/projects/${route.params.id}`,
  transform: (data) => data.project ?? data,
})

const txPath = computed(() => {
  const path = project.value?.primaryTxTree?.[0]
  if (path?.length) return path.map((n) => n.title).join(' › ')
  return project.value?.primaryTx?.title ?? null
})

const fmt = (d) => d?.split('T')[0] ?? d ?? '—'
</script>

<template>
  <div class="min-h-full px-10 py-8 text-white">
    <BackButton />
    <NasaLoader v-if="loading" />
    <p v-else-if="error" class="text-sm text-red-400 py-16">Falha ao carregar os dados ({{ error }}).</p>

    <template v-else-if="project">
      <header class="mb-8">
        <p v-if="project.program?.acronym" class="text-xs text-blue-300 mb-2">
          {{ project.program.acronym }} · {{ project.program.title }}
        </p>
        <h1 class="text-3xl font-bold mb-2 leading-snug">{{ project.title }}</h1>
        <p class="text-sm text-white/40">ID {{ project.projectId }} · {{ project.acronym ?? '—' }}</p>
      </header>

      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Centro líder</p>
          <p class="text-sm">{{ project.leadOrganization?.organizationName ?? '—' }}</p>
          <p v-if="project.leadOrganization?.acronym" class="text-xs text-white/40 mt-1">{{ project.leadOrganization.acronym }}</p>
        </div>
        <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Diretoria</p>
          <p class="text-sm">{{ project.program?.responsibleMd?.organizationName ?? '—' }}</p>
        </div>
        <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Início</p>
          <p class="text-sm">{{ fmt(project.startDateString ?? project.startDate) }}</p>
        </div>
        <div class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Término</p>
          <p class="text-sm">{{ fmt(project.endDateString ?? project.endDate) || 'Em andamento' }}</p>
        </div>
      </div>

      <div v-if="project.description" class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 mb-6">
        <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Descrição</p>
        <div class="text-sm text-white/70 leading-relaxed" v-html="project.description" />
      </div>

      <div v-if="project.benefits" class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 mb-6">
        <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Benefícios</p>
        <div class="text-sm text-white/70 leading-relaxed" v-html="project.benefits" />
      </div>

      <div v-if="txPath" class="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 mb-6">
        <p class="text-[11px] uppercase tracking-widest text-white/40 mb-3">Taxonomia</p>
        <p class="text-sm text-white/70">{{ txPath }}</p>
        <p v-if="project.primaryTx?.code" class="text-xs text-white/40 mt-2 font-mono">{{ project.primaryTx.code }}</p>
      </div>

      <div v-if="project.programContacts?.length" class="rounded-xl border border-white/[0.08] overflow-hidden">
        <p class="px-5 py-4 border-b border-white/[0.08] text-[11px] uppercase tracking-widest text-white/40">Contatos do programa</p>
        <table class="w-full text-xs">
          <thead>
            <tr class="text-white/35 border-b border-white/[0.08]">
              <th class="px-5 py-2.5 text-left font-medium">Nome</th>
              <th class="px-5 py-2.5 text-left font-medium">Função</th>
              <th class="px-5 py-2.5 text-left font-medium">E-mail</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in project.programContacts.slice(0, 10)"
              :key="c.programContactId ?? c.contactId"
              class="border-b border-white/[0.04] last:border-0"
            >
              <td class="px-5 py-3 text-white/70">{{ c.fullName }}</td>
              <td class="px-5 py-3 text-white/50">{{ c.programContactRolePretty || '—' }}</td>
              <td class="px-5 py-3 text-blue-400">{{ c.email ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
