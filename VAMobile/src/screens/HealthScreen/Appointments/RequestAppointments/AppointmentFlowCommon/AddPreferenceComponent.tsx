import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { TextArea, TextLineWithIcon, TextView, VAIconProps } from 'components'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

export type AddPreferenceComponentProps = {
  /** On press method that would be triggered when clicking the add link */
  onPress: () => void
  /** Sets the preference title */
  preferenceTitle: string
  /** optional param to change the link button title*/
  buttonText?: string
}

/** common component to add a preference */
const AddPreferenceComponent: FC<AddPreferenceComponentProps> = ({ buttonText, onPress, preferenceTitle }) => {
  const theme = useTheme() as VATheme
  const { t } = useTranslation(NAMESPACE.COMMON)

  const iconProps: VAIconProps = {
    name: 'Add',
    height: 24,
    width: 24,
    fill: theme.colors.buttonBackground.buttonPrimary,
  }

  return (
    <TextArea>
      <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
        {preferenceTitle}
      </TextView>
      <TouchableWithoutFeedback onPress={onPress}>
        <TextLineWithIcon text={buttonText || t('add.preference.btn.title')} variant="MobileBodyLink" iconProps={iconProps} />
      </TouchableWithoutFeedback>
    </TextArea>
  )
}

export default AddPreferenceComponent
