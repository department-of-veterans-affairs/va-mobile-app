import { ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AuthorizedServicesState, MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { Box, ErrorComponent, ListItemObj, LoadingComponent } from 'components'
import { List } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getProfileInfo, getServiceHistory } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useTranslation } from 'utils/hooks'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import ProfileBanner from './ProfileBanner'

type ProfileScreenProps = {}

export const PROFILE_SCREEN_ID = 'PROFILE_SCREEN'

const ProfileScreen: FC<ProfileScreenProps> = () => {
  const { directDepositBenefits, userProfileUpdate } = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)
  const { loading: militaryInformationLoading, needsDataLoad: militaryHistoryNeedsUpdate } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)
  const { needsDataLoad: personalInformationNeedsUpdate } = useSelector<StoreState, PersonalInformationState>((s) => s.personalInformation)

  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()

  /**
   * Function used on error to reload the data for this page. This combines all calls necessary to load the page rather
   * than checking the needsDataLoad flag because if something went wrong we assume we want to reload all of the necessary data
   */
  const getInfoTryAgain = (): void => {
    // Fetch the profile information
    dispatch(getProfileInfo(PROFILE_SCREEN_ID))
    // Get the service history to populate the profile banner
    dispatch(getServiceHistory(PROFILE_SCREEN_ID))
  }

  useEffect(() => {
    // Fetch the profile information
    if (personalInformationNeedsUpdate) {
      dispatch(getProfileInfo(PROFILE_SCREEN_ID))
    }
  }, [dispatch, personalInformationNeedsUpdate])

  useEffect(() => {
    // Get the service history to populate the profile banner
    if (militaryHistoryNeedsUpdate) {
      dispatch(getServiceHistory(PROFILE_SCREEN_ID))
    }
  }, [dispatch, militaryHistoryNeedsUpdate])

  const onPersonalAndContactInformation = navigateTo('PersonalInformation')

  const onMilitaryInformation = navigateTo('MilitaryInformation')

  const onDirectDeposit = navigateTo('DirectDeposit')

  const onLettersAndDocs = navigateTo('LettersOverview')

  const onSettings = navigateTo('Settings')

  const buttonDataList: Array<ListItemObj> = []
  if (userProfileUpdate) {
    buttonDataList.push({ textLines: t('personalInformation.title'), a11yHintText: t('personalInformation.a11yHint'), onPress: onPersonalAndContactInformation })
  }

  buttonDataList.push({ textLines: t('militaryInformation.title'), a11yHintText: t('militaryInformation.a11yHint'), onPress: onMilitaryInformation })

  // hide button if user does not have permission
  if (directDepositBenefits) {
    buttonDataList.push({ textLines: t('directDeposit.title'), a11yHintText: t('directDeposit.a11yHint'), onPress: onDirectDeposit })
  }

  buttonDataList.push(
    { textLines: t('lettersAndDocs.title'), a11yHintText: t('lettersAndDocs.a11yHint'), onPress: onLettersAndDocs },
    { textLines: t('settings.title'), a11yHintText: t('settings.a11yHint'), onPress: onSettings },
  )

  // pass in optional onTryAgain because this screen needs to dispatch two actions for its loading sequence
  if (useError(PROFILE_SCREEN_ID)) {
    return <ErrorComponent onTryAgain={getInfoTryAgain} />
  }

  if (militaryInformationLoading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  return (
    <ScrollView {...testIdProps('Profile-screen')}>
      <ProfileBanner />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <List items={buttonDataList} />
      </Box>
    </ScrollView>
  )
}

export default ProfileScreen
