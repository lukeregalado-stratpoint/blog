"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "@/lib/actions/upload";

type ToolbarAction = "header" | "paragraph" | "code" | "bold" | "italic";

const BLOCK_TAGS: Record<
	ToolbarAction,
	{ open: string; close: string; placeholder: string }
> = {
	header: { open: "[header]", close: "[/header]", placeholder: "Heading text" },
	paragraph: {
		open: "[paragraph]",
		close: "[/paragraph]",
		placeholder: "Paragraph text",
	},
	code: { open: "[code]", close: "[/code]", placeholder: "code goes here" },
	bold: { open: "[bold]", close: "[/bold]", placeholder: "bold text" },
	italic: { open: "[italic]", close: "[/italic]", placeholder: "italic text" },
};

const BUTTONS: { action: ToolbarAction; label: string; title: string }[] = [
	{ action: "header", label: "H", title: "Header block" },
	{ action: "paragraph", label: "¶", title: "Paragraph block" },
	{ action: "code", label: "</>", title: "Code block" },
	{ action: "bold", label: "B", title: "Bold" },
	{ action: "italic", label: "I", title: "Italic" },
];

export default function BodyEditor({
	name = "body",
	value,
	onChange,
	rows = 16,
	placeholder,
	className,
}: {
	name?: string;
	value: string;
	onChange: (value: string) => void;
	rows?: number;
	placeholder?: string;
	className?: string;
}) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const insertPosRef = useRef<number>(0);
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	function applyTextBlock(action: ToolbarAction) {
		const el = textareaRef.current;
		if (!el) return;

		const { open, close, placeholder: blockPlaceholder } = BLOCK_TAGS[action];
		const start = el.selectionStart;
		const end = el.selectionEnd;
		const selected = value.slice(start, end);
		const inner = selected || blockPlaceholder;
		const next = value.slice(0, start) + open + inner + close + value.slice(end);

		onChange(next);

		requestAnimationFrame(() => {
			el.focus();
			const innerStart = start + open.length;
			const innerEnd = innerStart + inner.length;
			el.setSelectionRange(innerStart, innerEnd);
		});
	}

	function openImageModal() {
		const el = textareaRef.current;
		insertPosRef.current = el ? el.selectionEnd : value.length;
		setUploadError(null);
		setImageModalOpen(true);
	}

	function closeImageModal() {
		setImageModalOpen(false);
		setUploadError(null);
	}

	async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadImageAction(formData);
        setUploading(false);

        if ("error" in result) {
            setUploadError(result.error);
            return;
        }

        const pos = insertPosRef.current;
        const tag = `[image]${result.url}|${result.width}|${result.height}[/image]`;
        const next = value.slice(0, pos) + tag + value.slice(pos);
        onChange(next);
        setImageModalOpen(false);

        requestAnimationFrame(() => {
            textareaRef.current?.focus();
        });
    }

	return (
		<div className="relative">
			<div className="flex items-center gap-1 mb-1.5">
				{BUTTONS.map((btn) => (
					<button
						key={btn.action}
						type="button"
						title={btn.title}
						onClick={() => applyTextBlock(btn.action)}
						className={`w-7 h-7 flex items-center justify-center rounded border border-[#283618]/20 
							text-xs hover:bg-[#283618]/10 cursor-pointer ${
								btn.action === "bold" ? "font-bold" : ""
							} ${btn.action === "italic" ? "italic" : ""}`}
					>
						{btn.label}
					</button>
				))}
				<button
					type="button"
					title="Image block"
					onClick={openImageModal}
					className="w-7 h-7 flex items-center justify-center rounded border border-[#283618]/20 
						text-xs hover:bg-[#283618]/10 cursor-pointer"
				>
					🗁
				</button>
			</div>

			<textarea
				ref={textareaRef}
				name={name}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				rows={rows}
				placeholder={placeholder}
				className={className}
			/>

            {/* MODAL */}
			{imageModalOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50 flex justify-center">
                    <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#283618]/40 rounded-xl shadow-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-[#f1faee]">
                                Upload image
                            </span>
                            <button
                                type="button"
                                onClick={closeImageModal}
                                className="text-[#f1faee]/60 hover:text-[#f1faee] text-sm cursor-pointer"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <label htmlFor="body-image-upload" className="block text-xs text-[#f1faee]/70 mb-2">
                            Choose an image to upload to Cloudinary. It'll be inserted as an
                            [image] block at your cursor.
                        </label>

                        <input
                            id="body-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelected}
                            disabled={uploading}
                            className="text-xs text-[#f1faee]/80 file:mr-2 file:py-1.5 file:px-3 file:rounded 
                                file:border-0 file:bg-[#283618] file:text-[#f1faee] file:text-xs file:cursor-pointer 
                                cursor-pointer disabled:opacity-50"
                        />

                        {uploading && (
                            <p className="text-xs text-[#f1faee]/60 mt-2">Uploading…</p>
                        )}
                        {uploadError && (
                            <p className="text-xs text-red-400 mt-2">{uploadError}</p>
                        )}
                    </div>
                </div>
            )}
		</div>
	);
}