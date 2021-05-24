import { useDispatch, useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Carousel, VABulletListText } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { capitalizeWord } from 'utils/formattingUtils'
import { completeFirstTimeLogin } from 'store/actions'
import { useTranslation } from 'utils/hooks'
import GenericOnboarding from './GenericOnboarding/GenericOnboarding'

const OnboardingProfile: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return <GenericOnboarding header={t('onboarding.guessworkOutOfProfile')} text={t('onboarding.getMostOfProfile')} testID="Onboarding-profile-page" />
}

const OnboardingClaimsAndAppeals: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  return <GenericOnboarding header={t('onboarding.learnMoreAboutClaimsAndAppeals')} text={t('onboarding.getMostOfClaimsAndAppeals')} testID="Onboarding-claims-and-Appeals-page" />
}

const OnboardingAppointments: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  const bullets: Array<VABulletListText> = [
    {
      text: t('onboarding.appointments.manageCalendar'),
      color: 'primaryContrast',
    },
    {
      text: t('onboarding.appointments.joinVideoAppointments'),
      color: 'primaryContrast',
    },
  ]
  return <GenericOnboarding header={t('onboarding.manageAppointments')} listOfText={bullets} testID="Onboarding-appointments-page" />
}

const OnboardingAppOverview: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const firstName = profile?.firstName ? `, ${capitalizeWord(profile?.firstName)}` : ''

  return (
    <GenericOnboarding
      header={t('onboarding.welcomeMessage', { firstName })}
      headerA11yLabel={t('onboarding.welcomeMessageA11yLabel', { firstName })}
      text={t('onboarding.allInformationYouNeed')}
      textA11yLabel={t('onboarding.allInformationYouNeed.a11yLabel')}
      testID="Onboarding-app-overview-page"
      displayLogo={true}
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
        continueHint: t('onboarding.continueA11yHint.appointmentsOnboarding'),
      },
    },
    {
      name: 'OnboardingAppointments',
      component: OnboardingAppointments,
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
