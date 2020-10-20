import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { ButtonList, ButtonListItemObj, TextView } from 'components'
import { useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

const PersonalInformationScreen: FC = () => {
  const t = useTranslation('profile')
  const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

  console.log('PROFILE DATA IS ', profile)

  const getPersonalInformationData = (): Array<ButtonListItemObj> => {
    const dateOfBirthTextIDs = ['personalInformationScreen.dateOfBirth']
    const genderTextIDs = ['personalInformationScreen.gender']

    if (profile && profile.birthDate) {
      dateOfBirthTextIDs.push(profile.birthDate)
    } else {
      dateOfBirthTextIDs.push('personalInformationScreen.informationNotAvailable')
    }

    if (profile && profile.gender) {
      genderTextIDs.push(profile.gender)
    } else {
      genderTextIDs.push('personalInformationScreen.informationNotAvailable')
    }

    return [
      { textIDs: dateOfBirthTextIDs, a11yHintID: '' },
      { textIDs: genderTextIDs, a11yHintID: '' },
    ]
  }

  return (
    <ScrollView>
      <ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
      <TextView variant="MobileBody" ml={20} mt={20} mr={25} mb={12}>
        {t('personalInformationScreen.editNote')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mr={25} mb={4}>
        {t('personalInformationScreen.title')}
      </TextView>
      <ButtonList items={getPersonalInformationData()} translationNameSpace="profile" />
      <TextView variant="MobileBody" color="link" textDecoration="underline" textDecorationColor="link" ml={20} mt={15} mr={47} mb={20}>
        {t('personalInformationScreen.howDoIUpdatePersonalInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mr={25}>
        {t('personalInformationScreen.addresses')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={43} mr={25}>
        {t('personalInformationScreen.phoneNumbers')}
      </TextView>
      <TextView variant="MobileBody" color="link" textDecoration="underline" textDecorationColor="link" ml={20} mt={15} mr={47} mb={20}>
        {t('personalInformationScreen.howWillYouUseContactInfo')}
      </TextView>
      <TextView variant="TableHeaderBold" ml={20} mt={8} mr={25}>
        {t('personalInformationScreen.contactEmailAddress')}
      </TextView>
      <TextView variant="TableHeaderLabel" mx={20} mt={10}>
        {t('personalInformationScreen.thisIsEmailWeUseToContactNote')}
      </TextView>
    </ScrollView>
  )
}

export default PersonalInformationScreen
