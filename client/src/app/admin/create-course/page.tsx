"use client";

import React from "react";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import Heading from "@/utils/Heading";
import CreateCourse from "@/components/Admin/CreateCourse";
import DashboardHeader from "@/components/Admin/DashboardHeader";

type Props = {};

const CreateCoursePage = (props: Props) => {
  return (
    <div>
      <Heading
        title="Create Course - Elearning"
        description="Elearning is a platform for students to learn and get help from mentors"
        keywords="MERN & Nextjs"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <CreateCourse />
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
