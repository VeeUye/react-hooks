// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {useEffect, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <div role="alert">
            There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Please try again</button>
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

    useEffect(() => {
            if (!pokemonName) {
                return
            }
            setState({...state, status: 'pending'})

        fetchPokemon(pokemonName)
            .then(pokemon => {
                setState({...state, status: 'resolved', pokemon: pokemon})
            })
            .catch(error => {
                setState({...state, status: 'rejected',  error: error})
            })
        // eslint-disable-next-line

    }, [pokemonName])

    if (status === 'idle') {
        return 'Submit a pokemon'
    }
    if (status === 'pending') {
        return <PokemonInfoFallback name = {pokemonName} />
    }
    if (status === 'rejected') {
        throw error
    }

    if (status === 'resolved') {
        return <PokemonDataView pokemon={pokemon}/>
    }

    if(error) {
        throw error
    }

    throw new Error('This should be impossible')

}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
      setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[pokemonName]}>
              <PokemonInfo pokemonName={pokemonName} />
            </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
