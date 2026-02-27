import { SummaryBinaryGetData } from 'api/types'

// AVS error message constants (must match those in utils/constants.js)
const AVS_ERROR_EMPTY_BINARY = 'Retrieved empty AVS binary'
const AVS_ERROR_RETRIEVAL = 'Error retrieving AVS binary'

const validBinary =
  'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9udCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAovRjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAwMDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAwMDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVFQ0VPRg=='
const invalidBinary = 'JVBERi0xLjQKJeLjz9M#INVALID-DATA$$%%123=='

// Even though the data on rails will be snake case, changed to camel here so that it aligns with data returned
// with the X-Key-Inflection header set to camel in apiRequestWithUrl

export const data = {
  testcerner001a: [
    { docId: '208750417891', binary: validBinary },
    { docId: '208750417892', binary: validBinary },
  ],
  testcerner002a: [{ docId: '208750417893', error: AVS_ERROR_EMPTY_BINARY }], // Simulate empty binary retrieval
  testcerner003a: [{ docId: '208750417894', binary: invalidBinary }],
  testcerner004a: [{ docId: '208750417895', binary: validBinary }],
  testcerner005a: [
    { docId: '208750417896', binary: invalidBinary },
    { docId: '208750417897', binary: validBinary },
  ],
  testcerner006a: [{ docId: '208750417898', error: AVS_ERROR_RETRIEVAL }],
  testcerner007a: [
    { docId: '208750417899', error: AVS_ERROR_RETRIEVAL },
    { docId: '208750417900', binary: validBinary },
  ],
} satisfies Record<string, SummaryBinaryGetData[]>
