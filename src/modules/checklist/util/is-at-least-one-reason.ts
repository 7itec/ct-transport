import { ReasonProps } from "../types";

export const isAtLeastOneReason = (reason: ReasonProps) =>
  reason.text ||
  reason.video ||
  reason.audio ||
  (reason.images && reason.images?.length > 0);
