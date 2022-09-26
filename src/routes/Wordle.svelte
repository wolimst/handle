<script lang="ts">
  import Game from '@/components/wordle/Game.svelte'
  import { initializeWordleStores } from '@/components/wordle/store'
  import { N_GUESSES } from '@/constants'

  export let id: string

  function initialize() {
    const nWordles = Number(id.charAt(1))
    const answerLength = Number(id.charAt(3))
    const nGuesses = N_GUESSES[nWordles][answerLength]

    initializeWordleStores(nWordles, nGuesses, answerLength)
  }

  initialize()
</script>

<Game />
