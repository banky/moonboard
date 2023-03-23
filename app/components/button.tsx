import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { HoverShadow } from "./hover-shadow";

export const Button = ({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <HoverShadow>
      <button
        {...props}
        className={`bg-primary-brand border-outlines
        border-2 text-white font-bold p-2 px-4 rounded-md
        hover:bg-accent hover:text-text-standard 
        ${className}`}
      />
    </HoverShadow>
  );
};
