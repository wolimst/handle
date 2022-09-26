<script lang="ts">
  export let widthPerSyllable: number = 48
  export let gapRem: number = 0.125
</script>

<div class="tw-inline-flex tw-justify-center" style:gap={`${gapRem}rem`}>
  <svg
    class="icon tw-border tw-border-app-text-secondary tw-rounded-md tw-shadow-md"
    xmlns="http://www.w3.org/2000/svg"
    width={widthPerSyllable}
    height={widthPerSyllable}
    viewBox="-7.7 1.4 86 86"
  >
    <path
      d="M19.73 34.78C19.73 26.78 25.92 22.39 35.28 22.39C44.64 22.39 50.83 26.78 50.83 34.78C50.83 42.77 42.84 47.16 35.28 47.16C27.72 47.16 19.73 42.77 19.73 34.78ZM13.46 34.78C13.46 47.30 24.26 52.42 35.28 52.42C46.30 52.42 57.10 47.30 57.10 34.78C57.10 22.25 46.30 17.14 35.28 17.14C24.26 17.14 13.46 22.25 13.46 34.78Z"
      fill="var(--wordle-absent-color)"
    />
    <path
      d="M6 72L65 72C66 72 67 71 67 69C67 67 66 66 65 66L38 66L38 58C38 56 37 56 35 56C33 56 32 56 32 58L32 66L6 66C4 66 3 67 3 69C3 71 4 72 6 72Z"
      fill="var(--wordle-present-color)"
    />
  </svg>

  <svg
    class="icon tw-border tw-border-app-text-secondary tw-rounded-md tw-shadow-md"
    xmlns="http://www.w3.org/2000/svg"
    width={widthPerSyllable}
    height={widthPerSyllable}
    viewBox="-7.7 6.9 86 86"
  >
    <path
      d="M12.38 31.90C10.94 31.90 10.15 32.90 10.15 34.49C10.15 36.07 10.94 37.08 12.38 37.08L13.25 37.08C12.60 38.66 12.24 40.61 12.24 42.55C12.24 49.18 16.49 51.70 35.28 51.70C43.49 51.70 51.48 50.83 57.60 49.10C59.11 48.67 59.47 47.38 59.18 45.94C58.90 44.57 57.89 43.63 56.02 44.14C50.40 45.65 42.98 46.44 35.28 46.44C21.10 46.44 18.65 45.00 18.65 41.83C18.65 40.18 18.86 38.52 19.22 37.08L51.48 37.08C55.58 37.08 57.60 35.06 57.60 30.96L57.60 24.12C57.60 20.02 55.58 18.00 51.48 18.00L13.90 18.00C12.46 18.00 11.66 19.01 11.66 20.59C11.66 22.18 12.46 23.18 13.90 23.18L49.10 23.18C50.62 23.18 51.26 23.83 51.26 25.34L51.26 29.74C51.26 31.25 50.62 31.90 49.10 31.90Z"
      fill="var(--wordle-correct-color)"
    />
    <path
      d="M47 82C49 82 50 81 50 79L50 62L65 62C66 62 67 61 67 60C67 58 66 57 65 57L6 57C4 57 3 58 3 60C3 61 4 62 6 62L20 62L20 79C20 81 22 82 24 82C25 82 27 81 27 79L27 62L44 62L44 79C44 81 45 82 47 82Z"
      fill="var(--wordle-absent-color)"
    />
  </svg>
</div>
