import { Box, BoxProps } from 'components'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { FC } from 'react'
import VAIcon from 'components/VAIcon'
import WebviewControlButton from './WebviewControlButton'

export type WebviewControlsProps = {
	onBackPressed: () => void
	onForwardPressed: () => void
	onOpenPressed: () => void
	canGoBack: boolean
	canGoForward: boolean
}

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
					<WebviewControlButton onPress={props.onBackPressed} disabled={!props.canGoBack}>
						<VAIcon name={'WebviewBack'} width={15} height={25} />
					</WebviewControlButton>
					<WebviewControlButton onPress={props.onForwardPressed} disabled={!props.canGoForward}>
						<VAIcon name={'WebviewForward'} width={15} height={25} />
					</WebviewControlButton>
				</Box>
				<WebviewControlButton onPress={props.onOpenPressed} disabled={false}>
					<VAIcon name={'WebviewOpen'} width={25} height={25} />
				</WebviewControlButton>
			</Box>
		</SafeAreaView>
	)
}

export default WebviewControls
