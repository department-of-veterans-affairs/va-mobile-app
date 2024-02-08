import { Appearance, ColorSchemeName } from 'react-native'
import { useEffect, useRef, useState } from 'react'

/**
 * A function overriding RN's default useColorScheme hook
 * 		This is a workaround to an unresolved RN bug flashing light/dark mode on entry as documented
 * 		on https://github.com/expo/expo/issues/10815 and works by basically preventing the logic to
 * 		get the device color scheme from firing too frequently
 * @param delay - Delay to add in milliseconds, 250 by default
 * @returns Color scheme to be used
 */
export function useColorScheme(delay = 250): NonNullable<ColorSchemeName> {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())

  let timeout: ReturnType<typeof setTimeout> | null = useRef(null).current

  useEffect(() => {
    const appearanceEvent = Appearance.addChangeListener(onColorSchemeChange)

    return () => {
      resetCurrentTimeout()
      appearanceEvent?.remove()
    }
  })

  function onColorSchemeChange(preferences: Appearance.AppearancePreferences) {
    resetCurrentTimeout()

    timeout = setTimeout(() => {
      setColorScheme(preferences.colorScheme)
    }, delay)
  }

  function resetCurrentTimeout() {
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  return colorScheme as NonNullable<ColorSchemeName>
}
