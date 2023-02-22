import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react'

import { AlertBox, AlertBoxProps, Box, BoxProps, ClosePanelButton, LoadingComponent, TextArea, TextView, VAButton, VAIcon, VAIconProps, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionHistoryTabConstants, PrescriptionsList } from 'store/api/types'
import { PrescriptionState, requestRefills } from 'store/slices'
import { RefillStackParamList } from './RefillScreen'
import { RootState } from 'store'
import { getRxNumberTextAndLabel } from '../PrescriptionCommon'
import { isIOS } from 'utils/platform'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, usePanelHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
type RefillRequestSummaryProps = StackScreenProps<RefillStackParamList, 'RefillRequestSummary'>

const enum REQUEST_STATUS {
  FAILED,
  SUCCESS,
  MIX,
}

const RefillRequestSummary: FC<RefillRequestSummaryProps> = ({ navigation }) => {
  const headerStyle = usePanelHeaderStyles()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const [status, setStatus] = useState<REQUEST_STATUS>()
  const [requestFailed, setRequestFailed] = useState<PrescriptionsList>([])
  const { refillRequestSummaryItems, showLoadingScreenRequestRefillsRetry } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    const requestSubmittedItems = []
    const requestFailedItems: PrescriptionsList = []
    refillRequestSummaryItems.forEach((item) => {
      item.submitted ? requestSubmittedItems.push(item.data) : requestFailedItems.push(item.data)
    })

    if (requestFailed.length === refillRequestSummaryItems.length) {
      setStatus(REQUEST_STATUS.FAILED)
    } else if (requestSubmittedItems.length === refillRequestSummaryItems.length) {
      setStatus(REQUEST_STATUS.SUCCESS)
    } else {
      setStatus(REQUEST_STATUS.MIX)
    }
    setRequestFailed(requestFailedItems)
  }, [refillRequestSummaryItems, tc, requestFailed.length])

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
      headerLeft: () => (
        <ClosePanelButton
          buttonText={tc('close')}
          onPress={navigation.getParent()?.goBack}
          buttonTextColor={'showAll'}
          focusOnButton={isIOS() ? false : true} // this is done due to ios not reading the button name on modal
        />
      ),
    })
  }, [navigation, headerStyle, tc])

  const renderAlert = (): ReactElement => {
    let alertBoxProps: AlertBoxProps
    switch (status) {
      case REQUEST_STATUS.SUCCESS:
        alertBoxProps = {
          border: 'success',
          title: t('prescriptions.refillRequestSummary.success'),
        }
        break
      case REQUEST_STATUS.MIX:
      case REQUEST_STATUS.FAILED:
      default:
        alertBoxProps = {
          border: 'error',
          title: t('prescriptions.refillRequestSummary.mix', { count: requestFailed.length }),
          text: t('prescriptions.refillRequestSummary.tryAgain'),
          textA11yLabel: t('prescriptions.refillRequestSummary.tryAgain.a11yLabel'),
        }
        break
    }
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <AlertBox {...alertBoxProps}>
          {status !== REQUEST_STATUS.SUCCESS && (
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VAButton
                onPress={() => {
                  dispatch(requestRefills(requestFailed))
                  logAnalyticsEvent(Events.vama_rx_refill_retry())
                }}
                label={tc('tryAgain')}
                buttonType="buttonPrimary"
                a11yHint={t('prescriptions.refillRequestSummary.tryAgain.a11yLabel')}
              />
            </Box>
          )}
        </AlertBox>
      </Box>
    )
  }

  const borderProps: BoxProps = {
    borderTopWidth: 1,
    borderTopColor: 'prescriptionDivider',
    mt: theme.dimensions.standardMarginBetween,
    pt: theme.dimensions.standardMarginBetween,
  }

  const getRequestSummaryItem = () => {
    return refillRequestSummaryItems.map((request, index) => {
      const vaIconProps: VAIconProps = {
        name: request.submitted ? 'WhiteCheckCircle' : 'WhiteCloseCircle',
        width: 20,
        height: 20,
        fill: request.submitted ? theme.colors.icon.success : theme.colors.icon.error,
      }

      const boxProps: BoxProps = {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        mb: index < refillRequestSummaryItems.length - 1 ? theme.dimensions.condensedMarginBetween : 0,
      }

      const { prescriptionName, prescriptionNumber } = request.data.attributes
      const [rxNumber, rxNumberA11yLabel] = getRxNumberTextAndLabel(t, prescriptionNumber)
      const a11yProps = {
        accessibilityLabel: `${prescriptionName}. ${rxNumberA11yLabel}. ${
          request.submitted ? t('prescriptions.refillRequestSummary.pendingRefills.requestSubmitted') : t('prescriptions.refillRequestSummary.pendingRefills.requestFailed')
        }`,
        accessibilityValue: { text: tc('listPosition', { position: index + 1, total: refillRequestSummaryItems.length }) },
        accessible: true,
      }

      return (
        <Box key={index} {...boxProps} {...a11yProps}>
          <Box flex={1}>
            <TextView variant="MobileBodyBold">{prescriptionName}</TextView>
            <TextView variant="HelperText" color="placeholder">
              {rxNumber}
            </TextView>
          </Box>
          <VAIcon {...vaIconProps} />
        </Box>
      )
    })
  }

  const renderRequestSummary = (): ReactElement => {
    return (
      <>
        <Box>
          <TextView variant="BitterBoldHeading" accessibilityRole="header">
            {t('prescriptions.refillRequestSummary')}
          </TextView>
        </Box>
        <Box {...borderProps}>{getRequestSummaryItem()}</Box>
      </>
    )
  }
  const renderWhatsNext = (): ReactElement => {
    if (status === REQUEST_STATUS.FAILED) {
      return <></>
    }

    return (
      <Box {...borderProps}>
        <TextView variant="HelperTextBold">{t('prescriptions.refillRequestSummary.whatsNext')}</TextView>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBody" accessibilityLabel={t('prescriptions.refillRequestSummary.yourRefills.successPt1.a11y')}>
            {t('prescriptions.refillRequestSummary.yourRefills.successPt1')}
          </TextView>
          <TextView variant="MobileBody" accessibilityLabel={t('prescriptions.refillRequestSummary.yourRefills.successPt2.a11y')} mt={theme.dimensions.standardMarginBetween}>
            {t('prescriptions.refillRequestSummary.yourRefills.successPt2')}
          </TextView>
        </Box>
        <VAButton
          onPress={navigateTo('PrescriptionHistory', { startingTab: PrescriptionHistoryTabConstants.PENDING })}
          label={t('prescriptions.refillRequestSummary.pendingRefills')}
          buttonType="buttonSecondary"
        />
      </Box>
    )
  }

  if (showLoadingScreenRequestRefillsRetry) {
    return <LoadingComponent text={t('prescriptions.refill.send', { count: 1 })} />
  }

  return (
    <>
      <VAScrollView>
        <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
          {renderAlert()}
          <TextArea>
            {renderRequestSummary()}
            {renderWhatsNext()}
          </TextArea>
        </Box>
      </VAScrollView>
    </>
  )
}

export default RefillRequestSummary
