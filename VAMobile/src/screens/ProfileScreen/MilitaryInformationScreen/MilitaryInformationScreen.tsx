import { ScrollView } from 'react-native'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'utils/hooks'
import React, { FC, useEffect } from 'react'

import { AuthState, MilitaryServiceState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextView, TextViewProps, textIDObj } from 'components'
import { ServiceData } from 'store/api/types'
import { generateTestID } from 'utils/common'
import { getServiceHistory } from 'store'
import { testIdProps } from 'utils/accessibility'
import ProfileBanner from '../ProfileBanner'

const MilitaryInformationScreen: FC = ({}) => {
  const dispatch = useDispatch()
  const t = useTranslation('profile')
  const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)
  const { serviceHistory } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)

  useEffect(() => {
    dispatch(getServiceHistory(true))
  }, [dispatch])

  const historyItems: Array<ButtonListItemObj> = map(serviceHistory, (service: ServiceData) => {
    const textIDs: Array<textIDObj> = [
      {
        textID: 'personalInformation.branch',
        fieldObj: { branch: service.branchOfService },
      },
      {
        textID: 'militaryInformation.history',
        fieldObj: { begin: service.formattedBeginDate, end: service.formattedEndDate },
      },
    ]
    return { textIDs: textIDs, a11yHintID: '' }
  })

  const posProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mt: 32,
    ml: 20,
    mr: 25,
    mb: 4,
    accessibilityRole: 'header',
    ...testIdProps(generateTestID(t('militaryInformation.periodOfService'), '')),
  }

  const linkProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    mt: 15,
    ml: 20,
    mr: 48,
    mb: 20,
    accessibilityRole: 'link',
    ...testIdProps(generateTestID(t('militaryInformation.whatIf'), '')),
  }

  return (
    <ScrollView {...testIdProps('Military-Information-screen')}>
      <ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
      <TextView {...posProps}>{t('militaryInformation.periodOfService')}</TextView>
      <Box my={4}>
        <ButtonList items={historyItems} translationNameSpace="profile" />
      </Box>
      <TextView {...linkProps}>{t('militaryInformation.whatIf')}</TextView>
    </ScrollView>
  )
}

export default MilitaryInformationScreen
