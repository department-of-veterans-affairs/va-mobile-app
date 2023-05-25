import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useLayoutEffect } from 'react'

import { Box, TextView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { TypeOfCareWithSubCareIdType } from 'store/api'
import { VATheme } from 'styles/theme'
import { useRequestAppointmentModalHeaderStyles } from 'utils/requestAppointments'
import { useTheme } from 'styled-components'

type SubTypeHelpScreenProps = StackScreenProps<HealthStackParamList, 'SubTypeHelpScreen'>

type TextSectionType = {
  header: string
  description: string
}

type BodyTextType = Array<TextSectionType>

/** Component for the sub type care help screen */
const SubTypeHelpScreen: FC<SubTypeHelpScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme() as VATheme
  const { careTypeId } = route.params
  const headerStyle = useRequestAppointmentModalHeaderStyles()

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
    })
  }, [navigation, headerStyle])

  const subcareHelptext: Record<TypeOfCareWithSubCareIdType, BodyTextType> = {
    audiology: [
      {
        header: t('requestAppointments.audiologyCareRoutineHeader'),
        description: t('requestAppointments.audiologyCareRoutineText'),
      },
      {
        header: t('requestAppointments.audiologyCareHelpHearingAidsHeader'),
        description: t('requestAppointments.audiologyCareHelpHearingAidsText'),
      },
    ],
    eyeParentCare: [
      {
        header: t('requestAppointments.eyeCareHelpOptometryHeader'),
        description: t('requestAppointments.eyeCareHelpOptometryText'),
      },
      {
        header: t('requestAppointments.eyeCareHelpOphthalmologyHeader'),
        description: t('requestAppointments.eyeCareHelpOphthalmologyText'),
      },
    ],
    sleepParentCare: [
      {
        header: t('requestAppointments.sleepCareHelpCpapHeader'),
        description: t('requestAppointments.sleepCareHelpCpapText'),
      },
      {
        header: t('requestAppointments.sleepCareHelpMedicineHomeHeader'),
        description: t('requestAppointments.sleepCareHelpMedicineHomeText'),
      },
    ],
  }

  const getSubTypeHelpContext = (): BodyTextType => {
    return subcareHelptext[careTypeId as TypeOfCareWithSubCareIdType] || []
  }

  return (
    <Box flex={1} backgroundColor={'main'}>
      <Box mx={theme.dimensions.gutter}>
        {getSubTypeHelpContext().map((item, index) => {
          return (
            <Box key={index}>
              <TextView variant="MobileBodyBold" mt={theme.dimensions.contentMarginTop} accessibilityRole={'header'}>
                {item.header}
              </TextView>
              <TextView variant="MobileBody">{item.description}</TextView>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export default SubTypeHelpScreen
