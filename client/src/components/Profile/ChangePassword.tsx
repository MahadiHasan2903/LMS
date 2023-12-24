"use client";

import React, { FC, useEffect, useState } from "react";
import { styles } from "../../styles/style";
import { useChangePasswordMutation } from "@/redux/user/userApi";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: FC<Props> = (props) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, { isSuccess, error }] = useChangePasswordMutation();

  const passwordChangeHandler = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords didn't match");
    } else {
      await changePassword({ oldPassword, newPassword });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password changed successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message || "Invalid old password");
      } else {
        toast.error(error as any);
      }
    }
  }, [isSuccess, error]);

  return (
    <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2 ">
        Change Password
      </h1>
      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your old password
            </label>
            <input
              type="password"
              value={oldPassword}
              required
              onChange={(e) => setOldPassword(e.target.value)}
              className={`${styles.input}text-black dark:text-[#fff] !w-[95!] mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block text-black dark:text-[#fff] pb-2">
              Enter new password
            </label>
            <input
              type="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${styles.input}text-black dark:text-[#fff] !w-[95!] mb-4 800px:mb-0`}
            />
          </div>
          <div className="w-[100%] 800px:w-[60%] mt-2">
            <label className="block text-black dark:text-[#fff] pb-2">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${styles.input} text-black dark:text-[#fff] !w-[95!] mb-4 800px:mb-0`}
            />
            <input
              type="submit"
              required
              className={`w-[100%] 800px:[200px] h-[40px] transition-all\ hover:bg-[#37a39a] hover:text-white border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
              value="Updated"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
