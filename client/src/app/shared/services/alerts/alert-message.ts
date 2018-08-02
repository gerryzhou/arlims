
export interface AlertMessage {
   type: 'success' | 'info' | 'warning' | 'danger';
   text: string;
   detailLines: string[] | null;
}
