import { ReactElement } from "react";

export type Position = "top" | "bottom" | "left" | "right";

export type PopoverProps = {
  children: ReactElement;
  content: string;
  position?: Position;
};
