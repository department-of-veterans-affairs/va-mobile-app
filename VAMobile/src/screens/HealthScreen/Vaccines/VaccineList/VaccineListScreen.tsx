import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, TextLine, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StoreState, VaccineState } from 'store/reducers'
import { Vaccine } from 'store/api/types'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getA11yLabelText } from 'utils/common'
import { getVaccines } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoVaccineRecords from '../NoVaccineRecords/NoVaccineRecords'

type VaccineListScreenProps = StackScreenProps<HealthStackParamList, 'VaccineList'>

/**
 * Screen containing a list of vaccines on record and a link to their details view
 */
const VaccineListScreen: FC<VaccineListScreenProps> = () => {
  const dispatch = useDispatch()
  const { vaccines, loading } = useSelector<StoreState, VaccineState>((state) => state.vaccine)
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    dispatch(getVaccines(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID))
  }, [dispatch])

  const vaccineButtons: Array<DefaultListItemObj> = map(vaccines || [], (vaccine: Vaccine, index) => {
    const textLines: Array<TextLine> = [
      { text: t('vaccines.vaccineName', { name: vaccine.attributes?.groupName }), variant: 'MobileBodyBold' },
      { text: formatDateMMMMDDYYYY(vaccine.attributes?.date || '') },
    ]

    const vaccineButton: DefaultListItemObj = {
      textLines,
      onPress: navigateTo('VaccineDetails', { vaccineId: vaccine.id }),
      a11yHintText: t('vaccines.list.a11y'),
      a11yValue: t('common:listPosition', { position: index + 1, total: vaccines.length }),
      testId: getA11yLabelText(textLines),
    }

    return vaccineButton
  })

  if (useError(ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.VACCINE_LIST_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('vaccines.loading')} />
  }

  if (vaccines.length === 0) {
    return <NoVaccineRecords />
  }

  return (
    <VAScrollView {...testIdProps('Letters-list-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <DefaultList items={vaccineButtons} />
      </Box>
    </VAScrollView>
  )
}

export default VaccineListScreen
