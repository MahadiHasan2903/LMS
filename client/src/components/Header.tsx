"use client";

import NavItems from "@/utils/NavItems";
import ThemeSwitcher from "@/utils/ThemeSwitcher";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { TbMenuDeep } from "react-icons/tb";
import { HiOutlineUserCircle } from "react-icons/hi";
import CustomeModal from "@/utils/CustomeModal";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import Verification from "./Authentication/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import avatar from "../../public/avatar.png";
import { useSession } from "next-auth/react";
import {
  useLogoutQuery,
  useSocialAuthMutation,
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, setRoute, open, route }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  // console.log(user);
  const { data } = useSession();
  // console.log(data);
  const [logout, setLogout] = useState(false);
  const {} = useLogoutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image,
        });
      }
    }
    if (data === null) {
      if (isSuccess) {
        toast.success("Login is Successful");
      }
    }
    if (data === null) {
      setLogout(true);
    }
  }, [data, user]);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  const handleSidebar = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href="/"
                className={`text-[25px] font-Poppins font-[500] text-black  dark:text-white `}
              >
                𝓔𝓛𝓮𝓪𝓻𝓷𝓲𝓷𝓰
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />

              {/* only for mobile */}

              <div className="800px:hidden">
                <TbMenuDeep
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>

              {user ? (
                <Link href="/profile">
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    width={30}
                    height={30}
                    alt={user.name}
                    className=" rounded-full"
                    style={{
                      border: activeItem === 5 ? "2px solid #37a39a" : "none",
                    }}
                    onClick={() => setOpen(true)}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {openSidebar && (
          <div
            className="block 800px:hidden fixed w-full h-screen left-0 top-0 z-[9999999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleSidebar}
            id="screen"
          >
            <div className="fixed w-[70%] h-screen right-0 top-0 z-[999999999] dark:bg-opacity-90 dark:bg-slate-900 bg-white">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="ml-3"> Copyright &copy; 2023 ELearning</p>
            </div>
          </div>
        )}
      </div>

      {route === "Login" && (
        <>
          {open && (
            <CustomeModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route === "SignUp" && (
        <>
          {open && (
            <CustomeModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomeModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
