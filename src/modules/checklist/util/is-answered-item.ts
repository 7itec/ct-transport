import { AnsweredChecklistItemProps } from "../types";

const isAnsweredItem = (object: any): object is AnsweredChecklistItemProps => {
  return !!object.checklistItem;
};

export default isAnsweredItem;
