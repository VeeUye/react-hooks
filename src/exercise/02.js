// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {useEffect, useRef, useState} from 'react'

const useLocalStorageState = (key, initialValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse,
} = {},) =>
 {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)

    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    // if the default value is computationally expensive, we can use the following to
    // conditionally call or return it
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

   // useRef within useEffect enables us to deal with cases where the key changes between renders.

   const prevKeyRef = useRef(key)

  useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}


function Greeting({initialName = ''}) {



  const [name, setName] = useLocalStorageState('name', initialName)


  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
