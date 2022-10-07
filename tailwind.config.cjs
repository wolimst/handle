module.exports = {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  darkMode: ['class', '[data-mode="dark-theme"]'],
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--background-color)',
        'app-text': 'var(--text-color)',
        'app-text-secondary': 'var(--text-color-secondary)',
        'app-text-invert': 'var(--text-color-invert)',
        'app-anchor-text': 'var(--anchor-text-color)',
        'app-anchor-button': 'var(--text-color)',
        'app-modal-bg': 'var(--modal-background-color)',
        'app-primary': 'var(--primary-color)',
        'app-secondary': 'var(--secondary-color)',
        'app-neutral': 'var(--neutral-color)',
        'app-wordle-correct': 'var(--wordle-correct-color)',
        'app-wordle-present': 'var(--wordle-present-color)',
        'app-wordle-absent': 'var(--wordle-absent-color)',
        'app-wordle-exact': 'var(--wordle-exact-color)',
        'app-wordle-exact-bg': 'var(--wordle-exact-background-color)',
        'app-keyboard-bg': 'var(--keyboard-background-color)',
        'app-alert-bg': 'var(--alert-background-color)',
      },
    },
  },
  plugins: [],
  prefix: 'tw-',
}
