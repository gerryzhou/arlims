#!/bin/sh
rand=$((aRANDOM % 10000))
curl -i -d @- \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev/LabsDataService/api/SampleAnalysesMicrobiology" <<REQBODY
[
  {
     "operationId":8643036,
     "accomplishingOrgName":"ARKL",
     "performingOrgName": "ARKL-MICRO1",
     "actionIndicator":"Y",
     "problemCode":"MICROID",
     "genusCode":"SLML",
     "speciesCode":"SLML998",
     "methodSourceCode":"BAM",
     "methodCode":"T2004.03",
     "methodModificationIndicator":"N",
     "kitTestIndicator":"N",
     "lowestDilutionTestedCode": "1",
     "compositesExaminedNumber": 3,
     "subSamplesUsedCompositeNumber":15,
     "subSamplesDetectableFindingsNumber":1,
     "quantifiedIndicator":"N",
     "analysisResultsRemarksText":"{\"methodRemarks\":null,\"methodDetails\":{\"gramsPerSub\":25}}",
     "analysisMicFindings": null,
     "analysisMicKitTests": null
  }
]
REQBODY
~
