import { ReactNode } from "react";

export const HoverShadow = ({ children }: { children: ReactNode }) => {
  return (
    <div className="hover:drop-shadow-[5px_5px_0_rgba(30,30,30,1)]">
      {children}
    </div>
  );
};
