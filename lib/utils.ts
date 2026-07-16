import { stripBodyMarkup } from "./markup";

export function excerpt(body: string, maxLength = 140): string {
	const plain = stripBodyMarkup(body);
	return plain.length > maxLength
		? `${plain.slice(0, maxLength).trim()}…`
		: plain;
}
