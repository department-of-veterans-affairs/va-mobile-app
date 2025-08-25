export interface MedicalCopayDetail {
  pDDatePosted?: string
  pDDatePostedOutput?: string
  pDTransDesc?: string
  pDTransDescOutput?: string
  pDTransAmt?: number
  pDTransAmtOutput?: string
  pDRefNo?: string
}

export interface MedicalCopayStation {
  facilitYNum?: string
  visNNum?: string
  facilitYDesc?: string
  cyclENum?: string
  remiTToFlag?: string
  maiLInsertFlag?: string
  staTAddress1?: string
  staTAddress2?: string
  staTAddress3?: string
  city?: string
  state?: string
  ziPCde?: string
  ziPCdeOutput?: string
  baRCde?: string
  teLNumFlag?: string
  teLNum?: string
  teLNum2?: string
  contacTInfo?: string
  dM2TelNum?: string
  contacTInfo2?: string
  toPTelNum?: string
  lbXFedexAddress1?: string
  lbXFedexAddress2?: string
  lbXFedexAddress3?: string
  lbXFedexCity?: string
  lbXFedexState?: string
  lbXFedexZipCde?: string
  lbXFedexBarCde?: string
  lbXFedexContact?: string
  lbXFedexContactTelNum?: string
}

export interface MedicalCopayRecord {
  id: string

  pSSeqNum?: number
  pSTotSeqNum?: number
  pSFacilityNum?: string
  pSFacPhoneNum?: string
  pSTotStatement?: number
  pSStatementVal?: string
  pSStatementDate?: string
  pSStatementDateOutput?: string
  pSProcessDate?: string
  pSProcessDateOutput?: string

  pHPatientLstNme?: string
  pHPatientFstNme?: string
  pHPatientMidNme?: string
  pHAddress1?: string
  pHAddress2?: string
  pHAddress3?: string
  pHCity?: string
  pHState?: string
  pHZipCde?: string
  pHZipCdeOutput?: string
  pHCtryNme?: string

  pHAmtDue?: number
  pHAmtDueOutput?: string
  pHPrevBal?: number
  pHPrevBalOutput?: string
  pHTotCharges?: number
  pHTotChargesOutput?: string
  pHTotCredits?: number
  pHTotCreditsOutput?: string
  pHNewBalance?: number
  pHNewBalanceOutput?: string

  pHSpecialNotes?: string
  pHROParaCdes?: string
  pHNumOfLines?: number
  pHDfnNumber?: number

  pHCernerStatementNumber?: number
  pHCernerPatientId?: string
  pHCernerAccountNumber?: string

  pHIcnNumber?: string
  pHAccountNumber?: number
  pHLargeFontIndcator?: number

  station: MedicalCopayStation
  details: MedicalCopayDetail[]
}

export interface MedicalCopayPayload {
  data: MedicalCopayRecord
  status: number
}

export interface MedicalCopaysPayload {
  data: MedicalCopayRecord[]
  status: number
}
