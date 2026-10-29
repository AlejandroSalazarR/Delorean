import { useEffect, useRef } from 'react'

// Attach the returned ref to a container: every [data-reveal] child fades up and scales in once visible.
export default function useScrollReveal(deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    root.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 60}ms`
      io.observe(el)
    })
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}
