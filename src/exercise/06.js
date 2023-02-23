// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {useEffect, useState} from 'react'

function Alert({error}) {
    return (
        <div role="alert">
            There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
    )
}
function PokemonInfo({pokemonName}) {
const [status, setStatus] = useState('idle')
    const [pokemon, setPokemon] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
            if (!pokemonName) {
                return
            }
            setStatus('pending')
        fetchPokemon(pokemonName)
            .then(pokemonData => {
                setPokemon(pokemonData)
                setStatus('resolved')
            })
            .catch(error => {
                setError(error)
                setStatus('rejected')
            })

    }, [pokemonName])

    if (status === 'idle') {
        return 'Submit a pokemon'
    }
    if (status === 'pending') {
        return <PokemonInfoFallback name = {pokemonName} />
    }
    if (status === 'rejected') {
        return <Alert error={error}/>
    }

    if (status === 'resolved') {
        return <PokemonDataView pokemon={pokemon}/>
    }

    if(error) {
        return <Alert error={error}/>
    }

    throw new Error('This should be impossible')

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
