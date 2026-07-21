import { useState } from 'react'
import { useStore } from '../game/store'
import { IconInfo, IconPlay } from '../components/icons'

export function Rules() {
  const { dispatch } = useStore()
  const [page, setPage] = useState(0)

  const next = () => {
    if (page === 0) setPage(1)
    else dispatch({ type: 'goto', screen: 'home' })
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="screen-head">
        <span className="badge-ic">
          <IconInfo />
        </span>
        <h1>Règles du jeu</h1>
      </div>

      {page === 0 ? (
        <div className="rules-body">
          <p>Dans ce jeu, l’un de vous va piocher un mot aléatoirement.</p>
          <p>
            Celui-ci va devoir le faire deviner à son complice par n’importe quel
            moyen oral.
          </p>
          <p>Attention, les adversaires doivent aussi tenter de le trouver.</p>
          <p>La première équipe à démasquer le mot remporte la manche.</p>
        </div>
      ) : (
        <div className="rules-body">
          <p>Exemple : le mot pioché est «&nbsp;Titanic&nbsp;»</p>
          <p>
            ❌ «&nbsp;C’est un film avec Leonardo DiCaprio&nbsp;» est un indice trop
            global. Il peut donc aider les adversaires à trouver.
          </p>
          <p className="ok">
            ✓ «&nbsp;Rappelle-toi, le mois dernier on a vu un film ensemble, on
            mangeait du popcorn sucré devant&nbsp;» est un souvenir partagé avec le
            complice que l’équipe adverse peut difficilement comprendre.
          </p>
          <p>À vous de jouer !</p>
        </div>
      )}

      <div className="spacer" />
      <div className="footer-center">
        <button className="pill teal-accent" onClick={next}>
          <span className="ic" style={{ background: 'var(--teal)' }}>
            <IconPlay width={16} height={16} />
          </span>
          {page === 0 ? 'Suivant' : 'Compris !'}
        </button>
      </div>
    </div>
  )
}
