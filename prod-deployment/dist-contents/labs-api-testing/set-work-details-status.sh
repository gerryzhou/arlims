#!/bin/sh
rand=$((aRANDOM % 10000))
curl -i -d @- \
  -X PATCH \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev/LabsDataService/api/WorkDetails" <<REQBODY
{
  "operationId":8646420,
  "assignedToPersonId": 472629,
  "statusCode": "I"
}
REQBODY
~
