import { useEffect, useState } from 'react'
import { IconClose } from './icons'

/** Événement non standard (pas dans lib.dom) déclenché par Chrome/Android
 * quand la PWA est installable. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'refs-communes:install-dismissed'

function isStandalone(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

/** Bannière d'installation PWA : déclenche le prompt natif sur Android/Chrome,
 * guide vers le geste manuel sur iOS/Safari (Apple ne permet pas de l'automatiser). */
export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (dismissed || isStandalone()) return null
  if (!deferred && !isIOS()) return null

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem(DISMISS_KEY, '1')
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    dismiss()
  }

  return (
    <div className="install-banner">
      <div className="install-banner-text">
        {deferred
          ? 'Installe le jeu sur ton téléphone pour y jouer hors-ligne.'
          : 'Installe ce jeu : appuie sur Partager (⬆️) puis « Sur l’écran d’accueil ».'}
      </div>
      <div className="install-banner-actions">
        {deferred && (
          <button className="pill blue-accent install-banner-btn" onClick={install}>
            Installer
          </button>
        )}
        <button className="icon-btn" onClick={dismiss} aria-label="Fermer">
          <IconClose width={18} height={18} />
        </button>
      </div>
    </div>
  )
}
