import { NextRequest, NextResponse } from 'next/server'
import { insertLead } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, contact_method, contact_value,
      client_type, event_type, guests, event_date,
      message, budget, calc_summary,
    } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Имя обязательно' }, { status: 400 })
    }
    if (!contact_value?.trim()) {
      return NextResponse.json({ error: 'Укажите способ связи' }, { status: 400 })
    }

    insertLead({
      name: name.trim(),
      contact_method: contact_method || 'telegram',
      contact_value: contact_value.trim(),
      client_type: client_type || 'не указано',
      event_type: event_type || '',
      guests: guests || '',
      event_date: event_date || '',
      message: message || '',
      budget: budget || '',
      calc_summary: calc_summary || '',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
