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

// Writes scroll progress (0 → 1) as the CSS var --p, without re-rendering. Starts at the first pixel of
// scroll and completes after `range` × the element's height, so the hero reacts to the first wheel tick.
export function useScrollProgress(range = 0.45) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const p = scrollY / Math.max(el.offsetHeight * range, 1)
      el.style.setProperty('--p', Math.min(1, p).toFixed(3))
    }
    const onScroll = () => (frame ||= requestAnimationFrame(update))
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
    }
  }, [range])
  return ref
}
