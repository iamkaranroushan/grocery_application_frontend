import AdminOrdersPage from '@/components/admin/adminOrderPage'
import React, { Suspense } from 'react'

const AdminOrders = () => {
  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <div ><AdminOrdersPage /></div>
    </Suspense>
  )
}

export default AdminOrders