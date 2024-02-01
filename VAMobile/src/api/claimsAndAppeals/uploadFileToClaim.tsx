import { Asset } from 'react-native-image-picker'
import { find, map } from 'underscore'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ClaimDocUploadData, ClaimEventDocumentData, Params, contentTypes, post } from 'store/api'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { UploadFileToClaimParamaters } from 'api/types/ClaimsAndAppealsData'
import { claimsAndAppealsKeys } from './queryKeys'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

/**
 * Uploads a File to Claim
 */
export const uploadFileToClaim = async ({ claimID, request, files }: UploadFileToClaimParamaters) => {
  if (files.length > 1) {
    const fileStrings = files.map((file: DocumentPickerResponse | Asset) => {
      return file.base64
    })

    const payload = JSON.parse(
      JSON.stringify({
        files: fileStrings,
        trackedItemId: request.trackedItemId,
        document_type: request.documentType,
      }),
    )
    return post<ClaimDocUploadData>(`/v0/claim/${claimID}/documents/multi-image`, payload as unknown as Params)
  } else {
    const formData = new FormData()
    const fileToUpload = files[0]
    let nameOfFile: string | undefined
    let typeOfFile: string | undefined
    let uriOfFile: string | undefined

    if ('fileSize' in fileToUpload) {
      const { fileName, type, uri } = fileToUpload
      nameOfFile = fileName
      typeOfFile = type
      uriOfFile = uri
    } else if ('size' in fileToUpload) {
      const { name, uri, type } = fileToUpload
      nameOfFile = name
      typeOfFile = type
      uriOfFile = uri
    }
    // TODO: figure out why backend-upload reads images as 1 MB more than our displayed size (e.g. 1.15 MB --> 2.19 MB)
    formData.append(
      'file',
      JSON.parse(
        JSON.stringify({
          name: nameOfFile || '',
          uri: uriOfFile || '',
          type: typeOfFile || '',
        }),
      ),
    )

    formData.append('trackedItemId', JSON.parse(JSON.stringify(request.trackedItemId)))
    formData.append('documentType', JSON.parse(JSON.stringify(request.documentType)))
    await post<ClaimDocUploadData>(`/v0/claim/${claimID}/documents`, formData as unknown as Params, contentTypes.multipart)
  }
}

/**
 * Returns a mutation for Uploading a File to Claim
 */
export const useUploadFileToClaim = (claimID: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadFileToClaim,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [claimsAndAppealsKeys.claim, claimID] })
    },
    onError: (error) => {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, 'uploadFileToClaim: Service error')
      }
    },
  })
}

// creates the documents array after submitting a file request
export const createFileRequestDocumentsArray = (
  files: Array<Asset> | Array<DocumentPickerResponse>,
  trackedItemId: number | undefined,
  documentType: string,
  uploadDate: string,
): Array<ClaimEventDocumentData> => {
  return map(files, (item) => {
    let name: string | undefined

    if ('fileSize' in item) {
      name = item.fileName
    } else if ('size' in item) {
      name = item.name
    }

    const fileType = find(DocumentTypes526, (type) => {
      return type.value === documentType
    })

    return {
      trackedItemId,
      fileType: fileType ? fileType.label : '',
      filename: name,
      documentType,
      uploadDate,
    } as ClaimEventDocumentData
  })
}
/*
const { mutate: uploadFileToClaim } = useUploadFileToClaim()
const save = () => {

      const mutateOptions = {
        onMutate: () => {
            logAnalyticsEvent(Events.vama_claim_upload_start(claimID, request.trackedItemId || null, request.type, evidenceMethod))
        }
        onSuccess: async () => {
      logAnalyticsEvent(Events.vama_claim_upload_compl(claimID, request.trackedItemId || null, request.type, evidenceMethod))
      showSnackBar(messages.successMsg, dispatch, undefined, true)
    },
        onError: () => showSnackBar(messages.errorMsg, dispatch, retryFunction, false, true),
      }
      uploadFileToClaim(claimID: string, request: ClaimEventData, files: Array<Asset> | Array<DocumentPickerResponse>, evidenceMethod: 'file' | 'photo', mutateOptions)
    }

*/
