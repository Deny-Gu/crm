import type { Order } from '../types'

const MOCK_ORDERS: Order[] = [
  {
    id: 'o-1',
    masterId: 'master-1',
    customerName: 'ООО "СтройДом"',
    description: 'Установка дверей (3 шт.)',
    status: 'в работе',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'o-2',
    masterId: 'master-1',
    customerName: 'ИП Петров',
    description: 'Ремонт санузла',
    status: 'новый',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'o-3',
    masterId: 'master-2',
    customerName: 'Сосед Сергей',
    description: 'Покраска стен',
    status: 'завершён',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
]

export async function getOrdersByMaster(masterId: string): Promise<Order[]> {
  await sleep(300)
  return MOCK_ORDERS.filter((o) => o.masterId === masterId)
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}
