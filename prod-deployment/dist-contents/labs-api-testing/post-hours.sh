#!/bin/sh
rand=$((aRANDOM % 10000))
curl -i -d @- \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ..." \
  -H "sourceApplicationId: 0757" \
  -H "sourceTransactionId: A3WDBHDA${rand}" \
  "http://dih-svc.dev.fda.gov/LabsDataService/api/LabAccomplishmentHours" <<REQBODY
{
  "operationId":8661242,
  "labHoursList":[
    {"assignedToPersonId":437799,"analystTypeCode":"O","leadIndicator":"Y","remarks":"","statusCode":"I","hoursSpentNum":2.2,"hoursCreditedOrgName":"ARKL"},
    {"assignedToPersonId":454522,"analystTypeCode":"A","leadIndicator":"N","remarks":"","statusCode":"I","hoursSpentNum":1,"hoursCreditedOrgName":"ARKL"}
  ]
}
REQBODY
