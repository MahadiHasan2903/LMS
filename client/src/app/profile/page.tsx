"use client";
import React, { useState } from "react";
import Protected from "@/hooks/useProtected";
import Heading from "@/utils/Heading";
import Header from "@/components/Header";
import Profile from "@/components/Profile/Profile";
import { useSelector } from "react-redux";

type Props = {};

const ProfilePage = (props: Props) => {
  const { user } = useSelector((state: any) => state.auth);
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name} profile`}
          description="Elearning is a platform for students to learn and get help from mentors"
          keywords="MERN & Nextjs"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  );
};

export default ProfilePage;
