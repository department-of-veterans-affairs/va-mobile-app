import { SafeAreaView } from 'react-native-safe-area-context'
import React, { FC } from 'react'

import { Box, BoxProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import WebviewControlButton from './WebviewControlButton'

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
  const t = useTranslation(NAMESPACE.COMMON)
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
    <SafeAreaView edges={['bottom']}>
      <Box {...controlsViewProps}>
        <WebviewControlButton
          margin={theme.dimensions.webviewSpaceBetweenButtons}
          icon={'WebviewBack'}
          onPress={props.onBackPressed}
          disabled={!props.canGoBack}
          a11yHint={t('back.a11yHint')}
          {...testIdProps(t('back'))}
        />
        <WebviewControlButton
          margin={theme.dimensions.webviewSpaceBetweenButtons}
          icon={'WebviewForward'}
          onPress={props.onForwardPressed}
          disabled={!props.canGoForward}
          a11yHint={t('forward.a11yHint')}
          {...testIdProps(t('forward'))}
        />
        <WebviewControlButton icon={'WebviewOpen'} onPress={props.onOpenPressed} a11yHint={t('openInBrowser.a11yHint')} {...testIdProps(t('openInBrowser'))} />
      </Box>
    </SafeAreaView>
  )
}

export default WebviewControls
