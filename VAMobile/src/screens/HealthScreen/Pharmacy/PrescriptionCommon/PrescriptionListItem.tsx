import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionAttributeData } from 'store/api/types'
import { useTheme } from 'utils/hooks'
import RefillTag from './RefillTag'

type PrescriptionListItemProps = {
  //** the prescription info to present */
  prescription: PrescriptionAttributeData
  /** boolean to show the status tag */
  showTag?: boolean
}

/** common component to show the prescription info on a list  */
const PrescriptionListItem: FC<PrescriptionListItemProps> = ({ prescription, showTag = true }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { condensedMarginBetween } = theme.dimensions
  const { refillStatus, instructions, refillRemaining, prescriptionName, prescriptionNumber, facilityName } = prescription

  return (
    <Box flex={1}>
      <Box borderBottomWidth={1} borderBottomColor={'prescriptionDivider'}>
        {showTag && <RefillTag status={refillStatus} />}
        <TextView mt={condensedMarginBetween} variant={'MobileBodyBold'}>
          {prescriptionName}
        </TextView>
        <TextView my={condensedMarginBetween}>{instructions}</TextView>
      </Box>
      <TextView mt={condensedMarginBetween}>
        {t('prescription.history.refill')} <TextView variant={'MobileBodyBold'}>{refillRemaining}</TextView>
      </TextView>
      <TextView mt={condensedMarginBetween}>
        {t('prescription.history.facility')} <TextView variant={'MobileBodyBold'}>{facilityName}</TextView>
      </TextView>
      <TextView mt={condensedMarginBetween}>
        {t('prescription.history.prescriptionNumber')} <TextView variant={'MobileBodyBold'}>{prescriptionNumber}</TextView>
      </TextView>
    </Box>
  )
}

export default PrescriptionListItem
