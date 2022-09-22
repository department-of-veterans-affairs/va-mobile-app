import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, BoxProps, TextView, VAIcon, VAIconProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionAttributeData } from 'store/api/types'
import { Pressable, PressableProps } from 'react-native'
import { formatDateUtc } from 'utils/formattingUtils'
import { getTagColorForStatus, getTextForRefillStatus } from 'utils/prescriptions'
import { useRouteNavigation, useTheme } from 'utils/hooks'

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
  const navigateTo = useRouteNavigation()

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

  /**
   * Because the label tag common component needs to be redesigned to support an accessible press area,
   * using a temporary tag to support being able to see the status modals
   */
  const getTemporaryStatusTag = () => {
    if (!includeRefillTag) {
      return <></>
    }

    const status = prescription.refillStatus
    const statusText = getTextForRefillStatus(status, t)
    const backgroundColor = getTagColorForStatus(status)

    const statusPressableProps: PressableProps = {
      onPress: navigateTo('StatusGlossary', { display: statusText, value: status }),
      accessible: true,
      accessibilityRole: 'button',
      accessibilityHint: t('prescription.history.a11yHint.top'),
      accessibilityLabel: status,
    }

    const infoIconProps: VAIconProps = {
      name: 'InfoIcon',
      fill: 'statusInfoIcon',
      height: 16,
      width: 16,
      ml: 10,
      mt: 3,
    }

    const tagBoxProps: BoxProps = {
      justifyContent: 'space-between',
      alignSelf: 'flex-start',
      backgroundColor,
      alignItems: 'center',
      flexDirection: 'row',
      height: 44,
      borderRadius: 100,
      px: 10,
    }

    return (
      <Box mt={20}>
        <Pressable {...statusPressableProps}>
          <Box {...tagBoxProps}>
            <TextView variant={'HelperText'} flexWrap={'wrap'} pt={3}>
              {statusText}
            </TextView>
            <VAIcon {...infoIconProps} />
          </Box>
        </Pressable>
      </Box>
    )
  }

  return (
    <Box flex={1}>
      <TextView mt={condensedMarginBetween} variant={'MobileBodyBold'}>
        {prescriptionName}
      </TextView>
      <TextView variant={'HelperText'} color={'placeholder'} mt={condensedMarginBetween}>
        {`${t('prescription.prescriptionNumber')} ${prescriptionNumber || noneNoted}`}
      </TextView>
      {getTemporaryStatusTag()}
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
