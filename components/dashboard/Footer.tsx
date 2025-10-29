'use client';

import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-white border-t border-[var(--border-light)] py-4 px-6 mt-auto flex-shrink-0">
      <div className="flex justify-start items-center">
        <span className="text-sm text-[var(--text-secondary)]">
          Copyright © 2018 - {currentYear}{' '}
          <span className="text-[var(--primary-orange)] font-semibold">
            Everonic Solutions Private Limited
          </span>
          . All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;