<script lang="ts">
  import Nav from '@/Nav.svelte'
  import { PRODUCTION, ROUTES } from '@/constants'
  import FontViewer from '@/routes/FontViewer.svelte'
  import Home from '@/routes/Home.svelte'
  import { Router, Route } from 'svelte-routing'
</script>

<Router>
  <Nav />

  <main class="tw-container tw-mx-auto tw-pt-6">
    <Route path={ROUTES.home}>
      <Home />
    </Route>
    {#if !PRODUCTION}
      <Route path={ROUTES.fontViewer}>
        <FontViewer />
      </Route>
    {/if}
  </main>
</Router>
