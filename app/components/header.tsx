import Link from "next/link";
import Image from "next/image";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";

export const Header = () => {
  return (
    <header className="flex justify-between bg-white p-4 px-8 border-b-2">
      <div className="flex items-center gap-8">
        <Link href="/">
          <Image width="168" height="45" alt="" src="/images/logo.png" />
        </Link>
        <div className="text-xl flex gap-8 h-full">
          <HeaderButton href="/">Explore</HeaderButton>
          <HeaderButton href="/dashboard">Dashboard</HeaderButton>
        </div>
      </div>
      <ConnectKitButton />
    </header>
  );
};

type HeaderButtonProps = {
  href: string;
  children: React.ReactNode;
};

const HeaderButton = ({ href, children }: HeaderButtonProps) => {
  const { pathname } = useRouter();
  const selectedRoute = pathname === href;

  return (
    <div className="flex flex-col relative justify-center group">
      <Link
        className={`${selectedRoute ? "font-bold" : ""} h-full`}
        href={href}
      >
        {children}
      </Link>
      <div
        className={`h-1 bottom-0 left-0 right-0 absolute ${
          selectedRoute ? "bg-blue" : ""
        } group-hover:bg-green`}
      />
    </div>
  );
};
