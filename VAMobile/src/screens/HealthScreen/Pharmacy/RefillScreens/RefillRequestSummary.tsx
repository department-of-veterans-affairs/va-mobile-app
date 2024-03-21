import React, { ReactElement, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import {
  AlertBox,
  AlertBoxProps,
  Box,
  BoxProps,
  LoadingComponent,
  TextArea,
  TextView,
  VAIcon,
  VAIconProps,
} from 'components'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { PrescriptionsList, RefillStatusConstants } from 'store/api/types'
import { PrescriptionState, requestRefills } from 'store/slices'
import { dispatchClearLoadingRequestRefills, dispatchSetPrescriptionsNeedLoad } from 'store/slices/prescriptionSlice'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useBeforeNavBackListener, useRouteNavigation, useTheme } from 'utils/hooks'

import { HealthStackParamList } from '../../HealthStackScreens'
import { getRxNumberTextAndLabel } from '../PrescriptionCommon'

const enum REQUEST_STATUS {
  FAILED,
  SUCCESS,
  MIX,
}

type RefillRequestSummaryProps = StackScreenProps<HealthStackParamList, 'RefillRequestSummary'>

function RefillRequestSummary({ navigation }: RefillRequestSummaryProps) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [status, setStatus] = useState<REQUEST_STATUS>()
  const [requestFailed, setRequestFailed] = useState<PrescriptionsList>([])
  const { refillRequestSummaryItems, showLoadingScreenRequestRefillsRetry } = useSelector<RootState, PrescriptionState>(
    (s) => s.prescriptions,
  )

  const onNavToHistory = () => {
    dispatch(dispatchSetPrescriptionsNeedLoad())
    dispatch(dispatchClearLoadingRequestRefills())
    navigateTo('PrescriptionHistory', {})
  }

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
  }, [refillRequestSummaryItems, t, requestFailed.length])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      presentation: 'card',
    })
  }, [navigation])

  useBeforeNavBackListener(navigation, (e) => {
    e.preventDefault()
    onNavToHistory()
  })

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
          textA11yLabel: a11yLabelVA(t('prescriptions.refillRequestSummary.tryAgain')),
        }
        break
    }
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <AlertBox {...alertBoxProps}>
          {status !== REQUEST_STATUS.SUCCESS && (
            <Box mt={theme.dimensions.standardMarginBetween}>
              <Button
                onPress={() => {
                  dispatch(requestRefills(requestFailed))
                  const prescriptionIds = requestFailed.map((prescription) => prescription.id)
                  logAnalyticsEvent(Events.vama_rx_refill_retry(prescriptionIds))
                }}
                label={t('tryAgain')}
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
        name: request.submitted ? 'CircleCheckMark' : 'Remove',
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
          request.submitted
            ? t('prescriptions.refillRequestSummary.pendingRefills.requestSubmitted')
            : t('prescriptions.refillRequestSummary.pendingRefills.requestFailed')
        }`,
        accessibilityValue: {
          text: t('listPosition', { position: index + 1, total: refillRequestSummaryItems.length }),
        },
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
          <TextView
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('prescriptions.refillRequestSummary.yourRefills.success.1'))}
            paragraphSpacing={true}>
            {t('prescriptions.refillRequestSummary.yourRefills.success.1')}
          </TextView>
          <TextView
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('prescriptions.refillRequestSummary.yourRefills.success.2'))}>
            {t('prescriptions.refillRequestSummary.yourRefills.success.2')}
          </TextView>
        </Box>
        <Box
          accessibilityRole="link"
          accessibilityLabel={t('prescriptions.refillRequestSummary.pendingRefills')}
          accessible={true}>
          <Box importantForAccessibility={'no-hide-descendants'}>
            <Button
              onPress={() => {
                dispatch(dispatchSetPrescriptionsNeedLoad())
                dispatch(dispatchClearLoadingRequestRefills())
                navigateTo('PrescriptionHistory', { startingFilter: RefillStatusConstants.PENDING })
              }}
              label={t('prescriptions.refillRequestSummary.pendingRefills')}
              buttonType={ButtonVariants.Secondary}
            />
          </Box>
        </Box>
      </Box>
    )
  }

  if (showLoadingScreenRequestRefillsRetry) {
    return (
      <FullScreenSubtask
        leftButtonText={t('close')}
        onLeftButtonPress={() => {
          onNavToHistory()
        }}>
        <LoadingComponent text={t('prescriptions.refill.send', { count: 1 })} />
      </FullScreenSubtask>
    )
  }

  return (
    <>
      <FullScreenSubtask
        leftButtonText={t('close')}
        onLeftButtonPress={() => {
          onNavToHistory()
        }}
        title={t('refillRequest')}>
        <Box mb={theme.dimensions.contentMarginBottom}>
          {renderAlert()}
          <TextArea>
            {renderRequestSummary()}
            {renderWhatsNext()}
          </TextArea>
        </Box>
      </FullScreenSubtask>
    </>
  )
}

export default RefillRequestSummary
