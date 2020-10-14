import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { CtaButton, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'

/**
 * Reusable Crisis Line component that shows up as a 'sticky' on the Home screen
 *
 * @returns CrisisLineCta component
 */
const CrisisLineCta: FC = () => {
	const { t } = useTranslation(NAMESPACE.HOME)
	return (
		<CtaButton>
			<TextView color="primaryContrast" variant="MobileBody">
				{t('component.crisisLine.talkToThe')}
			</TextView>
			<TextView color="primaryContrast" variant="MobileBodyBold">
				&nbsp;{t('component.crisisLine.veteranCrisisLine')}
			</TextView>
			<TextView color="primaryContrast" variant="MobileBody">
				&nbsp;{t('component.crisisLine.now')}
			</TextView>
		</CtaButton>
	)
}

export default CrisisLineCta
