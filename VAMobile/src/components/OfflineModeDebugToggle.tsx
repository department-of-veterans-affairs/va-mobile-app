import React from 'react'
import { useSelector } from 'react-redux'

import queryClient from 'api/queryClient'
import { Switch } from 'components/index'
import { RootState } from 'store'
import { OfflineState, setForceOffline } from 'store/slices'
import { useAppDispatch } from 'utils/hooks'

const OfflineModeDebugToggle = () => {
  const dispatch = useAppDispatch()
  const { forceOffline, offlineDebugEnabled } = useSelector<RootState, OfflineState>((state) => state.offline)

  if (!offlineDebugEnabled) {
    return null
  }

  const onPress = () => {
    queryClient.cancelQueries()
    dispatch(setForceOffline(!forceOffline))
  }

  return <Switch onPress={onPress} on={!forceOffline} />
}

export default OfflineModeDebugToggle
