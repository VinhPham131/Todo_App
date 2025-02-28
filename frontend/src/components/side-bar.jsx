import React, { use } from "react";
import { Sidebar } from "flowbite-react";
import { HiHome, HiUsers } from "react-icons/hi";
import { useLocation } from "react-router-dom";

export default function SideBar() {
    const location = useLocation();

    const customTheme = {
        root: {
            inner: "bg-black p-4 h-screen",
        },
        item: {
            base: "flex items-center gap-4 text-white rounded-lg px-4 py-2 transition-all",
            active: "bg-gray-700",
            hover: "bg-gray-600",
            icon: "text-white text-xl",
            text: "text-white",
        }
    };

    return (
        <Sidebar theme={customTheme}>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item
                        href="/"
                        icon={HiHome}
                        active={location.pathname === "/"}
                    >Home
                    </Sidebar.Item>
                    <Sidebar.Item
                        href="/user-management"
                        icon={HiUsers}
                        active={location.pathname === "/user-management"}
                    >User Management
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
