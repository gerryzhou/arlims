#!/bin/sh
rand=$(((RANDOM % 10000)))
curl \
  -H "Accept: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.test.fda.gov/LabsDataService/api/SampleAnalyses/$1"

