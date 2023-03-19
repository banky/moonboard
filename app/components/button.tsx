import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

export const Button = ({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button
      {...props}
      className={`bg-blue-2 text-white font-bold p-2 px-4 rounded-md ${className}`}
    />
  );
};
