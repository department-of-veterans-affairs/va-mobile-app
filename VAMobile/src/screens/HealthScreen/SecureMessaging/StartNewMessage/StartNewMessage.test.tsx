import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import {
  CategoryTypeFields,
  SecureMessagingCareSystemData,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingRecipients,
  SecureMessagingSignatureData,
  SecureMessagingSystemFolderIdConstants,
} from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import StartNewMessage from 'screens/HealthScreen/SecureMessaging/StartNewMessage/StartNewMessage'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const mockUseComposeCancelConfirmationSpy = jest.fn()
jest.mock('../CancelConfirmations/ComposeCancelConfirmation', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useComposeCancelConfirmation: () => [false, mockUseComposeCancelConfirmationSpy],
  }
})

jest.mock('api/authorizedServices/getAuthorizedServices')

jest.mock('../../../../api/facilities/getFacilitiesInfo', () => {
  const original = jest.requireActual('../../../../api/facilities/getFacilitiesInfo')
  return {
    ...original,
    useFacilitiesInfo: jest.fn().mockReturnValue({
      data: [
        {
          id: '528',
          name: 'Test VA Medical Center',
          city: 'Test City',
          state: 'TS',
          cerner: false,
          miles: '10',
        },
        {
          id: '123',
          name: 'Different VA Medical Center',
          city: 'Another City',
          state: 'AC',
          cerner: false,
          miles: '20',
        },
      ],
      isLoading: false,
      isError: false,
    }),
  }
})

context('StartNewMessage', () => {
  let goBack: jest.Mock

  const signature: SecureMessagingSignatureData = {
    data: {
      id: '1',
      type: 'hah',
      attributes: {
        signatureName: 'signatureName',
        includeSignature: false,
        signatureTitle: 'Title',
      },
    },
  }
  const folderMessages: SecureMessagingFolderMessagesGetData = {
    data: [
      {
        type: 'test',
        id: 1,
        attributes: {
          messageId: 1,
          category: CategoryTypeFields.other,
          subject: 'test',
          body: 'test',
          hasAttachments: false,
          attachment: false,
          sentDate: '1-1-21',
          senderId: 2,
          senderName: 'mock sender',
          recipientId: 3,
          recipientName: 'mock recipient name',
          readReceipt: 'mock read receipt',
          isOhMessage: false,
        },
      },
    ],
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
    meta: {
      sort: {
        sentDate: 'DESC',
      },
      pagination: {
        currentPage: 1,
        perPage: 1,
        totalPages: 3,
        totalEntries: 5,
      },
    },
  }
  const careSystemsList: Array<SecureMessagingCareSystemData> = [
    {
      healthCareSystemName: 'SM STAGING CARE SYSTEM',
      stationNumber: '989',
    },
    {
      healthCareSystemName: '357',
      stationNumber: '357',
    },
  ]

  const singleCareSystemList: Array<SecureMessagingCareSystemData> = [
    {
      healthCareSystemName: '357',
      stationNumber: '357',
    },
  ]

  const recipients: SecureMessagingRecipients = {
    data: [
      {
        id: 'id',
        type: 'type',
        attributes: {
          triageTeamId: 0,
          name: 'Doctor 1',
          relationType: 'PATIENT',
          preferredTeam: true,
          stationNumber: '357',
          locationName: 'test_location',
          suggestedNameDisplay: 'test_suggested_name',
          healthCareSystemName: 'test_healthcare_system_name',
          ohTriageGroup: false,
        },
      },
      {
        id: 'id2',
        type: 'type',
        attributes: {
          triageTeamId: 1,
          name: 'Doctor 2',
          relationType: 'PATIENT',
          preferredTeam: true,
          stationNumber: '357',
          locationName: 'test_location',
          suggestedNameDisplay: 'test_suggested_name',
          healthCareSystemName: 'test_healthcare_system_name',
          ohTriageGroup: false,
        },
      },
    ],
    meta: {
      sort: {
        name: 'ASC',
      },
      careSystems: careSystemsList,
    },
  }

  const initializeTestInstance = (params: object = { attachmentFileToAdd: {} }) => {
    goBack = jest.fn()

    const props = mockNavProps(
      undefined,
      {
        addListener: mockUseComposeCancelConfirmationSpy,
        navigate: mockNavigationSpy,
        goBack,
        setOptions: jest.fn(),
      },
      { params: params },
    )

    render(<StartNewMessage {...props} />, {})
  }

  beforeEach(() => {
    ;(useAuthorizedServices as jest.Mock).mockReturnValue({
      data: {
        migratingFacilitiesList: [],
      },
      isFetched: true,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    })
  })

  const initializeApiCalls = (isSingleFaciltyTest: boolean = false) => {
    if (isSingleFaciltyTest) {
      recipients.meta.careSystems = singleCareSystemList
    }
    when(api.get as jest.Mock)
      .calledWith('/v0/messaging/health/allrecipients')
      .mockResolvedValue(recipients)
      .calledWith('/v0/messaging/health/messages/signature')
      .mockResolvedValue(signature)
      .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
        page: '1',
        per_page: LARGE_PAGE_SIZE.toString(),
        useCache: 'false',
      } as api.Params)
      .mockResolvedValue(folderMessages)
  }

  describe('when no recipients are returned', () => {
    it('should display an AlertBox', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockResolvedValue({
          data: [],
          meta: {
            sort: {
              name: 'ASC',
            },
          },
        })
        .calledWith('/v0/messaging/health/messages/signature')
        .mockResolvedValue(signature)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(folderMessages)
      initializeTestInstance()
      expect(screen.getByText(t('secureMessaging.formMessage.startNewMessage.loading'))).toBeTruthy()
      await waitFor(() =>
        expect(screen.getByText(t('secureMessaging.startNewMessage.noMatchWithProvider'))).toBeTruthy(),
      )
      expect(screen.getByText(t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled'))).toBeTruthy()
      fireEvent.press(screen.getByRole('link', { name: t('secureMessaging.goToInbox') }))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging', { activeTab: 0 }))
    })
  })

  describe('when there is an error', () => {
    it('should display the ErrorComponent', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/allrecipients')
        .mockRejectedValue({ networkError: true } as api.APIError)
        .calledWith('/v0/messaging/health/messages/signature')
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('errors.networkConnection.header'))).toBeTruthy())
    })
  })

  describe('when the subject is general', () => {
    it('should add the text (*Required) for the subject line field', async () => {
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByTestId('picker')))
      await waitFor(() => {
        fireEvent.press(screen.getByTestId(t('secureMessaging.startNewMessage.general')))
      })
      fireEvent.press(screen.getByLabelText(t('done')))
      await waitFor(() =>
        expect(screen.getByText(`${t('secureMessaging.startNewMessage.subject')} ${t('required')}`)).toBeTruthy(),
      )
    })
  })

  describe('when pressing the back button', () => {
    it('should go to inbox if all fields empty', async () => {
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByText(t('cancel'))))
      await waitFor(() => expect(goBack).toHaveBeenCalled())
    })

    it('should ask for confirmation if any field filled in', async () => {
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByTestId('picker')))
      await waitFor(() => {
        fireEvent.press(screen.getByTestId(t('secureMessaging.startNewMessage.general')))
      })
      fireEvent.press(screen.getByLabelText(t('done')))
      fireEvent.press(screen.getByText(t('cancel')))
      await waitFor(() => expect(mockUseComposeCancelConfirmationSpy).toHaveBeenCalled())
    })
  })

  describe('on click of save (draft)', () => {
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        initializeApiCalls()
        initializeTestInstance()
        await waitFor(() => fireEvent.press(screen.getByText(t('save'))))
        await waitFor(() =>
          expect(screen.getAllByText(t('secureMessaging.startNewMessage.to.fieldError'))).toBeTruthy(),
        )
        expect(screen.getAllByText(t('secureMessaging.startNewMessage.category.fieldError'))).toBeTruthy()
        expect(screen.getAllByText(t('secureMessaging.formMessage.message.fieldError'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.weNeedMoreInfo'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.saveDraft.validation.text'))).toBeTruthy()
      })
    })
  })

  describe('when user has multiple facilities on record', () => {
    it('should display select a care system', async () => {
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => expect(screen.queryAllByText('Pick a care system (Required)').length).toBe(1))
    })

    it('should display To combobox with selected care system as header', async () => {
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => expect(screen.queryAllByText('Pick a care system (Required)').length).toBe(1))
      const careSystemPicker = await screen.findByTestId('care system field')
      fireEvent.press(careSystemPicker)
      const careSystemOption = await screen.findAllByText('357')
      fireEvent.press(careSystemOption[0])
      const careSystemDoneButton = await screen.findByText('Done')
      fireEvent.press(careSystemDoneButton)
      const toField = await screen.findByTestId('to field')
      const picker = await screen.findByTestId('picker')
      fireEvent.press(picker)
      const generalOption = await screen.findByTestId(t('secureMessaging.startNewMessage.general'))
      fireEvent.press(generalOption)
      const doneButton = await screen.findByLabelText(t('done'))
      fireEvent.press(doneButton)
      fireEvent.press(toField)
      // Verify facility name appears as header in ComboBox (not "All care teams")
      const comboBoxScrollView = await screen.findByTestId('comboBoxScrollViewID')
      expect(comboBoxScrollView).toBeTruthy()
      expect(screen.getAllByText('357').length).toBeGreaterThanOrEqual(1)
      expect(screen.queryByText('All care teams')).toBeFalsy()
    })
  })

  describe('when user has only one facility on record', () => {
    it('should hide select a care system', async () => {
      initializeApiCalls(true)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryAllByText('Pick a care system (Required)').length).toBe(0))
    })

    it('should display To combobox with auto-selected care system as header', async () => {
      initializeApiCalls(true)
      initializeTestInstance()
      // Wait for form to load - care system is auto-selected for single facility
      const toField = await screen.findByTestId('to field')
      const picker = await screen.findByTestId('picker')
      fireEvent.press(picker)
      const generalOption = await screen.findByTestId(t('secureMessaging.startNewMessage.general'))
      fireEvent.press(generalOption)
      const doneButton = await screen.findByLabelText(t('done'))
      fireEvent.press(doneButton)
      fireEvent.press(toField)
      // Verify facility name appears as header in ComboBox (not "All care teams")
      const comboBoxScrollView = await screen.findByTestId('comboBoxScrollViewID')
      expect(comboBoxScrollView).toBeTruthy()
      expect(screen.getAllByText('357').length).toBeGreaterThanOrEqual(1)
      expect(screen.queryByText('All care teams')).toBeFalsy()
    })
  })

  describe('on click of send', () => {
    describe('when a required field is not filled', () => {
      it('should display a field error for that field and an AlertBox', async () => {
        initializeApiCalls()
        initializeTestInstance()
        await waitFor(() => fireEvent.press(screen.getByText(t('secureMessaging.formMessage.send'))))
        await waitFor(() =>
          expect(screen.getAllByText(t('secureMessaging.startNewMessage.to.fieldError'))).toBeTruthy(),
        )
        expect(screen.getAllByText(t('secureMessaging.startNewMessage.category.fieldError'))).toBeTruthy()
        expect(screen.getAllByText(t('secureMessaging.formMessage.message.fieldError'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.weNeedMoreInfo'))).toBeTruthy()
        expect(screen.getByText(t('secureMessaging.formMessage.sendMessage.validation.text'))).toBeTruthy()
      })
    })

    describe('when the form is filled and sent', () => {
      it('should include station_number in the send message payload', async () => {
        initializeApiCalls(true)
        ;(api.post as jest.Mock).mockResolvedValue({ data: {} })
        initializeTestInstance()
        // Wait for form to load (to field only appears after careSystem is auto-set for single facility)
        const toField = await screen.findByTestId('to field')
        // Select category - use findBy to wait for modal content to render between each step
        const picker = await screen.findByTestId('picker')
        fireEvent.press(picker)
        const generalOption = await screen.findByTestId(t('secureMessaging.startNewMessage.general'))
        fireEvent.press(generalOption)
        const doneButton = await screen.findByLabelText(t('done'))
        fireEvent.press(doneButton)
        // Select recipient from ComboBox
        fireEvent.press(toField)
        const doctor = await screen.findByText('Doctor 1')
        fireEvent.press(doctor)
        // Fill subject (required for General category)
        const subjectField = await screen.findByTestId('startNewMessageSubjectTestID')
        fireEvent.changeText(subjectField, 'test subject')
        // Fill message
        const messageField = await screen.findByTestId('message field')
        fireEvent.changeText(messageField, 'test message')
        // Press send
        const sendButton = await screen.findByText(t('secureMessaging.formMessage.send'))
        fireEvent.press(sendButton)
        await waitFor(() =>
          expect(api.post).toHaveBeenCalledWith(
            '/v0/messaging/health/messages',
            expect.objectContaining({ station_number: '357' }),
            undefined,
          ),
        )
      })
    })
  })

  describe('on click of add files button', () => {
    it('should call useRouteNavigation', async () => {
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByLabelText(t('secureMessaging.formMessage.addFiles'))))
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })

  describe('when displaying the form', () => {
    it('should display an alert about urgent messages', async () => {
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(
          screen.getAllByText(
            t('secureMessaging.startNewMessage.nonurgent.careTeam') +
              t('secureMessaging.startNewMessage.nonurgent.threeDays') +
              t('secureMessaging.startNewMessage.nonurgent.reply'),
          ),
        ).toBeTruthy(),
      )
    })
  })

  describe('migration alerts', () => {
    const mockMigrationPhases = {
      current: 'p3',
      p0: 'March 1, 2026',
      p1: 'March 15, 2026',
      p2: 'April 1, 2026',
      p3: 'April 24, 2026',
      p4: 'April 27, 2026',
      p5: 'May 1, 2026',
      p6: 'May 3, 2026',
      p7: 'May 8, 2026',
    }

    it('should show migration error alert when a facility is in error state for secure messaging', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
              phases: { ...mockMigrationPhases, current: 'p3' },
            },
          ],
        },
        isFetched: true,
        error: null,
        refetch: jest.fn(),
        isFetching: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByText("You can't use messages to contact some facilities right now")).toBeTruthy(),
      )
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should show migration error alert for p4 phase', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
              phases: { ...mockMigrationPhases, current: 'p4' },
            },
          ],
        },
        isFetched: true,
        error: null,
        refetch: jest.fn(),
        isFetching: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByText("You can't use messages to contact some facilities right now")).toBeTruthy(),
      )
    })

    it('should show migration error alert for p5 phase', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
              phases: { ...mockMigrationPhases, current: 'p5' },
            },
          ],
        },
        isFetched: true,
        error: null,
        refetch: jest.fn(),
        isFetching: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByText("You can't use messages to contact some facilities right now")).toBeTruthy(),
      )
    })

    it('should show the facility locator link in the migration error alert', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
              phases: { ...mockMigrationPhases, current: 'p3' },
            },
          ],
        },
        isFetched: true,
        error: null,
        refetch: jest.fn(),
        isFetching: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => expect(screen.getByTestId('goToFindLocationInfoTestID')).toBeTruthy())
    })

    it('should not show migration error alert when no facilities are in error state', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
              phases: { ...mockMigrationPhases, current: 'p1' },
            },
          ],
        },
        isFetched: true,
        error: null,
        refetch: jest.fn(),
        isFetching: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.queryByText("You can't use messages to contact some facilities right now")).toBeNull(),
      )
    })

    it('should not show migration error alert when migratingFacilitiesList is empty', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [],
        },
        isFetched: true,
        error: null,
        refetch: jest.fn(),
        isFetching: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.queryByText("You can't use messages to contact some facilities right now")).toBeNull(),
      )
    })

    it('should show error alerts for all migrations in error state when multiple exist', async () => {
      ;(useAuthorizedServices as jest.Mock).mockReturnValue({
        data: {
          migratingFacilitiesList: [
            {
              migrationDate: '2026-05-01',
              facilities: [{ facilityId: 528, facilityName: 'Test VA Medical Center' }],
              phases: { ...mockMigrationPhases, current: 'p3' },
            },
            {
              migrationDate: '2026-06-01',
              facilities: [{ facilityId: 123, facilityName: 'Different VA Medical Center' }],
              phases: { ...mockMigrationPhases, current: 'p4' },
            },
          ],
        },
        isFetched: true,
        error: null,
        refetch: jest.fn(),
        isFetching: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText('Test VA Medical Center')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Different VA Medical Center')).toBeTruthy())
    })
  })

  describe('name change alert', () => {
    it('should show the name change alert when user has cerner facilities', async () => {
      ;(useFacilitiesInfo as jest.Mock).mockReturnValue({
        data: [
          {
            id: '528',
            name: 'Test VA Medical Center',
            city: 'Test City',
            state: 'TS',
            cerner: true,
            miles: '10',
          },
        ],
        isLoading: false,
        isError: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByText(t('secureMessaging.startNewMessage.nameChangeAlert.title'))).toBeTruthy(),
      )
    })

    it('should not show the name change alert when user has no cerner facilities', async () => {
      ;(useFacilitiesInfo as jest.Mock).mockReturnValue({
        data: [
          {
            id: '528',
            name: 'Test VA Medical Center',
            city: 'Test City',
            state: 'TS',
            cerner: false,
            miles: '10',
          },
        ],
        isLoading: false,
        isError: false,
      })
      initializeApiCalls()
      initializeTestInstance()
      await waitFor(() =>
        expect(screen.queryByText(t('secureMessaging.startNewMessage.nameChangeAlert.title'))).toBeNull(),
      )
    })
  })
})
