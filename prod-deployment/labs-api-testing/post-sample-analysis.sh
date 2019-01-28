#!/bin/sh
rand=$(((RANDOM % 10000)))
curl -d @- \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.test.fda.gov/LabsDataService/api/SampleAnalysesMicrobiology" <<REQBODY
{
   "sampleTrackingNum": 848176,
   "sampleTrackingSubNumber": 0,
   "programAssignmentCode": "03819C",
   "workId": 6888784,
   "problemAreaFlag": "MICROID",
   "actionIndicator": "N",
   "analysisResultsRemarksText": "Analysis remarks text",
   "compositesExaminedNumber": 2,
   "createdBy": "454522",
   "methodCode": "T2004.03",
   "methodModificationIndicator": "N",
   "methodSourceCode": "AOAC",
   "problemCode": "SLML",
   "speciesCode": "SLML998",
   "quantifiedIndicator": "N",
   "examinedType": "COMPOSITES",
   "examinedNumber": 2,
   "subSamplesDetectableFindingsNumber": 0,
   "subSamplesUsedCompositeNumber": 1,
   "accomplishingOrgName": "ARKL"
}
REQBODY
