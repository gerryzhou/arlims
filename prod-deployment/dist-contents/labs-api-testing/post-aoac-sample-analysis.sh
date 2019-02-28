#!/bin/sh
rand=$((aRANDOM % 10000))
curl -i -d @- \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev/LabsDataService/api/SampleAnalysesMicrobiology" <<REQBODY
{ "sampleAnalysisMicrobiologyList": [
{
  "operationId":8661297,
  "accomplishingOrgName":"ARKL",
  "performingOrgName":"ARL-MICRO2",
  "actionIndicator":"Y",
  "problemCode":"MICROID",
  "genusCode":"SLML",
  "speciesCode":"SLML998",
  "methodSourceCode":"AOAC",
  "methodCode":"T2004.03",
  "methodModificationIndicator":"N",
  "kitTestIndicator":"Y",
  "lowestDilutionTestedCode":"1",
  "quantifiedIndicator":"N",
  "subSamplesDetectableFindingsNumber":1,
  "compositesExaminedNumber":1,
  "subSamplesExaminedNumber":null,
  "subSamplesUsedCompositeNumber":15,
  "analysisResultsRemarksText":"{\"methodRemarks\":null,\"methodDetails\":{\"gramsPerSub\":25}}",
  "analysisMicFindings":[],
  "analysisMicKitTests":[
    {"conventionalMethodResultCode":"NA",
     "rapidMethodResultCode":"POS",
     "spikingGenusSpeciesText":"S. cerro",
     "spikingResultCode":"POS",
     "subsampleNumberCode":"1",
     "selectiveAgarResultCode":"",
     "selectiveAgarText":"",
     "analysisMicrobiologyKitId":null,
     "kitRemarksText":"6 CFU/100uL"
    }
  ]
}
]}
REQBODY
~
