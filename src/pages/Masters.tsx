import { CCard, CCardBody, CCardHeader, CContainer, CSpinner, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMasters } from "../auth/mastersSlice";
import { Link } from "react-router-dom";

const Masters = () => {
  const dispatch = useAppDispatch();
  const { masters, status, page, limit, count, q } = useAppSelector(s => s.masters);

  useEffect(() => {
    dispatch(fetchMasters({ q, page, limit }));
  }, [dispatch, q, page, limit]);

  if (status === 'loading') return (
    <div 
      className="position-absolute d-flex align-items-center justify-content-center"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CSpinner />
    </div>
  )
  
  if (status === 'error') return (
    <div 
      className="position-absolute d-flex flex-column align-items-center justify-content-center"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <h2 className="text-danger">Ошибка 404</h2>
      <h4>Страница не найдена</h4>
    </div>
  )

  return (
    <CContainer className="py-4">
      <CCard className="shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <span>Мастера</span>
          <span className="text-muted">Всего: {count}</span>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">ФИО</CTableHeaderCell>
                <CTableHeaderCell scope="col">Контакты</CTableHeaderCell>
                <CTableHeaderCell scope="col">Город</CTableHeaderCell>
                <CTableHeaderCell scope="col">Округ</CTableHeaderCell>
                <CTableHeaderCell scope="col">Способ передвижения</CTableHeaderCell>
                <CTableHeaderCell scope="col">Последняя активность</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {masters.map((master, i) => (
                <CTableRow key={master.id}>
                  <CTableDataCell>{i + 1}</CTableDataCell>
                  <CTableDataCell>
                    <Link
                      to={`/masters/${master.id}`}
                      className="text-decoration-none link-dark fw-semibold"
                    >
                      {master.fullName}
                    </Link>
                  </CTableDataCell>
                  <CTableDataCell>{master.contacts}</CTableDataCell>
                  <CTableDataCell>{master.city}</CTableDataCell>
                  <CTableDataCell>{master.district}</CTableDataCell>
                  <CTableDataCell>{master.transportMode}</CTableDataCell>
                  <CTableDataCell>{new Date(master.lastActivity).toLocaleDateString()}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Masters