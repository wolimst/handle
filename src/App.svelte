<script lang="ts">
  import Nav from '@/Nav.svelte'
  import PageNotFound from '@/NotFound.svelte'
  import Notification from '@/Notification.svelte'
  import { PRODUCTION, ROUTES } from '@/constants'
  import FontViewer from '@/routes/FontViewer.svelte'
  import Home from '@/routes/Home.svelte'
  import Notice from '@/routes/Notice.svelte'
  import WordViewer from '@/routes/WordViewer.svelte'
  import Wordle from '@/routes/Wordle.svelte'
  import WordleCustom from '@/routes/WordleCustom.svelte'
  import Router from 'svelte-spa-router'
  import { wrap } from 'svelte-spa-router/wrap'

  const routes = new Map<string, unknown>()
  routes.set(ROUTES.home, Home)
  routes.set(ROUTES.notice, Notice)
  if (!PRODUCTION) {
    routes.set(ROUTES.fontViewer, FontViewer)
    routes.set(ROUTES.wordViewer, WordViewer)
  }
  ROUTES.game.forEach((path) =>
    routes.set(path, wrap({ component: Wordle, props: { path: path } }))
  )
  routes.set(ROUTES.custom, WordleCustom)
  routes.set('*', PageNotFound)
</script>

<Nav />

<main
  class="tw-w-full tw-h-[calc(100%-var(--nav-height))] tw-overflow-y-auto tw-overscroll-y-none"
>
  <Router {routes} />

  <div
    class="notification tw-w-full tw-fixed tw-top-7 tw-flex tw-flex-nowrap tw-justify-center"
  >
    <Notification />
  </div>
</main>

<style>
  .notification {
    z-index: 10000;
  }
</style>
