import 'react-native'
import React from 'react'
import {Pressable} from "react-native";
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import {ErrorsState, initialSecureMessagingState} from 'store/reducers'
import Folder from './Folders'
import {SecureMessagingFolderList} from 'store/api/types'
import { LoadingComponent, TextView } from 'components'
import {initialAuthState, initialErrorsState} from "../../../../store";
import { findByTypeWithText } from "../../../../testUtils"

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
    let original = jest.requireActual("../../../../utils/hooks")
    let theme = jest.requireActual("../../../../styles/themes/standardTheme").default
    return {
        ...original,
        useTheme: jest.fn(()=> {
            return {...theme}
        }),
        useRouteNavigation: () => { return () => mockNavigationSpy},
    }
})

context('Folder', () =>{
    let component: any
    let store: any
    let props: any
    let testInstance: ReactTestInstance

    let listOfFolders: SecureMessagingFolderList = [
        {
          type: 'folders',
          id: '-2',
          attributes: {
            folderId: -2,
            name: 'Drafts',
            count: 2,
            unreadCount: 2,
            systemFolder: true,
          }
        },
        {
          type: 'folders',
          id: '-1',
          attributes: {
            folderId: -1,
            name: 'Sent',
            count: 32,
            unreadCount: 0,
            systemFolder: true,
          }
        },
        {
          type: 'folders',
          id: '-3',
          attributes: {
            folderId: -3,
            name: 'Deleted',
            count: 24,
            unreadCount: 0,
            systemFolder: true,
          }
        },
        {
          type: 'folders',
          id: '100',
          attributes: {
            folderId: 100,
            name: 'test 1',
            count: 3,
            unreadCount: 0,
            systemFolder: true,
          }
        },
        {
          type: 'folders',
          id: '101',
          attributes: {
            folderId: 101,
            name: 'test 2',
            count: 12,
            unreadCount: 0,
            systemFolder: true,
          }
        },
    ]

    const initializeTestInstance = (foldersList: SecureMessagingFolderList, loading = false, errorsState: ErrorsState = initialErrorsState) => {
        props = mockNavProps()

        store = mockStore({
            auth: {...initialAuthState},
            secureMessaging:{
                ...initialSecureMessagingState,
                loadingFolders: loading,
                folders: foldersList,
            },

            errors: initialErrorsState,
        })

        act(() => {
            component = renderWithProviders(<Folder {...props} />, store)
        })

        testInstance = component.root
    }

    beforeEach(() =>{
        initializeTestInstance(listOfFolders)
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('when loading is set to true', () => {
        it('should show loading screen', async () => {
            initializeTestInstance([], true)
            expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
        })
    })

    describe('when system folders are visible', () => {
      it('should show the Drafts folder', async () => {
        expect(findByTypeWithText(testInstance, TextView, 'Drafts (2)')).toBeTruthy()
      })
    })

    describe('when a folder is clicked', () => {
        it('should call useRouteNavigation', async () => {
            testInstance.findAllByType(Pressable)[0].props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

})
