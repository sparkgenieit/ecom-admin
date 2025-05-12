'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [masterOpen, setMasterOpen] = useState(false);

  const mainLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/categories', label: 'Categories' },
  ];

  const masterLinks = [
    { href: '/assembly-types',    label: 'Assembly Types' },
    { href: '/brands',            label: 'Brands' },
    { href: '/colors',            label: 'Colors' },
    { href: '/locations',         label: 'Locations' },
    { href: '/materials',         label: 'Materials' },
    { href: '/product-status',    label: 'Product Status' },
    { href: '/room-types',        label: 'Room Types' },
    { href: '/shipping-partners', label: 'Shipping Partners' },
    { href: '/size-uom',          label: 'Size UOM' },
    { href: '/styles',            label: 'Styles' },
    { href: '/tax-rules',         label: 'Tax Rules' },
    { href: '/vendors',           label: 'Vendors' },
    { href: '/warranties',        label: 'Warranties' },
  ];
  

  const linkClass = (href: string) =>
    `block p-2 rounded hover:bg-gray-200 ${
      pathname === href ? 'font-bold text-blue-600' : 'text-gray-800'
    }`;

  return (
    <aside className="w-64 bg-gray-100 p-4 min-h-screen">
      <ul className="space-y-2">
        {mainLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          </li>
        ))}

        <li>
          <button
            onClick={() => setMasterOpen(open => !open)}
            className="w-full text-left p-2 rounded hover:bg-gray-200"
          >
            <span className="flex justify-between items-center">
              <span>Master Data</span>
              <span className="text-sm">{masterOpen ? '▾' : '▸'}</span>
            </span>
          </button>
          {masterOpen && (
            <ul className="pl-4 space-y-1 mt-1">
              {masterLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </aside>
  );
}
