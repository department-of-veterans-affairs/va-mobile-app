import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { Carousel } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeFirstTimeLogin } from 'store/actions'
import { useTranslation } from 'utils/hooks'
import GenericOnboarding from './GenericOnboarding/GenericOnboarding'
import OnboardingAppOverview from './OnboardingAppOverview/OnboardingAppOverview'

const OnboardingProfile: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return <GenericOnboarding header={t('onboarding.guessworkOutOfProfile')} text={t('onboarding.getMostOfProfile')} testID="Onboarding: Profile" />
}

const OnboardingClaimsAndAppeals: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return <GenericOnboarding header={t('onboarding.learnMoreAboutClaimsAndAppeals')} text={t('onboarding.getMostOfClaimsAndAppeals')} testID="Onboarding: Claims and Appeals" />
}

const OnboardingAppointment: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return <GenericOnboarding header={t('onboarding.trackAppointments')} text={t('onboarding.getMostOfAppointments')} testID="Onboarding: Appointments" />
}

const OnboardingCarousel: FC = () => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.LOGIN)

  const onCarouselEnd = (): void => {
    dispatch(completeFirstTimeLogin())
  }

  // TODO: update components w/ remaining onboarding screens
  const screenList = [
    {
      name: 'OnboardingAppOverview',
      component: OnboardingAppOverview,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 1 }),
        continueHint: t('onboarding.continueA11yHint.appointmentsOnboarding'),
      },
    },
    {
      name: 'OnboardingAppointments',
      component: OnboardingAppointment,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 2 }),
        continueHint: t('onboarding.continueA11yHint.claimsAndAppealsOnboarding'),
      },
    },
    {
      name: 'OnboardingClaimsAndAppeals',
      component: OnboardingClaimsAndAppeals,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 3 }),
        continueHint: t('onboarding.continueA11yHint.profileOnboarding'),
      },
    },
    {
      name: 'OnboardingProfile',
      component: OnboardingProfile,
      a11yHints: {
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 4 }),
        continueHint: t('onboarding.skipA11yHint'),
      },
    },
  ]

  return <Carousel screenList={screenList} onCarouselEnd={onCarouselEnd} translation={t} />
}

export default OnboardingCarousel
