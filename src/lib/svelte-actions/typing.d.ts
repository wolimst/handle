/* eslint-disable @typescript-eslint/no-unused-vars */

// Add typings for the custom events of svelte actions
declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    // Events of inView action
    'on:enter'?: (event: CustomEvent) => void
    'on:exit'?: (event: CustomEvent) => void
  }
}
