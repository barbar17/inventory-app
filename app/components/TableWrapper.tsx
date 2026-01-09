import React from 'react'

function TableWrapper({ children, width = "100%" }: { children: React.ReactNode, width?: string }) {
  return (
    <div style={{
      overflowX: 'auto',
      overflowY: 'hidden',
      width: "100%",
      border: '1px solid #dee2e6',
      borderRadius: '8px'
    }}>
      <div style={{ width: width }}>
        {children}
      </div>
    </div>
  )
}

export default TableWrapper