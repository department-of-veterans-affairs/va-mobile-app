export type IndividualRatingData = {
  decision: string
  effectiveDate: string
  ratingPercentage: number
  diagnosticText: string
  type: string
}

export type RatingData = {
  combinedDisabilityRating: number
  combinedEffectiveDate: string
  legalEffectiveDate: string
  individualRatings: Array<IndividualRatingData>
}

export type DisabilityRatingData = {
  data: {
    type: string
    id: string
    attributes: RatingData
  }
}
