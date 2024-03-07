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
            <DropdownMenuContent align="start" className="w-[185px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
