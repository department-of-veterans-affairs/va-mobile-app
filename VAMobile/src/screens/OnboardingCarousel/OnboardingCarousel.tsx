import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Carousel } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { capitalizeWord } from 'utils/formattingUtils'
import { completeFirstTimeLogin } from 'store/actions'
import { useTranslation } from 'utils/hooks'
import GenericOnboarding from './GenericOnboarding/GenericOnboarding'

const OnboardingProfile: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return (
    <GenericOnboarding header={t('onboarding.guessworkOutOfProfile')} text={t('onboarding.getMostOfProfile')} testID="Onboarding-profile-page" iconToDisplay="ProfileUnselected" />
  )
}

const OnboardingClaimsAndAppeals: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return (
    <GenericOnboarding
      header={t('onboarding.learnMoreAboutClaimsAndAppeals')}
      text={t('onboarding.getMostOfClaimsAndAppeals')}
      testID="Onboarding-claims-and-Appeals-page"
      iconToDisplay="ClaimsUnselected"
    />
  )
}

const OnboardingAppointments: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return (
    <GenericOnboarding
      header={t('onboarding.manageAppointments')}
      text={t('onboarding.getMostOfAppointments')}
      testID="Onboarding-appointments-page"
      iconToDisplay="HealthUnselected"
    />
  )
}

const OnboardingAppOverview: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const firstName = profile?.firstName ? `${capitalizeWord(profile?.firstName)}` : ''

  return (
    <GenericOnboarding
      header={t('onboarding.welcomeMessage', { firstName })}
      headerA11yLabel={t('onboarding.welcomeMessageA11yLabel', { firstName })}
      text={t('onboarding.allInformationYouNeed')}
      testID="Onboarding-app-overview-page"
      iconToDisplay="Logo"
    />
  )
}

const OnboardingCarousel: FC = () => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.LOGIN)

  const onCarouselEnd = (): void => {
    dispatch(completeFirstTimeLogin())
  }

  const screenList = [
    {
      name: 'OnboardingAppOverview',
      component: OnboardingAppOverview,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 1 }),
        continueHint: t('onboarding.continueA11yHint.claimsAndAppealsOnboarding'),
      },
    },
    {
      name: 'OnboardingClaimsAndAppeals',
      component: OnboardingClaimsAndAppeals,
      a11yHints: {
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 2 }),
        continueHint: t('onboarding.continueA11yHint.appointmentsOnboarding'),
        backHint: t('onboarding.previousA11yHint.OnboardingAppOverview'),
      },
    },
    {
      name: 'OnboardingAppointments',
      component: OnboardingAppointments,
      a11yHints: {
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 3 }),
        continueHint: t('onboarding.continueA11yHint.profileOnboarding'),
        backHint: t('onboarding.previousA11yHint.OnboardingClaimsAndAppeals'),
      },
    },
    {
      name: 'OnboardingProfile',
      component: OnboardingProfile,
      a11yHints: {
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 4 }),
        doneHint: t('onboarding.skipA11yHint'),
        backHint: t('onboarding.previousA11yHint.OnboardingAppointments'),
      },
    },
  ]

  return <Carousel screenList={screenList} onCarouselEnd={onCarouselEnd} translation={t} />
}

export default OnboardingCarousel
