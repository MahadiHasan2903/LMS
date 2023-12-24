"use client";

import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import avatarIcon from "../../../public/avatar.png";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "@/styles/style";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "@/redux/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import toast from "react-hot-toast";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const [
    editProfile,
    { isSuccess: editProfileSuccess, error: editProfileError },
  ] = useEditProfileMutation();

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
    console.log("Image Uploaded");
  };

  useEffect(() => {
    if (isSuccess || editProfileSuccess) {
      setLoadUser(true);
    }
    if (error || editProfileError) {
      console.log("Error while uploading an image:", error);
    }
    if (editProfileSuccess) {
      toast.success("Profile updated successfully");
    }
  }, [isSuccess, error, editProfileSuccess, editProfileError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
      });
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            width={120}
            height={120}
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            alt="avatar"
            className="w-[120px] h-[120px] border-[3px] border-[#37a39a] cursor-pointer rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png, image/jpg, image/jpeg/ image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px]  h-[30px] bg-slate-900 flex rounded-full absolute bottom-2 right-2 items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2 text-black dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              />
            </div>
            <div className="w-[100%] pt-4">
              <label className="block pb-2 text-black dark:text-white">
                Email address
              </label>
              <input
                type="email"
                required
                value={user?.email}
                className={`${styles.input} !w-[95%] mb-2 800px:mb-0`}
              />
            </div>
            <input
              type="submit"
              required
              className={`w-[95%] 800px:[200px] h-[40px] transition-all\ hover:bg-[#37a39a] hover:text-white border border-[#37a39a] text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
              value="Updated"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileInfo;
