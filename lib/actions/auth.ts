"use server";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";

export type LoginState = {
	error?: string;
};

export async function loginAction(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const password = formData.get("password") as string;

	if (password !== process.env.ADMIN_PASSWORD) {
		return { error: "Incorrect password." };
	}

	await createSession();
	redirect("/blog/new");
}

export async function logoutAction() {
	await destroySession();
	redirect("/1w4ntt0cl1mb!");
}
