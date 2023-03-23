import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "./button";

type TitleBarTabsProps = {
  children: React.ReactNode;
};
export const TitleBarTabs = ({ children }: TitleBarTabsProps) => {
  return (
    <div className="flex border-2 rounded-md border-outlines">{children}</div>
  );
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
    <div
      className={`overflow-clip border-r-2 border-r-outlines last:border-r-0 px-4 py-2 
    ${isActive ? "bg-secondary-brand" : ""}`}
    >
      <Link className={`mx-auto`} href={`?filter=${filter}`}>
        {children}
      </Link>
    </div>
  );
};
