import React from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

import styled from 'styled-components/native'

import { Box, BoxProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { themeFn } from 'utils/theme'

import WebviewControlButton from './WebviewControlButton'

const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${themeFn((theme) => theme.colors.background.webviewControls)};
`

/**
 *  Signifies the props that need to be passed in to {@link WebviewControls}
 */
export type WebviewControlsProps = {
  /** Run when back button is pressed */
  onBackPressed: () => void
  /** Run when forward button is pressed */
  onForwardPressed: () => void
  /** Run when open button is pressed */
  onOpenPressed: () => void
  /** Disables or enables the back button */
  canGoBack: boolean
  /** Disables or enables the forward button */
  canGoForward: boolean
}

/**
 * Controls for back, forward, and open in browser used in the Webview screen
 */
function WebviewControls(props: WebviewControlsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const controlsViewProps: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    px: theme.dimensions.gutter,
  }

  return (
    <StyledSafeAreaView edges={['bottom']}>
      <Box {...controlsViewProps}>
        <WebviewControlButton
          icon={'ChevronLeft'}
          onPress={props.onBackPressed}
          disabled={!props.canGoBack}
          width={36}
          height={36}
          a11yHint={t('back.a11yHint')}
          a11yLabel={t('back')}
          testID={t('back')}
        />
        <WebviewControlButton
          icon={'ChevronRight'}
          onPress={props.onForwardPressed}
          disabled={!props.canGoForward}
          width={36}
          height={36}
          a11yHint={t('forward.a11yHint')}
          a11yLabel={t('forward')}
          testID={t('forward')}
        />
        <WebviewControlButton
          icon={'Launch'}
          onPress={props.onOpenPressed}
          a11yHint={t('openInBrowser.a11yHint')}
          a11yLabel={t('openInBrowser')}
          testID={t('openInBrowser')}
        />
      </Box>
    </StyledSafeAreaView>
  )
}

export default WebviewControls
