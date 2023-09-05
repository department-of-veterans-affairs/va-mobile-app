import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { RefillStatus } from 'store/api/types'
import { getTagTypeForStatus, getTextForRefillStatus } from 'utils/prescriptions'
import { useRouteNavigation } from 'utils/hooks'
import Box, { BoxProps } from 'components/Box'
import LabelTag, { LabelTagProps } from 'components/LabelTag'

export type RefillTagProps = {
  status: RefillStatus
}

const RefillTag: FC<RefillTagProps> = ({ status }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const statusText = getTextForRefillStatus(status, t) || ''

  const wrapperProps: BoxProps = {
    alignSelf: 'flex-start',
  }

  const labelTagProps: LabelTagProps = {
    text: statusText,
    a11yLabel: statusText,
    labelType: getTagTypeForStatus(status),
    onPress: navigateTo('StatusDefinition', { display: statusText, value: status }),
    a11yHint: t('prescription.history.a11yHint.status'),
  }

  return (
    <Box {...wrapperProps}>
      <LabelTag {...labelTagProps} />
    </Box>
  )
}

export default RefillTag
