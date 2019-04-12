#!/bin/sh
personid=${1:-437799}
rand=$(((RANDOM % 10000)))
curl \
  -H "Accept: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev.fda.gov/LabsDataService/api/SampleTransfers?sampleTrackingNumber=852325&personid=$personId&maxRecords=5"
