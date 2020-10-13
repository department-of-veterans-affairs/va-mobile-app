import { SafeAreaView } from 'react-native-safe-area-context'
import React, { FC } from 'react'

import { Box, BoxProps } from 'components'
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
	const controlsViewProps: BoxProps = {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 50,
		pl: 20,
		pr: 20,
	}

	return (
		<SafeAreaView edges={['bottom']}>
			<Box {...controlsViewProps}>
				<Box display="flex" flexDirection="row">
					<WebviewControlButton icon={'WebviewBack'} width={15} onPress={props.onBackPressed} disabled={!props.canGoBack} />
					<WebviewControlButton icon={'WebviewForward'} width={15} onPress={props.onForwardPressed} disabled={!props.canGoForward} />
				</Box>
				<WebviewControlButton icon={'WebviewOpen'} onPress={props.onOpenPressed} />
			</Box>
		</SafeAreaView>
	)
}

export default WebviewControls
