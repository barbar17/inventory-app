import React from 'react'

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      overflowX: 'auto',
      overflowY: 'hidden',
      width: '100%',
      border: '1px solid #dee2e6',
      borderRadius: '8px'
    }}>
      {children}
    </div>
  )
}

export default TableWrapper