import React from "react";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex items-center justify-around py-4">
      <Link href="/" className="text-2xl font-bold text-[#dc2626]">
        tubechapters
      </Link>
      <div className="flex gap-x-8 items-center">
        <Link href="#about" className="text-primary text-base font-normal">
          About
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
