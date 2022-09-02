export function inView(element: Element) {
  const handleIntersect: IntersectionObserverCallback = (
    e: IntersectionObserverEntry[]
  ) => {
    const event = e[0].isIntersecting ? 'enter' : 'exit'
    element.dispatchEvent(new CustomEvent(event))
  }

  const observer = new IntersectionObserver(handleIntersect)
  observer.observe(element)

  return {
    destroy() {
      observer.disconnect()
    },
  }
}
