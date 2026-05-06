import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getAllLeads, updateLeadStatus, deleteLead } from '@/lib/db'

async function checkAuth() {
  const session = await getSession()
  if (!session) return false
  return true
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }
  const leads = getAllLeads()
  return NextResponse.json(leads)
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }
  const { id, status } = await req.json()
  updateLeadStatus(id, status)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }
  const { id } = await req.json()
  deleteLead(id)
  return NextResponse.json({ ok: true })
}
