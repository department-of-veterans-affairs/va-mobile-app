import React from 'react'
import { useTranslation } from 'react-i18next'

import Box, { BoxProps } from 'components/Box'
import LabelTag, { LabelTagProps } from 'components/LabelTag'
import { NAMESPACE } from 'constants/namespaces'
import { RefillStatus } from 'store/api/types'
import { useRouteNavigation } from 'utils/hooks'
import { getTagTypeForStatus, getTextForRefillStatus } from 'utils/prescriptions'

export type RefillTagProps = {
  status: RefillStatus
}

function RefillTag({ status }: RefillTagProps) {
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
    onPress: () => navigateTo('StatusDefinition', { display: statusText, value: status }),
    a11yHint: t('prescription.history.a11yHint.status'),
  }

  return (
    <Box {...wrapperProps}>
      <LabelTag {...labelTagProps} />
    </Box>
  )
}

export default RefillTag
