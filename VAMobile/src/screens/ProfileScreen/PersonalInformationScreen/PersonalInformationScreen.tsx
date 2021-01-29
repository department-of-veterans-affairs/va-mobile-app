import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { PersonalInformationState, StoreState } from 'store/reducers'
import { PhoneData, ProfileFormattedFieldType, UserDataProfile } from 'store/api/types'

import { ErrorComponent, List, ListItemObj, LoadingComponent, TextLine, TextView, TextViewProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../ProfileScreen'
import { ScreenIDs } from 'constants/screens'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { generateTestID } from 'utils/common'
import { getProfileInfo } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/ProfileScreen/AddressSummary'
import ProfileBanner from '../ProfileBanner'

const getPersonalInformationData = (profile: UserDataProfile | undefined, t: TFunction): Array<ListItemObj> => {
  const dateOfBirthTextIDs: Array<TextLine> = [{ text: t('personalInformation.dateOfBirth'), variant: 'MobileBodyBold' }]
  const genderTextIDs: Array<TextLine> = [{ text: t('personalInformation.gender'), variant: 'MobileBodyBold' }]

  if (profile && profile.birthDate) {
    const formattedBirthDate = formatDateMMMMDDYYYY(profile.birthDate)
    dateOfBirthTextIDs.push({ text: t('personalInformation.dynamicField', { field: formattedBirthDate }) })
  } else {
    dateOfBirthTextIDs.push({ text: t('personalInformation.informationNotAvailable') })
  }

  if (profile && profile.gender) {
    const text = profile.gender.toLowerCase() === 'm' ? t('personalInformation.male') : t('personalInformation.female')
    genderTextIDs.push({ text })
  } else {
    genderTextIDs.push({ text: t('personalInformation.informationNotAvailable') })
  }

  return [
    { textLines: dateOfBirthTextIDs, a11yHintText: '' },
    { textLines: genderTextIDs, a11yHintText: '' },
  ]
}

type phoneType = 'homePhoneNumber' | 'workPhoneNumber' | 'mobilePhoneNumber' | 'faxNumber'

const getTextForPhoneData = (profile: UserDataProfile | undefined, profileField: ProfileFormattedFieldType, phoneType: phoneType, t: TFunction): Array<TextLine> => {
  const textIDs: Array<TextLine> = []

  if (profile && profile[profileField]) {
    const extension = profile[phoneType].extension
    if (extension) {
      textIDs.push({ text: t('personalInformation.phoneWithExtension', { number: profile[profileField] as string, extension }) })
    } else {
      textIDs.push({ text: t('personalInformation.dynamicField', { field: profile[profileField] as string }) })
    }
  } else {
    textIDs.push({ text: t('personalInformation.pleaseAddYour', { field: t(`personalInformation.${phoneType}`) }) })
  }

  return textIDs
}

const getPhoneNumberData = (
  profile: UserDataProfile | undefined,
  t: TFunction,
  onHomePhone: () => void,
  onWorkPhone: () => void,
  onCellPhone: () => void,
  onFax: () => void,
): Array<ListItemObj> => {
  let homeText: Array<TextLine> = [{ text: t('personalInformation.home'), variant: 'MobileBodyBold' }]
  let workText: Array<TextLine> = [{ text: t('personalInformation.work'), variant: 'MobileBodyBold' }]
  let cellText: Array<TextLine> = [{ text: t('personalInformation.cell'), variant: 'MobileBodyBold' }]
  let faxText: Array<TextLine> = [{ text: t('personalInformation.faxTextIDs'), variant: 'MobileBodyBold' }]

  homeText = homeText.concat(getTextForPhoneData(profile, 'formattedHomePhone', 'homePhoneNumber', t))
  workText = workText.concat(getTextForPhoneData(profile, 'formattedWorkPhone', 'workPhoneNumber', t))
  cellText = cellText.concat(getTextForPhoneData(profile, 'formattedMobilePhone', 'mobilePhoneNumber', t))
  faxText = faxText.concat(getTextForPhoneData(profile, 'formattedFaxPhone', 'faxNumber', t))

  return [
    { textLines: homeText, a11yHintText: t('personalInformation.editOrAddHomeNumber'), onPress: onHomePhone },
    { textLines: workText, a11yHintText: t('personalInformation.editOrAddWorkNumber'), onPress: onWorkPhone },
    { textLines: cellText, a11yHintText: t('personalInformation.editOrAddCellNumber'), onPress: onCellPhone },
    { textLines: faxText, a11yHintText: t('personalInformation.editOrAddFaxNumber'), onPress: onFax },
  ]
}

const getEmailAddressData = (profile: UserDataProfile | undefined, t: TFunction, onEmailAddress: () => void): Array<ListItemObj> => {
  const textLines: Array<TextLine> = [{ text: t('personalInformation.emailAddress'), variant: 'MobileBodyBold' }]

  if (profile?.contactEmail?.emailAddress) {
    textLines.push({ text: t('personalInformation.dynamicField', { field: profile.contactEmail.emailAddress }) })
  } else {
    textLines.push({ text: t('personalInformation.pleaseAddYour', { field: t('personalInformation.emailAddress').toLowerCase() }) })
  }

  return [{ textLines: textLines, a11yHintText: t('personalInformation.editOrAddEmailAddress'), onPress: onEmailAddress }]
}

type PersonalInformationScreenProps = StackScreenProps<ProfileStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = () => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const { profile, loading, needsDataLoad } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const { contentMarginTop, contentMarginBottom, gutter, marginBetween, titleHeaderAndElementMargin } = theme.dimensions

  const navigateTo = useRouteNavigation()

  useFocusEffect(
    React.useCallback(() => {
      if (needsDataLoad) {
        dispatch(getProfileInfo(ScreenIDs.PERSONAL_INFORMATION_SCREEN_ID))
      }
    }, [dispatch, needsDataLoad]),
  )

  const onMailingAddress = navigateTo('EditAddress', {
    displayTitle: t('personalInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const onResidentialAddress = navigateTo('EditAddress', {
    displayTitle: t('personalInformation.residentialAddress'),
    addressType: profileAddressOptions.RESIDENTIAL_ADDRESS,
  })

  const onHomePhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.homePhoneTitle'),
    phoneType: 'HOME',
    phoneData: profile ? profile.homePhoneNumber : ({} as PhoneData),
  })

  const onWorkPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.workPhoneTitle'),
    phoneType: 'WORK',
    phoneData: profile ? profile.workPhoneNumber : ({} as PhoneData),
  })

  const onCellPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.cellPhoneTitle'),
    phoneType: 'MOBILE',
    phoneData: profile ? profile.mobilePhoneNumber : ({} as PhoneData),
  })

  const onFax = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.faxPhoneTitle'),
    phoneType: 'FAX',
    phoneData: profile ? profile.faxNumber : ({} as PhoneData),
  })

  const onEmailAddress = navigateTo('EditEmail')

  const linkProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    mx: gutter,
    mt: marginBetween,
    accessibilityRole: 'link',
  }

  const howDoIUpdateProps: TextViewProps = {
    ...linkProps,
    onPress: navigateTo('HowDoIUpdate'),
  }

  const howWillYouProps: TextViewProps = {
    ...linkProps,
    onPress: navigateTo('HowWillYou'),
  }

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onMailingAddress },
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  const headerProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mx: gutter,
    mb: titleHeaderAndElementMargin,
    mt: marginBetween,
    accessibilityRole: 'header',
  }

  if (useError(ScreenIDs.PERSONAL_INFORMATION_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (loading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  return (
    <ScrollView {...testIdProps('Personal-information-screen')}>
      <ProfileBanner />
      <TextView {...testIdProps(t('personalInformation.editNoteA11yLabel'))} variant="MobileBody" mx={gutter} mt={contentMarginTop}>
        {t('personalInformation.editNote')}
      </TextView>
      <TextView {...headerProps} {...testIdProps(generateTestID(t('personalInformation.headerTitle'), ''))}>
        {t('personalInformation.headerTitle')}
      </TextView>
      <List items={getPersonalInformationData(profile, t)} />
      <TextView {...howDoIUpdateProps} {...testIdProps(generateTestID(t('personalInformation.howDoIUpdatePersonalInfo'), ''))}>
        {t('personalInformation.howDoIUpdatePersonalInfo')}
      </TextView>
      <TextView {...headerProps} {...testIdProps(generateTestID(t('personalInformation.addresses'), ''))}>
        {t('personalInformation.addresses')}
      </TextView>
      <AddressSummary addressData={addressData} />
      <TextView {...headerProps} {...testIdProps(generateTestID(t('personalInformation.phoneNumbers'), ''))}>
        {t('personalInformation.phoneNumbers')}
      </TextView>
      <List items={getPhoneNumberData(profile, t, onHomePhone, onWorkPhone, onCellPhone, onFax)} />
      <TextView {...howWillYouProps} {...testIdProps(generateTestID(t('personalInformation.howWillYouUseContactInfo'), ''))}>
        {t('personalInformation.howWillYouUseContactInfo')}
      </TextView>
      <TextView {...headerProps} {...testIdProps(generateTestID(t('personalInformation.contactEmailAddress'), ''))}>
        {t('personalInformation.contactEmailAddress')}
      </TextView>
      <List items={getEmailAddressData(profile, t, onEmailAddress)} />
      <TextView variant="TableHeaderLabel" mx={gutter} mt={titleHeaderAndElementMargin} mb={contentMarginBottom}>
        {t('personalInformation.thisIsEmailWeUseToContactNote')}
      </TextView>
    </ScrollView>
  )
}

export default PersonalInformationScreen
