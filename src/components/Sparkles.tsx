import { useEffect, useRef } from 'react'

/** Slow drifting ice dust behind everything. Stills itself for reduced motion. */
export function Sparkles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    type P = { x: number; y: number; r: number; vy: number; vx: number; tw: number; ph: number }
    let parts: P[] = []

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(140, (w * h) / 11000))
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.3,
        vy: Math.random() * 0.18 + 0.04,
        vx: (Math.random() - 0.5) * 0.08,
        tw: Math.random() * 0.02 + 0.006,
        ph: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        if (!reduce) {
          p.y += p.vy
          p.x += p.vx
          if (p.y > h + 4) (p.y = -4), (p.x = Math.random() * w)
          if (p.x < -4) p.x = w + 4
          if (p.x > w + 4) p.x = -4
        }
        const a = 0.25 + 0.75 * Math.abs(Math.sin(p.ph + t * p.tw * 0.06))
        ctx.globalAlpha = a * 0.8
        ctx.fillStyle = p.r > 1.4 ? '#e6f6ff' : '#9fd8ff'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        if (p.r > 1.55 && a > 0.85) {
          // little four-point glint on the biggest flakes
          ctx.globalAlpha = (a - 0.85) * 4
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(p.x - 5, p.y)
          ctx.lineTo(p.x + 5, p.y)
          ctx.moveTo(p.x, p.y - 5)
          ctx.lineTo(p.x, p.y + 5)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
      if (!reduce) raf = requestAnimationFrame(draw)
    }

    const onResize = () => {
      resize()
      if (reduce) draw(0)
    }
    resize()
    draw(0)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} className="sparkles" aria-hidden="true" />
}
