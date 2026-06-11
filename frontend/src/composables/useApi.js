import { ref, onMounted } from 'vue'

function buildUrl(path) {
  if (path.startsWith('http')) return path
  if (path.startsWith('/api')) return path
  return `/api${path.startsWith('/') ? path : `/${path}`}`
}

function resolveUrl(url) {
  return typeof url === 'function' ? url() : url
}

async function parseResponse(res) {
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

export async function apiFetch(path) {
  const res = await fetch(buildUrl(path))
  return parseResponse(res)
}

export function useApi(options = {}) {
  const {
    initialData = null,
    immediate = false,
    url,
    transform = (data) => data,
  } = options

  const data = ref(initialData)
  const loading = ref(Boolean(immediate))
  const error = ref(null)
  const searched = ref(false)

  async function run(path, runOptions = {}) {
    const transformFn = runOptions.transform ?? transform
    const reset = runOptions.reset !== false

    loading.value = true
    error.value = null
    if (reset) data.value = initialData

    try {
      const json = await apiFetch(path)
      data.value = transformFn(json)
      return data.value
    } catch (e) {
      error.value = e.message
      if (reset) data.value = initialData
      return null
    } finally {
      loading.value = false
    }
  }

  async function search(path, searchOptions = {}) {
    searched.value = true
    return run(path, { ...searchOptions, reset: true })
  }

  if (immediate && url) {
    onMounted(() => run(resolveUrl(url)))
  }

  return { data, loading, error, searched, run, search }
}

export function useTabs(tabs) {
  const tab = ref(tabs[0]?.id)
  const { data, loading, error, run } = useApi()

  function load(id = tab.value) {
    tab.value = id
    const current = tabs.find((t) => t.id === id)
    if (current) run(current.path, { transform: current.transform })
  }

  onMounted(() => load())

  return { tab, tabs, data, loading, error, load }
}

const TAB_BTN = 'text-xs px-3 py-1.5 rounded-lg border transition-colors'

export function tabClass(active) {
  return active
    ? `${TAB_BTN} border-blue-500/50 bg-blue-500/10 text-blue-300`
    : `${TAB_BTN} border-white/10 text-white/50 hover:text-white/80 hover:border-white/20`
}

export function useFetchDetail() {
  const detail = ref(null)
  async function load(path) {
    if (path) detail.value = await apiFetch(path)
  }
  function clear() {
    detail.value = null
  }
  return { detail, load, clear }
}
