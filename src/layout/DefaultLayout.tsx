import React from 'react'
import { AppContent, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <>
      <AppHeader />
      <div className="body flex-grow-1 px-3">
        <AppContent />
      </div>
      <AppFooter />
    </>
  )
}

export default DefaultLayout
