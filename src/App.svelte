<script lang="ts">
  import Wordle from './routes/Wordle.svelte'
  import Nav from '@/Nav.svelte'
  import PageNotFound from '@/NotFound.svelte'
  import { PRODUCTION, ROUTES } from '@/constants'
  import FontViewer from '@/routes/FontViewer.svelte'
  import Home from '@/routes/Home.svelte'
  import { Router, Route } from 'svelte-routing'
</script>

<Router>
  <Nav />

  <main class="tw-container tw-mx-auto tw-pt-6 tw-pb-1">
    <Route path={ROUTES.home}>
      <Home />
    </Route>

    {#each Object.entries(ROUTES.game) as [gameId, path]}
      <Route {path}>
        <Wordle id={gameId} />
      </Route>
    {/each}

    {#if !PRODUCTION}
      <Route path={ROUTES.fontViewer}>
        <FontViewer />
      </Route>
    {/if}

    <Route>
      <PageNotFound />
    </Route>
  </main>
</Router>
