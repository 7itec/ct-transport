import { colors } from "assets/colors";

export default (type?: string) => {
  if (type === "APPROVED") return colors.success;
  if (type === "DISAPPROVED") return colors.error;
  return colors.warn;
};
