const BLOCK_REGEX = /\[(header|paragraph|code|image)\]([\s\S]*?)\[\/\1\]/g;
const INLINE_REGEX = /\[(bold|italic)\]([\s\S]*?)\[\/\1\]/g;

/* removes all the blocks from the text - strips it down + dropping code/image content */
export function stripBodyMarkup(body: string): string {
	return body
		.replace(BLOCK_REGEX, (_match, tag, content) =>
			tag === "image" || tag === "code" ? " " : content,
		)
		.replace(INLINE_REGEX, (_match, _tag, content) => content)
		.replace(/\s+/g, " ")
		.trim();
}
