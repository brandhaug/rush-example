import * as React from 'react'
import { AddButton } from '@rush-example/web-lib'
import { CenteredContainer } from '@rush-example/ui-lib'

export const App = () => {
  return (
    <CenteredContainer>
      <h1>Hello world</h1>
      <AddButton a={2} b={3} />
    </CenteredContainer>
  )
}
