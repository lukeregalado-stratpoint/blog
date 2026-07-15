import Image from "next/image";

type BlockTag = "header" | "paragraph" | "code" | "image";

const BLOCK_REGEX = /\[(header|paragraph|code|image)\]([\s\S]*?)\[\/\1\]/g;
const INLINE_REGEX = /\[(bold|italic)\]([\s\S]*?)\[\/\1\]/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	let i = 0;

	INLINE_REGEX.lastIndex = 0;
	let match = INLINE_REGEX.exec(text);
	while (match !== null) {
		if (match.index > lastIndex) {
			nodes.push(text.slice(lastIndex, match.index));
		}
		const [, tag, inner] = match;
		if (tag === "bold") {
			nodes.push(<strong key={`${keyPrefix}-b-${i}`}>{inner}</strong>);
		} else {
			nodes.push(<em key={`${keyPrefix}-i-${i}`}>{inner}</em>);
		}
		i++;
		lastIndex = INLINE_REGEX.lastIndex;
		match = INLINE_REGEX.exec(text);
	}
	if (lastIndex < text.length) {
		nodes.push(text.slice(lastIndex));
	}
	return nodes;
}

function parseImageContent(content: string): {
	url: string;
	width: number;
	height: number;
} {
	const parts = content.split("|");
	const url = parts[0];
	const width = Number(parts[1]);
	const height = Number(parts[2]);

	if (parts.length === 3 && Number.isFinite(width) && Number.isFinite(height)) {
		return { url, width, height };
	}

	// fallback for older posts saved before dimensions were tracked
	return { url: content, width: 1200, height: 800 };
}

function parseBody(body: string): React.ReactNode[] {
	const blocks: React.ReactNode[] = [];
	let lastIndex = 0;
	let blockIndex = 0;

	function pushPlainText(raw: string, key: string) {
		const trimmed = raw.trim();
		if (!trimmed) return;
		blocks.push(
			<p key={key} className="whitespace-pre-line mb-4">
				{renderInline(trimmed, key)}
			</p>,
		);
	}

	BLOCK_REGEX.lastIndex = 0;
	let match = BLOCK_REGEX.exec(body);
	while (match !== null) {
		if (match.index > lastIndex) {
			pushPlainText(body.slice(lastIndex, match.index), `plain-${blockIndex}`);
		}

		const tag = match[1] as BlockTag;
		const content = match[2].trim();
		const key = `${tag}-${blockIndex}`;

		switch (tag) {
			case "header":
				blocks.push(
					<h2 key={key} className="text-2xl font-serif font-bold mt-8 mb-3">
						{renderInline(content, key)}
					</h2>,
				);
				break;
			case "paragraph":
				blocks.push(
					<p key={key} className="whitespace-pre-line mb-4">
						{renderInline(content, key)}
					</p>,
				);
				break;
			case "code":
				blocks.push(
					<pre
						key={key}
						className="bg-black/40 border border-[#283618]/30 rounded-lg p-4 overflow-x-auto text-sm font-mono mb-4"
					>
						<code>{content}</code>
					</pre>,
				);
				break;
			case "image": {
				const { url, width, height } = parseImageContent(content);
				blocks.push(
					<Image
						key={key}
						src={url}
						alt=""
						width={width}
						height={height}
						sizes="(max-width: 640px) 100vw, 66vw"
						className="w-auto h-auto max-w-full rounded-2xl mb-4"
						style={{ maxWidth: `min(100%, ${width}px)` }}
					/>,
				);
				break;
			}
		}

		blockIndex++;
		lastIndex = BLOCK_REGEX.lastIndex;
		match = BLOCK_REGEX.exec(body);
	}

	if (lastIndex < body.length) {
		pushPlainText(body.slice(lastIndex), `plain-${blockIndex}`);
	}

	return blocks;
}

export default function BodyRenderer({ body }: { body: string }) {
	return <div className="body-content">{parseBody(body)}</div>;
}