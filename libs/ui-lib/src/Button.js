import * as React from 'react'

export const Button = ({ children, ...props }) => {
  return (
    <button style={{ padding: '16px', cursor: 'pointer' }} {...props}>
      {children}
    </button>
  )
}