import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, BoxProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme } from 'utils/hooks'
import WebviewControlButton from './WebviewControlButton'
import styled from 'styled-components'

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
const WebviewControls: FC<WebviewControlsProps> = (props) => {
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
        <WebviewControlButton icon={'ChevronLeft'} onPress={props.onBackPressed} disabled={!props.canGoBack} a11yHint={t('back.a11yHint')} {...testIdProps(t('back'))} />
        <WebviewControlButton
          icon={'ChevronRight'}
          onPress={props.onForwardPressed}
          disabled={!props.canGoForward}
          a11yHint={t('forward.a11yHint')}
          {...testIdProps(t('forward'))}
        />
        <WebviewControlButton icon={'ExternalLink'} onPress={props.onOpenPressed} a11yHint={t('openInBrowser.a11yHint')} {...testIdProps(t('openInBrowser'))} />
      </Box>
    </StyledSafeAreaView>
  )
}

export default WebviewControls
