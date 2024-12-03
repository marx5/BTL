import { CCard, CCol, CContainer, CImage, CRow } from '@coreui/react'
import React from 'react'

const Profile = () => {
  return (
    <>
      <CContainer>
        <CCard style={{
          padding: "50px",
          marginTop: "10px",
          marginLeft: "100px",
          marginRight: "100px"
        }}>
          <CRow>
            <CCol sm={5}>
              <CImage align="start" rounded src="./img\profile.png" width={150} height={150} />
            </CCol>
            <CCol sm={7}>
              <h2>Lâm Văn Vũ</h2>
              <p><strong>MSV: </strong>B21DCCN796</p>
              <p><strong>Lớp: </strong>D21HTTT3</p>
              <p><strong>Email: </strong>vulv.nvgb@gmail.com</p>
              <p><strong>SĐT: </strong>0396922593</p>
              <p><strong>Github: </strong><a href="https://github.com/marx5/BTL" target="_blank" rel="noopener noreferrer">BTL</a></p>
              <p><strong>PDF: </strong><a href="https://drive.google.com/file/d/1ARUmxbkaHyDx4RcOmqUEmFY2zKB9bUnc/view?usp=sharing" target="_blank" rel="noopener noreferrer">Báo cáo</a></p>
              <p><strong>Apidoc: </strong><a href="http://localhost:3001/api#/" target="_blank" rel="noopener noreferrer">Swagger API</a></p>
            </CCol>
          </CRow>
        </CCard>
      </CContainer>
    </>
  )
}

export default Profile