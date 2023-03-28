import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="my-8 mt-16">
      <p className="text-center">
        A project by{" "}
        <Link className="underline" href="https://twitter.com/0xbanky">
          0xbanky
        </Link>{" "}
        and{" "}
        <Link className="underline" href="https://twitter.com/ArtusMichal">
          ArtusMichal
        </Link>
      </p>
    </footer>
  );
};
