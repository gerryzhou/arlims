import {FactsSubmissionResultsByType} from '../../lab-tests/microbiology/salmonella/test-data';

export interface FactsSubmissionResult {
   submissionTimestamp: string;
   submissionSucceeded: boolean;
   failureMessage?: string | null;
}

export interface FactsSubmissionProcessResults {
   preconditionFailures: string[];
   factsSubmissionResultsByType: FactsSubmissionResultsByType;
}
