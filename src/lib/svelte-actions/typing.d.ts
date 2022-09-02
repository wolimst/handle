/* eslint-disable @typescript-eslint/no-unused-vars */

// Add typings for the custom events of svelte actions
declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    // Events of inView action
    onenter?: (event: CustomEvent) => void
    onexit?: (event: CustomEvent) => void
  }
}
