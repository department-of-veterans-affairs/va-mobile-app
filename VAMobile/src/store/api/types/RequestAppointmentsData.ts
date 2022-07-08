export type TypeOfCareNameTypes =
  | 'Primary care'
  | 'Pharmacy'
  | 'Mental health'
  | 'Social work'
  | 'Amputation care'
  | 'Audiology and speech'
  | 'MOVE! weight management program'
  | 'Nutrition and food'
  | 'Podiatry'
  | 'Sleep medicine'
  | 'Eye care'
  | 'COVID-19 vaccine'
  | 'Optometry'
  | 'Continuous Positive Airway Pressure (CPAP)'
  | 'Sleep medicine and home sleep testing'
  | 'Optometry'
  | 'Ophthalmology'
  | 'Routine hearing exam'
  | 'Hearing aid support'

export type TypeOfCareIdTypes = '323' | '160' | '502' | '125' | '211' | '203' | '372' | '123' | 'tbd-podiatry' | 'SLEEP' | 'EYE' | 'covid' | '349' | '143' | '408' | '407'

export type TypeOfCareIdV2Types =
  | 'primaryCare'
  | 'clinicalPharmacyPrimaryCare'
  | 'outpatientMentalHealth'
  | 'socialWork'
  | 'amputation'
  | 'audiology'
  | 'moveProgram'
  | 'foodAndNutrition'
  | 'podiatry'
  | 'covid'
  | 'cpap'
  | 'homeSleepTesting'
  | 'optometry'
  | 'ophthalmology'
  | 'audiology-routine exam'
  | 'audiology-hearing aid support'
  | 'eyeParentCare'
  | 'sleepParentCare'

export type TypeOfCareGroupTypes = 'primary' | 'mentalHealth' | 'specialty'

export type TypeOfCareCcIdTypes = 'CCPRMYRTNE' | 'CCNUTRN' | 'CCPOD' | 'Optometry' | 'CCAUDRTNE' | 'CCAUDHEAR' | 'CCOPT'

export type TypeOfCareCceTypes = 'PrimaryCare' | 'Audiology' | 'Nutrition' | 'Podiatry' | 'Optometry'

export type TypeOfCareSpecialtiesTypes =
  | '207QA0505X'
  | '363LP2300X'
  | '363LA2200X'
  | '261QP2300X'
  | '133V00000X'
  | '133VN1201X'
  | '133N00000X'
  | '133NN1002X'
  | '213E00000X'
  | '213EG0000X'
  | '213EP1101X'
  | '213ES0131X'
  | '213ES0103X'
  | '152W00000X'
  | '152WC0802X'
  | '231H00000X'
  | '237600000X'
  | '261QH0700X'

export type TypeOfCareLabelTypes = 'Audiology and speech (including hearing aid support)' | 'Podiatry (only available online for Community Care appointments)'

export type TypeOfCareObjectType = {
  id: TypeOfCareIdTypes
  idV2: TypeOfCareIdV2Types
  name: TypeOfCareNameTypes
  group?: TypeOfCareGroupTypes
  ccId?: TypeOfCareCcIdTypes | Array<TypeOfCareCcIdTypes>
  cceType?: TypeOfCareCceTypes
  specialties?: Array<TypeOfCareSpecialtiesTypes>
  label?: TypeOfCareLabelTypes
  isVaEligible?: boolean
}

export type TypeOfEyeCareObjectType = {
  id: TypeOfCareIdTypes
  idV2: TypeOfCareIdV2Types
  name: TypeOfCareNameTypes
  cceType?: TypeOfCareCceTypes
  ccId?: TypeOfCareCcIdTypes | Array<TypeOfCareCcIdTypes>
  specialties?: Array<TypeOfCareSpecialtiesTypes>
  isVaEligible?: boolean
}

export type TypeOfSleepCareObjectType = {
  id: TypeOfCareIdTypes
  idV2: TypeOfCareIdV2Types
  name: TypeOfCareNameTypes
  isVaEligible?: boolean
}

export type TypeOfAudiologyCareObjectType = {
  ccId: TypeOfCareCcIdTypes
  idV2: TypeOfCareIdV2Types
  name: TypeOfCareNameTypes
  specialties?: Array<TypeOfCareSpecialtiesTypes>
  isVaEligible?: boolean
}

// Array for the type of care to always show on the select type of care screen on the request appointment flow
export const ALWAYS_SHOW_CARE_LIST: Array<TypeOfCareIdV2Types> = ['eyeParentCare', 'primaryCare', 'foodAndNutrition', 'covid', 'sleepParentCare', 'audiology', 'podiatry']

export const TYPE_OF_CARE: Array<TypeOfCareObjectType> = [
  {
    id: '323',
    idV2: 'primaryCare',
    name: 'Primary care',
    group: 'primary',
    ccId: 'CCPRMYRTNE',
    cceType: 'PrimaryCare',
    specialties: ['207QA0505X', '363LP2300X', '363LA2200X', '261QP2300X'],
  },
  {
    id: '160',
    idV2: 'clinicalPharmacyPrimaryCare',
    name: 'Pharmacy',
    group: 'primary',
  },
  {
    id: '502',
    idV2: 'outpatientMentalHealth',
    name: 'Mental health',
    group: 'mentalHealth',
  },
  {
    id: '125',
    idV2: 'socialWork',
    name: 'Social work',
    group: 'mentalHealth',
  },
  {
    id: '211',
    idV2: 'amputation',
    name: 'Amputation care',
    group: 'specialty',
  },
  {
    id: '203',
    idV2: 'audiology',
    name: 'Audiology and speech',
    label: 'Audiology and speech (including hearing aid support)',
    group: 'specialty',
    ccId: ['CCAUDHEAR', 'CCAUDRTNE'],
    cceType: 'Audiology',
  },
  {
    id: '372',
    idV2: 'moveProgram',
    name: 'MOVE! weight management program',
    group: 'specialty',
  },
  {
    id: '123',
    idV2: 'foodAndNutrition',
    name: 'Nutrition and food',
    group: 'specialty',
    ccId: 'CCNUTRN',
    cceType: 'Nutrition',
    specialties: ['133V00000X', '133VN1201X', '133N00000X', '133NN1002X'],
  },
  {
    id: 'tbd-podiatry',
    idV2: 'podiatry',
    name: 'Podiatry',
    label: 'Podiatry (only available online for Community Care appointments)',
    ccId: 'CCPOD',
    group: 'specialty',
    cceType: 'Podiatry',
    specialties: ['213E00000X', '213EG0000X', '213EP1101X', '213ES0131X', '213ES0103X'],
  },
  {
    id: 'SLEEP',
    name: 'Sleep medicine',
    idV2: 'sleepParentCare',
    group: 'specialty',
  },
  {
    id: 'EYE',
    name: 'Eye care',
    idV2: 'eyeParentCare',
    group: 'specialty',
  },
  {
    id: 'covid',
    idV2: 'covid',
    name: 'COVID-19 vaccine',
  },
]

export const TYPES_OF_SLEEP_CARE: Array<TypeOfSleepCareObjectType> = [
  {
    id: '349',
    idV2: 'cpap',
    name: 'Continuous Positive Airway Pressure (CPAP)',
  },
  {
    id: '143',
    idV2: 'homeSleepTesting',
    name: 'Sleep medicine and home sleep testing',
  },
]

export const TYPES_OF_EYE_CARE: Array<TypeOfEyeCareObjectType> = [
  {
    id: '408',
    idV2: 'optometry',
    name: 'Optometry',
    ccId: 'CCOPT',
    cceType: 'Optometry',
    specialties: ['152W00000X', '152WC0802X'],
  },
  {
    id: '407',
    idV2: 'ophthalmology',
    name: 'Ophthalmology',
  },
]

export const AUDIOLOGY_TYPES_OF_CARE: Array<TypeOfAudiologyCareObjectType> = [
  {
    ccId: 'CCAUDRTNE',
    idV2: 'audiology-routine exam',
    name: 'Routine hearing exam',
    specialties: ['231H00000X', '237600000X', '261QH0700X'],
  },
  {
    ccId: 'CCAUDHEAR',
    idV2: 'audiology-hearing aid support',
    name: 'Hearing aid support',
    specialties: ['231H00000X', '237600000X'],
  },
]

export type reasonForAppointmentIdTypes = 'routine-follow-up' | 'new-issue' | 'medication-concern' | 'other'

export type reasonForAppointmentShortNameTypes = 'Follow-up/Routine' | 'New issue' | 'Medication concern' | 'My reason isn’t listed'

export type reasonForAppointmentLabelTypes = 'Routine or follow-up visit' | 'New medical issue' | 'Concern or question about medication' | 'Other (please explain)'

export type reasonForAppointmentServiceNameTypes = 'Routine Follow-up' | 'New Issue' | 'Medication Concern' | 'Other'

export type reasonForAppointmentObjectType = {
  id: reasonForAppointmentIdTypes
  short: reasonForAppointmentShortNameTypes
  label: reasonForAppointmentLabelTypes
  serviceName: reasonForAppointmentServiceNameTypes
}

export const PURPOSE_TEXT: Array<reasonForAppointmentObjectType> = [
  {
    id: 'routine-follow-up',
    short: 'Follow-up/Routine',
    label: 'Routine or follow-up visit',
    serviceName: 'Routine Follow-up',
  },
  {
    id: 'new-issue',
    short: 'New issue',
    label: 'New medical issue',
    serviceName: 'New Issue',
  },
  {
    id: 'medication-concern',
    short: 'Medication concern',
    label: 'Concern or question about medication',
    serviceName: 'Medication Concern',
  },
  {
    id: 'other',
    short: 'My reason isn’t listed',
    label: 'Other (please explain)',
    serviceName: 'Other',
  },
]

export const typeOfCareWithSubCareId = ['audiology', 'eyeParentCare', 'sleepParentCare'] as const

export type TypeOfCareWithSubCareIdType = typeof typeOfCareWithSubCareId[number]

export type SubCareDataMappingType = Array<TypeOfAudiologyCareObjectType> | Array<TypeOfEyeCareObjectType> | Array<TypeOfSleepCareObjectType>

export const SubCareDataMapping: {
  audiology: SubCareDataMappingType
  eyeParentCare: SubCareDataMappingType
  sleepParentCare: SubCareDataMappingType
} = {
  sleepParentCare: TYPES_OF_SLEEP_CARE,
  audiology: AUDIOLOGY_TYPES_OF_CARE,
  eyeParentCare: TYPES_OF_EYE_CARE,
}

export type facilityTypeLabelTypes = 'VA medical center or clinic' | 'Community care'

export type facilityTypeValueTypes = 'va' | 'cc'

export const FacilityTypeValueMapping: {
  VA: facilityTypeValueTypes
  CC: facilityTypeValueTypes
} = {
  VA: 'va',
  CC: 'cc',
}

export type facilityTypeObjectType = {
  label: facilityTypeLabelTypes
  value: string
  a11yLabel?: string
}

// TODO move label to translations?
export const FACILITY_TYPE: Array<facilityTypeObjectType> = [
  {
    label: 'VA medical center or clinic',
    value: 'va',
    a11yLabel: 'V-A medical center or clinic',
  },
  {
    label: 'Community care',
    value: 'cc',
  },
]

export type visitTypeLabelTypes = 'In person' | 'Phone call' | 'Telehealth (through VA Video Connect)'

export type visitTypeObjectType = {
  label: visitTypeLabelTypes
  value: string
  a11yLabel?: string
}

// TODO move label to translations?
export const VISIT_TYPE: Array<visitTypeObjectType> = [
  {
    label: 'In person',
    value: 'clinic',
  },
  {
    label: 'Phone call',
    value: 'phone',
  },
  {
    label: 'Telehealth (through VA Video Connect)',
    value: 'telehealth',
    a11yLabel: 'Telehealth (through V-A Video Connect)',
  },
]

export const AVAILABLE_FOR_CC: Array<TypeOfCareIdV2Types> = ['primaryCare', 'optometry', 'audiology', 'podiatry', 'foodAndNutrition']

export type UserVAEligibilityAttributes = {
  services: Array<UserVAEligibilityService>
}
export type UserVAEligibilityService = {
  name: string
  requestEligibleFacilities: Array<string>
  directEligibleFacilities: Array<string>
}

export type UserVAEligibilityData = {
  data: {
    type: string
    id: string
    attributes: UserVAEligibilityAttributes
  }
}

export type UserFacilitiesAttributes = {
  facilities: Array<UserFacilityInfo>
}

export type UserFacilityInfo = {
  id: string
  name: string
  city: string
  state: string
  cerner: boolean
  miles: string
  clinics: Array<Record<string, unknown>> // Todo find out the object structure for clinics
}

export type UserFacilitiesData = {
  data: {
    type: string
    id: string
    attributes: UserFacilitiesAttributes
  }
}

export type UserCCEligibilityAttributes = {
  eligible: boolean
}

export type UserCCEligibilityData = {
  data: {
    type: string
    id: string
    attributes: UserCCEligibilityAttributes
  }
}

export type FormKindType = 'clinic' | 'cc' | 'telehealth' | 'phone'

export type FormStatusType = 'proposed' | 'booked'

export type CodeType = {
  code: string
}

export type FormReasonCodeType = {
  coding: Array<CodeType>
  text: string
}

export type FormRequestedPeriodsType = {
  start: string
  end: string
}

export type MethodOfContactType = {
  type: 'email' | 'phone'
  value: string
}

export type ContactType = {
  telecom: Array<MethodOfContactType>
}

export type TimesForPhoneCallType = 'Morning' | 'Afternoon' | 'Evening'

export type PreferredLocationType = {
  city: string
  state: string
}

export type ExtensionType = {
  desiredDate: string
}

export type SlotType = {
  id: string
}

export type CommonFormPropType = {
  kind: FormKindType
  status: FormStatusType
  locationId: string
  comment: string
}

export type AppointmentFlowRequestDataType = {
  serviceType: TypeOfCareIdV2Types
  reasonCode?: FormReasonCodeType
  requestedPeriods: Array<FormRequestedPeriodsType>
  contact: ContactType
  preferredTimesForPhoneCall?: TimesForPhoneCallType
  preferredLocation?: PreferredLocationType
  preferredLanguage?: string
} & CommonFormPropType

export type AppointmentFlowDirectDataType = {
  extension: ExtensionType
  slot: SlotType
} & CommonFormPropType

export type AppointmentFlowFormDataType = {
  // helper props that are not going to be sent to backend but are use to track selected data
  typeOfCareSelected?: TypeOfCareIdV2Types
  subTypeSelected?: TypeOfCareIdV2Types
  facilitySelected?: facilityTypeValueTypes
} & Partial<AppointmentFlowDirectDataType & AppointmentFlowRequestDataType>
