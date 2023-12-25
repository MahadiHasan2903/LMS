"use client";

import AdminProtected from "@/hooks/adminProtected";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import Heading from "@/utils/Heading";
import React from "react";
import DashboardHero from "@/components/Admin/DashboardHero";

type Props = {};

const AdminDashboard = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title="Admin Dashboard - Elearning"
          description="Elearning is a platform for students to learn and get help from mentors"
          keywords="MERN & Nextjs"
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5 ">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default AdminDashboard;
