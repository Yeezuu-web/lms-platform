'use client';
import * as React from 'react';

import { AccountSwitcher } from '@/components/account-switcher';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Navbar from './navbar';
import { sidebarOne, sidebarTow } from '@/lib/sidebar-data';

interface MainProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export function Main({
  accounts,
  defaultLayout = [265, 1195],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: MainProps) {
  const [isCollapsed, setIsCollapsed] =
    React.useState<boolean>(defaultCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full min-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={16}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              'h-full min-w-[50px] transition-all duration-300 ease-in-out'
          )}
        >
          <div
            className={cn(
              'flex py-3 items-center justify-center',
              isCollapsed ? 'h-[55px]' : 'px-2 py-3'
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />
          <Sidebar isCollapsed={isCollapsed} links={sidebarOne} />
          <Separator />
          <Sidebar isCollapsed={isCollapsed} links={sidebarTow} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} maxSize={96}>
          <div className={cn('py-0', isCollapsed ? 'h-[56px]' : 'py-0')}>
            <Navbar isCollapsed />
          </div>
          <main className="p-8">{children}</main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
