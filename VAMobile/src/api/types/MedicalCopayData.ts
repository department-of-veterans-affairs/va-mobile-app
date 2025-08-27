export type MedicalCopayDetail = {
  pDDatePosted?: string
  pDDatePostedOutput?: string
  pDTransDesc?: string
  pDTransDescOutput?: string
  pDTransAmt?: number
  pDTransAmtOutput?: string
  pDRefNo?: string
}

export type MedicalCopayStation = {
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

export type MedicalCopayRecord = {
  id: string

  pSSeqNum?: number
  pSTotSeqNum?: number
  pSFacilityNum?: string
  pSFacPhoneNum?: string
  pSTotStatement?: number
  pSStatementVal?: string
  pSStatementDate?: string
  accountNumber?: string
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
  pHStateOutput?: string
  pHZipCde?: string
  pHZipCdeOutput?: string
  pHCtryNme?: string
  pHCtryNmeOutput?: string

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
  pHroParaCdes?: string
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

export type MedicalCopayPayload = {
  data: MedicalCopayRecord
  status: number
}

export type MedicalCopaysPayload = {
  data: MedicalCopayRecord[]
  status: number
}
