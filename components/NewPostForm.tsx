"use client";
import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createPostAction } from "@/lib/actions/posts";

function PublishButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="bg-[#283618] text-[#f1faee] font-bold text-sm rounded px-5 py-2 disabled:opacity-50 cursor-pointer"
		>
			{pending ? "Publishing..." : "Publish"}
		</button>
	);
}

export default function NewPostForm() {
	const [preview, setPreview] = useState<string | null>(null);
	const [tagsInput, setTagsInput] = useState(""); // no existing post to prefill from
	const [autoApproveComments, setAutoApproveComments] = useState(true);

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
		}
	}

	return (
		<form action={createPostAction}>
			<input
				type="hidden"
				name="autoApproveComments"
				value={autoApproveComments ? "true" : "false"}
			/>

			<article className="px-4 py-6 min-w-full max-w-5xl pt-6 md:px-8 md:grid md:grid-cols-3 md:gap-10">
				<div className="md:col-start-1 md:row-start-1">
					{/* IMAGE */}
					<label
						className="relative z-10 block w-full h-[50vh] md:h-[28vw] md:min-h-75 md:rounded-b-3xl 
                            rounded-t-3xl shadow-2xl cursor-pointer group overflow-hidden bg-[#283618]/10"
					>
						<Image
							src={preview ?? "/placeholder.jpg"}
							alt="Post image preview"
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							priority
							className="object-cover mask-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]"
						/>
						<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
							<span className="opacity-0 group-hover:opacity-100 text-white text-sm font-semibold transition-opacity">
								{preview ? "Click to change image" : "Click to add an image"}
							</span>
						</div>
						<input
							type="file"
							name="image"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
						/>
					</label>
					<div className="mt-6">
						<input
							name="title"
							required
							placeholder="Title"
							className="text-2xl md:text-3xl font-serif font-bold w-full bg-transparent 
                        border-b border-[#283618]/30 focus:border-[#283618] outline-none pb-1 placeholder:text-[#cream]/40"
						/>
						<div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
							<time>
								{new Date().toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</time>
							<span>·</span>
							<span>Luke Regalado</span>
						</div>
						{/* TAGS */}
						<div className="mt-4">
							<input
								name="tags"
								value={tagsInput}
								onChange={(e) => setTagsInput(e.target.value)}
								placeholder="Tags (comma-separated)"
								className="text-sm w-full bg-transparent border-b border-[#283618]/20 
                                focus:border-[#283618] outline-none pb-1 placeholder:text-[#283618]/30"
							/>
						</div>

						{/* AUTO-APPROVE COMMENTS TOGGLE */}
						<div className="mt-4 flex items-center gap-2">
							<button
								type="button"
								role="switch"
								aria-checked={autoApproveComments}
								onClick={() => setAutoApproveComments((v) => !v)}
								className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
									autoApproveComments ? "bg-[#283618]" : "bg-[#283618]/20"
								}`}
							>
								<span
									className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[#f1faee] transition-transform ${
										autoApproveComments ? "translate-x-5" : "translate-x-1"
									}`}
								/>
							</button>
							<span className="text-sm text-[#283618]/70">
								Auto-approve comments
							</span>
						</div>

						<div className="hidden md:block mt-10 md:mt-6">
							<PublishButton />
						</div>
					</div>
				</div>
				<div className="col-span-2 mt-4 md:mt-0 md:mr-5 md:col-start-2 md:row-start-1">
					<textarea
						name="body"
						required
						rows={16}
						placeholder="Write your post..."
						className="whitespace-pre-line prose prose-lg text-xl w-full md:prose-base font-libre bg-transparent 
                    border border-[#283618]/20 focus:border-[#283618]/50 rounded-lg p-3 outline-none resize-y 
                    placeholder:text-[#283618]/30"
					/>
				</div>
				<div className="mt-6 md:hidden">
					<PublishButton />
				</div>
			</article>
		</form>
	);
}