'use client'
import { useEffect, useState, useCallback } from 'react'

export interface CaseData {
  tag: string
  title: string
  subtitle: string
  description: string
  photos: string[]
}

interface Props {
  case_: CaseData | null
  onClose: () => void
}

export default function CaseModal({ case_, onClose }: Props) {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)

  const goTo = useCallback((next: number) => {
    if (!case_) return
    setFade(false)
    setTimeout(() => {
      setIdx((next + case_.photos.length) % case_.photos.length)
      setFade(true)
    }, 220)
  }, [case_])

  // Auto-advance
  useEffect(() => {
    if (!case_) return
    const t = setInterval(() => goTo(idx + 1), 4500)
    return () => clearInterval(t)
  }, [case_, idx, goTo])

  // Reset slide when case changes
  useEffect(() => { setIdx(0); setFade(true) }, [case_])

  // Keyboard
  useEffect(() => {
    if (!case_) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goTo(idx + 1)
      if (e.key === 'ArrowLeft') goTo(idx - 1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [case_, idx, onClose, goTo])

  if (!case_) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(25,15,5,.72)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 20, width: '100%', maxWidth: 760,
          maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(25,15,5,.35)',
        }}
      >
        {/* Slideshow */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', flexShrink: 0, background: '#111' }}>
          <img
            src={case_.photos[idx]}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: fade ? 1 : 0, transition: 'opacity .22s ease',
            }}
          />

          {/* Prev */}
          <button
            onClick={() => goTo(idx - 1)}
            style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(0,0,0,.45)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.1rem', transition: 'background .15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(0,0,0,.7)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(0,0,0,.45)')}
          >‹</button>

          {/* Next */}
          <button
            onClick={() => goTo(idx + 1)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(0,0,0,.45)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1.1rem', transition: 'background .15s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(0,0,0,.7)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(0,0,0,.45)')}
          >›</button>

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6,
          }}>
            {case_.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === idx ? 22 : 7, height: 7, borderRadius: 4,
                  background: i === idx ? '#C4AA82' : 'rgba(255,255,255,.55)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'width .25s, background .25s',
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: 12, right: 14,
            background: 'rgba(0,0,0,.5)', borderRadius: 20,
            padding: '3px 10px', color: '#fff', fontSize: '.72rem', fontWeight: 600,
          }}>
            {idx + 1} / {case_.photos.length}
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, left: 12,
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,.45)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '1rem',
            }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 2rem 2rem', overflowY: 'auto' }}>
          <div style={{
            fontSize: '.62rem', fontWeight: 700, letterSpacing: '.18em',
            textTransform: 'uppercase', color: '#C4AA82', marginBottom: '.5rem',
          }}>
            {case_.tag}
          </div>
          <h2 style={{
            fontSize: '1.35rem', fontWeight: 800, color: '#231508',
            letterSpacing: '-.02em', marginBottom: '.2rem', lineHeight: 1.2,
          }}>
            {case_.title}
          </h2>
          <div style={{ fontSize: '.9rem', color: '#917A60', marginBottom: '1.1rem' }}>
            {case_.subtitle}
          </div>
          <div style={{
            fontSize: '.88rem', color: '#3d2a18', lineHeight: 1.8,
            borderTop: '1px solid #E2D8C4', paddingTop: '1.1rem',
          }}>
            {case_.description.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: i < case_.description.split('\n\n').length - 1 ? '.9rem' : 0 }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
