import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionAttributeData } from 'store/api/types'
import { formatDateUtc } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type PrescriptionListItemProps = {
  /** the prescription info to present */
  prescription: PrescriptionAttributeData
}

/** common component to show the prescription info on a list  */
const PrescriptionListItem: FC<PrescriptionListItemProps> = ({ prescription }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { condensedMarginBetween } = theme.dimensions
  const { instructions, refillRemaining, prescriptionName, prescriptionNumber, facilityName, refillDate } = prescription

  return (
    <Box flex={1}>
      <TextView mt={condensedMarginBetween} variant={'MobileBodyBold'}>
        {prescriptionName}
      </TextView>
      <TextView variant={'HelperText'} color={'placeholder'} mt={condensedMarginBetween}>
        {t('prescription.prescriptionNumber')} {prescriptionNumber}
      </TextView>
      <Box mt={condensedMarginBetween}>
        <TextView variant={'HelperText'} my={condensedMarginBetween}>
          {instructions}
        </TextView>
      </Box>
      <TextView variant={'HelperText'} mt={condensedMarginBetween}>
        {t('prescription.history.refill')} {refillRemaining}
      </TextView>
      <TextView variant={'HelperText'} mt={condensedMarginBetween}>
        {`${t('prescriptions.sort.fillDate')}: ${formatDateUtc(refillDate || '', 'MM/dd/yyyy')}`}
      </TextView>
      <TextView variant={'HelperText'} mt={condensedMarginBetween}>
        {t('prescription.history.facility')} {facilityName}
      </TextView>
    </Box>
  )
}

export default PrescriptionListItem
