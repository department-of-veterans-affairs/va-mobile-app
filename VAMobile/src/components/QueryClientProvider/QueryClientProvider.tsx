import React, { useEffect, useState } from 'react'
import { UserCredentials } from 'react-native-keychain'
import * as Keychain from 'react-native-keychain'

import { ANDROID_DATABASE_PATH, IOS_LIBRARY_PATH, Storage } from '@op-engineering/op-sqlite'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider, Persister } from '@tanstack/react-query-persist-client'

import queryClient from 'api/queryClient'
import { isBiometricsPreferred } from 'store/slices'
import { isIOS } from 'utils/platform'

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [usesBiometrics, setUsesBiometrics] = useState(false)
  const [persister, setPersister] = useState<Persister>()

  useEffect(() => {
    const setBiometricsStatus = async () => {
      const isit = await isBiometricsPreferred()
      setUsesBiometrics(isit)
    }
    setBiometricsStatus()
  }, [])

  useEffect(() => {
    const getPersister = async () => {
      const key = await Keychain.getGenericPassword()
      const storage = new Storage({
        location: isIOS() ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH,
        encryptionKey: (key as UserCredentials).password,
      })
      const p = createAsyncStoragePersister({
        storage: storage,
      })
      setPersister(p)
    }
    getPersister()
  }, [usesBiometrics])

  if (!persister) return null

  if (usesBiometrics) {
    return (
      <PersistQueryClientProvider persistOptions={{ persister: persister }} client={queryClient}>
        {children}
      </PersistQueryClientProvider>
    )
  }

  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
}

export default QueryClientProvider
