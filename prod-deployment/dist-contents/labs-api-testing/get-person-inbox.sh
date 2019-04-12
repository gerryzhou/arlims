#!/bin/sh
rand=$(((RANDOM % 10000)))
personid=${1:-437799}
curl \
  -H "Accept: application/json" \
  -H "Authorization: Basic <SEE APP DEBUG LOG FOR VALUE>" \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev.fda.gov/LabsDataService/api/PersonInbox?personId=$personid&statusCodes=S,T,I&maxRecords=50&allowNullValues=Y"
