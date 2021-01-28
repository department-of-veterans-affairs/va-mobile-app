import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { AlertBox, Box, LoadingComponent, SegmentedControl } from 'components'
import { ClaimEventData } from 'store/api/types'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { getAllClaimsAndAppeals } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import AppealDetailsScreen from './AppealDetailsScreen/AppealDetailsScreen'
import AskForClaimDecision from './ClaimDetailsScreen/ClaimStatus/AskForClaimDecision/AskForClaimDecision'
import ClaimDetailsScreen from './ClaimDetailsScreen/ClaimDetailsScreen'
import ClaimFileUpload from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/ClaimFileUpload'
import ClaimsAndAppealsListView, { ClaimType, ClaimTypeConstants } from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import ConsolidatedClaimsNote from './ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import SelectFile from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/SelectFile'
import TakePhotos from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/TakePhotos'
import UploadConfirmation from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/UploadConfirmation/UploadConfirmation'
import UploadFile from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import UploadOrAddPhotos from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'
import UploadSuccess from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/UploadSucesss/UploadSuccess'
import WhatDoIDoIfDisagreement from './ClaimDetailsScreen/ClaimStatus/WhatDoIDoIfDisagreement/WhatDoIDoIfDisagreement'

export type DocumentPickerResponse = {
  uri: string
  fileCopyUri: string
  copyError?: string
  type: string
  name: string
  size: number
}

export type ClaimsStackParamList = {
  Claims: undefined
  ClaimDetailsScreen: {
    claimID: string
    claimType: ClaimType
  }
  ConsolidatedClaimsNote: undefined
  WhatDoIDoIfDisagreement: undefined
  AppealDetailsScreen: {
    appealID: string
  }
  ClaimFileUpload: {
    requests: ClaimEventData[]
    claimID: string
    currentPhase: number
  }
  AskForClaimDecision: {
    claimID: string
  }
  TakePhotos: {
    request: ClaimEventData
  }
  SelectFile: {
    request: ClaimEventData
  }
  UploadOrAddPhotos: {
    request: ClaimEventData
    firstImageResponse: ImagePickerResponse
  }
  UploadFile: {
    request: ClaimEventData
    fileUploaded: DocumentPickerResponse
    imageUploaded: ImagePickerResponse
  }
  UploadConfirmation: {
    request: ClaimEventData
    filesList: Array<ImagePickerResponse> | Array<DocumentPickerResponse>
  }
  UploadSuccess: undefined
}

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { loadingAllClaimsAndAppeals, claimsServiceError, appealsServiceError } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  const controlValues = [t('claimsTab.active'), t('claimsTab.closed')]
  const accessibilityHints = [t('claims.viewYourActiveClaims'), t('claims.viewYourClosedClaims')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const claimType = selectedTab === t('claimsTab.active') ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED
  const claimsAndAppealsServiceErrors = !!claimsServiceError && !!appealsServiceError

  // load all claims and appeals and filter upon mount
  // let ClaimsAndAppealsListView handle subsequent filtering to avoid reloading all claims and appeals
  useEffect(() => {
    dispatch(getAllClaimsAndAppeals())
  }, [dispatch])

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  if (loadingAllClaimsAndAppeals) {
    return <LoadingComponent />
  }

  const serviceErrorAlert = (): ReactElement => {
    // if there is a claims service error or an appeals service error
    if (!!claimsServiceError || !!appealsServiceError) {
      let alertTitle, alertText

      // if both services failed
      if (claimsAndAppealsServiceErrors) {
        alertTitle = t('claimsAndAppeal.claimAndAppealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaimsAndAppeals')

        // if claims service fails but appeals did not
      } else if (!!claimsServiceError && !appealsServiceError) {
        alertTitle = t('claimsAndAppeal.claimStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaims')

        // if appeals service fails but claims does not
      } else if (!!appealsServiceError && !claimsServiceError) {
        alertTitle = t('claimsAndAppeal.appealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingAppeals')
      }

      return (
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
          <AlertBox title={alertTitle} text={alertText} border="error" background="noCardBackground" />
        </Box>
      )
    }

    return <></>
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start" mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} {...testIdProps('Claims-screen')}>
        {!claimsAndAppealsServiceErrors && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
            <SegmentedControl
              values={controlValues}
              titles={controlValues}
              onChange={setSelectedTab}
              selected={controlValues.indexOf(selectedTab)}
              accessibilityHints={accessibilityHints}
            />
          </Box>
        )}
        {serviceErrorAlert()}
        {!claimsAndAppealsServiceErrors && (
          <Box flex={1}>
            <ClaimsAndAppealsListView claimType={claimType} />
          </Box>
        )}
      </Box>
    </ScrollView>
  )
}

type IClaimsStackScreen = {}

const ClaimsStackScreen: FC<IClaimsStackScreen> = () => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const headerStyles = useHeaderStyles()

  return (
    <ClaimsStack.Navigator screenOptions={headerStyles}>
      <ClaimsStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claimsAndAppeals.title') }} />
      <ClaimsStack.Screen name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={{ title: t('claimDetails.title') }} />
      <ClaimsStack.Screen name="ConsolidatedClaimsNote" component={ConsolidatedClaimsNote} />
      <ClaimsStack.Screen name="WhatDoIDoIfDisagreement" component={WhatDoIDoIfDisagreement} />
      <ClaimsStack.Screen name="AppealDetailsScreen" component={AppealDetailsScreen} options={{ title: t('appealDetails.title') }} />
      <ClaimsStack.Screen name="ClaimFileUpload" component={ClaimFileUpload} options={{ title: t('fileUpload.title') }} />
      <ClaimsStack.Screen name="AskForClaimDecision" component={AskForClaimDecision} />
      <ClaimsStack.Screen name="TakePhotos" component={TakePhotos} options={{ title: t('fileUpload.title') }} />
      <ClaimsStack.Screen name="SelectFile" component={SelectFile} options={{ title: t('fileUpload.title') }} />
      <ClaimsStack.Screen name="UploadOrAddPhotos" component={UploadOrAddPhotos} options={{ title: t('fileUpload.title') }} />
      <ClaimsStack.Screen name="UploadFile" component={UploadFile} options={{ title: t('fileUpload.title') }} />
      <ClaimsStack.Screen name="UploadSuccess" component={UploadSuccess} options={{ title: t('fileUpload.title') }} />
      <ClaimsStack.Screen name="UploadConfirmation" component={UploadConfirmation} options={{ title: t('fileUpload.title') }} />
    </ClaimsStack.Navigator>
  )
}

export default ClaimsStackScreen
