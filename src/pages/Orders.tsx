import { useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import * as ordersApi from '../services/orders'
import type { Order } from '../types'

const user = {id: '3'}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ordersApi
      .getOrdersByMaster(user?.id || '')
      .then((data) => {
        if (mounted) setOrders(data)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const total = useMemo(() => orders.length, [orders])

  return (
    <CContainer className="py-4">
      <CCard className="shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Мои заказы</span>
          <span className="text-muted">Всего: {total}</span>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <div>Загрузка…</div>
          ) : (
            <CTable hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Клиент</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Описание</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Статус</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Срок</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {orders.map((o, idx) => (
                  <CTableRow key={o.id}>
                    <CTableDataCell>{idx + 1}</CTableDataCell>
                    <CTableDataCell>{o.customerName}</CTableDataCell>
                    <CTableDataCell>{o.description}</CTableDataCell>
                    <CTableDataCell>{o.status}</CTableDataCell>
                    <CTableDataCell>{new Date(o.dueDate).toLocaleDateString()}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}
