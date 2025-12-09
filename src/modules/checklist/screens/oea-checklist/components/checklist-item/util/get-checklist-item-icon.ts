export default (type?: string) => {
  if (type === 'APPROVED') return 'checkmark-circle-outline';
  if (type === 'DISAPPROVED') return 'close-circle-outline';
  return 'alert-circle-outline';
};
