"use client";
import { useActionState } from "react";
import { type LoginState, loginAction } from "@/lib/actions/auth";

const initialState: LoginState = { error: undefined };

export default function LoginPage() {
	const [state, formAction] = useActionState(loginAction, initialState);

	return (
		<div className="max-w-sm mx-auto py-24">
			<form action={formAction} className="flex flex-col gap-3">
				<input
					type="password"
					name="password"
					placeholder="Password"
					required
					className="border rounded px-3 py-2"
				/>
				{state.error && <p className="text-red-500 text-sm">{state.error}</p>}
				<button type="submit" className="bg-black text-white rounded px-4 py-2">
					Enter
				</button>
			</form>
		</div>
	);
}
