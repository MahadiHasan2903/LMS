"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Heading from "@/utils/Heading";
import React, { FC, useState } from "react";

interface Props {}

const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Heading
        title="Elearning"
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
      <Hero />
    </div>
  );
};

export default Page;
