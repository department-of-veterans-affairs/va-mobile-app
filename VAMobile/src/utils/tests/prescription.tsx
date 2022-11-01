import { PrescriptionsList, RefillStatus } from 'store/api/types'

export const defaultPrescriptionsList: PrescriptionsList = [
  {
    attributes: {
      dispensedDate: '2021-09-06T04:00:00.000Z',
      expirationDate: '2022-05-04T04:00:00.000Z',
      facilityName: 'SLC10 TEST LAB',
      instructions: 'TAKE ONE TABLET EVERY DAY FOR 30 DAYS TAKE WITH FOOD',
      isRefillable: true,
      isTrackable: false,
      orderedDate: '2021-05-03T04:00:00.000Z',
      prescriptionName: 'ALLOPURINOL 100MG TAB',
      prescriptionNumber: '3636691',
      quantity: 30,
      refillDate: '2021-09-21T04:00:00.000Z',
      refillRemaining: 1,
      refillStatus: 'activeParked' as RefillStatus,
      refillSubmitDate: '2021-09-08T18:28:22.000Z',
      stationNumber: '979',
    },
    id: '20004342',
    type: 'Prescription',
  },
  {
    attributes: {
      dispensedDate: null,
      expirationDate: '2022-10-28T04:00:00.000Z',
      facilityName: 'SLC10 TEST LAB',
      instructions: 'TAKE ONE-HALF TABLET EVERY DAY FOR 30 DAYS',
      isRefillable: true,
      isTrackable: false,
      orderedDate: '2021-10-27T04:00:00.000Z',
      prescriptionName: 'AMLODIPINE BESYLATE 10MG TAB',
      prescriptionNumber: '3636711A',
      quantity: 15,
      refillDate: '2022-05-15T04:00:00.000Z',
      refillRemaining: 6,
      refillStatus: 'active' as RefillStatus,
      refillSubmitDate: '2022-06-14T19:24:36.000Z',
      stationNumber: '979',
    },
    id: '20280404',
    type: 'Prescription',
  },
]

export const emptyStatePrescriptionList = [
  {
    attributes: {
      dispensedDate: '2022-08-02T04:00:00.000Z',
      expirationDate: '2023-04-27T04:00:00.000Z',
      facilityName: '',
      instructions: '',
      isRefillable: false,
      isTrackable: true,
      orderedDate: '2022-04-26T04:00:00.000Z',
      prescriptionName: 'ALLOPURINOL 100MG TAB',
      prescriptionNumber: '',
      quantity: 30,
      refillDate: null,
      refillStatus: 'active' as RefillStatus,
      refillSubmitDate: '2022-08-04T13:59:40.000Z',
      stationNumber: '989',
    },
    id: '20004342',
    type: 'Prescription',
  },
]

export const emptyStateTrackingInfoList = [
  {
    attributes: {
      deliveryService: '',
      otherPrescriptions: [],
      prescriptionNumber: '',
      prescriptionName: 'ALLOPURINOL 100MG TAB',
      shippedDate: '',
      trackingNumber: '',
      prescriptionId: '',
      ndcNumber: '',
    },
    id: '20004342',
    type: 'PrescriptionTracking',
  },
]

export const multipleTrackingInfoList = [
  {
    attributes: {
      deliveryService: 'DHL',
      otherPrescriptions: [
        {
          prescriptionName: 'LAMIVUDINE 10MG TAB',
          prescriptionNumber: '2336800',
        },
        {
          prescriptionName: 'ZIDOVUDINE 1MG CAP',
          prescriptionNumber: '',
        },
      ],
      prescriptionName: 'ALLOPURINOL 100MG TAB',
      prescriptionNumber: '3636691',
      shippedDate: '2022-06-14T00:00:00.000Z',
      trackingNumber: '7534533636856',
      ndcNumber: '00013264681',
      prescriptionId: 20004342,
    },
    id: '20004342',
    type: 'PrescriptionTracking',
  },
  {
    attributes: {
      deliveryService: 'USPS',
      otherPrescriptions: [
        {
          prescriptionName: 'AMLODIPINE BESYLATE 10MG TAB',
          prescriptionNumber: '3636711A',
        },
        {
          prescriptionName: 'ZIDOVUDINE 1MG CAP',
          prescriptionNumber: '4636722C',
        },
      ],
      prescriptionName: 'ALLOPURINOL 100MG TAB',
      prescriptionNumber: '3636691',
      shippedDate: '2022-06-28T00:00:00.000Z',
      trackingNumber: '5634533636812',
      ndcNumber: '00013264681',
      prescriptionId: 20004342,
    },
    id: '1000433',
    type: 'PrescriptionTracking',
  },
]

// Has prescriptions that match what is filtered when loadAllPrescriptions is called
export const defaultLoadAllPrescriptionsList: PrescriptionsList = [
  {
    // isRefillable - true
    attributes: {
      dispensedDate: '2021-09-06T04:00:00.000Z',
      expirationDate: '2022-05-04T04:00:00.000Z',
      facilityName: 'SLC10 TEST LAB',
      instructions: 'TAKE ONE TABLET EVERY DAY FOR 30 DAYS TAKE WITH FOOD',
      isRefillable: true,
      isTrackable: false,
      orderedDate: '2021-05-03T04:00:00.000Z',
      prescriptionName: 'ALLOPURINOL 100MG TAB',
      prescriptionNumber: '3636691',
      quantity: 30,
      refillDate: '2021-09-21T04:00:00.000Z',
      refillRemaining: 1,
      refillStatus: 'activeParked' as RefillStatus,
      refillSubmitDate: '2021-09-08T18:28:22.000Z',
      stationNumber: '979',
    },
    id: '20004342',
    type: 'Prescription',
  },
  {
    // isTrackable - true
    attributes: {
      dispensedDate: null,
      expirationDate: '2022-10-28T04:00:00.000Z',
      facilityName: 'SLC10 TEST LAB',
      instructions: 'TAKE ONE TABLET EVERY DAY FOR 31 DAYS',
      isRefillable: false,
      isTrackable: true,
      orderedDate: '2021-10-27T04:00:00.000Z',
      prescriptionName: 'AMLODIPINE BESYLATE 10MG TAB',
      prescriptionNumber: '3636711A',
      quantity: 15,
      refillDate: '2022-05-15T04:00:00.000Z',
      refillRemaining: 6,
      refillStatus: 'active' as RefillStatus,
      refillSubmitDate: '2022-06-14T19:24:36.000Z',
      stationNumber: '979',
    },
    id: '11280404',
    type: 'Prescription',
  },
  {
    // transferred
    attributes: {
      dispensedDate: null,
      expirationDate: '2022-10-28T04:00:00.000Z',
      facilityName: 'SLC10 TEST LAB03',
      instructions: 'TAKE THREE TABLET EVERY DAY FOR 31 DAYS',
      isRefillable: false,
      isTrackable: false,
      orderedDate: '2021-10-27T04:00:00.000Z',
      prescriptionName: 'AMLODIPINE BESYLATE 2MG TAB',
      prescriptionNumber: '3636711A',
      quantity: 15,
      refillDate: '2022-05-15T04:00:00.000Z',
      refillRemaining: 6,
      refillStatus: 'transferred' as RefillStatus,
      refillSubmitDate: '2022-06-14T19:24:36.000Z',
      stationNumber: '979',
    },
    id: '23280404',
    type: 'Prescription',
  },
  {
    // refillStatus - RefillStatusConstants.REFILL_IN_PROCESS
    attributes: {
      dispensedDate: null,
      expirationDate: '2022-10-28T04:00:00.000Z',
      facilityName: 'SLC10 TEST LAB4',
      instructions: 'TAKE FOUR TABLET EVERY DAY FOR 31 DAYS',
      isRefillable: false,
      isTrackable: false,
      orderedDate: '2021-10-27T04:00:00.000Z',
      prescriptionName: 'AMLODIPINE BESYLATE 9MG TAB',
      prescriptionNumber: '3636711A',
      quantity: 15,
      refillDate: '2022-05-15T04:00:00.000Z',
      refillRemaining: 6,
      refillStatus: 'refillinprocess' as RefillStatus,
      refillSubmitDate: '2022-06-14T19:24:36.000Z',
      stationNumber: '979',
    },
    id: '23280434',
    type: 'Prescription',
  },
  {
    // refillStatus - RefillStatusConstants.SUBMITTED
    attributes: {
      dispensedDate: null,
      expirationDate: '2022-10-28T04:00:00.000Z',
      facilityName: 'SLC10 TEST LAB04',
      instructions: 'TAKE TWO TABLET EVERY DAY FOR 31 DAYS',
      isRefillable: false,
      isTrackable: false,
      orderedDate: '2021-10-27T04:00:00.000Z',
      prescriptionName: 'AMLODIPINE BESYLATE 9MG TAB',
      prescriptionNumber: '3636711A',
      quantity: 15,
      refillDate: '2022-05-15T04:00:00.000Z',
      refillRemaining: 6,
      refillStatus: 'submitted' as RefillStatus,
      refillSubmitDate: '2022-06-14T19:24:36.000Z',
      stationNumber: '979',
    },
    id: '23280256',
    type: 'Prescription',
  },
]
