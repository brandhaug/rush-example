import * as React from 'react'

export const CenteredContainer = ({ children, ...props }) => {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} {...props}>
      {children}
    </div>
  )
}
