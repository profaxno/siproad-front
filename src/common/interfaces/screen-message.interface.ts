import { ScreenMessageTypeEnum } from "../enums/screen-message-type-enum";

export type ScreenMessageInterface = {
  type    : ScreenMessageTypeEnum;
  title   : string;
  message : string;
  show    : boolean;
};
