import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, TextLine, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { Immunization } from 'store/api/types'
import { ImmunizationState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getImmunizations } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ImmunizationListScreenProps = StackScreenProps<HealthStackParamList, 'ImmunizationList'>

/**
 * Screen containing a list of vaccines on record and a link to their details view
 */
const ImmunizationListScreen: FC<ImmunizationListScreenProps> = () => {
  const dispatch = useDispatch()
  const { immunizations, loading } = useSelector<StoreState, ImmunizationState>((state) => state.immunization)
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    dispatch(getImmunizations(ScreenIDTypesConstants.IMMUNIZATION_LIST_SCREEN_ID))
  }, [dispatch])

  const vaccineButtons: Array<DefaultListItemObj> = map(immunizations || [], (immunization: Immunization) => {
    const textLines: Array<TextLine> = [
      { text: t('immunizations.vaccineName', { name: immunization.protocolApplied.targetDisease }), variant: 'MobileBodyBold' },
      { text: formatDateMMMMDDYYYY(immunization.recorded) },
    ]

    const vaccineButton: DefaultListItemObj = {
      textLines,
      onPress: navigateTo('ImmunizationDetails', { immunizationId: immunization.id }),
      a11yHintText: t('immunizations.list.a11y'),
    }

    return vaccineButton
  })

  if (useError(ScreenIDTypesConstants.IMMUNIZATION_LIST_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.IMMUNIZATION_LIST_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('immunizations.loading')} />
  }

  return (
    <VAScrollView {...testIdProps('Letters-list-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <DefaultList items={vaccineButtons} title={t('immunizations')} />
      </Box>
    </VAScrollView>
  )
}

export default ImmunizationListScreen
