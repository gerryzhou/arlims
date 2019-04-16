export interface FactsSubmissionResult {
   submissionTimestamp: string;
   submissionSucceeded: boolean;
   failureMessage?: string | null;
}

// latest result of FACTS submission by submission type.
export interface FactsSubmissionResultsByType {
   [submissionType: string]: FactsSubmissionResult;
}

export interface FactsSubmissionProcessResults {
   preconditionFailures: string[];
   factsSubmissionResultsByType: FactsSubmissionResultsByType;
}

// Represents a submission including both AOAC and BAM analyses, as key in FactsSubmissionResultsByType structure.
export const AOAC_BAM_SUBMT = 'AOAC+BAM';
