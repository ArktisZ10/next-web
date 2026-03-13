"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface DrawerLinkProps {
  href: string;
  children: ReactNode;
}

export function DrawerLink({ href, children }: DrawerLinkProps) {
  return (
    <Link 
      href={href} 
      onClick={() => {
        const checkbox = document.getElementById("nav-drawer") as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = false;
        }
      }}
    >
      {children}
    </Link>
  );
}