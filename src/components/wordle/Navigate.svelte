<script lang="ts">
  import ArrowLeftIcon from '@/components/ui/icons/ArrowLeft.svelte'
  import ArrowRightIcon from '@/components/ui/icons/ArrowRight.svelte'
  import ClickButton from '@/components/ui/core/ClickButton.svelte'
  import { game, initializeWordleStores } from './store'
  import { savedata } from '@/stores/wordle'

  function navigateBack() {
    const prevData = savedata.loadPrevious($game.data)
    if (prevData) {
      initializeWordleStores(prevData.config, prevData.id)
    }
  }

  function navigateForward() {
    const nextData = savedata.loadNext($game.data)
    if (nextData) {
      initializeWordleStores(nextData.config, nextData.id)
    }
  }
</script>

<ClickButton
  disabled={savedata.loadPrevious($game.data) === undefined}
  on:click={navigateBack}
>
  <ArrowLeftIcon />
</ClickButton>
<ClickButton
  disabled={savedata.loadNext($game.data) === undefined}
  on:click={navigateForward}
>
  <ArrowRightIcon />
</ClickButton>
