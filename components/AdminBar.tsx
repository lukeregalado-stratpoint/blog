import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

export default function AdminBar() {
	return (
		<div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-black text-white px-5 py-3 shadow-2xl text-sm">
			<span className="text-white/50">Admin</span>
			<Link href="/blog/new" className="hover:underline">
				+ New post
			</Link>
			<form action={logoutAction}>
				<button
					type="submit"
					className="text-white/70 hover:text-white hover:underline"
				>
					Sign out
				</button>
			</form>
		</div>
	);
}
