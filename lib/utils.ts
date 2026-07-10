export function excerpt(body: string, len = 120) {
	const clean = body.replace(/\s+/g, " ").trim();
	return clean.length > len ? `${clean.slice(0, len)}...` : clean;
}
