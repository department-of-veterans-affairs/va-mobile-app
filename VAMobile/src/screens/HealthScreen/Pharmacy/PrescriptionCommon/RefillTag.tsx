import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { RefillStatus } from 'api/types'
import Box, { BoxProps } from 'components/Box'
import LabelTag, { LabelTagProps } from 'components/LabelTag'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation } from 'utils/hooks'
import { getTagTypeForStatus, getTextForRefillStatus } from 'utils/prescriptions'

export type RefillTagProps = {
  status: RefillStatus
  dispStatus: string | null
}

function RefillTag({ status, dispStatus }: RefillTagProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { medicationsOracleHealthEnabled = false } = userAuthorizedServices || {}

  let statusText: string = dispStatus || ''
  if (!medicationsOracleHealthEnabled) {
    statusText = getTextForRefillStatus(status, t) || ''
  }

  const wrapperProps: BoxProps = {
    alignSelf: 'flex-start',
  }

  const labelTagProps: LabelTagProps = {
    text: statusText,
    a11yLabel: statusText,
    labelType: getTagTypeForStatus(status),
    onPress: () => navigateTo('StatusDefinition', { display: statusText, value: status }),
    a11yHint: t('prescription.history.a11yHint.status'),
    a11yRole: 'link',
  }

  return (
    <Box {...wrapperProps}>
      <LabelTag {...labelTagProps} />
    </Box>
  )
}

export default RefillTag
