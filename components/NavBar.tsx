"use client";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	// true for any /blog/[slug] page
	// false for the /blog listing page itself
	const isOnSlugPage = /^\/blog\/[^/]+/.test(pathname);

	const linkColor = isOnSlugPage ? "text-cream" : "text-[#003049]";

	return (
		<nav className="relative">
			<div className="relative flex items-center justify-end">
				{/* burger button */}
				<button
					type="button"
					onClick={() => setOpen(!open)}
					className={`md:hidden p-2 relative z-50 ${linkColor}`}
					aria-label="Toggle menu"
					aria-expanded={open}
				>
					{open ? <X size={24} /> : <Menu size={24} />}
				</button>

				<ul
					className={`
                        list-none m-0

                        ${open ? "flex opacity-100 translate-x-0" : "hidden opacity-0 translate-x-2"}
                        transition-all duration-200 ease-out
                        font-medium flex-row items-center gap-4 p-3
                        rounded-base
                        
                        absolute right-full top-1/2 -translate-y-1/2 w-max z-40
                        
                        md:static md:flex md:space-x-8 md:gap-0
                        md:translate-x-0 md:translate-y-0 md:mr-0
                        rtl:space-x-reverse md:mt-0 md:p-0 
                        md:opacity-100 md:shadow-none
                    `}
				>
					<li>
						<a
							href="/"
							className={`block py-2 px-3 
                                        rounded md:bg-transparent 
                                        md:p-0 md:px-5
                                        font-lexend font-extrabold ${linkColor}`}
						>
							Home
						</a>
					</li>
					<li>
						<a
							href="/blog"
							className={`block py-2 px-3 text-heading rounded 
                                        hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 
                                        md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent md:px-5
                                        font-lexend font-extrabold ${linkColor}`}
						>
							Blog
						</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}
