"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/partials/Sidebar/SidebarItem";
import ClickOutside from "@/components/partials/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faUserTie, faImages} from "@fortawesome/free-solid-svg-icons";


const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth="1.5"
                 stroke="currentColor"
                 className="w-6 h-6">
              <path strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.5h4.5v4.5H3.75V4.5zm0 9.75h4.5v4.5H3.75v-4.5zM13.5
           4.5h4.5v4.5h-4.5V4.5zm0 9.75h4.5v4.5h-4.5v-4.5z"/>
            </svg>
        ),
        label: "Dashboard",
        route: "/",
      },
      {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth="1.5"
                 stroke="currentColor"
                 className="w-6 h-6">
              <path strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 7.125V6c0-.621.504-1.125
           1.125-1.125h.75M4.5 7.125h15m-15
           0V21h15V7.125H4.5zM14.25
           10.875h1.5m-3 3h1.5m-3
           3h1.5m1.5-3h1.5m-1.5
           3h1.5"/>
            </svg>
        ),
        label: "Events",
        route: "#",
        children: [
          {label: "All Events", route: "/events"},
        ]
      },
      {
        icon: (
            <FontAwesomeIcon icon={faUserTie} />
        ),
        label: "Staff",
        route: "#",
        children: [
          {label: "All Staff", route: "/staff"},
        ]
      },
      {
        icon: (
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
              <path
                  d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502Z"/>
            </svg>
        ),
        label: "Testimonials",
        route: "/testimonials",
      },
      {
        icon: (
            <FontAwesomeIcon icon={faImages} />
        ),
        label: "Media Library",
        route: "/media",
      },
      {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 strokeWidth="1.5"
                 stroke="currentColor"
                 className="w-6 h-6">
              <path strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75l3.17-4.125A1.125
           1.125 0 016.87 2.25h10.36c.356
           0 .693.158.92.375l3.6
           4.125M2.25 6.75V21h19.5V6.75H2.25z
           M15.75 9a3 3 0 11-6 0
           3 3 0 016 0z"/>
            </svg>
        ),
        label: "Gallery",
        route: "/gallery"
      },
    ],
  },
  {
    name: "STATIC PAGES",
    menuItems: [
      {
        label: "Home",
        route: "/static/home",
      },
      {
        label: "About Us",
        route: "/static/about",
      },
      {
        label: "Coaching Staff",
        route: "/static/coaching-staff",
      },
      {
        label: "Gallery",
        route: "/static/gallery",
      },
      {
        label: "Events",
        route: "/static/events",
      },
      {
        label: "Newsletter",
        route: "/static/newsletter",
      },
      {
        label: "Testimonials",
        route: "/static/testimonials",
      },
      {
        label: "Contact",
        route: "/static/contact",
      }
    ],
  },
  {
    name: "FORMS",
    menuItems: [
      {
        label: "Join Us",
        route: "/form/join-us",
      },
      {
        label: "Newsletter",
        route: "/form/newsletter",
      },
      {
        label: "Contact",
        route: "/form/contact",
      },
    ],
  },
  {
    name: "SETTINGS",
    menuItems: [
      {
        icon: (
            <FontAwesomeIcon icon={faUser} />
        ),
        label: "Users",
        route: "/users",
      },
    ],
  }
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link className="flex justify-center items-center w-full" href="/">
            <Image
              width={176}
              height={32}
              src={"/logo.png"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;