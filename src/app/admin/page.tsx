'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (r.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Неверный пароль')
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#FAF7F0',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'#FFFFFF',borderRadius:20,padding:'2.5rem',width:'100%',maxWidth:400,border:'1px solid #E2D8C4',boxShadow:'0 4px 32px rgba(35,21,8,.08)'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div style={{width:56,height:56,background:'#C09530',borderRadius:12,margin:'0 auto 1rem',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',color:'#FFFFFF',fontFamily:'Georgia,serif',fontWeight:400}}>Di</div>
          <h1 style={{fontSize:'1.4rem',fontWeight:800,color:'#231508',letterSpacing:'-.03em',marginBottom:'.3rem'}}>Панель управления</h1>
          <p style={{fontSize:'.85rem',color:'#917A60'}}>Dialife Event · Административный доступ</p>
        </div>
        <form onSubmit={submit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{display:'block',fontSize:'.7rem',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#917A60',marginBottom:'.4rem'}}>Пароль</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
              style={{width:'100%',padding:'.75rem 1rem',border:'1.5px solid #E2D8C4',borderRadius:9,fontFamily:'inherit',fontSize:'.9rem',color:'#231508',outline:'none',background:'#FAF7F0'}}
            />
          </div>
          {error && <p style={{color:'#c0392b',fontSize:'.82rem',marginBottom:'.75rem'}}>{error}</p>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'.85rem',background:'#C09530',color:'#FFFFFF',border:'none',borderRadius:10,fontFamily:'inherit',fontSize:'.95rem',fontWeight:700,cursor:'pointer',opacity:loading?.6:1}}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
