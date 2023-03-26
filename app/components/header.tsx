import Link from "next/link";
import Image from "next/image";
import { ConnectKitButton } from "connectkit";
import { useRouter } from "next/router";

export const Header = () => {
  return (
    <header className=" bg-white px-8 border-b-2 border-black rounded-2xl">
      <div className="max-w-6xl mx-auto flex justify-between">
        <div className="flex items-center gap-8 py-4 ">
          <Link href="/">
            <Image width="112" height="30" alt="" src="/images/logo.png" />
          </Link>
          <div className="text-md flex gap-8 h-full">
            <HeaderButton href="/">Explore</HeaderButton>
            <HeaderButton href="/dashboard">Dashboard</HeaderButton>
          </div>
        </div>
        <div className="py-4">
          <ConnectKitButton />
        </div>
      </div>
    </header>
  );
};

type HeaderButtonProps = {
  href: string;
  children: React.ReactNode;
};

const HeaderButton = ({ href, children }: HeaderButtonProps) => {
  const { pathname } = useRouter();
  const selectedRoute =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <div className="flex flex-col relative justify-center group">
      <Link className={`${selectedRoute ? "font-bold" : ""}`} href={href}>
        {children}
      </Link>
      <div
        className={`h-1 -bottom-4 left-0 right-0 absolute ${
          selectedRoute ? "bg-green" : ""
        }`}
      />
    </div>
  );
};
