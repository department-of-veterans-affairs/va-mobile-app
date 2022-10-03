import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { RefillStatus } from 'store/api/types'
import { getTagTypeForStatus, getTextForRefillStatus } from 'utils/prescriptions'
import { useRouteNavigation } from 'utils/hooks'
import LabelTag, { LabelTagProps } from 'components/LabelTag'

export type RefillTagProps = {
  status: RefillStatus
}

const RefillTag: FC<RefillTagProps> = ({ status }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const statusText = getTextForRefillStatus(status, t) || ''

  const labelTagProps: LabelTagProps = {
    text: statusText,
    a11yLabel: statusText,
    labelType: getTagTypeForStatus(status),
    onPress: navigateTo('StatusGlossary', { display: statusText, value: status }),
    a11yHint: t('prescription.history.a11yHint.status'),
  }

  return <LabelTag {...labelTagProps} />
}

export default RefillTag
