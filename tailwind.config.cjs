module.exports = {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  darkMode: ['class', '[data-mode="dark-theme"]'],
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--background-color)',
        'app-text': 'var(--text-color)',
        'app-text-secondary': 'var(--text-color-secondary)',
        'app-anchor-text': 'var(--anchor-text-color)',
        'app-anchor-button': 'var(--text-color)',
        'app-modal-bg': 'var(--modal-background-color)',
        'app-primary': 'var(--primary-color)',
        'app-secondary': 'var(--secondary-color)',
        'app-neutral': 'var(--neutral-color)',
        'app-wordle-correct': 'var(--wordle-correct-color)',
        'app-wordle-present': 'var(--wordle-present-color)',
        'app-wordle-absent': 'var(--wordle-absent-color)',
      },
    },
  },
  plugins: [],
  prefix: 'tw-',
}
