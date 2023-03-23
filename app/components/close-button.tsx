import { Button, ButtonProps } from "./button";

export const IconButton = ({ className = "", ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      className={`bg-transparent enabled:hover:bg-secondary-light ${className}`}
    ></Button>
  );
};
