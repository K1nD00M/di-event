'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Lead {
  id: number; created_at: string; name: string;
  contact_method: string; contact_value: string;
  client_type: string; event_type: string; guests: string;
  event_date: string; message: string; budget: string;
  calc_summary: string; status: string;
}

const MESSENGER_ICONS: Record<string,string> = { telegram: '✈', max: 'M', email: '✉' }
const MESSENGER_LABELS: Record<string,string> = { telegram: 'Telegram', max: 'Max', email: 'Email' }

const STATUS_LABELS: Record<string,string> = { new: 'Новая', in_progress: 'В работе', done: 'Готово', cancelled: 'Отменено' }
const STATUS_COLORS: Record<string,string> = { new: '#C4AA82', in_progress: '#2980b9', done: '#27ae60', cancelled: '#95a5a6' }

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Lead | null>(null)
  const router = useRouter()

  useEffect(() => { loadLeads() }, [])

  async function loadLeads() {
    const r = await fetch('/api/admin/leads')
    if (r.status === 401) { router.push('/admin'); return }
    const data = await r.json()
    setLeads(data)
    setLoading(false)
  }

  async function updateStatus(id: number, status: string) {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
  }

  async function deleteLead(id: number) {
    if (!confirm('Удалить заявку?')) return
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setLeads(prev => prev.filter(l => l.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin')
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)
  const counts = { all: leads.length, new: leads.filter(l=>l.status==='new').length, in_progress: leads.filter(l=>l.status==='in_progress').length, done: leads.filter(l=>l.status==='done').length }

  const s = { /* inline styles object */ }

  return (
    <div style={{minHeight:'100vh',background:'#F7F2E6',fontFamily:"'Inter',-apple-system,sans-serif"}}>
      {/* Header */}
      <div style={{background:'rgba(255,253,246,0.97)',padding:'0 2rem',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,borderBottom:'1px solid #E2D8C4',backdropFilter:'blur(8px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <div style={{width:34,height:34,background:'#C09530',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#FFFFFF',fontFamily:'Georgia,serif',fontSize:'1rem'}}>Di</div>
          <div>
            <div style={{color:'#231508',fontWeight:700,fontSize:'.9rem',letterSpacing:'.05em'}}>Dialife Event</div>
            <div style={{color:'#917A60',fontSize:'.6rem',letterSpacing:'.15em',textTransform:'uppercase'}}>Панель управления</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <a href="/" target="_blank" style={{color:'#C09530',fontSize:'.8rem',textDecoration:'none',fontWeight:500}}>Открыть сайт ↗</a>
          <button onClick={logout} style={{background:'transparent',color:'#917A60',border:'1px solid #E2D8C4',borderRadius:7,padding:'.4rem .9rem',fontFamily:'inherit',fontSize:'.8rem',cursor:'pointer'}}>Выйти</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'2rem'}}>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
          {[['Всего заявок',counts.all,'#231508'],['Новые',counts.new,'#C4AA82'],['В работе',counts.in_progress,'#2980b9'],['Закрыты',counts.done,'#27ae60']].map(([l,c,col]) => (
            <div key={l as string} style={{background:'white',borderRadius:14,padding:'1.25rem 1.5rem',border:'1px solid #E0D8C6'}}>
              <div style={{fontSize:'2rem',fontWeight:800,color:col as string,letterSpacing:'-.03em',lineHeight:1}}>{c as number}</div>
              <div style={{fontSize:'.72rem',color:'#7B6245',marginTop:'.3rem',textTransform:'uppercase',letterSpacing:'.1em'}}>{l as string}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:selected?'1fr 380px':'1fr',gap:'1.5rem',alignItems:'start'}}>
          {/* List */}
          <div style={{background:'white',borderRadius:16,border:'1px solid #E0D8C6',overflow:'hidden'}}>
            {/* Filters */}
            <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid #E0D8C6',display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
              {[['all','Все'],['new','Новые'],['in_progress','В работе'],['done','Готово'],['cancelled','Отменено']].map(([val,lbl]) => (
                <button key={val} onClick={() => setFilter(val)}
                  style={{padding:'.35rem .85rem',borderRadius:6,border:`1.5px solid ${filter===val?'#C4AA82':'#D8D0BA'}`,background:filter===val?'rgba(196,170,130,.1)':'transparent',color:filter===val?'#A89070':'#7B6245',fontSize:'.78rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                  {lbl}
                </button>
              ))}
              <button onClick={loadLeads} style={{marginLeft:'auto',padding:'.35rem .85rem',borderRadius:6,border:'1.5px solid #D8D0BA',background:'transparent',color:'#7B6245',fontSize:'.78rem',cursor:'pointer',fontFamily:'inherit'}}>↻ Обновить</button>
            </div>

            {loading ? (
              <div style={{padding:'3rem',textAlign:'center',color:'#7B6245'}}>Загружаем заявки...</div>
            ) : filtered.length === 0 ? (
              <div style={{padding:'3rem',textAlign:'center',color:'#7B6245'}}>
                <div style={{fontSize:'2rem',marginBottom:'.75rem'}}>📭</div>
                <div>Заявок пока нет</div>
              </div>
            ) : (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#F7F2E6'}}>
                    {['#','Дата','Имя','Мессенджер','Контакт','Тип','Мероприятие','Статус',''].map(h => (
                      <th key={h} style={{padding:'.65rem 1rem',fontSize:'.65rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'#7B6245',textAlign:'left',whiteSpace:'nowrap'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead, i) => (
                    <tr key={lead.id} onClick={() => setSelected(selected?.id===lead.id?null:lead)}
                      style={{borderTop:'1px solid #F0EAD8',cursor:'pointer',background:selected?.id===lead.id?'rgba(196,170,130,.06)':'white',transition:'background .15s'}}>
                      <td style={{padding:'.75rem 1rem',fontSize:'.75rem',color:'#7B6245'}}>{i+1}</td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.75rem',color:'#7B6245',whiteSpace:'nowrap'}}>{lead.created_at.slice(0,16).replace('T',' ')}</td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.85rem',fontWeight:600,color:'#2C1A08'}}>{lead.name}</td>
                      <td style={{padding:'.75rem 1rem'}}>
                        <span style={{display:'inline-flex',alignItems:'center',gap:'.35rem',fontSize:'.72rem',fontWeight:700,color:'#A89070',background:'rgba(196,170,130,.1)',padding:'.22rem .6rem',borderRadius:5}}>
                          <span>{MESSENGER_ICONS[lead.contact_method] || '📞'}</span>
                          {MESSENGER_LABELS[lead.contact_method] || lead.contact_method}
                        </span>
                      </td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.8rem',color:'#2C1A08',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lead.contact_value}</td>
                      <td style={{padding:'.75rem 1rem'}}>
                        <span style={{fontSize:'.65rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:lead.client_type==='business'?'#2980b9':'#8e44ad',background:lead.client_type==='business'?'rgba(41,128,185,.1)':'rgba(142,68,173,.1)',padding:'.2rem .55rem',borderRadius:4}}>
                          {lead.client_type === 'business' ? 'Компания' : 'Частное'}
                        </span>
                      </td>
                      <td style={{padding:'.75rem 1rem',fontSize:'.8rem',color:'#7B6245'}}>{lead.event_type || '—'}</td>
                      <td style={{padding:'.75rem 1rem'}}>
                        <span style={{fontSize:'.65rem',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:STATUS_COLORS[lead.status]||'#7B6245',background:`${STATUS_COLORS[lead.status]||'#7B6245'}18`,padding:'.22rem .6rem',borderRadius:4,whiteSpace:'nowrap'}}>
                          {STATUS_LABELS[lead.status] || lead.status}
                        </span>
                      </td>
                      <td style={{padding:'.75rem 1rem'}}>
                        <button onClick={e => { e.stopPropagation(); deleteLead(lead.id) }} style={{background:'none',border:'none',cursor:'pointer',color:'#c0392b',fontSize:'.8rem',padding:'.2rem .4rem',borderRadius:4}} title="Удалить">✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{background:'white',borderRadius:16,border:'1px solid #E0D8C6',padding:'1.5rem',position:'sticky',top:76}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.25rem'}}>
                <h3 style={{fontSize:'1.1rem',fontWeight:800,color:'#231508'}}>Заявка #{selected.id}</h3>
                <button onClick={() => setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',color:'#7B6245',fontSize:'1rem'}}>✕</button>
              </div>

              {/* Контакт */}
              <div style={{marginBottom:'.75rem',background:'rgba(196,170,130,.06)',border:'1px solid rgba(196,170,130,.2)',borderRadius:10,padding:'.85rem 1rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:'.5rem',marginBottom:'.3rem'}}>
                  <span style={{fontSize:'1rem'}}>{MESSENGER_ICONS[selected.contact_method] || '📞'}</span>
                  <span style={{fontSize:'.65rem',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#A89070'}}>{MESSENGER_LABELS[selected.contact_method] || selected.contact_method}</span>
                </div>
                <div style={{fontSize:'.95rem',fontWeight:700,color:'#2C1A08'}}>{selected.contact_value}</div>
              </div>

              {selected.calc_summary && (
                <div style={{marginBottom:'.75rem'}}>
                  <div style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#7B6245',marginBottom:'.2rem'}}>Из калькулятора</div>
                  <div style={{fontSize:'.82rem',color:'#2C1A08',background:'#F7F2E6',borderRadius:8,padding:'.6rem .75rem'}}>{selected.calc_summary}</div>
                </div>
              )}

              {[
                ['Имя', selected.name],
                ['Тип клиента', selected.client_type === 'business' ? 'Компания' : 'Частное лицо'],
                ['Мероприятие', selected.event_type || '—'],
                ['Гостей', selected.guests || '—'],
                ['Дата события', selected.event_date || '—'],
                ['Бюджет', selected.budget || '—'],
                ['Получено', selected.created_at.slice(0,16).replace('T',' ')],
              ].map(([k,v]) => (
                <div key={k} style={{marginBottom:'.65rem'}}>
                  <div style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#7B6245',marginBottom:'.15rem'}}>{k}</div>
                  <div style={{fontSize:'.88rem',color:'#2C1A08'}}>{v as string}</div>
                </div>
              ))}

              {selected.message && (
                <div style={{marginBottom:'.75rem'}}>
                  <div style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#7B6245',marginBottom:'.2rem'}}>Пожелания</div>
                  <div style={{fontSize:'.85rem',color:'#2C1A08',lineHeight:1.65,background:'#F7F2E6',borderRadius:8,padding:'.75rem'}}>{selected.message}</div>
                </div>
              )}

              {/* Статус */}
              <div style={{borderTop:'1px solid #E0D8C6',paddingTop:'1rem',marginTop:'1rem'}}>
                <div style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',color:'#7B6245',marginBottom:'.6rem'}}>Статус</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'.4rem'}}>
                  {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                    <button key={val} onClick={() => updateStatus(selected.id, val)}
                      style={{padding:'.38rem .8rem',borderRadius:6,border:`1.5px solid ${selected.status===val?STATUS_COLORS[val]:'#D8D0BA'}`,background:selected.status===val?`${STATUS_COLORS[val]}18`:'transparent',color:selected.status===val?STATUS_COLORS[val]:'#7B6245',fontSize:'.75rem',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Кнопки быстрого контакта */}
              <div style={{display:'flex',gap:'.75rem',marginTop:'1.25rem'}}>
                {selected.contact_method === 'email' ? (
                  <a href={`mailto:${selected.contact_value}`} style={{flex:1,padding:'.65rem',background:'#C09530',color:'white',borderRadius:8,textAlign:'center',textDecoration:'none',fontSize:'.82rem',fontWeight:600}}>✉ Написать</a>
                ) : selected.contact_method === 'max' ? (
                  <a href={`https://max.ru/im?sel=${selected.contact_value.replace(/\D/g,'')}`} target="_blank" style={{flex:1,padding:'.65rem',background:'linear-gradient(135deg,#3D9BF7,#9B52EE)',color:'white',borderRadius:8,textAlign:'center',textDecoration:'none',fontSize:'.82rem',fontWeight:600}}>M Max</a>
                ) : (
                  <a href={`https://t.me/${selected.contact_value.replace('@','').replace(/\D/g,d => d==='@'?'@':'')}`} target="_blank" style={{flex:1,padding:'.65rem',background:'#2AABEE',color:'white',borderRadius:8,textAlign:'center',textDecoration:'none',fontSize:'.82rem',fontWeight:600}}>✈ Telegram</a>
                )}
                <a href={`tel:${selected.contact_value.replace(/[^\d+]/g,'')}`} style={{flex:1,padding:'.65rem',background:'rgba(196,170,130,.12)',color:'#A89070',border:'1px solid rgba(196,170,130,.3)',borderRadius:8,textAlign:'center',textDecoration:'none',fontSize:'.82rem',fontWeight:600}}>📞 Позвонить</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
