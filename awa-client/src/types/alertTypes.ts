export interface IConfirmation {
  askConfirm: boolean;
  title: string;
  message: string;
  confirm: () => void;
  cancel: () => void;
}

export interface IAlert {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  showAlert: boolean;
}