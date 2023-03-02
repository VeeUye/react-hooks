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
    const [state, setState] = useState({
        status: 'idle',
        pokemon: null,
        error: null,
    })

    const {status, pokemon, error} = state

    console.log(state)

    useEffect(() => {
            if (!pokemonName) {
                return
            }
            setState({...state, status: 'pending'})

        fetchPokemon(pokemonName)
            .then(pokemonData => {
                setState({...state, status: 'resolved', pokemon: pokemonData})
            })
            .catch(error => {
                setState({...state, status: 'rejected',  error: error})
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
