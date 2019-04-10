export interface SampleOpStatus {
   code: SampleOpStatusCode;
   displayName: string;
}

export type SampleOpStatusCode = 'P' | 'A' |'S' | 'I' | 'T' | 'O' |  'M' | 'C';


export const SAMPLE_OP_STATUSES: SampleOpStatus[] = [
   {code: 'P', displayName: 'Pending'},
   {code: 'A', displayName: 'Accepted'},
   {code: 'S', displayName: 'Assigned'},
   {code: 'I', displayName: 'In Progress'},
   {code: 'T', displayName: 'Returned to Assignee'},
   {code: 'O', displayName: 'Original Completed'},
   {code: 'M', displayName: 'Completed'},
   {code: 'C', displayName: 'Complete'},
];

export const SAMPLE_OP_STATUS_CODES = SAMPLE_OP_STATUSES.map(sos => sos.code);

export function factsStatusTextFromCode(factsStatus: string)
{
   switch (factsStatus)
   {
      // most common, "active" codes
      case 'S': return 'Assigned';          // assigned to individual analyst(s)
      case 'I': return 'In Progress';       // analyst(s) work in progress
      case 'O': return 'Original Completed'; // analyst work completed, ready for final review and sign-off
      // less-used codes
      case 'P': return 'Pending';  // initial status, prior to being received at lab facility
      case 'A': return 'Accepted'; // received at facility but not yet assigned: ready for admin to assign to user
      case 'T': return 'Returned to Assignee';
      case 'C': return 'Complete'; // final status, all done
      default: return factsStatus;
   }
}

