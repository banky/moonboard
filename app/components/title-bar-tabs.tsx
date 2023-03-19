import Link from "next/link";
import { useRouter } from "next/router";

export const TitleBarTabs = () => {
  return (
    <div className="flex gap-4 h-full">
      <Tab filter="all">All</Tab>
      <Tab filter="moonpins">Moonpins</Tab>
      <Tab filter="moonboards">Moonboards</Tab>
    </div>
  );
};

type TabProps = {
  filter: string;
  children: React.ReactNode;
};

const Tab = ({ filter, children }: TabProps) => {
  const { query } = useRouter();
  const isActive =
    query.filter === filter || (!query.filter && filter === "all");

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
