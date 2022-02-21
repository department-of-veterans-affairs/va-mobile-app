import 'react-native'
import { Pressable } from 'react-native'
import React from 'react'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import CollapsibleAlert from './CollapsibleAlert'
import TextView from './TextView'
import { VABorderColors } from 'styles/theme'

context('CollapsibleAlert', () => {
    let component: RenderAPI
    let testInstance: RenderAPI
    
    const initializeTestInstance = () => {
    
        component = render(
          <CollapsibleAlert
            border="informational"
            headerText='HEADER'
            body={<TextView>EXPANDED</TextView>}
          />,
        )
        testInstance = component
      }
    
      beforeEach(() => {
        initializeTestInstance()
      })
    
      it('initializes correctly', async () => {
        expect(component).toBeTruthy()
      })
    
      describe('is pressable', () => {
        it('should render a Pressable', async () => {
          expect(testInstance.container.findAllByType(Pressable).length).toEqual(1)
        })
      })
    
      describe('when expanded is true', () => {
        it('should render the expandedContent', async () => {
          await waitFor(() => {
            testInstance.container.findByType(Pressable).props.onPress()
    
            expect(testInstance.container.findAllByType(TextView)[1].props.children).toEqual('EXPANDED')
          })
        })
      })
    })
    