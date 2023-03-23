import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { HoverShadow } from "./hover-shadow";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = ({ className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`bg-primary-brand border-outlines
        border-2 text-white font-bold p-2 px-4 rounded-md
        enabled:hover:bg-accent enabled:hover:text-text-standard 
        enabled:hover:drop-shadow-[5px_5px_0_rgba(30,30,30,1)]
        ${className}`}
    />
  );
};
