import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { LocationData } from '@department-of-veterans-affairs/mobile-component-library/src/utils/OSfunctions'

import {
  AccordionCollapsible,
  Box,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  TextArea,
  TextView,
  VABulletList,
  VABulletListText,
} from 'components'
import PhoneNumberComponent from 'components/PhoneNumberComponent'
import { NAMESPACE } from 'constants/namespaces'
import { InfoRowCopay } from 'screens/PaymentsScreen/Copays/PayBill/InfoRowCopay'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getMedicalCenterNameByID } from 'utils/copays'
import getEnv from 'utils/env'
import { numberToUSDollars } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type PayBillScreenProps = StackScreenProps<PaymentsStackParamList, 'PayBill'>

const { LINK_URL_ASK_VA_GOV } = getEnv()

function splitAccountNumber(raw?: string): string[] {
  const acct = (raw || '').trim()
  if (!acct) return ['', '', '', '', '']

  const delimParts = acct.split(/[^A-Za-z0-9]+/).filter(Boolean)
  if (delimParts.length >= 5) return delimParts.slice(0, 5)
  if (delimParts.length > 1) {
    while (delimParts.length < 5) delimParts.push('')
    return delimParts
  }

  const s = acct.replace(/[^A-Za-z0-9]/g, '')
  const p1 = s.slice(0, 3)
  const p2 = s.slice(3, 7)
  const p3 = s.slice(7, 11)
  const p4 = s.slice(11, 16)
  const p5 = s.slice(16)
  return [p1, p2, p3, p4, p5].map((x) => x || '')
}

function PayBillScreen({ route, navigation }: PayBillScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { gutter, cardPadding, condensedMarginBetween, contentMarginBottom, standardMarginBetween } = theme.dimensions

  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'CopayDetails' ? t('copays.details.title') : t('copays.title')

  const copay = route.params?.copay
  const currentBalance: number = copay?.pHAmtDue ?? 0
  const accountNumber: string = copay?.accountNumber ?? ''

  const [part1, part2, part3, part4, part5] = splitAccountNumber(accountNumber)

  const facilityName =
    (copay?.station?.facilitYNum && getMedicalCenterNameByID(copay.station.facilitYNum)) ||
    copay?.station?.facilitYDesc ||
    ''

  const street = [copay?.station?.staTAddress1, copay?.station?.staTAddress2, copay?.station?.staTAddress3]
    .filter((s) => !!s && s.trim().length > 0)
    .join(' ')
    .trim()

  const city = copay?.station?.city?.trim() || ''
  const state = copay?.station?.state?.trim() || ''
  const zipCode = copay?.station?.ziPCde?.trim() || ''

  const hasFullAddress = !!(street && city && state && zipCode)

  const locationData: LocationData | undefined = hasFullAddress
    ? { name: facilityName, address: { street, city, state, zipCode } }
    : undefined

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('copays.payBill.title')}
      testID="payBillTestID"
      backLabelTestID="payBillBackTestID">
      <>
        {/* Pay online block */}
        <Box mb={condensedMarginBetween}>
          <TextArea>
            <TextView mb={condensedMarginBetween} variant="MobileBodyBold">
              {t('copays.payBill.intro')}
            </TextView>
            {/* TODO(merge-900): replace with shared InfoRow/InlineCopyLink + @react-native-clipboard/clipboard */}
            <InfoRowCopay
              label={t('copays.payBill.currentBalance')}
              value={numberToUSDollars(currentBalance)}
              copyable
              testID="row-copay-current-balance"
            />

            <InfoRowCopay label={t('copays.payBill.part1')} value={part1} copyable={!!part1} testID="row-copay-part1" />
            <InfoRowCopay label={t('copays.payBill.part2')} value={part2} copyable={!!part2} testID="row-copay-part2" />
            <InfoRowCopay label={t('copays.payBill.part3')} value={part3} copyable={!!part3} testID="row-copay-part3" />
            <InfoRowCopay label={t('copays.payBill.part4')} value={part4} copyable={!!part4} testID="row-copay-part4" />
            <InfoRowCopay label={t('copays.payBill.part5')} value={part5} copyable={!!part5} testID="row-copay-part5" />

            <LinkWithAnalytics
              type="url"
              url={LINK_URL_ASK_VA_GOV}
              text={t('copays.payBill.payOnPayGov')}
              a11yLabel={a11yLabelVA(t('copays.payBill.payOnPayGov'))}
              a11yHint={t('copays.payBill.payOnPayGov')}
              testID="payOnVAGovID"
            />
          </TextArea>
        </Box>

        {/* Other ways to pay */}
        <Box mb={contentMarginBottom}>
          <Box px={gutter} py={cardPadding}>
            <TextView variant="BitterHeading">{t('copays.payBill.otherWaysHeader')}</TextView>
          </Box>

          {/* Pay by phone */}
          <AccordionCollapsible
            testID="accordion-copay-pay-by-phone"
            header={
              <Box>
                <TextView variant="MobileBodyBold">{t('copays.payBill.payByPhone')}</TextView>
              </Box>
            }
            expandedContent={
              <Box>
                <Trans
                  i18nKey="copays.payBill.phone.copy"
                  components={{
                    p: <TextView my={condensedMarginBetween} variant="MobileBody" />,
                    tel: <PhoneNumberComponent variant="standalone" ttyBypass={false} />,
                    tty: <PhoneNumberComponent variant="standalone" />,
                  }}
                />
              </Box>
            }
          />

          {/* Pay by mail */}
          <AccordionCollapsible
            testID="accordion-copay-pay-by-mail"
            header={
              <Box>
                <TextView variant="MobileBodyBold">{t('copays.payBill.payByMail')}</TextView>
              </Box>
            }
            expandedContent={
              <Box pb={cardPadding}>
                <TextView variant="MobileBodyBold" mt={standardMarginBetween}>
                  {t('copays.payBill.mail.itemsHeader')}
                </TextView>
                <Box mt={standardMarginBetween}>
                  <VABulletList
                    paragraphSpacing
                    listOfText={
                      [
                        {
                          text: t('copays.payBill.mail.item1'),
                          boldedText: t('copays.payBill.mail.and'),
                        },
                        { text: t('copays.payBill.mail.item2') },
                      ] as VABulletListText[]
                    }
                  />
                </Box>

                <TextView variant="MobileBody">
                  <TextView variant="MobileBodyBold">{t('copays.payBill.mail.noteHeader')} </TextView>
                  {t('copays.payBill.mail.noteCopy')}
                </TextView>

                <TextView mt={standardMarginBetween} variant="MobileBodyBold">
                  {t('copays.payBill.mail.printHeader')}
                </TextView>
                <Box mt={condensedMarginBetween}>
                  <VABulletList
                    paragraphSpacing
                    listOfText={
                      [
                        { text: t('copays.payBill.mail.printItem1') },
                        { text: t('copays.payBill.mail.printItem2') },
                      ] as VABulletListText[]
                    }
                  />
                </Box>

                <TextView variant="MobileBodyBold">{t('copays.payBill.mail.addressHeader')}</TextView>
                <Box mt={condensedMarginBetween}>
                  <TextView variant="MobileBody">{t('copays.payBill.mail.addr1')}</TextView>
                  <TextView variant="MobileBody">{t('copays.payBill.mail.addr2')}</TextView>
                  <TextView variant="MobileBody">{t('copays.payBill.mail.addr3')}</TextView>
                  <TextView variant="MobileBody">{t('copays.payBill.mail.addr4')}</TextView>
                </Box>
              </Box>
            }
          />

          {/* Pay in person */}
          <AccordionCollapsible
            testID="accordion-copay-pay-in-person"
            header={
              <Box>
                <TextView variant="MobileBodyBold">{t('copays.payBill.payInPerson')}</TextView>
              </Box>
            }
            expandedContent={
              <Box pb={cardPadding}>
                <TextView variant="MobileBody" mt={standardMarginBetween}>
                  {t('copays.payBill.inPerson.visit', { facility: facilityName })}
                </TextView>

                <TextView variant="MobileBodyBold" mt={standardMarginBetween}>
                  {t('copays.payBill.inPerson.bringHeader')}
                </TextView>
                <Box mt={condensedMarginBetween}>
                  <VABulletList
                    paragraphSpacing
                    listOfText={
                      [
                        { text: t('copays.payBill.inPerson.bringItem1') },
                        { text: t('copays.payBill.inPerson.bringItem2') },
                      ] as VABulletListText[]
                    }
                  />
                </Box>

                <TextView mt={condensedMarginBetween} variant="MobileBody">
                  <TextView variant="MobileBodyBold">{t('copays.payBill.inPerson.noteHeader')} </TextView>
                  {t('copays.payBill.inPerson.noteCopy')}
                </TextView>

                <Box mt={condensedMarginBetween}>
                  <LinkWithAnalytics
                    type="directions"
                    locationData={locationData as LocationData}
                    text={t('directions')}
                    a11yLabel={t('directions')}
                    a11yHint={t('directions.a11yHint')}
                    testID="copay-in-person-directions"
                  />
                </Box>
              </Box>
            }
          />
        </Box>
      </>
    </FeatureLandingTemplate>
  )
}

export default PayBillScreen
