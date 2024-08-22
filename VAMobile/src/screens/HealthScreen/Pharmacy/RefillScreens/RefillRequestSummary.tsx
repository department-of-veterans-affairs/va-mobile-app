import React, { ReactElement, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { useRequestRefills } from 'api/prescriptions'
import { PrescriptionsList, RefillStatusConstants } from 'api/types'
import {
  AlertWithHaptics,
  AlertWithHapticsProps,
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
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useRouteNavigation, useTheme } from 'utils/hooks'

import { HealthStackParamList } from '../../HealthStackScreens'
import { getRxNumberTextAndLabel } from '../PrescriptionCommon'

const enum REQUEST_STATUS {
  FAILED,
  SUCCESS,
  MIX,
}

type RefillRequestSummaryProps = StackScreenProps<HealthStackParamList, 'RefillRequestSummary'>

function RefillRequestSummary({ navigation, route }: RefillRequestSummaryProps) {
  const { refillRequestSummaryItems } = route.params
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [status, setStatus] = useState<REQUEST_STATUS>()
  const [requestFailed, setRequestFailed] = useState<PrescriptionsList>([])

  const { mutate: requestRefill, isPending: showLoadingScreenRequestRefillsRetry } = useRequestRefills()

  const onNavToHistory = () => {
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
    let alertBoxProps: AlertWithHapticsProps
    switch (status) {
      case REQUEST_STATUS.SUCCESS:
        alertBoxProps = {
          variant: 'success',
          header: t('prescriptions.refillRequestSummary.success'),
        }
        break
      case REQUEST_STATUS.MIX:
      case REQUEST_STATUS.FAILED:
      default:
        alertBoxProps = {
          variant: 'error',
          header: t('prescriptions.refillRequestSummary.mix', { count: requestFailed.length }),
          description: t('prescriptions.refillRequestSummary.tryAgain'),
          descriptionA11yLabel: a11yLabelVA(t('prescriptions.refillRequestSummary.tryAgain')),
          primaryButton: {
            label: t('tryAgain'),
            onPress: () => {
              requestRefill(requestFailed)
              const prescriptionIds = requestFailed.map((prescription) => prescription.id)
              logAnalyticsEvent(Events.vama_rx_refill_retry(prescriptionIds))
            },
            a11yHint: t('prescriptions.refillRequestSummary.tryAgain.a11yLabel'),
          },
        }
        break
    }
    return (
      <Box mb={theme.dimensions.standardMarginBetween}>
        <AlertWithHaptics {...alertBoxProps} />
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
          <TextView variant="MobileBodyBold" accessibilityRole="header">
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
        <Button
          onPress={() => navigateTo('PrescriptionHistory', { startingFilter: RefillStatusConstants.PENDING })}
          label={t('prescriptions.refillRequestSummary.pendingRefills')}
          buttonType={ButtonVariants.Secondary}
        />
      </Box>
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
        {showLoadingScreenRequestRefillsRetry ? (
          <LoadingComponent text={t('prescriptions.refill.send', { count: 1 })} />
        ) : (
          <Box mb={theme.dimensions.contentMarginBottom}>
            {renderAlert()}
            <TextArea>
              {renderRequestSummary()}
              {renderWhatsNext()}
            </TextArea>
          </Box>
        )}
      </FullScreenSubtask>
    </>
  )
}

export default RefillRequestSummary
