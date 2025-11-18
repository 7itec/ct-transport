import useApiMutation from "hooks/use-api-mutations";

export enum ReceiptTypeEnum {
  DIGITAL_SIGNATURE = "DIGITAL_SIGNATURE",
  RECEIPT_PHOTO = "RECEIPT_PHOTO",
}

const useUploadReceipt = (attendanceId: string) => {
  return useApiMutation({
    method: "PATCH",
    url: `/jobs/${attendanceId}/delivery-receipt`,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    errorTitle: "Erro ao enviar ",
  });
};

export default useUploadReceipt;
