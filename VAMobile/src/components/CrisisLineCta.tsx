import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { CtaButton, TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'

/**
 *  Signifies the props that need to be passed in to {@link CrisisLineCta}
 */
export type CrisisLineCtaProps = {
  /** function called when the banner is pressed */
  onPress: () => void
}

/**
 * Reusable Crisis Line component that shows up as a 'sticky' on the Home screen
 *
 * @returns CrisisLineCta component
 */
const CrisisLineCta: FC<CrisisLineCtaProps> = ({ onPress }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const props = { onPress }

  return (
    <CtaButton {...props}>
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
