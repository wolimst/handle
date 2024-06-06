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
    viewBox="-7.7 7.1 86 86"
  >
    <path
      d="M54.00 23.62C55.44 23.62 56.23 22.61 56.23 21.02C56.23 19.44 55.44 18.43 54.00 18.43L12.96 18.43C11.52 18.43 10.73 19.44 10.73 21.02C10.73 22.61 11.52 23.62 12.96 23.62L14.40 23.62C13.03 27.00 12.31 30.74 12.31 34.42C12.31 42.98 16.78 47.74 34.13 47.74C42.77 47.74 50.33 46.51 55.58 44.78C57.24 44.21 57.60 42.91 57.17 41.40C56.74 39.96 55.51 39.38 53.93 39.89C49.10 41.40 42.26 42.48 34.13 42.48C21.17 42.48 18.65 39.96 18.65 34.42C18.65 31.03 19.15 27.14 20.23 23.62Z"
      fill="var(--wordle-absent-color)"
    />
    <path
      d="M6 55C4 55 3 56 3 57C3 59 4 60 6 60L32 60L32 79C32 81 33 82 35 82C37 82 38 81 38 79L38 60L65 60C66 60 67 59 67 57C67 56 66 55 65 55Z"
      fill="var(--wordle-correct-color)"
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
