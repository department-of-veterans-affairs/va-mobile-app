import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { Carousel } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeFirstTimeLogin } from 'store/actions'
import { useTranslation } from 'utils/hooks'
import GenericOnboarding from './GenericOnboarding/GenericOnboarding'
import OnboardingAppOverview from './OnboardingAppOverview/OnboardingAppOverview'

const OnboardingAppointment: FC = () => {
  return (
    <GenericOnboarding
      header={'Easily track your appointments'}
      text={'Get the most out of your appointments by schedule listing, as well using push notifications, and lastly, joining them remotely from your app if scheduled.'}
    />
  )
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
      },
    },
    {
      name: 'OnboardingClaimsAndAppeals',
      component: OnboardingAppOverview,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 3 }),
      },
    },
    {
      name: 'OnboardingProfile',
      component: OnboardingAppOverview,
      a11yHints: {
        skipHint: t('onboarding.skipA11yHint'),
        carouselIndicatorsHint: t('onboarding.progressBarA11yHint.viewingPage', { currPage: 4 }),
      },
    },
  ]

  return <Carousel screenList={screenList} onCarouselEnd={onCarouselEnd} translation={t} />
}

export default OnboardingCarousel
