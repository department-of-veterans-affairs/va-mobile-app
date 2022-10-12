import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionAttributeData } from 'store/api/types'
import { formatDateUtc } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'
import RefillTag from './RefillTag'

export type PrescriptionListItemProps = {
  /** the prescription info to present */
  prescription: PrescriptionAttributeData
  /** boolean to determine to hide the instructions */
  hideInstructions?: boolean
  /** whether to hide the fill date */
  hideFillDate?: boolean
  /** whether to show the refill status tag */
  includeRefillTag?: boolean
}

/** common component to show the prescription info on a list  */
const PrescriptionListItem: FC<PrescriptionListItemProps> = ({ prescription, hideInstructions, hideFillDate, includeRefillTag }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const { instructions, refillRemaining, prescriptionName, prescriptionNumber, facilityName, refillDate } = prescription
  const noneNoted = tc('noneNoted')

  const renderInstructions = () => {
    if (hideInstructions) {
      return <></>
    }

    return (
      <Box mt={condensedMarginBetween}>
        <TextView variant={'HelperText'} my={condensedMarginBetween}>
          {instructions || t('prescription.instructions.noneNoted')}
        </TextView>
      </Box>
    )
  }

  return (
    <Box>
      <TextView mt={condensedMarginBetween} variant={'MobileBodyBold'}>
        {prescriptionName}
      </TextView>
      <TextView
        variant={'HelperText'}
        color={'placeholder'}
        mt={condensedMarginBetween}
        accessibilityLabel={prescriptionNumber ? `${t('prescription.prescriptionNumber.a11yLabel')} ${prescriptionNumber.split('').join(' ')}` : noneNoted}>
        {`${t('prescription.prescriptionNumber')} ${prescriptionNumber || noneNoted}`}
      </TextView>
      {includeRefillTag && (
        <Box mt={20}>
          <RefillTag status={prescription.refillStatus} />
        </Box>
      )}
      {renderInstructions()}
      <TextView variant={'HelperText'} mt={hideInstructions ? standardMarginBetween : condensedMarginBetween}>
        {`${t('prescription.refillsLeft')} ${refillRemaining ?? noneNoted}`}
      </TextView>
      {!hideFillDate && (
        <TextView variant={'HelperText'} mt={condensedMarginBetween}>
          {`${t('prescriptions.sort.fillDate')}: ${refillDate ? formatDateUtc(refillDate, 'MM/dd/yyyy') : noneNoted}`}
        </TextView>
      )}
      <TextView variant={'HelperText'} mt={condensedMarginBetween} accessibilityLabel={`${t('prescription.vaFacility.a11yLabel')} ${facilityName || noneNoted}`}>
        {`${t('prescription.vaFacility')} ${facilityName || noneNoted}`}
      </TextView>
    </Box>
  )
}

export default PrescriptionListItem
