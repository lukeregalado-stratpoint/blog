"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      {/* Hamburger button: visible only below md */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="md:hidden p-2"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul
        className={`
          ${open ? "flex" : "hidden"} 
          font-medium flex-col p-4
          rounded-base bg-neutral-secondary-soft
          absolute top-full left-0 right-0
          md:static md:flex md:flex-row md:space-x-8 
          rtl:space-x-reverse md:mt-0 md:p-0 md:bg-neutral-primary
        `}
      >
        <li>
          <a href="/" className="block py-2 px-3 
            rounded md:bg-transparent 
            md:p-0 md:px-5
            font-lexend font-extrabold text-[#003049]">Home</a>
        </li>
        <li>
          <a href="/blog" className="block py-2 px-3 text-heading rounded 
            hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 
            md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent md:px-5
            font-lexend font-extrabold text-[#003049]">Blog</a>
        </li>
      </ul>
    </nav>
  );
}