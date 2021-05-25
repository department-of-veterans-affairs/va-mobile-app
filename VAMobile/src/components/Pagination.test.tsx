import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, findByTestID, renderWithProviders} from 'testUtils'
import Pagination, { PaginationArrow, PaginationProps } from './Pagination'

context('Pagination', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (paginationProps : PaginationProps): void => {

    act(() => {
      component = renderWithProviders(<Pagination {...paginationProps} />)
    })

    testInstance = component.root
  }

  it('initializes correctly', async () => {
    initializeTestInstance({
      onPrev: () => {},
      onNext: () => {},
      totalEntries: 12,
      page: 1,
      pageSize: 10,
    })
    expect(component).toBeTruthy()
  })

  it('should not render pagination when totalEntries is less than the pageSize', async () => {
    initializeTestInstance({
      onPrev: () => {},
      onNext: () => {},
      totalEntries: 2,
      page: 1,
      pageSize: 10,
    })
    expect(testInstance.findAllByType(PaginationArrow).length).toEqual(0)
  })

  describe('Previous Arrow',() => {
    it('should call onPrev', async () => {
      const previousSpy = jest.fn()
      initializeTestInstance({
        onPrev: previousSpy,
        onNext: () => {},
        totalEntries: 20,
        page: 2,
        pageSize: 10,
      })
      findByTestID(testInstance, 'previous-page').props.onPress()
      expect(previousSpy).toBeCalled()
    })

    it('should be disabled when on first page', () => {
      initializeTestInstance({
        onPrev: () => {},
        onNext: () => {},
        totalEntries: 12,
        page: 1,
        pageSize: 10,
      })
      expect(findByTestID(testInstance, 'previous-page').props.disabled).toBeTruthy()
    })
  })

  describe('Next Arrow',() => {
    it('should call setPage for pagination next arrow', async () => {
      const nextSpy = jest.fn()
      initializeTestInstance({
        onPrev: () => {},
        onNext: nextSpy,
        totalEntries: 22,
        page: 2,
        pageSize: 10,
      })
      findByTestID(testInstance, 'next-page').props.onPress()
      expect(nextSpy).toBeCalled()
    })

    it('should be disabled when on last page', () => {
      initializeTestInstance({
        onPrev: () => {},
        onNext: () => {},
        totalEntries: 22,
        page: 3,
        pageSize: 10,
      })
      expect(findByTestID(testInstance, 'next-page').props.disabled).toBeTruthy()
    })
  })
})
