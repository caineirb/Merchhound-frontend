'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
// import '@/app/globals.css';

const SideBar = () => {
  const pathname = usePathname();
  const iconsPath = '/navigation-icons';
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: `${iconsPath}/dashboard.svg`
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: `${iconsPath}/orders.svg`
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: `${iconsPath}/inventory.svg`
    },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border h-full flex flex-col">
      <div className="px-6 py-12 border-b border-border flex justify-center">
        <Link
          href="/"
          className="flex flex-col items-center space-y-3"
          title={"MerchHound Logo"}
          >
            <Image
              src="/wolf-icon.svg"
              alt="MerchHound Logo"
              width={100}
              height={100}
              className="flex-shrink-0"
            />
            <span className="text-xl font-semibold text-foreground">MerchHound</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link ${pathname === item.href ? 'selected' : ''}`}
                title={`${item.name} (${item.href})`}
              >
                <Image
                  src={item.icon}
                  alt={`${item.name} Icon`}
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar;