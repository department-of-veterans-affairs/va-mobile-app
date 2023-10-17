import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ErrorComponent, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent, VAButton } from 'components'
import { EMAIL_REGEX_EXP } from 'constants/common'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, deleteEmail, finishEditEmail, updateEmail } from 'store/slices'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SnackbarMessages } from 'components/SnackBar'
import { useAlert, useAppDispatch, useBeforeNavBackListener, useDestructiveActionSheet, useError, useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type WaygateEditScreenProps = StackScreenProps<HomeStackParamList, 'WaygateEditScreen'>

/**
 * Screen for editing a users email in the personal info section
 */
const WaygateEditScreen: FC<WaygateEditScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { waygate } = route.params
  const { profile, emailSaved, loading } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const emailId = profile?.contactEmail?.id
  const deleteEmailAlert = useAlert()
  const confirmAlert = useDestructiveActionSheet()
  const screenReaderEnabled = useIsScreenReaderEnabled()
  const [email, setEmail] = useState(profile?.contactEmail?.emailAddress || '')
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveDisabled, setSaveDisabled] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={t('waygateEditScreen.title')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      rightButtonText={t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter} />
    </FullScreenSubtask>
  )
}

export default WaygateEditScreen
