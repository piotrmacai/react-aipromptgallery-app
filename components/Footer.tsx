import React from 'react';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-row sm:flex-col justify-between gap-12">

          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/images/ainsiderlogo.png" alt="Ainsider Logo" className="h-8 w-auto" />
              <h3 className="text-xl font-bold tracking-tight text-white">
                Promptr Gallery by Macai.dev
              </h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              High-fidelity AI art prompt engineering & curation.
              Reverse engineer the impossible and explore the frontier of generative creativity.
            </p>
            <div className="text-xs text-slate-600 font-mono pt-4">
              &copy; {new Date().getFullYear()} Macai.dev. All rights reserved.
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
              The Ecosystem
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://ainsider.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
                  AInsider.co
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ainsider.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
                  AInsider Store
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Guides */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
              Guides
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://ainsider.gumroad.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
                  Gumroad Profile
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ainsider.gumroad.com/l/pfikv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
                  Midjourney Prompts
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ainsider.gumroad.com/l/jzvil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary transition-colors" />
                  Nano Banana Guide
                  <ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">
              Connect
            </h4>
            <div className="flex flex-wrap gap-4">
              <SocialLink href="https://x.com/piotrmacai" label="X (Twitter)">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </SocialLink>

              <SocialLink href="https://www.instagram.com/piotr.macai/" label="Instagram">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </SocialLink>

              <SocialLink href="https://www.behance.net/macaistudio" label="Behance">
                <path d="M21 13h-6" />
                <path d="M22 17a4.1 4.1 0 0 1-2.9 1c-2.3 0-3.9-1.6-3.9-4.2 0-2.3 1.5-4.2 4-4.2 1.9 0 3.2 1.3 3.3 3.2H15.1c.1 1.6 1.3 2.5 3 2.5.8 0 1.6-.2 2.3-.8" />
                <path d="M2 12c0-2.8 1.8-4 4.5-4 2 0 3.5 1 3.5 3.3 0 1.3-.7 2.2-1.7 2.7 1.4.5 2.2 1.5 2.2 3.1 0 2.6-2 3.9-4.7 3.9H2V8h3.8" />
                <path d="M6 11h-.5v2.8H6c1.1 0 1.7-.5 1.7-1.4 0-.9-.6-1.4-1.7-1.4z" />
                <path d="M6 15.8h-.5v3H6c1.2 0 1.9-.5 1.9-1.5 0-1-.7-1.5-1.9-1.5z" />
              </SocialLink>

              <SocialLink href="https://www.tiktok.com/@piotr_macai" label="TikTok">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </SocialLink>

              <SocialLink href="https://www.artstation.com/piotrmacai" label="ArtStation">
                <path d="M16.6 6.3 18.5 3H5.5L7.4 6.3h9.2zm-2.1 3.5-5.9-3.4L6 10.3l-3.3 5.6 1.4 2.5 8.1-14.1 2.3 5.5zm.7.9L11.7 19h10l-3.2-5.6-3.3-2.7z" />
                <circle cx="12" cy="12" r="1" />
              </SocialLink>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  );
};