import Image from "next/image";
import React, { FC } from "react";
import avatarDefault from "../../../public/avatar.png";
import { FaUnlockAlt } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { CiLogout } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import Link from "next/link";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SidebarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  return (
    <div className="w-ful">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 1 ? "dark:bg-slate-800 bg-slate-400" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          width={20}
          height={20}
          src={
            user.avatar || avatar ? user.avatar.url || avatar : avatarDefault
          }
          alt="avatar"
          className=" 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
        />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          My Account
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 2 ? "dark:bg-slate-800 bg-slate-400" : "bg-transparent"
        }`}
        onClick={() => setActive(2)}
      >
        <FaUnlockAlt size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Change Passoword
        </h5>
      </div>
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 3 ? "dark:bg-slate-800 bg-slate-400" : "bg-transparent"
        }`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Enrolled Courses
        </h5>
      </div>
      {user.role === "admin" && (
        <Link
          href="/admin"
          className={`w-full flex items-center px-3 py-4 cursor-pointer ${
            active === 4 ? "dark:bg-slate-800 bg-slate-400" : "bg-transparent"
          }`}
        >
          <MdDashboard size={20} className="dark:text-white text-black" />
          <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
            Admin Dashboard
          </h5>
        </Link>
      )}
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${
          active === 4 ? "dark:bg-slate-800 bg-slate-400" : "bg-transparent"
        }`}
        onClick={() => logoutHandler()}
      >
        <CiLogout size={20} className="dark:text-white text-black" />
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Logout
        </h5>
      </div>
    </div>
  );
};

export default SidebarProfile;
