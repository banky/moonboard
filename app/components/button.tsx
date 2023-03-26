import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";
import { HoverShadow } from "./hover-shadow";
import { LoadingSpinner } from "./loading-spinner";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
};

export const Button = ({
  className = "",
  loading = false,
  ...props
}: ButtonProps) => {
  const children = loading ? <LoadingSpinner /> : props.children;

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`bg-primary-brand border-outlines
        border-2 text-white font-bold p-2 px-4 rounded-md 
        enabled:hover:bg-accent enabled:hover:text-text-standard 
        enabled:hover:drop-shadow-[5px_5px_0_rgba(30,30,30,1)]
        enabled:fill-outlines disabled:bg-transparent
        disabled:text-text-low-contrast disabled:border-text-low-contrast
        disabled:fill-text-low-contrast
        min-w-[150px] transition
        ${className}`}
    >
      {children}
    </button>
  );
};
