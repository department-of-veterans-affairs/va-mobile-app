import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionAttributeData } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getDateTextAndLabel, getRxNumberTextAndLabel } from './PrescriptionUtils'
import { useTheme } from 'utils/hooks'
import RefillTag from './RefillTag'

export type PrescriptionListItemProps = {
  /** the prescription info to present */
  prescription: PrescriptionAttributeData
  /** boolean to determine to hide the instructions */
  hideInstructions?: boolean
  /** whether to show the refill status tag */
  includeRefillTag?: boolean
}

/** common component to show the prescription info on a list  */
const PrescriptionListItem: FC<PrescriptionListItemProps> = ({ prescription, hideInstructions, includeRefillTag }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const { instructions, refillRemaining, prescriptionName, prescriptionNumber, facilityName, refillDate } = prescription
  const noneNoted = t('noneNoted')

  const [rxNumber, rxNumberA11yLabel] = getRxNumberTextAndLabel(t, prescriptionNumber)
  const [dateMMddyyyy, dateA11yLabel] = getDateTextAndLabel(t, refillDate)

  const renderInstructions = () => {
    if (hideInstructions) {
      return <></>
    }

    const instructionsText = instructions || t('prescription.instructions.noneNoted')
    return (
      <Box mt={condensedMarginBetween}>
        <TextView variant={'HelperText'} my={condensedMarginBetween} accessibilityLabel={`${instructionsText}.`}>
          {instructionsText}
        </TextView>
      </Box>
    )
  }

  const refillDateText = `${t('prescription.refillsLeft')} ${refillRemaining ?? noneNoted}`

  return (
    <Box>
      <TextView variant={'MobileBodyBold'} accessibilityLabel={`${prescriptionName}.`}>
        {prescriptionName}
      </TextView>
      <TextView variant={'HelperText'} color={'placeholder'} accessibilityLabel={`${rxNumberA11yLabel}.`}>
        {rxNumber}
      </TextView>
      {includeRefillTag && (
        <Box mt={20}>
          <RefillTag status={prescription.refillStatus} />
        </Box>
      )}
      {renderInstructions()}
      <TextView accessibilityLabel={`${refillDateText}.`} variant={'HelperText'} mt={hideInstructions ? standardMarginBetween : condensedMarginBetween}>
        {refillDateText}
      </TextView>
      <TextView variant={'HelperText'} mt={condensedMarginBetween} accessibilityLabel={`${t('prescriptions.sort.fillDate')} ${dateA11yLabel}.`}>
        {`${t('prescriptions.sort.fillDate')}: ${dateMMddyyyy}`}
      </TextView>
      <TextView variant={'HelperText'} mt={condensedMarginBetween} accessibilityLabel={`${a11yLabelVA(t('prescription.vaFacility'))} ${facilityName || noneNoted}.`}>
        {`${t('prescription.vaFacility')} ${facilityName || noneNoted}`}
      </TextView>
    </Box>
  )
}

export default PrescriptionListItem
