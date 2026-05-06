'use client'
import { useState, useEffect, useRef } from 'react'
import TypeSelector from '@/components/TypeSelector'
import ContactModal, { CalcPrefill } from '@/components/ContactModal'
import CaseModal, { CaseData } from '@/components/CaseModal'

const LogoSvg = () => (
  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%',display:'block'}}>
    <rect width="40" height="40" rx="9" fill="#C09530"/>
    <text x="4" y="30" fontFamily="Georgia,serif" fontSize="27" fontWeight="400" fill="#fff">D</text>
    <text x="23" y="29" fontFamily="Georgia,serif" fontSize="18" fontWeight="300" fontStyle="italic" fill="#fff">i</text>
    <polygon points="31,4.5 32.2,1.5 33.5,4.5 36.5,5.8 33.5,7 32.2,10 31,7 28,5.8" fill="rgba(255,255,255,.65)"/>
    <polygon points="10,9 10.8,7 11.6,9 13.5,9.8 11.6,10.6 10.8,12.5 10,10.6 8,9.8" fill="rgba(255,255,255,.4)"/>
  </svg>
)

const PEOPLE   = [10, 20, 30, 50, 80, 100, 150]
const FOOD_PER: Record<string,number> = { buffet: 1200, banquet: 1800, pizza: 800, own: 1000 }
const HOST_P: Record<string,number>   = { none: 0, host_2h: 15000, host_4h: 25000, dj: 15000, live: 30000, host_dj: 40000 }
const FMT_COEF: Record<string,number> = { corporate: 1.0, wedding: 1.25, birthday: 1.0, gender: 1.0, kids: 0.85, teambuilding: 0.9 }

function fmt(n: number) { return Math.round(n).toLocaleString('ru-RU') + ' ₽' }
function fmtRange(lo: number, hi: number) { return 'от ' + fmt(lo) + ' — до ' + fmt(hi) }

interface CalcState {
  format: string; food: string; host: string;
  people: number; dur: number;
  photo: boolean; decor: boolean; venue: boolean; outside: boolean;
}

function calcTotal(S: CalcState) {
  if (S.people >= 6) return null
  const n = PEOPLE[S.people] || 30
  const coef = FMT_COEF[S.format] || 1.0
  const foodSub    = (FOOD_PER[S.food] || 0) * n
  const hostSub    = HOST_P[S.host] || 0
  const venueSub   = S.venue   ? 40000 + n * 300 : 0
  const photoSub   = S.photo   ? 25000 : 0
  const decorSub   = S.decor   ? 20000 + n * 100 : 0
  const outsideSub = S.outside ? 15000 : 0
  const sub   = (foodSub + hostSub + venueSub + photoSub + decorSub + outsideSub) * coef
  const comm  = sub * 0.15
  const total = sub + comm
  const hi    = total * 1.15
  const lines: [string, string][] = []
  if (foodSub > 0)    lines.push(['Питание', fmt(Math.round(foodSub * coef))])
  if (hostSub > 0)    lines.push(['Ведущий / музыка', fmt(Math.round(hostSub * coef))])
  if (venueSub > 0)   lines.push(['Аренда зала', fmt(Math.round(venueSub * coef))])
  if (photoSub > 0)   lines.push(['Фотограф', fmt(Math.round(photoSub * coef))])
  if (decorSub > 0)   lines.push(['Декор', fmt(Math.round(decorSub * coef))])
  if (outsideSub > 0) lines.push(['Выезд за город', fmt(Math.round(outsideSub * coef))])
  lines.push(['Наша координация (15%)', fmt(Math.round(comm))])
  return { total, hi, lines }
}

export default function Home() {
  const [clientType, setClientType] = useState<'business' | 'private'>('business')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPrefill, setModalPrefill] = useState<CalcPrefill | null>(null)
  const [activeCase, setActiveCase] = useState<CaseData | null>(null)

  const CASES: Record<string, CaseData> = {
    krasStrelа: {
      tag: 'Юбилей · Корпоратив',
      title: '90 лет «Красной стрелы»',
      subtitle: 'Праздник на перроне',
      description: 'Мы оживили историю: перрон и вокзал стали сценой для большого юбилея.\n\nГостей встречали «живые проводники» с флажками. Ретро-ходулисты создавали атмосферу и лучшие кадры. Кавер-группа соединила хиты 30–40‑х и современные ритмы. Ведущий вёл сквозь время — легко и с душой. А кульминацией стало лазерное шоу.\n\nПрошлое и настоящее встретились. Получилось ярко, душевно и красиво — как и должно быть на 90-летие легенды.',
      photos: ['/kc_1.png','/kc_2.png','/kc_3.png','/kc_4.png','/kc_5.png','/kc_6.png','/kc_7.png'],
    },
    maslenitsa: {
      tag: 'Корпоративный праздник · Улица',
      title: 'Масленица для Горэлектротранса',
      subtitle: 'Когда трамваи пляшут, а блины — не главное',
      description: 'Театральное вступление задало тон и сразу включило в сказку. Соревновательные точки с азартом — победители кричали громче всех. У каждого своя территория: отдельные шатры для команд, никакой суеты.\n\nХаски, которых можно гладить и катать — счастливы и дети, и взрослые. Трамвай с детской программой — отдельный вагон веселья. Еда не фоном: блины, чай, кофе, горячие угощения — сытно и по-домашнему. Кавер-группа держала ритм, а ведущий — драйв.\n\nКульминация: сожжение Масленицы под аплодисменты, смех и морозный воздух.\n\nВместо стандартного выезда на природу — настоящий народный праздник. Со своим трамваем, собаками, огнём и дымом. Уехали все — румяные, уставшие и очень довольные.',
      photos: ['/ms_1.png','/ms_2.png','/ms_3.png','/ms_4.png','/ms_5.png','/ms_6.png','/ms_7.png','/ms_8.png','/ms_9.png','/ms_10.png'],
    },
    tramvai: {
      tag: 'Детский праздник · Конкурс',
      title: 'Конкурс рисунков «Трамваи и троллейбусы на Неве»',
      subtitle: 'Когда рисунки оживают на глазах',
      description: 'Ростовые куклы, аквагрим и робот с шариками встречали юных художников. Танцевальные коллективы зажигали.\n\nГлавное чудо: рисунки участников на глазах у зала оживали на большом экране — благодаря ИИ. Мастер-класс по рисованию, драйвовый ведущий и трогательное награждение.\n\nДети поверили в волшебство. Рисунки дышали, робот дарил шары, а счастливые глаза победителей говорили громче любых слов.',
      photos: ['/tr_1.png','/tr_2.png','/tr_3.png','/tr_4.png','/tr_5.png','/tr_6.png','/tr_7.png','/tr_8.png'],
    },
  }
  const [headerVisible, setHeaderVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [calcFormVisible, setCalcFormVisible] = useState(false)
  const [calcStatus, setCalcStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle')
  const [S, setS] = useState<CalcState>({
    format: 'corporate', food: 'buffet', host: 'none',
    people: 2, dur: 3, photo: false, decor: false, venue: false, outside: false
  })

  const stripsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setHeaderVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let snapped = false
    const onScroll = () => {
      if (!snapped && window.scrollY > 60 && window.scrollY < window.innerHeight * 0.88) {
        snapped = true
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => { snapped = false }, 1200)
      } else if (window.scrollY < 10) snapped = false
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const stripsEl = stripsRef.current
    if (!stripsEl) return

    const STRIP_EVENTS = [
      [
        { src: '/canvas.png',        tag: 'Корпоратив',    title: 'Корпоративный вечер',   price: 'от 150 000 ₽' },
        { src: '/image_copy_2.png',  tag: 'Свадьба',       title: 'Свадьба за городом',    price: 'от 300 000 ₽' },
        { src: '/image_copy_5.png',  tag: 'Гендер-пати',   title: 'Праздник ожидания',     price: 'от 35 000 ₽'  },
        { src: '/image.png',         tag: 'День рождения', title: 'Персональный праздник', price: 'от 50 000 ₽'  },
        { src: '/image_copy_7.png',  tag: 'Тимбилдинг',   title: 'Командный день',        price: 'от 80 000 ₽'  },
      ],
      [
        { src: '/canvas1.png',        tag: 'Фуршет',     title: 'Деловой фуршет',    price: 'от 45 000 ₽'  },
        { src: '/image_copy_3.png',   tag: 'Детский',    title: 'Праздник под ключ', price: 'от 25 000 ₽'  },
        { src: '/image_copy.png',     tag: 'Вечеринка',  title: 'Праздник',          price: 'от 60 000 ₽'  },
        { src: '/image_copy_10.png',  tag: 'Корпоратив', title: 'Новогодний вечер',  price: 'от 200 000 ₽' },
        { src: '/image_copy_11.png',  tag: 'Юбилей',     title: 'Юбилей',            price: 'от 90 000 ₽'  },
      ],
      [
        { src: '/image_copy_12.png', tag: 'Свадьба',    title: 'Банкет у воды',      price: 'от 250 000 ₽' },
        { src: '/image_copy_13.png', tag: 'Тимбилдинг', title: 'Квест на природе',   price: 'от 70 000 ₽'  },
        { src: '/image_copy_15.png', tag: 'Гала-ужин',  title: 'Гала-ужин',         price: 'от 120 000 ₽' },
        { src: '/image_copy_4.png',  tag: 'Концерт',    title: 'Живая музыка',       price: 'от 40 000 ₽'  },
        { src: '/image_copy_6.png',  tag: 'Детский',    title: 'Сказочный праздник', price: 'от 30 000 ₽'  },
      ],
    ]
    const STRIP_CFG = [
      { idx: 0, dir: 1,  speed: 0.28, vFact: 1.00, cardHRatio: 0.52 },
      { idx: 1, dir: -1, speed: 0.32, vFact: 0.75, cardHRatio: 0.37 },
      { idx: 2, dir: 1,  speed: 0.36, vFact: 1.30, cardHRatio: 0.36 },
    ]
    const GAP = 14
    let VH = window.innerHeight
    const onResize = () => { VH = window.innerHeight }
    window.addEventListener('resize', onResize)

    type Strip = typeof STRIP_CFG[0] & { cardEls: HTMLDivElement[]; cardH: number; STEP: number; TOTAL: number; N: number; offset: number }

    function buildStrip(cfg: typeof STRIP_CFG[0]): Strip {
      const events = STRIP_EVENTS[cfg.idx]
      const cardH  = Math.round(VH * cfg.cardHRatio)
      const STEP   = cardH + GAP
      const N      = events.length
      const TOTAL  = N * STEP
      const wrapEl = document.createElement('div')
      wrapEl.className = 'vstrip vstrip-' + (cfg.idx + 1)
      const cardEls = events.map(ev => {
        const card = document.createElement('div')
        card.className = 'strip-card'
        card.style.height = cardH + 'px'
        card.innerHTML = `<img src="${ev.src}" alt="${ev.tag}"><div class="card-overlay"><span class="card-tag">${ev.tag}</span><div class="card-reveal"><div class="card-title">${ev.title}</div><div class="card-price">${ev.price}</div></div></div>`
        wrapEl.appendChild(card)
        return card as HTMLDivElement
      })
      stripsEl!.appendChild(wrapEl)
      return { ...cfg, cardEls, cardH, STEP, TOTAL, N, offset: 0 }
    }

    const strips = STRIP_CFG.map(buildStrip)
    let rawVel = 0, smoothVel = 0, lastSY = window.scrollY
    const onScroll = () => { rawVel += (window.scrollY - lastSY) * 0.45; lastSY = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    function renderStrip(s: Strip) {
      const normOff = ((s.offset % s.TOTAL) + s.TOTAL) % s.TOTAL
      s.cardEls.forEach((card, i) => {
        let y: number
        if (s.dir === 1) { y = i * s.STEP - normOff; if (y < -(s.cardH + 10)) y += s.TOTAL }
        else { y = normOff - i * s.STEP; y = ((y % s.TOTAL) + s.TOTAL) % s.TOTAL; if (y > VH + s.cardH + 10) y -= s.TOTAL }
        card.style.transform = 'translateY(' + y + 'px)'
      })
    }

    let raf: number
    function loop() {
      smoothVel += (rawVel - smoothVel) * 0.10; rawVel *= 0.86
      strips.forEach(s => { s.offset += s.speed + smoothVel * s.vFact })
      strips.forEach(renderStrip)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); stripsEl.innerHTML = '' }
  }, [])

  function handleTypeChange(t: 'business' | 'private') {
    setClientType(t)
    setTimeout(() => { document.getElementById(t === 'business' ? 'businessContent' : 'privateContent')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 60)
    setS(prev => ({ ...prev, format: t === 'business' ? 'corporate' : 'birthday' }))
  }

  function openModalFromCalc() {
    if (!calcResult) return
    const n = PEOPLE[S.people] || 30
    const totalStr = fmtRange(Math.round(calcResult.total / 1000) * 1000, Math.round(calcResult.hi / 1000) * 1000)
    const FORMAT_LABELS: Record<string,string> = {
      corporate:'Корпоратив', wedding:'Свадьба', birthday:'День рождения',
      gender:'Гендер-пати', kids:'Детский праздник', teambuilding:'Тимбилдинг',
    }
    const parts = [`${FORMAT_LABELS[S.format] || S.format}`, `${n} чел.`, `${S.dur} ч`, totalStr]
    setModalPrefill({
      format: S.format,
      guests_count: n,
      budget_range: totalStr,
      calc_summary: parts.join(' · '),
    })
    setModalOpen(true)
  }

  const calcResult = calcTotal(S)
  const peopleVal = PEOPLE[S.people] || 30
  const isBusiness = clientType === 'business'
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  const FearCheck = () => (
    <div className="fear-check">
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" style={{width:12,height:12}}>
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
  )

  const StepArrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:16,height:16}}>
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )

  return (
    <>
      <header className={`site-header ${headerVisible ? 'visible' : ''}`}>
        <a href="#hero" className="logo" onClick={e => { e.preventDefault(); scrollTo('hero') }}>
          <div className="logo-mark"><LogoSvg /></div>
          <div><div className="logo-name">Di Event</div><div className="logo-sub">Event Agency</div></div>
        </a>
        <nav className={`hdr-nav ${menuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={e => { e.preventDefault(); scrollTo('about') }}>О нас</a>
          <a href="#slideshow" onClick={e => { e.preventDefault(); scrollTo('slideshow') }}>Портфолио</a>
          <a href="#services" onClick={e => { e.preventDefault(); scrollTo('services') }}>Услуги</a>
          <a href="#calculator" onClick={e => { e.preventDefault(); scrollTo('calculator') }}>Цены</a>
          <button className="hdr-cta" onClick={() => { setModalOpen(true); setMenuOpen(false) }}>Обсудить проект</button>
          <button className="hdr-cta-m" onClick={() => { setModalOpen(true); setMenuOpen(false) }}>Обсудить проект</button>
        </nav>
        <button className={`hdr-burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(v => !v)} aria-label="Меню">
          <span/><span/><span/>
        </button>
      </header>

      <button className="float-btn" onClick={() => setModalOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:16,height:16}}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="float-label">Обсудить проект</span>
      </button>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg"/>
        <div className="hero-overlay"/>
        <div className="hero-center">
          <div className="hero-mark"><LogoSvg /></div>
          <h1 className="hero-brand">Di Event</h1>
          <p className="hero-tagline">Event Agency</p>
          <div className="hero-divider"/>
          <p className="hero-city">Санкт-Петербург</p>
        </div>
        <div className="hero-scroll"><div className="hero-scroll-line"/>scroll</div>
      </section>

      {/* ABOUT + SELECTOR */}
      <section className="about" id="about">
        <div className="about-inner">
          <div className="about-text">
            <div className="eyebrow" style={{color:'var(--gold)',opacity:.8}}>О нас</div>
            <h2>Делаем мероприятия,<br/>которые <strong>запоминают</strong></h2>
            <p>Организуем события для компаний и частных клиентов в Санкт-Петербурге. Берём на себя всё — от концепции до последнего гостя. Без скрытых комиссий.</p>
            <div className="about-stats">
              <div className="astat"><div className="num">150+</div><div className="lbl">Мероприятий</div></div>
              <div className="astat"><div className="num">5 лет</div><div className="lbl">На рынке</div></div>
              <div className="astat"><div className="num">98%</div><div className="lbl">Рекомендуют</div></div>
            </div>
          </div>
          <TypeSelector active={clientType} onChange={handleTypeChange} onContactClick={() => setModalOpen(true)} />
        </div>
      </section>

      {/* BUSINESS CONTENT */}
      <div id="businessContent" className={`type-content ${isBusiness ? 'active' : ''}`}>
        <section className="section section-light" id="services">
          <div className="sec-head">
            <div className="eyebrow">Для бизнеса</div>
            <h2 className="sec-title">Что мы делаем</h2>
            <p className="sec-sub">Четыре формата под ключ — от идеи до последнего бокала</p>
          </div>
          <div className="services-grid">
            {[
              { n:'01', title:'«Сами хотим отдохнуть»', desc:'Корпоратив для 20–80 человек. Берём на себя площадку, питание, программу и ведущего.', tag:'Корпоратив' },
              { n:'02', title:'«Клиентский день без скуки»', desc:'Мероприятие для ваших клиентов. Деловая часть + нетворкинг + развлечения без провисаний.', tag:'Клиентское событие' },
              { n:'03', title:'«Тимбилдинг, от которого не увольняются»', desc:'Активности, которые реально объединяют команду. Без принудительных обнимашек.', tag:'Тимбилдинг' },
              { n:'04', title:'«Фуршет без головной боли»', desc:'Деловые приёмы, презентации и фуршеты под ключ. Кейтеринг, оформление, персонал.', tag:'Фуршет / приём' },
            ].map(s => (
              <div key={s.n} className="srv-card">
                <div className="srv-num">{s.n}</div>
                <div className="srv-title">{s.title}</div>
                <div className="srv-desc">{s.desc}</div>
                <span className="srv-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-dark">
          <div className="fears-inner">
            <div className="fears-left">
              <div className="eyebrow" style={{color:'var(--gold)',opacity:.8,marginBottom:'.75rem'}}>Узнали себя?</div>
              <h2><strong>Давайте созвонимся</strong> на 10 минут</h2>
              <p>Если хотя бы один из пунктов справа звучит знакомо — вы попали по адресу.</p>
              <button className="fears-cta" onClick={() => setModalOpen(true)}>
                Записаться на звонок <StepArrow />
              </button>
            </div>
            <div className="fears-list">
              {['Последний корпоратив прошёл скучно — все разошлись в 22:00','HR-менеджер потратила 3 недели на организацию вместо своей работы','Подрядчики подводят: то DJ не приехал, то еда оказалась не того уровня','Бюджет вышел за рамки на 30–40% — директор недоволен','Команда ожидала особенного, а получила «ну нормально»'].map((t,i) => (
                <div key={i} className="fear-item"><FearCheck /><p>{t}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="sec-head">
            <div className="eyebrow">Процесс</div>
            <h2 className="sec-title">Как мы работаем</h2>
            <p className="sec-sub">Четыре шага от первого звонка до вашего события</p>
          </div>
          <div className="steps-row steps-row-4">
            {[['01','Звонок 10 минут','Рассказываете задачу, мы задаём вопросы.'],['02','Концепция за 24 ч','Смета и три варианта концепции. Без сюрпризов.'],['03','Мы работаем','Координируем всё. Вы занимаетесь бизнесом.'],['04','Вы наслаждаетесь','В день события мы на месте. Вы — среди гостей.']].map(([n,t,d]) => (
              <div key={n} className="step"><div className="step-num">{n}</div><div className="step-title">{t}</div><div className="step-desc">{d}</div></div>
            ))}
          </div>
        </section>

        <section className="section section-white" id="cases-b">
          <div className="sec-head">
            <div className="eyebrow">Кейсы</div>
            <h2 className="sec-title">Реальные проекты</h2>
          </div>
          <div className="cases-grid cases-grid-2">
            <div className="case-card" style={{backgroundImage:"url('/kc_7.png')"}} onClick={() => setActiveCase(CASES.krasStrelа)}>
              <div className="case-body"><div className="case-tag">Юбилей · Корпоратив</div><div className="case-title">90 лет «Красной стрелы»</div><div className="case-result">Праздник на перроне · лазерное шоу</div></div>
            </div>
            <div className="case-card" style={{backgroundImage:"url('/ms_3.png')"}} onClick={() => setActiveCase(CASES.maslenitsa)}>
              <div className="case-body"><div className="case-tag">Корпоративный праздник · Улица</div><div className="case-title">Масленица для Горэлектротранса</div><div className="case-result">Трамвай · хаски · огненный финал</div></div>
            </div>
            <div className="case-card" style={{backgroundImage:"url('/tr_5.png')"}} onClick={() => setActiveCase(CASES.tramvai)}>
              <div className="case-body"><div className="case-tag">Детский праздник · Конкурс</div><div className="case-title">Конкурс рисунков «Трамваи на Неве»</div><div className="case-result">Робот · ИИ-анимация рисунков · аквагрим</div></div>
            </div>
          </div>
          <div className="cases-more"><button className="btn-outline" onClick={() => setModalOpen(true)}>Обсудить ваш проект →</button></div>
        </section>

        <section className="section section-white">
          <div className="sec-head"><div className="eyebrow">FAQ</div><h2 className="sec-title">Частые вопросы</h2></div>
          <div className="faq-list">
            {[['Можете организовать мероприятие за 2 недели?','Да, у нас есть проверенная база подрядчиков. За 2 недели реально организовать корпоратив до 80 человек.'],['Работаете с корпоративным договором и НДС?','Да, работаем по договору, выставляем закрывающие документы. ИП и ООО — без проблем.'],['Что входит в комиссию 15%?','Разработка концепции, переговоры с подрядчиками, координация и управление бюджетом. Никаких доплат сверху.'],['Можем ли мы использовать своих подрядчиков?','Конечно. Просто сообщите заранее.'],['Как вы контролируете бюджет?','После утверждения смета фиксируется. Любое изменение — только с вашего согласия.']].map(([q, a], i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {q}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <div className="faq-a">{a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* PRIVATE CONTENT */}
      <div id="privateContent" className={`type-content ${!isBusiness ? 'active' : ''}`}>
        <section className="section section-light">
          <div className="sec-head">
            <div className="eyebrow">Для частных клиентов</div>
            <h2 className="sec-title">Ваш праздник</h2>
            <p className="sec-sub">Делаем так, чтобы вы сами наслаждались своим событием</p>
          </div>
          <div className="services-grid">
            {[
              { n:'01', title:'Свадьба без сценария «как у всех»', desc:'Ваша история — ваш стиль. Разрабатываем концепцию с нуля под ваш бюджет.', tag:'Свадьба' },
              { n:'02', title:'День рождения, который вы заслужили', desc:'Не «и так сойдёт», а праздник, о котором давно мечтали. Любой масштаб.', tag:'День рождения' },
              { n:'03', title:'Гендер-пати без инфоповода для ссоры', desc:'Тёплый праздник для близких. Декор, угощения и небольшая программа.', tag:'Гендер-пати' },
              { n:'04', title:'Детский праздник без истерик', desc:'Дети в восторге, родители отдыхают. Аниматоры, программа, торт.', tag:'Детский праздник' },
            ].map(s => (
              <div key={s.n} className="srv-card">
                <div className="srv-num">{s.n}</div><div className="srv-title">{s.title}</div><div className="srv-desc">{s.desc}</div><span className="srv-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section section-dark">
          <div className="fears-inner">
            <div className="fears-left">
              <div className="eyebrow" style={{color:'var(--gold)',opacity:.8,marginBottom:'.75rem'}}>Боитесь?</div>
              <h2><strong>Что было в прошлый раз</strong> — не повторится</h2>
              <p>Мы слышим это от каждого второго клиента. И знаем, как это исправить.</p>
              <button className="fears-cta" onClick={() => setModalOpen(true)}>
                Обсудить ваш праздник <StepArrow />
              </button>
            </div>
            <div className="fears-list">
              {['«В прошлый раз всё пошло не по плану, и переделывать было некогда»','«Боюсь, что будет дорого и непонятно, за что платить»','«Не знаю, с чего начать — площадка, ведущий, декор...»','«Хочу особенного, но не знаю, как объяснить это исполнителям»'].map((t,i) => (
                <div key={i} className="fear-item"><FearCheck /><p>{t}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-light">
          <div className="sec-head"><div className="eyebrow">Процесс</div><h2 className="sec-title">5 шагов к вашему празднику</h2></div>
          <div className="steps-row steps-row-5">
            {[['01','Рассказываете о себе','10-минутный звонок. Мечты, бюджет, пожелания.'],['02','Получаете концепцию','За 24 часа — смета и идея праздника.'],['03','Утверждаем детали','Площадка, команда, декор — согласовываем вместе.'],['04','Мы работаем','Вы ждёте праздника. Мы контролируем каждую деталь.'],['05','Ваш день','Мы на месте с утра до конца.']].map(([n,t,d]) => (
              <div key={n} className="step"><div className="step-num">{n}</div><div className="step-title">{t}</div><div className="step-desc">{d}</div></div>
            ))}
          </div>
        </section>

        <section className="section section-white" id="cases-p">
          <div className="sec-head"><div className="eyebrow">Кейсы</div><h2 className="sec-title">Истории наших клиентов</h2></div>
          <div className="cases-grid cases-grid-3">
            <div className="case-card" style={{backgroundImage:"url('/kc_7.png')"}} onClick={() => setActiveCase(CASES.krasStrelа)}>
              <div className="case-body"><div className="case-tag">Юбилей · Корпоратив</div><div className="case-title">90 лет «Красной стрелы»</div><div className="case-result">Праздник на перроне · лазерное шоу</div></div>
            </div>
            <div className="case-card" style={{backgroundImage:"url('/ms_3.png')"}} onClick={() => setActiveCase(CASES.maslenitsa)}>
              <div className="case-body"><div className="case-tag">Корпоративный праздник · Улица</div><div className="case-title">Масленица для Горэлектротранса</div><div className="case-result">Трамвай · хаски · огненный финал</div></div>
            </div>
            <div className="case-card" style={{backgroundImage:"url('/tr_5.png')"}} onClick={() => setActiveCase(CASES.tramvai)}>
              <div className="case-body"><div className="case-tag">Детский праздник · Конкурс</div><div className="case-title">Конкурс рисунков «Трамваи на Неве»</div><div className="case-result">Робот · ИИ-анимация рисунков · аквагрим</div></div>
            </div>
          </div>
          <div className="cases-more"><button className="btn-outline" onClick={() => setModalOpen(true)}>Обсудить ваш праздник →</button></div>
        </section>

        <section className="section section-white">
          <div className="sec-head"><div className="eyebrow">FAQ</div><h2 className="sec-title">Частые вопросы</h2></div>
          <div className="faq-list">
            {[['Работаете за пределами Санкт-Петербурга?','Да, выезжаем в Ленинградскую область и другие регионы. Транспортные расходы оговариваем дополнительно.'],['Можно поменять концепцию после утверждения?','До подписания договора — да, бесплатно.'],['Что будет, если что-то пойдёт не так в день события?','Наш координатор будет на площадке весь день. Любой форс-мажор — наша зона ответственности.'],['Нужна ли предоплата?','Да, 30% при подписании договора. Остаток — за 5 дней до мероприятия.']].map(([q, a], i) => (
              <div key={i} className={`faq-item ${openFaq === 100+i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === 100+i ? null : 100+i)}>
                  {q}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18,flexShrink:0}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <div className="faq-a">{a}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CALCULATOR */}
      <section className="section section-light" id="calculator">
        <div className="inner">
          <div className="sec-head">
            <div className="eyebrow">Открыто о деньгах</div>
            <h2 className="sec-title">Рассчитайте стоимость</h2>
            <p className="sec-sub">Укажите параметры — примерная цена обновляется мгновенно</p>
          </div>
          <div className="calc-wrap">
            <div className="calc-controls">
              <div className="calc-group">
                <div className="calc-label">Формат мероприятия</div>
                <div className="calc-chips">
                  {[['corporate','Корпоратив'],['wedding','Свадьба'],['birthday','День рождения'],['gender','Гендер-пати'],['kids','Детский праздник'],['teambuilding','Тимбилдинг']].map(([v,l]) => (
                    <button key={v} className={`calc-chip ${S.format===v?'active':''}`} onClick={() => setS(p=>({...p,format:v}))}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="calc-group">
                <div className="calc-label">Количество человек: <strong>{peopleVal}</strong></div>
                <div className="calc-slider-wrap">
                  <input type="range" className="calc-slider" min="0" max="6" value={S.people}
                    style={{'--pct': `${(S.people/6*100).toFixed(1)}%`} as React.CSSProperties}
                    onChange={e => setS(p=>({...p,people:+e.target.value}))}/>
                  <div className="calc-slider-row"><span>10</span><span>20</span><span>30</span><span>50</span><span>80</span><span>100</span><span>150+</span></div>
                </div>
              </div>
              <div className="calc-group">
                <div className="calc-label">Формат питания</div>
                <div className="calc-chips">
                  {[['buffet','Фуршет'],['banquet','Банкет'],['pizza','Пицца'],['own','Свой вариант']].map(([v,l]) => (
                    <button key={v} className={`calc-chip ${S.food===v?'active':''}`} onClick={() => setS(p=>({...p,food:v}))}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="calc-group">
                <div className="calc-label">Музыка и ведущий</div>
                <div className="calc-chips">
                  {[['none','Без ведущего'],['host_2h','Ведущий 2–3 ч'],['host_4h','Ведущий 4+ ч'],['dj','Диджей'],['live','Живая музыка'],['host_dj','Ведущий + DJ']].map(([v,l]) => (
                    <button key={v} className={`calc-chip ${S.host===v?'active':''}`} onClick={() => setS(p=>({...p,host:v}))}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="calc-group">
                <div className="calc-label">Длительность: <strong>{S.dur}</strong> ч</div>
                <div className="calc-slider-wrap">
                  <input type="range" className="calc-slider" min="2" max="6" value={S.dur}
                    style={{'--pct': `${((S.dur-2)/4*100).toFixed(1)}%`} as React.CSSProperties}
                    onChange={e => setS(p=>({...p,dur:+e.target.value}))}/>
                  <div className="calc-slider-row"><span>2 ч</span><span>3 ч</span><span>4 ч</span><span>5 ч</span><span>6 ч</span></div>
                </div>
              </div>
              <div className="calc-group">
                <div className="calc-label">Дополнительно</div>
                <div className="calc-checks">
                  {(['photo','decor','venue','outside'] as const).map(k => (
                    <label key={k} className="calc-check">
                      <input type="checkbox" checked={S[k]} onChange={e => setS(p=>({...p,[k]:e.target.checked}))} style={{position:'absolute',opacity:0}}/>
                      <span className="chk-box">{S[k] && <svg viewBox="0 0 12 12" style={{width:10,height:10,stroke:'white',fill:'none',strokeWidth:'2.8'}}><polyline points="2 6 5 9 10 3"/></svg>}</span>
                      <span className="chk-lbl">{{photo:'Фотограф',decor:'Декор',venue:'Аренда зала',outside:'Выезд за город'}[k]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="calc-result">
              <div className="calc-result-inner">
                {S.people >= 6 ? (
                  <>
                    <div className="calc-msg">Для мероприятий 100+ человек подготовим индивидуальный расчёт — ответим в течение часа.</div>
                    <button className="calc-cta" onClick={() => { setModalPrefill(null); setModalOpen(true) }}>Запросить расчёт</button>
                  </>
                ) : !calcResult || calcResult.total < 15000 ? (
                  <>
                    <div className="calc-msg">Для небольшого мероприятия предлагаем бесплатную консультацию.</div>
                    <button className="calc-cta" onClick={() => { setModalPrefill(null); setModalOpen(true) }}>Бесплатная консультация</button>
                  </>
                ) : (
                  <>
                    <div className="calc-range">{fmtRange(Math.round(calcResult.total/1000)*1000, Math.round(calcResult.hi/1000)*1000)}</div>
                    <div className="calc-lines">{calcResult.lines.map(([k,v]) => <div key={k} className="calc-line"><span>{k}</span><span>{v}</span></div>)}</div>
                    <div className="calc-disclaimer">Итоговая стоимость уточняется после консультации</div>
                    <button className="calc-cta" onClick={openModalFromCalc}>Обсудить проект →</button>
                    <button className="calc-cta-sec" onClick={openModalFromCalc}>Уточнить смету</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="slideshow" id="slideshow">
        <div className="ss-sticky">
          <div className="ss-info">
            <div className="ss-eyebrow">Наши работы</div>
            <h2>Настоящие<br/>моменты</h2>
            <p>Реальные фото с наших мероприятий — без студийного света</p>
            <div className="ss-hint">Прокрутите</div>
          </div>
          <div className="ss-strips" ref={stripsRef}/>
          <div className="ss-fade-top"/><div className="ss-fade-bot"/><div className="ss-fade-l"/>
        </div>
      </section>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setModalPrefill(null) }}
        defaultType={clientType}
        prefill={modalPrefill}
      />
      <CaseModal case_={activeCase} onClose={() => setActiveCase(null)} />
    </>
  )
}
