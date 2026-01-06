import React from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import {
  AccordionCollapsible,
  Box,
  ClickToCallPhoneNumber,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  TextView,
  VABulletList,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import VeteransCrisisLineNumbers from 'screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineNumbers/VeteransCrisisLineNumbers'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { vaGovWebviewTitle } from 'utils/webview'

const {
  LINK_URL_ASK_VA_GOV,
  LINK_URL_CONSUMER_GOV,
  LINK_URL_HELP_FROM_VA_ACCREDITED_REPRESENTATIVE,
  LINK_URL_MY_MONEY_GOV,
  LINK_URL_REQUEST_HARDSHIP_ASSISTANCE,
  LINK_URL_VA_FORM_5655,
  LINK_URL_VA_MENTAL_HEALTH_SERVICES,
  LINK_URL_VA_PRIVACY_POLICIES,
  LINK_URL_VETERANS_BENEFITS_BANKING,
  LINK_URL_WAIVERS_FOR_VA_BENEFIT_DEBT,
} = getEnv()

type NoticeOfRightsScreenProps = StackScreenProps<PaymentsStackParamList, 'NoticeOfRights'>

function NoticeOfRightsScreen({ navigation }: NoticeOfRightsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const backLabel = prevScreen === 'DebtDetails' ? t('debts.overpayment') : t('copays.details.title')

  function renderAskVALink() {
    return (
      <LinkWithAnalytics
        type="custom"
        onPress={() => {
          navigateTo('Webview', {
            url: LINK_URL_ASK_VA_GOV,
            displayTitle: vaGovWebviewTitle(t),
            loadingMessage: t('webview.askVA.loading'),
            useSSO: true,
          })
        }}
        text={t('debts.noticeOfRights.contactAskVA')}
        a11yLabel={a11yLabelVA(t('debts.noticeOfRights.contactAskVA'))}
        testID="debtsNoticeOfRightsContactAskVALinkID"
      />
    )
  }

  function renderCallSection() {
    return (
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <ClickToCallPhoneNumber phone={t('8008270648')} displayedText={displayedTextPhoneNumber(t('8008270648'))} />
        <TextView my={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('debts.help.questions.body.2')}
        </TextView>
        <ClickToCallPhoneNumber
          phone={t('16127136415')}
          displayedText={displayedTextPhoneNumber(t('16127136415'))}
          ttyBypass={true}
        />
      </Box>
    )
  }

  function renderCollection() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.collection.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.collection.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.collection.paragraph.2')}
            </TextView>
            <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.standardMarginBetween}>
              <VABulletList
                listOfText={[
                  { text: t('debts.noticeOfRights.collection.bullet.1') },
                  { text: t('debts.noticeOfRights.collection.bullet.2') },
                  { text: t('debts.noticeOfRights.collection.bullet.3') },
                ]}
              />
            </Box>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.collection.paragraph.3')}
            </TextView>
          </>
        }
      />
    )
  }

  function renderLateCharges() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.lateCharges.header')}
          </TextView>
        }
        expandedContent={
          <TextView mt={theme.dimensions.standardMarginBetween}>
            {t('debts.noticeOfRights.lateCharges.paragraph.1')}
          </TextView>
        }
      />
    )
  }

  function renderRightToDispute() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.rightToDispute.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToDispute.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToDispute.paragraph.2')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToDispute.paragraph.3')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToDispute.paragraph.4')}
            </TextView>
            {renderAskVALink()}
            <TextView mt={theme.dimensions.condensedMarginBetween}>{t('debts.help.questions.body.1')}</TextView>
            {renderCallSection()}
          </>
        }
      />
    )
  }

  function renderRightToRequestWaiver() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.rightToRequestWaiver.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToRequestWaiver.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToRequestWaiver.paragraph.2')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToRequestWaiver.paragraph.3')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToRequestWaiver.paragraph.4')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.rightToRequestWaiver.paragraph.5')}
            </TextView>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_WAIVERS_FOR_VA_BENEFIT_DEBT}
              text={t('debts.noticeOfRights.rightToRequestWaiver.learnMore')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.rightToRequestWaiver.learnMore'))}
              testID="debtsNoticeOfRightsWaiverLearnMoreLinkID"
            />
          </>
        }
      />
    )
  }

  function renderEffectOfWaiverRequest() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.effectOfWaiverRequest.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.effectOfWaiverRequest.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.effectOfWaiverRequest.paragraph.2')}
            </TextView>
          </>
        }
      />
    )
  }

  function renderOralHearing() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.oralHearing.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.oralHearing.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.oralHearing.paragraph.2')}
            </TextView>
          </>
        }
      />
    )
  }

  function renderCopaysHardship() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.copaysHardship.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.copaysHardship.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.copaysHardship.paragraph.2')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.copaysHardship.paragraph.3')}
            </TextView>
            <LinkWithAnalytics
              type="custom"
              onPress={() => {
                navigateTo('Webview', {
                  url: LINK_URL_REQUEST_HARDSHIP_ASSISTANCE,
                  displayTitle: vaGovWebviewTitle(t),
                  loadingMessage: t('webview.financialAssistance.loading'),
                  useSSO: true,
                })
              }}
              text={t('debts.noticeOfRights.copaysHardship.howToRequestAssistance')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.copaysHardship.howToRequestAssistance'))}
              testID="debtsNoticeOfRightscopaysHardshipLinkID"
            />
            <TextView mt={theme.dimensions.condensedMarginBetween}>
              {t('debts.noticeOfRights.copaysHardship.paragraph.4')}
            </TextView>
            {renderAskVALink()}
            <TextView mt={theme.dimensions.condensedMarginBetween}>{t('debts.help.questions.body.1')}</TextView>
            {renderCallSection()}
          </>
        }
      />
    )
  }

  function renderOverpaymentsHardship() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.overpaymentsHardship.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.overpaymentsHardship.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.overpaymentsHardship.paragraph.2')}
            </TextView>
            {renderCallSection()}
            <LinkWithAnalytics
              type="custom"
              onPress={() => {
                navigateTo('Webview', {
                  url: LINK_URL_VA_FORM_5655,
                  displayTitle: vaGovWebviewTitle(t),
                  loadingMessage: t('webview.form5655.loading'),
                  useSSO: true,
                })
              }}
              text={t('debts.noticeOfRights.overpaymentsHardship.form5655')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.overpaymentsHardship.form5655'))}
              testID="debtsNoticeOfRightsOverpaymentsHardshipForm5655LinkID"
            />
          </>
        }
      />
    )
  }

  function renderRepresentation() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.representation.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.representation.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.representation.paragraph.2')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.representation.paragraph.3')}
            </TextView>
            <LinkWithAnalytics
              type="custom"
              onPress={() => {
                navigateTo('Webview', {
                  url: LINK_URL_HELP_FROM_VA_ACCREDITED_REPRESENTATIVE,
                  displayTitle: vaGovWebviewTitle(t),
                  loadingMessage: t('webview.representative.loading'),
                  useSSO: true,
                })
              }}
              text={t('debts.noticeOfRights.representation.help')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.representation.help'))}
              testID="debtsNoticeOfRightsRepresentationHelpLinkID"
            />
            <TextView mt={theme.dimensions.condensedMarginBetween}>
              {t('debts.noticeOfRights.representation.paragraph.4')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.representation.paragraph.5')}
            </TextView>
          </>
        }
      />
    )
  }

  function renderQuestionsAboutPayments() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.questionsAboutPayments.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.questionsAboutPayments.paragraph.1')}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.questionsAboutPayments.paragraph.2')}
            </TextView>
            <TextView my={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.questionsAboutPayments.paragraph.3')}
            </TextView>
            <ClickToCallPhoneNumber phone={t('8664001238')} displayedText={displayedTextPhoneNumber(t('8664001238'))} />
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.questionsAboutPayments.paragraph.4')}
            </TextView>
            {renderCallSection()}
          </>
        }
      />
    )
  }

  function renderVAPrivacy() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.vaPrivacy.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView my={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.vaPrivacy.paragraph.1')}
            </TextView>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_VA_PRIVACY_POLICIES}
              text={t('debts.noticeOfRights.vaPrivacy.reviewPolicies')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.vaPrivacy.reviewPolicies'))}
              testID="debtsNoticeOfRightsVAPrivacyPoliciesLinkID"
            />
            <TextView mt={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.vaPrivacy.paragraph.2')}
            </TextView>
            <TextView my={theme.dimensions.standardMarginBetween}>
              {t('debts.noticeOfRights.vaPrivacy.paragraph.3')}
            </TextView>
          </>
        }
      />
    )
  }

  function renderManagingStress() {
    return (
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('debts.noticeOfRights.managingStress.header')}
          </TextView>
        }
        expandedContent={
          <>
            <TextView mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
              {t('debts.noticeOfRights.managingStress.paragraph.1')}
            </TextView>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_VA_MENTAL_HEALTH_SERVICES}
              text={t('debts.noticeOfRights.managingStress.mentalHealth')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.managingStress.mentalHealth'))}
              testID="debtsNoticeOfRightsVAMentalHealthServicesLinkID"
            />
            <TextView my={theme.dimensions.condensedMarginBetween}>
              {t('debts.noticeOfRights.managingStress.paragraph.2')}
            </TextView>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_VETERANS_BENEFITS_BANKING}
              text={t('debts.noticeOfRights.managingStress.bankingProgram')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.managingStress.bankingProgram'))}
              testID="debtsNoticeOfRightsVeteransBenefitsBankingLinkID"
            />
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_MY_MONEY_GOV}
              text={t('debts.noticeOfRights.managingStress.myMoneyGov')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.managingStress.myMoneyGov'))}
              testID="debtsNoticeOfRightsMyMoneyGovLinkID"
            />
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_CONSUMER_GOV}
              text={t('debts.noticeOfRights.managingStress.consumerGov')}
              a11yLabel={a11yLabelVA(t('debts.noticeOfRights.managingStress.consumerGov'))}
              testID="debtsNoticeOfRightsConsumerGovLinkID"
            />
            <TextView my={theme.dimensions.condensedMarginBetween}>
              {t('debts.noticeOfRights.managingStress.paragraph.3')}
            </TextView>
            <VeteransCrisisLineNumbers />
          </>
        }
      />
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('debts.noticeOfRights.title')}
      testID="noticeOfRightsTestID"
      backLabelTestID="noticeOfRightsBackTestID">
      {renderCollection()}
      {renderLateCharges()}
      {renderRightToDispute()}
      {renderRightToRequestWaiver()}
      {renderEffectOfWaiverRequest()}
      {renderOralHearing()}
      {renderCopaysHardship()}
      {renderOverpaymentsHardship()}
      {renderRepresentation()}
      {renderQuestionsAboutPayments()}
      {renderVAPrivacy()}
      {renderManagingStress()}
    </FeatureLandingTemplate>
  )
}

export default NoticeOfRightsScreen
