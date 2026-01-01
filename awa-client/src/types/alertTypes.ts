export interface IConfirmation {
  askConfirm: boolean;
  title: string;
  message: string;
  confirm: () => void;
  cancel: () => void;
}