<script lang="ts">
  import Nav from '@/Nav.svelte'
  import PageNotFound from '@/NotFound.svelte'
  import { PRODUCTION, ROUTES } from '@/constants'
  import FontViewer from '@/routes/FontViewer.svelte'
  import Home from '@/routes/Home.svelte'
  import Wordle from '@/routes/Wordle.svelte'
  import Router from 'svelte-spa-router'
  import { wrap } from 'svelte-spa-router/wrap'

  const routes = new Map<string, any>()
  routes.set(ROUTES.home, Home)
  if (!PRODUCTION) {
    routes.set(ROUTES.fontViewer, FontViewer)
  }
  Object.values(ROUTES.game).forEach((path) =>
    routes.set(path, wrap({ component: Wordle, props: { path: path } }))
  )
  routes.set('*', PageNotFound)
</script>

<Nav />

<main class="tw-container tw-mx-auto tw-pt-6 tw-pb-1">
  <Router {routes} />
</main>
