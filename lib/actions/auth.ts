"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/auth";

export type LoginState = {
	error?: string;
};

const loginSchema = z.object({
	password: z.string().min(1, "Password is required."),
});

export async function loginAction(
	_prevState: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const result = loginSchema.safeParse({
		password: formData.get("password"),
	});

	if (!result.success) {
		return { error: "Incorrect password." };
	}

	if (result.data.password !== process.env.ADMIN_PASSWORD) {
		return { error: "Incorrect password." };
	}

	await createSession();
	redirect("/");
}

export async function logoutAction() {
	await destroySession();
	redirect("/1w4ntt0cl1mb!");
}