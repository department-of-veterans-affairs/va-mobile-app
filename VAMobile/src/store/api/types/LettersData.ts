export type LetterData = {
  name: string
  letterType: string
}

export type LettersList = Array<LetterData>

export type LettersData = {
  data: {
    type: string
    id: string
    attributes: {
      letters: LettersList
    }
  }
}
