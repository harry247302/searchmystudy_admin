import React from 'react'
import MasterLayout from '../masterLayout/MasterLayout'
import { Breadcrumb } from 'react-bootstrap'
import ContactUsLeadManager from '../components/ContactUsLeadManager'

const ContactUsLeadPage = () => {
  return (
    <>
    <MasterLayout>
        {/* breadCrumb */}
        <Breadcrumb title='Contact us lead' />

        {/* Manager */}
        <ContactUsLeadManager/>
    </MasterLayout>
    </>
  )
}

export default ContactUsLeadPage