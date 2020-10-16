import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
const VeteransCrisisLineScreen: FC = () => {
	const { t } = useTranslation(NAMESPACE.HOME)

	return <Box {...testIdProps('Veterans-Crisis-Line-screen')} />
}

export default VeteransCrisisLineScreen
