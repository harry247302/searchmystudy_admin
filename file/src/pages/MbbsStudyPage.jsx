import React from 'react'
import MasterLayout from '../masterLayout/MasterLayout'
import Breadcrumb from '../components/Breadcrumb'
import AbroadManager from '../components/AbroadManager'
import MbbsCountryManager from '../components/MbbsCountryManager'

const MbbsStudyPage = () => {
  return (
   <>
   <MasterLayout>
    {/* BreadCrumb */}
    <Breadcrumb title='MBBS Study' />
    <MbbsCountryManager/>
   </MasterLayout>
   </>
  )
}

export default MbbsStudyPage