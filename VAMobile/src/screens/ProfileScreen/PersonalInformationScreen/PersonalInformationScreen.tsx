import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { PersonalInformationState, StoreState } from 'store/reducers'
import { PhoneData, PhoneTypeConstants, ProfileFormattedFieldType, UserDataProfile } from 'store/api/types'

import { DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, TextLine, TextView, TextViewProps, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { generateTestID } from 'utils/common'
import { getProfileInfo } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/ProfileScreen/AddressSummary'
import ProfileBanner from '../ProfileBanner'

const getPersonalInformationData = (profile: UserDataProfile | undefined, t: TFunction): Array<DefaultListItemObj> => {
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
    textIDs.push({ text: t('personalInformation.addYour', { field: t(`personalInformation.${phoneType}`) }) })
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
): Array<DefaultListItemObj> => {
  let homeText: Array<TextLine> = [{ text: t('personalInformation.home'), variant: 'MobileBodyBold' }]
  let workText: Array<TextLine> = [{ text: t('personalInformation.work'), variant: 'MobileBodyBold' }]
  let cellText: Array<TextLine> = [{ text: t('personalInformation.mobile'), variant: 'MobileBodyBold' }]
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

const getEmailAddressData = (profile: UserDataProfile | undefined, t: TFunction, onEmailAddress: () => void): Array<DefaultListItemObj> => {
  const textLines: Array<TextLine> = [{ text: t('personalInformation.emailAddress'), variant: 'MobileBodyBold' }]

  if (profile?.contactEmail?.emailAddress) {
    textLines.push({ text: t('personalInformation.dynamicField', { field: profile.contactEmail.emailAddress }) })
  } else {
    textLines.push({ text: t('personalInformation.addYour', { field: t('personalInformation.emailAddress').toLowerCase() }) })
  }

  return [{ textLines: textLines, a11yHintText: t('personalInformation.editOrAddEmailAddress'), onPress: onEmailAddress }]
}

type PersonalInformationScreenProps = StackScreenProps<ProfileStackParamList, 'PersonalInformation'>

const PersonalInformationScreen: FC<PersonalInformationScreenProps> = () => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const { profile, loading, needsDataLoad } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const { contentMarginTop, contentMarginBottom, gutter, standardMarginBetween, condensedMarginBetween } = theme.dimensions

  const navigateTo = useRouteNavigation()

  useFocusEffect(
    React.useCallback(() => {
      if (needsDataLoad) {
        dispatch(getProfileInfo(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID))
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
    phoneType: PhoneTypeConstants.HOME,
    phoneData: profile ? profile.homePhoneNumber : ({} as PhoneData),
  })

  const onWorkPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.workPhoneTitle'),
    phoneType: PhoneTypeConstants.WORK,
    phoneData: profile ? profile.workPhoneNumber : ({} as PhoneData),
  })

  const onCellPhone = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.cellPhoneTitle'),
    phoneType: PhoneTypeConstants.MOBILE,
    phoneData: profile ? profile.mobilePhoneNumber : ({} as PhoneData),
  })

  const onFax = navigateTo('EditPhoneNumber', {
    displayTitle: t('editPhoneNumber.faxPhoneTitle'),
    phoneType: PhoneTypeConstants.FAX,
    phoneData: profile ? profile.faxNumber : ({} as PhoneData),
  })

  const onEmailAddress = navigateTo('EditEmail')

  const linkProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    mx: gutter,
    mt: standardMarginBetween,
  }

  const addressData: Array<addressDataField> = [
    { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onMailingAddress },
    { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onResidentialAddress },
  ]

  if (useError(ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID)) {
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
    <VAScrollView {...testIdProps('Personal-information-page')}>
      <ProfileBanner />
      <TextView {...testIdProps(t('personalInformation.editNoteA11yLabel'))} variant="MobileBody" mx={gutter} mt={contentMarginTop}>
        {t('personalInformation.editNote')}
      </TextView>

      <DefaultList items={getPersonalInformationData(profile, t)} title={t('personalInformation.headerTitle')} />

      <Pressable
        onPress={navigateTo('HowDoIUpdate')}
        {...testIdProps(generateTestID(t('personalInformation.howDoIUpdatePersonalInfo'), ''))}
        accessibilityRole="link"
        accessible={true}>
        <TextView {...linkProps}>{t('personalInformation.howDoIUpdatePersonalInfo')}</TextView>
      </Pressable>

      <AddressSummary addressData={addressData} title={t('personalInformation.addresses')} />

      <DefaultList items={getPhoneNumberData(profile, t, onHomePhone, onWorkPhone, onCellPhone, onFax)} title={t('personalInformation.phoneNumbers')} />

      <Pressable
        onPress={navigateTo('HowWillYou')}
        {...testIdProps(generateTestID(t('personalInformation.howWillYouUseContactInfo'), ''))}
        accessibilityRole="link"
        accessible={true}>
        <TextView {...linkProps}>{t('personalInformation.howWillYouUseContactInfo')}</TextView>
      </Pressable>

      <DefaultList items={getEmailAddressData(profile, t, onEmailAddress)} title={t('personalInformation.contactEmailAddress')} />
      <TextView variant="TableHeaderLabel" mx={gutter} mt={condensedMarginBetween} mb={contentMarginBottom}>
        {t('personalInformation.thisIsEmailWeUseToContactNote')}
      </TextView>
    </VAScrollView>
  )
}

export default PersonalInformationScreen
