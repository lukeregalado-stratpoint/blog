"use client";

import Image from "next/image";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { updatePostAction } from "@/lib/actions/posts";

type Post = {
	id: string;
	title: string;
	slug: string;
	body: string;
	imageSrc: string | null;
	tags: string[] | null;
	createdAt: Date;
	autoApproveComments?: boolean; 
};

function SaveButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="bg-[#283618] text-[#f1faee] font-bold text-sm rounded px-5 py-2 disabled:opacity-50 cursor-pointer"
		>
			{pending ? "Saving..." : "Save changes"}
		</button>
	);
}

export default function EditPostForm({ post }: { post: Post }) {
	const [preview, setPreview] = useState<string | null>(null);
	const [tagsInput, setTagsInput] = useState(post.tags?.join(", ") ?? "");
	const [autoApproveComments, setAutoApproveComments] = useState(
		post.autoApproveComments ?? true,
	);

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
		}
	}

	return (
		<form action={updatePostAction}>
			<input type="hidden" name="id" value={post.id} />
			<input
				type="hidden"
				name="autoApproveComments"
				value={autoApproveComments ? "true" : "false"}
			/>

			<article className="px-4 py-6 min-w-full max-w-5xl pt-20 md:px-8 md:grid md:grid-cols-3 md:gap-10">
				<div className="md:col-start-1 md:row-start-1">
					{/* IMAGE */}
					<label
						className="relative z-10 block w-full h-[50vh] md:h-[28vw] md:min-h-75 md:rounded-b-3xl rounded-t-3xl 
                            shadow-2xl cursor-pointer group overflow-hidden"
					>
						<Image
							src={preview ?? post.imageSrc ?? "/placeholder.jpg"}
							alt={post.title}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							priority
							className="object-cover mask-[linear-gradient(to_bottom,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]"
						/>
						<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
							<span className="opacity-0 group-hover:opacity-100 text-white text-sm font-semibold transition-opacity">
								Click to change image
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
							defaultValue={post.title}
							required
							placeholder="Title"
							className="text-2xl md:text-3xl font-serif font-bold w-full bg-transparent 
                        border-b border-[#283618]/30 focus:border-[#283618] outline-none pb-1"
						/>
						<div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
							<time>
								{new Date(post.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</time>
							<span>·</span>
							<span>Luke Regalado</span>
						</div>
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
							<span className="text-sm text-[#f1faee]/70">
								Auto-approve comments
							</span>
						</div>

						<div className="hidden md:flex mt-10 md:mt-6 items-center gap-3">
							<SaveButton />
							<span className="text-xs text-gray-400">
								Comments are moderatable from the post page.
							</span>
						</div>
					</div>
				</div>

				<div className="col-span-2 mt-4 md:mt-0 md:mr-5 md:col-start-2 md:row-start-1">
					<textarea
						name="body"
						defaultValue={post.body}
						required
						rows={16}
						placeholder="Write your post..."
						className="whitespace-pre-line prose prose-lg text-xl w-full md:prose-base font-libre bg-transparent 
                        border border-[#283618]/20 focus:border-[#283618]/50 rounded-lg p-3 outline-none resize-y"
					/>
				</div>

				<div className="mt-6 md:hidden">
					<SaveButton />
				</div>
			</article>
		</form>
	);
}