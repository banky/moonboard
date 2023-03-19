import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "./button";

type TitleBarTabsProps = {
  children: React.ReactNode;
};
export const TitleBarTabs = ({ children }: TitleBarTabsProps) => {
  return <div className="flex gap-4 h-full">{children}</div>;
};

type TabProps = {
  filter: string;
  children: React.ReactNode;
  isDefault?: boolean;
};

export const Tab = ({ filter, children, isDefault = false }: TabProps) => {
  const { query } = useRouter();
  const isActive =
    query.filter === filter || (query.filter === undefined && isDefault);

  return (
    <div className="flex flex-col relative justify-center group min-w-[50px]">
      <Link
        className={`h-full flex items-center mx-auto ${
          isActive ? "font-bold" : ""
        }`}
        href={`?filter=${filter}`}
      >
        {children}
      </Link>
      <div
        className={`h-0.5 bottom-0 left-0 right-0 absolute ${
          isActive ? "bg-blue" : ""
        } group-hover:bg-green`}
      />
    </div>
  );
};
