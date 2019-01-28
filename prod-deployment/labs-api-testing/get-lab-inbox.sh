#!/bin/sh
rand=$(((RANDOM % 10000)))
curl \
  -H "Accept: application/json" \
  -H "Authorization: Basic <SEE APP DEBUG LOG FOR VALUE>" \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.test.fda.gov/LabsDataService/api/LabsInbox?accomplishingOrgName=ARKL&statusCodes=S,A,I,O&maxRecords=5"
