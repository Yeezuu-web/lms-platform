import React from 'react';
import { ModeToggle } from './mode-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';

export default function Navbar({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <div className="w-full h-full flex items-center px-6 py-3 border-b">
        <div className="text-xl font-bold">Dashboard</div>
        <div className="ml-auto flex items-center gap-4 lg:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-4">
                <Avatar className="rounded-md h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                  <div className="text-base font-semibold leading-tight">
                    Piseth Chhun
                  </div>
                  <div className="text-sm text-muted-foreground leading-none">
                    email@example.com
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[185px] cursor-pointer"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Link href="/dashboard/settings">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem className="cursor-pointer">
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Team
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 hover:!text-red-400 cursor-pointer">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
