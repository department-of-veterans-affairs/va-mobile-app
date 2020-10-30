import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, CheckBox, SaveButton, TextArea } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from './ProfileScreen'
import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { useTranslation } from 'utils/hooks'

type IEditAddressScreen = StackScreenProps<ProfileStackParamList, 'EditAddress'>

const EditAddressScreen: FC<IEditAddressScreen> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle } = route.params

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)
  const [checkboxSelected, setCheckboxSelected] = useState(false)

  const onSave = (): void => {}

  useEffect(() => {
    navigation.setOptions({
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} testID={'cancel'} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={onSave} disabled={saveButtonDisabled} />,
    })
  })

  return (
    <ScrollView>
      <Box mt={12}>
        <TextArea padding={{ pl: 20, pt: 20, pb: 18 }}>
          <CheckBox label={t('editAddress.liveOnMilitaryBase')} selected={checkboxSelected} onSelectionChange={setCheckboxSelected} />
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default EditAddressScreen
