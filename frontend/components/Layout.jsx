import React from 'react';

export default function Layout({ title, subtitle, actions, children }) {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-pink-200 to-pink-100">
      <header className="px-8 pt-6 pb-4 border-b border-pink-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-pink-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-pink-700 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
      </header>
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
