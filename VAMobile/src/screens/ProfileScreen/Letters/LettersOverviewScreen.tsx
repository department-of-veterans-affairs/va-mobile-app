import { ScrollView } from 'react-native'
import { TextView } from 'components'
import React, { FC, useEffect } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

type LettersOverviewProps = {}

const LettersOverviewScreen: FC<LettersOverviewProps> = ({}) => {
  const t = useTranslation(NAMESPACE.PROFILE)

  return (
    <ScrollView {...testIdProps('Letters-overview-screen')}>
      <TextView variant="MobileBody" ml={20} mt={20} mr={25} mb={12}>
        {t('personalInformation.editNote')}
      </TextView>
    </ScrollView>
  )
}

export default LettersOverviewScreen
