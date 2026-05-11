'use client'

interface Props {
  active: 'business' | 'private'
  onChange: (t: 'business' | 'private') => void
  onContactClick: () => void
}

export default function TypeSelector({ active, onChange, onContactClick }: Props) {
  return (
    <div>
      <div className="selector-cards">
        <button
          className={`sel-card ${active === 'business' ? 'active' : ''}`}
          onClick={() => onChange('business')}
        >
          <div className="sel-icon">
            <svg viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <div className="sel-text">
            <div className="sel-title">Мы — компания</div>
            <div className="sel-sub">Корпоративы, тимбилдинги,<br/>клиентские события, фуршеты</div>
            {active === 'business' && <div className="sel-badge">Выбрано ✓</div>}
          </div>
          <div className="sel-arrow">{active === 'business' ? '→' : '›'}</div>
        </button>

        <button
          className={`sel-card ${active === 'private' ? 'active' : ''}`}
          onClick={() => onChange('private')}
        >
          <div className="sel-icon">
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="sel-text">
            <div className="sel-title">Я — частное лицо</div>
            <div className="sel-sub">Свадьбы, дни рождения,<br/>гендер-пати, детские праздники</div>
            {active === 'private' && <div className="sel-badge">Выбрано ✓</div>}
          </div>
          <div className="sel-arrow">{active === 'private' ? '→' : '›'}</div>
        </button>
      </div>

      <div className="selector-hint">
        Нажмите на карточку — страница изменится под вас
      </div>
    </div>
  )
}
