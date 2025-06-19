import React from 'react'
import { CRow, CCol, CForm, CInputGroup } from '@coreui/react'
import RowItem from './components/RowItem/RowItem'



const HomePage = () => {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    Home Page
                </div>
                <div className="card-body">
                    <RowItem />
                </div>
            </div>
        </>
    )
}

export default HomePage