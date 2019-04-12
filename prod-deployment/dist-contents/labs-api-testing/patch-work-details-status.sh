#!/bin/sh
rand=$((aRANDOM % 10000))
curl -i -d @- \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev.fda.gov/LabsDataService/api/WorkDetails" <<REQBODY
{
  "operationId":8646420,
  "assignedToPersonId": 437799,
  "statusCode": "I"
}
REQBODY
~
