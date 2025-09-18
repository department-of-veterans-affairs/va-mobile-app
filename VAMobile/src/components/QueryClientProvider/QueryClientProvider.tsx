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

export let storage: Storage

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [usesBiometrics, setUsesBiometrics] = useState(false)
  const [persister, setPersister] = useState<Persister>()

  // Checks async storage for biometrics preference
  useEffect(() => {
    const setBiometricsStatus = async () => {
      const biometricsPreferred = await isBiometricsPreferred()
      setUsesBiometrics(biometricsPreferred)
    }
    setBiometricsStatus()
  }, [])

  // Creates persister when using persistent query client provider
  useEffect(() => {
    const getPersister = async () => {
      const key = await Keychain.getGenericPassword()

      // Create op-sqlite storage with encryption enabled
      storage = new Storage({
        location: isIOS() ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH,
        encryptionKey: (key as UserCredentials).password,
      })

      const newPersister = createAsyncStoragePersister({
        storage,
      })

      setPersister(newPersister)
    }

    if (usesBiometrics) {
      getPersister()
    }
  }, [usesBiometrics])

  if (usesBiometrics) {
    if (!persister) return null
    return (
      <PersistQueryClientProvider persistOptions={{ persister }} client={queryClient}>
        {children}
      </PersistQueryClientProvider>
    )
  }

  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
}

export default QueryClientProvider
