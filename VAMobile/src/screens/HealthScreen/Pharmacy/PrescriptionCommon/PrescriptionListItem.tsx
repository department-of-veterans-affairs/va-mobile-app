import React from 'react'
import { useTranslation } from 'react-i18next'

import { PrescriptionAttributeData } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import RefillTag from 'screens/HealthScreen/Pharmacy/PrescriptionCommon/RefillTag'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'
import { getDateTextAndLabel, getRxNumberTextAndLabel } from 'utils/prescriptions'

export type PrescriptionListItemProps = {
  /** the prescription info to present */
  prescription: PrescriptionAttributeData
  /** boolean to determine to hide the instructions */
  hideInstructions?: boolean
  /** whether to show the refill status tag */
  includeRefillTag?: boolean
}

/** common component to show the prescription info on a list  */
function PrescriptionListItem({ prescription, hideInstructions, includeRefillTag }: PrescriptionListItemProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const { instructions, refillRemaining, prescriptionName, prescriptionNumber, facilityName, refillDate } = prescription

  const [rxNumber, rxNumberA11yLabel] = getRxNumberTextAndLabel(t, prescriptionNumber)
  const [dateMMddyyyy, dateA11yLabel] = getDateTextAndLabel(
    t,
    refillDate,
    t('prescription.details.fillDateNotAvailable'),
  )

  const refillRemainingText =
    refillRemaining >= 0 && refillRemaining !== null
      ? refillRemaining
      : t('prescription.details.refillRemainingNotAvailable')
  const refillDateText = `${t('prescription.refillsLeft')} ${refillRemainingText}`
  const facilityNameText = facilityName || t('prescription.details.facilityNameNotAvailable')

  const renderInstructions = () => {
    if (hideInstructions) {
      return <></>
    }

    // OH Data includes the refills in the instructions text, so we need to remove it
    const removeTrailingRefills = (text: string | null): string => {
      return text?.replace(/\s*Refills?:\s*\d*\.?\s*$/i, '').trim() || ''
    }
    const instructionsText = removeTrailingRefills(instructions) || t('prescription.details.instructionsNotAvailable')

    return (
      <Box mt={condensedMarginBetween}>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView variant={'HelperText'} my={condensedMarginBetween} accessibilityLabel={`${instructionsText}`}>
          {instructionsText}
        </TextView>
      </Box>
    )
  }

  return (
    <Box>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView variant={'MobileBodyBold'} accessibilityLabel={`${prescriptionName}`} accessibilityRole="header">
        {prescriptionName}
      </TextView>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView variant={'HelperText'} color={'placeholder'} accessibilityLabel={`${rxNumberA11yLabel}`}>
        {rxNumber}
      </TextView>
      {includeRefillTag && (
        <Box mt={20}>
          <RefillTag status={prescription.refillStatus} />
        </Box>
      )}
      {renderInstructions()}
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView
        accessibilityLabel={`${refillDateText}`}
        variant={'HelperText'}
        mt={hideInstructions ? standardMarginBetween : condensedMarginBetween}>
        {refillDateText}
      </TextView>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView
        variant={'HelperText'}
        mt={condensedMarginBetween}
        accessibilityLabel={`${t('fillDate')} ${dateA11yLabel}`}>
        {`${t('fillDate')}: ${dateMMddyyyy}`}
      </TextView>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <TextView
        variant={'HelperText'}
        mt={condensedMarginBetween}
        accessibilityLabel={`${a11yLabelVA(t('prescription.vaFacility'))} ${facilityNameText}`}>
        {`${t('prescription.vaFacility')} ${facilityNameText}`}
      </TextView>
    </Box>
  )
}

export default PrescriptionListItem
