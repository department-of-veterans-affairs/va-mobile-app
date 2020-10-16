import React, { FC } from 'react'

import { Box } from 'components'
import { testIdProps } from 'utils/accessibility'

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
const VeteransCrisisLineScreen: FC = () => {
	return <Box {...testIdProps('Veterans-Crisis-Line-screen')} />
}

export default VeteransCrisisLineScreen
