"use client";

import Link from "next/link";
import React from "react";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  { name: "Courses", url: "/courses" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

type Props = {
  activeItem: number;
  isMobile: boolean;
};

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemsData &&
          navItemsData.map((item, index) => {
            const isItemActive = activeItem === index;

            return (
              <Link href={`${item.url}`} key={index} passHref>
                <span
                  className={`${
                    isItemActive
                      ? "dark:text-[#37a39a] text-[crimson]"
                      : "dark:text-white text-black"
                  } text-[18px] px-6 font-Poppins font-[400]`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
      </div>

      {isMobile && (
        <div className="mt-5 800px:hidden">
          <div className="w-full text-center py-3">
            <Link
              href="/"
              className={`text-[25px] font-Poppins font-[500] text-black  dark:text-white `}
            >
              𝓔𝓛𝓮𝓪𝓻𝓷𝓲𝓷𝓰
            </Link>
          </div>
          {navItemsData &&
            navItemsData.map((item, index) => {
              const isItemActive = activeItem === index;
              return (
                <Link href="/" key={index} passHref>
                  <span
                    className={`${
                      isItemActive
                        ? "dark:text-[#37a39a] text-[crimson]"
                        : "dark:text-white text-black"
                    } block py-6 text-[18px] px-6 font-Poppins font-[400]`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
        </div>
      )}
    </>
  );
};

export default NavItems;
