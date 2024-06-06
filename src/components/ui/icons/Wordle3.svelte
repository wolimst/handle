<script lang="ts">
  export let widthPerSyllable: number = 52
  export let gapRem: number = 0.2
</script>

<div class="tw-inline-flex tw-justify-center" style:gap={`${gapRem}rem`}>
  <svg
    class="icon tw-border tw-border-app-text-secondary tw-rounded-md tw-shadow-md"
    xmlns="http://www.w3.org/2000/svg"
    width={widthPerSyllable}
    height={widthPerSyllable}
    viewBox="-8.8 3.2 86 86"
  >
    <path
      d="M25.27 21.60C25.27 20.09 23.90 19.15 22.03 19.15C20.16 19.15 18.79 20.16 18.79 21.60L18.79 33.84C18.79 42.77 14.04 51.84 5.04 60.34C3.74 61.56 3.74 63.14 4.90 64.30C6.05 65.45 7.78 65.52 9.00 64.37C14.83 58.90 19.22 53.21 21.96 47.38L33.98 63.43C34.99 64.80 36.86 64.80 38.16 63.72C39.38 62.71 39.67 61.13 38.59 59.76L24.19 41.47C24.91 38.81 25.27 36.14 25.27 33.48Z"
      fill="var(--wordle-correct-color)"
    />
    <path
      d="M45 42L45 72C45 74 46 75 48 75C50 75 51 74 51 72L51 20C51 18 50 17 48 17C46 17 45 18 45 20L45 37L34 37C32 37 32 38 32 40C32 41 32 42 34 42ZM58 73C58 75 59 76 61 76C63 76 64 75 64 73L64 19C64 18 63 17 61 17C59 17 58 18 58 19Z"
      fill="var(--wordle-absent-color)"
    />
  </svg>

  <svg
    class="icon tw-border tw-border-app-text-secondary tw-rounded-md tw-shadow-md"
    xmlns="http://www.w3.org/2000/svg"
    width={widthPerSyllable}
    height={widthPerSyllable}
    viewBox="-7.7 8.7 86 86"
  >
    <path
      d="M54.94 22.61C56.38 22.61 57.17 21.60 57.17 20.02C57.17 18.43 56.38 17.42 54.94 17.42L12.82 17.42C11.38 17.42 10.58 18.43 10.58 20.02C10.58 21.60 11.38 22.61 12.82 22.61L13.54 22.61C12.60 24.48 12.02 26.93 12.02 29.38C12.02 36.94 15.91 39.74 35.28 39.74C43.20 39.74 51.05 38.81 56.30 37.37C57.96 36.86 58.32 35.50 58.03 34.20C57.74 32.90 56.81 32.04 55.01 32.47C49.68 33.77 42.70 34.56 35.28 34.56C21.10 34.56 18.36 33.05 18.36 29.38C18.36 27.07 18.79 24.62 19.44 22.61Z"
      fill="var(--wordle-absent-color)"
    />
    <path
      d="M6 50L65 50C66 50 67 49 67 47C67 46 66 45 65 45L6 45C4 45 3 46 3 47C3 49 4 50 6 50Z"
      fill="var(--wordle-absent-color)"
    />
    <path
      d="M13 58C13 60 13 61 15 61L50 61C51 61 52 62 52 63L52 66C52 67 51 68 50 68L14 68C12 68 11 69 11 70C11 72 12 73 14 73L14 73C14 74 14 76 14 78C14 83 17 86 36 86C44 86 52 85 58 84C59 83 60 82 59 81C59 79 58 78 57 79C51 80 43 81 36 81C22 81 20 80 20 76C20 75 20 74 20 73L52 73C56 73 58 71 58 67L58 61C58 58 56 56 52 56L15 56C13 56 13 57 13 58Z"
      fill="var(--wordle-present-color)"
    />
  </svg>
</div>
