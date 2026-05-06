'use client'
import { useState, useEffect } from 'react'

const EVENT_TYPES_BUSINESS = ['Корпоратив', 'Тимбилдинг', 'Клиентское событие', 'Фуршет / приём', 'Другое']
const EVENT_TYPES_PRIVATE  = ['Свадьба', 'День рождения', 'Гендер-пати', 'Детский праздник', 'Другое']

const FORMAT_LABELS: Record<string, string> = {
  corporate: 'Корпоратив', wedding: 'Свадьба', birthday: 'День рождения',
  gender: 'Гендер-пати', kids: 'Детский праздник', teambuilding: 'Тимбилдинг',
}
const GUESTS_MAP: Record<number, string> = {
  10: 'до 20', 20: 'до 20', 30: '20–50',
  50: '50–100', 80: '50–100', 100: '100–200', 150: '200+',
}

export interface CalcPrefill {
  format: string
  guests_count: number
  budget_range: string
  calc_summary: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  defaultType?: 'business' | 'private'
  prefill?: CalcPrefill | null
}

type ContactMethod = 'telegram' | 'whatsapp' | 'email'

const MESSENGERS: { id: ContactMethod; label: string; icon: string; placeholder: string; hint: string }[] = [
  { id: 'telegram', label: 'Telegram',  icon: '✈', placeholder: '@username или +7 (999) 000-00-00', hint: 'Напишем первыми' },
  { id: 'whatsapp', label: 'WhatsApp',  icon: '💬', placeholder: '+7 (999) 000-00-00', hint: 'Пришлём сообщение' },
  { id: 'email',    label: 'Email',     icon: '✉', placeholder: 'example@mail.ru', hint: 'Ответим в течение часа' },
]

export default function ContactModal({ isOpen, onClose, defaultType = 'business', prefill }: Props) {
  const [form, setForm] = useState({
    name: '',
    contact_method: 'telegram' as ContactMethod,
    contact_value: '',
    client_type: defaultType as string,
    event_type: '',
    guests: '',
    event_date: '',
    message: '',
    budget: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  /* Сбрасываем форму при открытии + подставляем данные из калькулятора */
  useEffect(() => {
    if (!isOpen) return
    setStatus('idle')
    setForm(prev => ({
      ...prev,
      client_type: defaultType,
      event_type: prefill ? (FORMAT_LABELS[prefill.format] || '') : '',
      guests:     prefill ? (GUESTS_MAP[prefill.guests_count] || '') : '',
      budget:     prefill ? prefill.budget_range : '',
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const eventTypes = form.client_type === 'business' ? EVENT_TYPES_BUSINESS : EVENT_TYPES_PRIVATE
  const messenger  = MESSENGERS.find(m => m.id === form.contact_method)!

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          calc_summary: prefill?.calc_summary || '',
        }),
      })
      setStatus(r.ok ? 'ok' : 'err')
    } catch { setStatus('err') }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">✕</button>

        {status === 'ok' ? (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <h3>Заявка отправлена!</h3>
            <p>Свяжемся с вами через {form.contact_method === 'email' ? 'час' : '15 минут'}.</p>
            <button className="modal-btn-primary" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="modal-header">
              <h2 className="modal-title">Обсудить мероприятие</h2>
              <p className="modal-sub">
                {prefill
                  ? 'Данные из калькулятора подставлены — просто оставьте контакт'
                  : 'Заполните форму — ответим в течение 15 минут'}
              </p>
            </div>

            {/* Подтверждение данных из калькулятора */}
            {prefill && (
              <div className="modal-calc-badge">
                <span className="modal-calc-badge-icon">🧮</span>
                <div>
                  <div className="modal-calc-badge-title">Из калькулятора</div>
                  <div className="modal-calc-badge-text">{prefill.calc_summary}</div>
                </div>
              </div>
            )}

            {/* Тип клиента */}
            <div className="modal-section-label">Кто вы?</div>
            <div className="modal-type-toggle">
              <button type="button" className={`modal-type-btn ${form.client_type === 'business' ? 'active' : ''}`} onClick={() => set('client_type', 'business')}>
                <span className="modal-type-icon">🏢</span><span>Компания</span>
              </button>
              <button type="button" className={`modal-type-btn ${form.client_type === 'private' ? 'active' : ''}`} onClick={() => set('client_type', 'private')}>
                <span className="modal-type-icon">👤</span><span>Частное лицо</span>
              </button>
            </div>

            {/* Имя */}
            <div className="modal-field">
              <label>Ваше имя *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Иван Иванов" />
            </div>

            {/* Выбор мессенджера */}
            <div className="modal-section-label" style={{marginTop:'.25rem'}}>Как с вами связаться?</div>
            <div className="modal-messenger-tabs">
              {MESSENGERS.map(m => (
                <button
                  key={m.id} type="button"
                  className={`modal-messenger-tab ${form.contact_method === m.id ? 'active' : ''}`}
                  onClick={() => { set('contact_method', m.id); set('contact_value', '') }}
                >
                  <span className="mstab-icon">{m.icon}</span>
                  <span className="mstab-label">{m.label}</span>
                </button>
              ))}
            </div>
            <div className="modal-field" style={{marginTop:'.5rem'}}>
              <label>
                {messenger.label}
                <span className="modal-field-hint">{messenger.hint}</span>
              </label>
              <input
                required
                type={form.contact_method === 'email' ? 'email' : 'tel'}
                value={form.contact_value}
                onChange={e => set('contact_value', e.target.value)}
                placeholder={messenger.placeholder}
                className="modal-contact-input"
              />
            </div>

            {/* Детали мероприятия */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Тип мероприятия</label>
                <select value={form.event_type} onChange={e => set('event_type', e.target.value)}>
                  <option value="">Выберите тип</option>
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="modal-field">
                <label>Количество гостей</label>
                <select value={form.guests} onChange={e => set('guests', e.target.value)}>
                  <option value="">Примерно...</option>
                  <option>до 20</option>
                  <option>20–50</option>
                  <option>50–100</option>
                  <option>100–200</option>
                  <option>200+</option>
                </select>
              </div>
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label>Дата мероприятия</label>
                <input type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} />
              </div>
              <div className="modal-field">
                <label>Бюджет</label>
                <select value={form.budget} onChange={e => set('budget', e.target.value)}>
                  <option value="">Не определился</option>
                  <option>до 50 000 ₽</option>
                  <option>50 000–150 000 ₽</option>
                  <option>150 000–300 000 ₽</option>
                  <option>300 000–500 000 ₽</option>
                  <option>500 000+ ₽</option>
                </select>
              </div>
            </div>

            <div className="modal-field">
              <label>Пожелания</label>
              <textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Расскажите о концепции, особых пожеланиях..." rows={3} />
            </div>

            {status === 'err' && <p className="modal-error">Ошибка отправки. Попробуйте ещё раз.</p>}

            <button type="submit" className="modal-btn-primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
            </button>
            <p className="modal-privacy">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
          </form>
        )}
      </div>
    </div>
  )
}
