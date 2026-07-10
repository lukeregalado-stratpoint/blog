import AdminBar from "@/components/AdminBar";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminBarSlot() {
	const admin = await isAuthenticated();
	return admin ? <AdminBar /> : null;
}
