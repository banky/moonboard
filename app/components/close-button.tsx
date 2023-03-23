import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { Close } from "svg/close";
import { Button, ButtonProps } from "./button";

export const CloseButton = ({ className = "", ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      className={`bg-transparent enabled:hover:bg-secondary-light ${className}`}
    >
      <Close />
    </Button>
  );
};
