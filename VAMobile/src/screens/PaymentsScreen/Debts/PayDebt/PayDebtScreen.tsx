import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import {
  Box,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  TextArea,
  TextView,
  VABulletList,
  VABulletListText,
} from 'components'
import AccordionCollapsible from 'components/AccordionCollapsible'
import PhoneNumberComponent from 'components/PhoneNumberComponent'
import { NAMESPACE } from 'constants/namespaces'
import { InfoRow } from 'screens/PaymentsScreen/Debts/PayDebt/InfoRow'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { numberToUSDollars } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type PayDebtScreenProps = StackScreenProps<PaymentsStackParamList, 'PayDebt'>

function PayDebtScreen({ route, navigation }: PayDebtScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'DebtDetails' ? t('debts.overpayment') : t('debts')

  const { debt } = route.params
  const { condensedMarginBetween } = theme.dimensions

  const currentBalance = debt.attributes.currentAr ?? 0
  const fileNumber = debt.attributes.fileNumber ?? ''
  const payeeNumber = debt.attributes.payeeNumber ?? ''
  const personEntitled = debt.attributes.personEntitled ?? ''
  const deductionCode = debt.attributes.deductionCode ?? ''

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('debts.payDebt.title')}
      testID="payDebtTestID"
      backLabelTestID="payDebtBackTestID">
      <>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBodyBold">
              {t('debts.payDebt.intro')}
            </TextView>
            <InfoRow
              label={t('debts.payDebt.currentBalance')}
              value={numberToUSDollars(currentBalance)}
              copyable
              testID="row-current-balance"
            />

            <InfoRow label={t('debts.payDebt.fileNumber')} value={fileNumber} copyable testID="row-file-number" />

            <InfoRow label={t('debts.payDebt.payeeNumber')} value={payeeNumber} copyable testID="row-payee-number" />

            <InfoRow
              label={t('debts.payDebt.personEntitled')}
              value={personEntitled}
              copyable
              testID="row-person-entitled"
            />

            <InfoRow label={t('debts.payDebt.deductionCode')} value={deductionCode} />

            <Box mt={12} mb={20}>
              <LinkWithAnalytics
                type="custom"
                text={t('debts.payDebt.termsLink')}
                onPress={() => navigateTo('TermDefinitions', { screenType: 'name' })}
                testID="termDefinitionsID"
              />
            </Box>

            <LinkWithAnalytics
              type="url"
              url={'https://www.pay.va.gov/'}
              text={t('debts.payDebt.payOnSite')}
              a11yLabel={a11yLabelVA(t('debts.payDebt.payOnSite'))}
              a11yHint={t('debts.payDebt.payOnSite')}
              testID="payOnVAGovID"
            />
          </TextArea>
        </Box>
        <Box mb={theme.dimensions.contentMarginBottom}>
          <Box px={theme.dimensions.gutter} py={theme.dimensions.cardPadding}>
            <TextView variant="BitterHeading">{t('debts.payDebt.otherWaysHeader')}</TextView>
          </Box>

          {/* --- Pay by phone accordion --- */}
          <AccordionCollapsible
            testID="accordion-pay-by-phone"
            header={
              <Box>
                <TextView variant="MobileBodyBold">{t('debts.payDebt.payByPhone')}</TextView>
              </Box>
            }
            expandedContent={
              <Box>
                <Trans
                  i18nKey={'debts.payDebt.howToPay.payByPhone'}
                  components={{
                    header: <TextView variant="MobileBodyBold" accessibilityRole="header" />,
                    p: <TextView my={condensedMarginBetween} variant="MobileBody" />,
                    tel: <PhoneNumberComponent variant="standalone" ttyBypass={true} />,
                    tty: <PhoneNumberComponent variant="standalone" />,
                  }}
                />
              </Box>
            }
          />

          {/* --- Pay by mail accordion --- */}
          <AccordionCollapsible
            testID="accordion-pay-by-mail"
            header={
              <Box>
                <TextView variant="MobileBodyBold">{t('debts.payDebt.payByMail')}</TextView>
              </Box>
            }
            expandedContent={
              <Box py={theme.dimensions.cardPadding}>
                <TextView variant="MobileBodyBold">{t('debts.payDebt.mail.itemsHeader')}</TextView>
                <Box mt={theme.dimensions.condensedMarginBetween}>
                  <VABulletList
                    paragraphSpacing={true}
                    listOfText={
                      [
                        {
                          text: t('debts.payDebt.mail.item1'),
                        },
                        {
                          text: t('debts.payDebt.mail.item2'),
                        },
                      ] as VABulletListText[]
                    }
                  />
                </Box>
                <TextView variant="MobileBodyBold">{t('debts.payDebt.mail.addressHeader')}</TextView>
                <Box>
                  <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
                    {t('debts.payDebt.mail.line1')}
                  </TextView>
                  <TextView variant="MobileBody">{t('debts.payDebt.mail.line2')}</TextView>
                  <TextView variant="MobileBody">{t('debts.payDebt.mail.line3')}</TextView>
                  <TextView variant="MobileBody">{t('debts.payDebt.mail.line4')}</TextView>
                  <TextView variant="MobileBody">{t('debts.payDebt.mail.line5')}</TextView>
                </Box>
              </Box>
            }
          />
        </Box>
      </>
    </FeatureLandingTemplate>
  )
}

export default PayDebtScreen
