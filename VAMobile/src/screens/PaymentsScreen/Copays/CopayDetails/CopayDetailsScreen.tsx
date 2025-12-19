import React, { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Icon, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useDownloadCopayStatement, useMedicalCopays } from 'api/medicalCopays'
import {
  AlertWithHaptics,
  Box,
  ClickToCallPhoneNumber,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  MultiTouchCard,
  TextArea,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { getCopayInfo } from 'screens/PaymentsScreen/Copays/CopayCard/CopayCard'
import PreviousPDFStatements from 'screens/PaymentsScreen/Copays/CopayDetails/PreviousPDFStatements'
import RecentStatementCharges from 'screens/PaymentsScreen/Copays/CopayDetails/RecentStatementCharges'
import StatementAddresses from 'screens/PaymentsScreen/Copays/CopayDetails/StatementAddresses'
import ResolveBillButton from 'screens/PaymentsScreen/Copays/ResolveBill/ResolveBillButton'
import NoticeOfRightsButton from 'screens/PaymentsScreen/NoticeOfRights/NoticeOfRightsButton'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { formatDate, sortStatementsByDate, verifyCurrentBalance } from 'utils/copays'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber, numberToUSDollars } from 'utils/formattingUtils'
import { useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'
import { vaGovWebviewTitle } from 'utils/webview'

type CopayDetailsScreenProps = StackScreenProps<PaymentsStackParamList, 'CopayDetails'>

function CopayDetailsScreen({ navigation, route }: CopayDetailsScreenProps) {
  const { copay } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const snackbar = useSnackbar()
  const [statementID, setStatementID] = useState('')
  const navigateTo = useRouteNavigation()
  const showActionSheet = useShowActionSheet()
  const { data: copaysData, isFetching: loadingCopays } = useMedicalCopays()

  const statements = useMemo(() => copaysData?.data ?? [], [copaysData?.data])
  const facilityCopays = statements.filter(({ pSFacilityNum }) => pSFacilityNum === copay?.pSFacilityNum)
  const sortedFacilityCopays = useMemo(() => sortStatementsByDate(facilityCopays), [facilityCopays])

  const previousSortedFacilityCopays = sortedFacilityCopays.filter((statement) => statement.id !== copay.id)

  const { error: downloadStatementError, refetch: refetchStatement } = useDownloadCopayStatement(statementID, {
    enabled: statementID.length > 0,
  })

  useEffect(() => {
    if (downloadStatementError && isErrorObject(downloadStatementError) && statementID.length > 0) {
      snackbar.show(t('copays.download.error'), { isError: true, onActionPressed: refetchStatement })
    }
  }, [downloadStatementError, statementID, t, refetchStatement, snackbar])

  const copayInfo = getCopayInfo(copay)
  const isCurrentBalance = verifyCurrentBalance(copayInfo.date)
  const formattedDate = formatDate(copayInfo.date)

  const downloadStatement = (id: string) => {
    logAnalyticsEvent(Events.vama_copay_stmt_download(id))
    if (statementID === id) {
      refetchStatement()
    } else {
      setStatementID(id)
    }
  }

  const handleResolveClick = () => {
    const options = [
      t('copays.resolveBill.payBill'),
      t('copays.resolveBill.requestHelp'),
      t('copays.resolveBill.disputeCopay'),
      t('cancel'),
    ]
    const routeNames = ['PayBill', 'CopayRequestHelp', 'DisputeCopay']

    showActionSheet(
      {
        options,
        title: t('copays.resolveBill'),
        message: t('copays.resolveBill.how'),
        cancelButtonIndex: 3,
      },
      (buttonIndex) => {
        if (buttonIndex !== undefined && buttonIndex < 3) {
          navigateTo(routeNames[buttonIndex])
        }
      },
    )
  }

  const renderHelpContent = () => {
    const { LINK_URL_ASK_VA_GOV } = getEnv()
    return (
      <TextArea borderBoxStyle={{ mt: theme.dimensions.standardMarginBetween }}>
        <Box>
          <TextView
            variant="MobileBodyBold"
            accessibilityRole="header"
            accessibilityLabel={t('copays.help.header.a11yLabel')}
            accessibilityHint={t('copays.help.header.a11yHint')}>
            {t('copays.help.header')}
          </TextView>
          <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody" paragraphSpacing={false}>
            {t('copays.help.content')}
          </TextView>
          <ClickToCallPhoneNumber phone={t('8664001238')} displayedText={displayedTextPhoneNumber(t('8664001238'))} />
          <TextView variant="MobileBody" paragraphSpacing={false}>
            {t('copays.help.orContactAskVA')}
          </TextView>
          <LinkWithAnalytics
            type="custom"
            onPress={() => {
              navigateTo('Copays')
              logAnalyticsEvent(Events.vama_webview(LINK_URL_ASK_VA_GOV))
              navigateTo('Webview', {
                url: LINK_URL_ASK_VA_GOV,
                displayTitle: vaGovWebviewTitle(t),
                loadingMessage: t('loading.vaWebsite'),
                useSSO: false,
              })
            }}
            text={t('copays.help.askVA')}
            a11yLabel={a11yLabelVA(t('copays.help.askVA'))}
            a11yHint={t('copays.help.askVAA11yHint')}
          />
        </Box>
      </TextArea>
    )
  }
  const mainContent = (
    <>
      <TextView variant="MobileBodyBold">{copayInfo.facilityName}</TextView>
      <TextView mt={theme.dimensions.condensedMarginBetween} variant="HelperText">
        {t('copays.currentBalance')}
      </TextView>
      <TextView mb={theme.dimensions.condensedMarginBetween} variant="vadsFontHeadingMedium">
        {numberToUSDollars(copayInfo.balance ?? 0)}
      </TextView>
      <TextView variant="HelperText">{t('copays.paymentDueDate')}</TextView>
      <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
        {formattedDate}
      </TextView>
      <ResolveBillButton />
      <Pressable onPress={() => downloadStatement(copay.id)} accessibilityRole="link" accessible={true}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          minHeight={theme.dimensions.touchableMinHeight}
          pt={5}>
          <TextView flex={1} variant={'HelperTextBold'} color={'link'}>
            {t('copays.goToStatement')}
          </TextView>
          <Icon
            name={'ChevronRight'}
            fill={theme.colors.icon.chevronListItem}
            width={theme.dimensions.chevronListItemWidth}
            height={theme.dimensions.chevronListItemHeight}
          />
        </Box>
      </Pressable>
    </>
  )

  return (
    <FeatureLandingTemplate
      backLabel={t('copays.title')}
      backLabelOnPress={navigation.goBack}
      title={t('copays.details.title')}
      testID="copayDetailsTestID"
      backLabelTestID="copayDetailsBackTestID">
      {loadingCopays ? (
        <LoadingComponent text={t('copays.loading')} />
      ) : (
        <>
          {!isCurrentBalance && (
            <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
              <AlertWithHaptics
                variant="warning"
                header={t('copays.balanceOverdue')}
                primaryButton={{
                  label: t('copays.resolveBill'),
                  onPress: handleResolveClick,
                }}
                expandable>
                <TextView variant="MobileBody">
                  <Trans
                    i18nKey="copays.balanceOverdue.description"
                    components={{ b: <TextView variant="MobileBodyBold" /> }}
                    values={{ date: formattedDate, amount: numberToUSDollars(copayInfo.balance ?? 0) }}
                  />
                </TextView>
              </AlertWithHaptics>
            </Box>
          )}
          <Box
            pb={theme.dimensions.condensedMarginBetween}
            mx={theme.dimensions.gutter}
            mb={theme.dimensions.condensedMarginBetween}>
            <MultiTouchCard mainContent={mainContent} />
          </Box>
          <RecentStatementCharges copay={copay} />
          <PreviousPDFStatements statements={previousSortedFacilityCopays} downloadStatement={downloadStatement} />
          <StatementAddresses copay={copay} facilityName={copayInfo.facilityName} />
          <NoticeOfRightsButton />
          {renderHelpContent()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default CopayDetailsScreen
