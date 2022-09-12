<script lang="ts">
  import Game from '@/components/wordle/Game.svelte'
  import { initStores } from '@/components/wordle/store'

  const nWordles = 2
  const nGuesses = 6
  const answerLength = 2

  initStores(nWordles, nGuesses, answerLength)
</script>

<Game />
