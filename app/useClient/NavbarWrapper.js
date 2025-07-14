"use client"
import { usePathname } from "next/navigation"
import Navbar from "../components/Navbar";

const hideNavbaronpaths = ["/questions/"]

export const NavbarWrapper = () => {
  const pathname = usePathname();
  const shouldHideNavbar = hideNavbaronpaths.some((path) => pathname.startsWith(path));

  if(shouldHideNavbar){
    return null;  
  }
  return !shouldHideNavbar && <Navbar />;
}