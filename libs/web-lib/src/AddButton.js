import * as React from 'react'
import { Button } from '@rush-example/ui-lib'
import { add } from '@rush-example/js-lib'

export const AddButton = ({ a, b, ...props }) => {
  const [result, setResult] = React.useState(null)

  const handleClick = () => {
    const c = add(a, b)
    setResult(c)
  }

  if (!result) {
    return (
      <Button onClick={handleClick} {...props}>
        Add {a} and {b}
      </Button>
    )
  }

  return (
    <div>
      {result}
    </div>
  )
}
