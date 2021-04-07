import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockStore, renderWithProviders } from 'testUtils'
import Folder from './Folders'
import { HIDDEN_FOLDERS } from 'constants/secureMessaging'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingFolderList } from 'store/api/types'

/** mock stuff goes here */

context('Folder', () =>{
    let component: any
    let store: any
    let testInstance: ReactTestInstance

    const initializeTestInstance = () => {
        act(() => {
            component = renderWithProviders(
                <Folder/>, store
            )
        })

        testInstance = component.root
    }

    beforeEach(() =>{
        initializeTestInstance()
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

})
