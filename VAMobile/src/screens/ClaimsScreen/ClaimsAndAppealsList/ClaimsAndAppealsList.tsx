import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, TextView } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { getActiveClaimsAndAppeals } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'

export const ClaimTypeConstants: {
  ACTIVE: ClaimType
  CLOSED: ClaimType
} = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
}

type ClaimType = 'ACTIVE' | 'CLOSED'

type ClaimsAndAppealsListProps = {
  claimType: ClaimType
}

const ClaimsAndAppealsList: FC<ClaimsAndAppealsListProps> = ({ claimType }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { activeClaimsAndAppeals } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  useEffect(() => {
    switch (claimType) {
      case ClaimTypeConstants.ACTIVE:
        dispatch(getActiveClaimsAndAppeals())
    }
  }, [dispatch, claimType])

  console.log('HERE IS THE LIST TWOOO ', activeClaimsAndAppeals)

  return (
    <Box>
      <TextView variant="TableHeaderBold" mx={theme.dimensions.gutter}>
        {t('claims.youClaimsAndAppeals', { claimType: claimType.toLowerCase() })}
      </TextView>
    </Box>
  )
}

export default ClaimsAndAppealsList
