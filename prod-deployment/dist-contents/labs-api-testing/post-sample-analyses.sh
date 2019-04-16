#!/bin/sh
rand=$((aRANDOM % 10000))
curl -i -d @- \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev.fda.gov/LabsDataService/api/SampleAnalysesMicrobiology" <<REQBODY
{
  "sampleAnalysisMicrobiologyList": [
    {
      "operationId": 6889192,
      "accomplishingOrgName": "ARKL",
      "actionIndicator": "Y",
      "problemCode": "MICROID",
      "genusCode": "SLML",
      "speciesCode": "SLML998",
      "methodSourceCode": "AOAC",
      "methodCode": "T2004.03",
      "methodModificationIndicator": "N",
      "kitTestIndicator": "N",
      "lowestDilutionTestedCode": "1",
      "quantifiedIndicator": "N",
      "subSamplesDetectableFindingsNumber": 1,
      "compositesExaminedNumber": 1,
      "subSamplesUsedCompositeNumber": 15,
      "subSamplesExaminedNumber": null,
      "analysisResultsRemarksText": "{\"methodRemarks\":null,\"methodDetails\":{\"vidasHoursFromSampleReceipt\":0,\"lotCodes\":[\"RV-233322\",\"RV-7361256\",\"TT-123121\",\"BG-12312\",\"I2KI-12323\",\"MB-23423\"],\"gramsPerSub\":25}}",
      "analysisMicFindings": [],
      "analysisMicKitTests": null
    },
    {
      "operationId": 6889192,
      "accomplishingOrgName": "ARKL",
      "actionIndicator": "Y",
      "problemCode": "MICROID",
      "genusCode": "SLML",
      "speciesCode": "SLML998",
      "methodSourceCode": "BAM",
      "methodCode": "B160",
      "methodModificationIndicator": "N",
      "kitTestIndicator": "N",
      "lowestDilutionTestedCode": "1",
      "quantifiedIndicator": "N",
      "subSamplesDetectableFindingsNumber": 1,
      "compositesExaminedNumber": 1,
      "subSamplesUsedCompositeNumber": 15,
      "subSamplesExaminedNumber": null,
      "analysisResultsRemarksText": "all finished",
      "analysisMicFindings": [
        {
          "actionIndicator": "Y",
          "subNumberCode": "1",
          "genusCode": "SLML",
          "speciesCode": "SLML998",
          "secondaryPafCode": "SAL",
          "presenceResultIndicator": "POS",
          "atypicalReactionCode": "N",
          "atypicalReactionRemarksText": null,
          "isolatesSentNumber": 1,
          "isolatesSentIndicator": "Y",
          "fdaLabOrgName": "ARKL",
          "remarksText": "Test entry from ALIS"
        }
      ],
      "analysisMicKitTests": null
    }
  ]
}
REQBODY
~
