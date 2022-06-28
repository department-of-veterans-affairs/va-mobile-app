import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactElement, useEffect, useLayoutEffect, useState } from 'react'

import { AlertBox, AlertBoxProps, Box, BoxProps, CloseModalButton, TextArea, TextView, VAButton, VAIcon, VAIconProps, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RefillStackParamList } from './RefillScreen'
import { isIOS } from '../../../../utils/platform'
import { useModalHeaderStyles, useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'
type RefillRequestSummaryProps = StackScreenProps<RefillStackParamList, 'RefillRequestSummary'>

// todo replace with real data
const mockSubmitted = [
  {
    submitted: false,
    name: 'PREDNISONE 10MG TAB',
    rxId: 'Rx #: 2757929503',
  },
  {
    submitted: true,
    name: 'PREDNISONE 11MG TAB',
    rxId: 'Rx #: 2757929504',
  },
  {
    submitted: true,
    name: 'PREDNISONE 12MG TAB',
    rxId: 'Rx #: 2757929505',
  },
]

const enum REQUEST_STATUS {
  FAILED,
  SUCCESS,
  MIX,
}

const RefillRequestSummary: FC<RefillRequestSummaryProps> = ({ navigation }) => {
  const headerStyle = useModalHeaderStyles()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const [status, setStatus] = useState<REQUEST_STATUS>()
  const [requestFailed, setRequestFailed] = useState<Array<{ submitted: boolean; name: string; rxId: string }>>([])

  useEffect(() => {
    const requestSubmittedItems = []
    const requestFailedItems: Array<{ submitted: boolean; name: string; rxId: string }> = []
    mockSubmitted.forEach((item) => {
      item.submitted ? requestSubmittedItems.push(item) : requestFailedItems.push(item)
    })

    if (requestFailed.length === mockSubmitted.length) {
      setStatus(REQUEST_STATUS.FAILED)
    } else if (requestSubmittedItems.length === mockSubmitted.length) {
      setStatus(REQUEST_STATUS.SUCCESS)
    } else {
      setStatus(REQUEST_STATUS.MIX)
    }
    setRequestFailed(requestFailedItems)
  }, [tc, requestFailed.length])

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
      headerLeft: () => (
        <CloseModalButton
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
      case REQUEST_STATUS.FAILED:
        alertBoxProps = {
          border: 'error',
          title: t('prescriptions.refillRequestSummary.failed'),
          text: t('prescriptions.refillRequestSummary.tryAgain'),
          textA11yLabel: t('prescriptions.refillRequestSummary.tryAgain.a11yLabel'),
        }
        break
      case REQUEST_STATUS.MIX:
      default:
        alertBoxProps = {
          border: 'error',
          title: t('prescriptions.refillRequestSummary.mix', { count: requestFailed.length, total: mockSubmitted.length }),
          text: t('prescriptions.refillRequestSummary.tryAgain'),
          textA11yLabel: t('prescriptions.refillRequestSummary.tryAgain.a11yLabel'),
        }
        break
    }
    return (
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
        <AlertBox {...alertBoxProps}>
          {status !== REQUEST_STATUS.SUCCESS && (
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VAButton onPress={() => {}} label={tc('tryAgain')} buttonType="buttonPrimary" />
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
    return mockSubmitted.map((request, index) => {
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
        mb: index < mockSubmitted.length - 1 ? theme.dimensions.condensedMarginBetween : 0,
      }

      const a11yProps = {
        accessibilityLabel: `${request.name} ${request.rxId} ${
          request.submitted ? t('prescriptions.refillRequestSummary.reviewRefills.requestSubmitted') : t('prescriptions.refillRequestSummary.reviewRefills.requestFailed')
        }`,
        accessibilityValue: { text: tc('listPosition', { position: index + 1, total: mockSubmitted.length }) },
        accessible: true,
      }
      return (
        <Box key={index} {...boxProps} {...a11yProps}>
          <Box flex={1}>
            <TextView variant="MobileBodyBold">{request.name}</TextView>
            <TextView variant="HelperText">{request.rxId}</TextView>
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
    let yourRefillText = ''
    switch (status) {
      case REQUEST_STATUS.FAILED:
        return <></>
      case REQUEST_STATUS.SUCCESS:
        yourRefillText = t('prescriptions.refillRequestSummary.yourRefills.success')
        break
      case REQUEST_STATUS.MIX:
      default:
        yourRefillText = t('prescriptions.refillRequestSummary.yourRefills.mix')
    }

    return (
      <Box {...borderProps}>
        <TextView variant="HelperTextBold">{t('prescriptions.refillRequestSummary.whatsNext')}</TextView>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBody">{yourRefillText}</TextView>
        </Box>
        <VAButton
          onPress={() => {}}
          label={t('prescriptions.refillRequestSummary.reviewRefills')}
          buttonType="buttonSecondary"
          a11yHint={t('prescriptions.refillRequestSummary.tryAgain.a11yLabel')}
        />
      </Box>
    )
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
