import React from 'react'
import { useTranslation } from 'react-i18next'

import { Observation } from 'api/types'
import { Box, BoxProps, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type LabsAndTestsResultItemProps = {
  observation: Observation
}

function LabsAndTestsResultItem({ observation }: LabsAndTestsResultItemProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const placeHolder = t('noneNoted')

  const boxProps: BoxProps = {
    width: '100%',
    px: theme.dimensions.gutter,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    pt: standardMarginBetween,
    backgroundColor: 'list',
  }

  const LAB_RESULT_FIELDS = [
    {
      labelKey: 'labsAndTests.details.sampleTested',
      value: observation.sampleTested,
    },
    {
      labelKey: 'labsAndTests.details.bodySite',
      value: observation.bodySite,
    },
    {
      labelKey: 'labsAndTests.details.result',
      value: observation.value?.text ?? null,
    },
    {
      labelKey: 'labsAndTests.details.referenceRange',
      value: observation.referenceRange,
    },
    {
      labelKey: 'labsAndTests.details.status',
      value: observation.status,
    },
    {
      labelKey: 'labsAndTests.details.comment',
      value: observation.comments,
    },
  ]

  return (
    <Box {...boxProps}>
      <Box>
        <TextView variant="LabResultHeader">{observation.testCode || placeHolder}</TextView>
      </Box>

      {LAB_RESULT_FIELDS.map(({ labelKey, value }) => (
        <Box key={labelKey} my={condensedMarginBetween}>
          <TextView variant="MobileBodyBold">{t(labelKey)}</TextView>
          <TextView variant="MobileBody">{value || placeHolder}</TextView>
        </Box>
      ))}
    </Box>
  )
}

export default LabsAndTestsResultItem
