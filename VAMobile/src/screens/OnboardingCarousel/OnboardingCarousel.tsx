import React from 'react'
import { useTranslation } from 'react-i18next'

import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { Carousel, CarouselScreen, TextLine } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeFirstTimeLogin } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { capitalizeWord } from 'utils/formattingUtils'
import { useAppDispatch } from 'utils/hooks'

import GenericOnboarding from './GenericOnboarding/GenericOnboarding'

function OnboardingPayments() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const paymentsTextLines: Array<TextLine> = [
    {
      text: t('onboarding.payments.directDeposit.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
    },
    {
      text: t('onboarding.payments.paymentHistory.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
    },
  ]
  return (
    <GenericOnboarding
      header={t('onboarding.payments.header')}
      text={t('onboarding.payments.details')}
      listOfText={paymentsTextLines}
    />
  )
}

function OnboardingBenefits() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const benefitsTextLines: Array<TextLine> = [
    {
      text: t('onboarding.benefits.disability.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
    },
    {
      text: t('onboarding.benefits.claimsAndAppeals.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
    },
    {
      text: t('onboarding.benefits.commonLetters.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
      a11yLabel: a11yLabelVA(t('onboarding.benefits.commonLetters.bullet')),
    },
  ]
  return (
    <GenericOnboarding
      header={t('onboarding.benefits.header')}
      text={t('onboarding.benefits.details')}
      listOfText={benefitsTextLines}
    />
  )
}

function OnboardingHealth() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const healthTextLines: Array<TextLine> = [
    {
      text: t('onboarding.health.details.prescriptions.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
    },
    {
      text: t('onboarding.health.details.communicate.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
    },
    {
      text: t('onboarding.health.details.appointments.bullet'),
      variant: 'MobileBody',
      color: 'primaryContrast',
    },
  ]

  return (
    <GenericOnboarding
      header={t('onboarding.health.header')}
      text={t('onboarding.health.details')}
      listOfText={healthTextLines}
    />
  )
}

function OnboardingAppOverview() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: personalInfo } = usePersonalInformation()
  const firstName = personalInfo?.firstName ? `${capitalizeWord(personalInfo?.firstName)}` : ''

  return (
    <GenericOnboarding
      header={t('onboarding.welcomeMessage', { firstName })}
      text={t('onboarding.allInformationYouNeed')}
      textA11yLabel={a11yLabelVA(t('onboarding.allInformationYouNeed'))}
      displayLogo={true}
      centerHeader={true}
    />
  )
}

function OnboardingCarousel() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const onCarouselEnd = (): void => {
    dispatch(completeFirstTimeLogin())
  }

  const screenList: Array<CarouselScreen> = [
    {
      name: 'OnboardingAppOverview',
      component: OnboardingAppOverview,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 1 }),
        continueHint: t('onboarding.continueA11yHint.healthOnboarding'),
      },
    },
    {
      name: 'OnboardingHealth',
      component: OnboardingHealth,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 2 }),
        continueHint: t('onboarding.continueA11yHint.benefitsOnboarding'),
        backHint: t('onboarding.backA11yHint.overviewOnboarding'),
      },
    },
    {
      name: 'OnboardingBenefits',
      component: OnboardingBenefits,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 3 }),
        continueHint: t('onboarding.continueA11yHint.paymentsOnboarding'),
        backHint: t('onboarding.backA11yHint.healthOnboarding'),
      },
    },
    {
      name: 'OnboardingPayments',
      component: OnboardingPayments,
      a11yHints: {
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 4 }),
        doneHint: t('onboarding.skipA11yHint'),
        backHint: t('onboarding.backA11yHint.benefitsOnboarding'),
      },
    },
  ]

  return <Carousel screenList={screenList} onCarouselEnd={onCarouselEnd} translation={t} />
}

export default OnboardingCarousel
