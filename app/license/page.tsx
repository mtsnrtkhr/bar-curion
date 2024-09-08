'use client'
// app/license/page.tsx
import React, { useEffect, useState } from 'react';
import { RiExternalLinkFill } from 'react-icons/ri';

interface License {
  name: string;
  installedVersion: string;
  licenseType: string;
  author: string;
  link: string;
}

const LicensePage = () => {
  const [licenses, setLicenses] = useState<License[]>([]);

  useEffect(() => {
    const fetchLicenses = async () => {
      const response = await fetch('/licenses.json');
      const licenses = await response.json();
      setLicenses(licenses);
    };

    fetchLicenses();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center mb-10 space-y-2 mt-28">
        <h1 className="text-5xl">Licenses</h1>
        <h2 className="text-xl">All licenses used for your project</h2>
      </div>
      <div className="grid max-w-3xl grid-cols-12 gap-10 mx-auto">
        {licenses.map((l) => (
          <a
            key={l.link}
            className="flex-col space-y-1 overflow-hidden col-span-full group"
            href={l.link.replace("git+", "").replace("ssh://", "").replace("git://","https://").replace("git@","https://")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Github repo for ${l.name}`}
          >
            <div className="inline-flex items-end">
              <div className="space-x-2 duration-300 ease-in group-hover:translate-x-6 group-hover:opacity-0">
                <span className="text-2xl">{l.name}</span>
                <span className="opacity-50">{l.installedVersion}</span>
              </div>
              <div className="absolute mb-1 text-blue-600 duration-300 ease-in -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                <RiExternalLinkFill />
              </div>
            </div>
            <div className="text-gray-400">
              {[l.licenseType, l.author].filter(Boolean).join(", ")}
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default LicensePage;
