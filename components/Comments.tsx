"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  addCommentAction,
  approveCommentAction,
  rejectCommentAction,
  type CommentFormState,
} from "@/lib/actions/comments";
import { useRouter } from "next/navigation";

type Comment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: Date;
  style: string | null;
  status: "pending" | "approved" | "rejected";
};

const PRESET_COLORS = ["#f1faee", "#ca7b80", "#c1121f", "#ffb703", "#a3c4f3", "#90a955"];
const NAME_MAX = 80;
const BODY_MAX = 2000;
const COMMENTS_PER_PAGE = 5;
const COMMENT_TRUNCATE_LENGTH = 100;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ml-auto bg-[#283618] text-[#f1faee] font-bold text-sm rounded px-4 py-2 disabled:opacity-50
                cursor-pointer"
    >
      {pending ? "Posting..." : "➤"}
    </button>
  );
}

function parseStyle(raw: string | null): React.CSSProperties {
  if (!raw) return {};
  try {
    const { bold, italic, color } = JSON.parse(raw);
    return {
      fontWeight: bold ? "bold" : undefined,
      fontStyle: italic ? "italic" : undefined,
      color: color || undefined,
    };
  } catch {
    return {};
  }
}

function CommentBody({ body, style }: { body: string; style: React.CSSProperties }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = body.length > COMMENT_TRUNCATE_LENGTH;
  const displayText = expanded || !isLong ? body : `${body.slice(0, COMMENT_TRUNCATE_LENGTH)}...`;

  return (
    <p className="text-sm text-[#f1faee]/70 mt-1" style={style}>
      {displayText}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="ml-1 text-[#f1faee]/50 hover:text-[#f1faee] underline text-xs cursor-pointer"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </p>
  );
}

function ModerationControls({ commentId, postId }: { commentId: string; postId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handle(action: typeof approveCommentAction) {
    startTransition(async () => {
      await action(commentId, postId);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-3 mt-1 text-xs font-black ml-auto">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handle(approveCommentAction)}
        className="text-green-500 hover:underline disabled:opacity-50 cursor-pointer"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handle(rejectCommentAction)}
        className="text-red-500 hover:underline disabled:opacity-50 cursor-pointer"
      >
        Reject
      </button>
    </div>
  );
}

const initialState: CommentFormState = { errors: {}, success: false };

export default function Comments({
  postId,
  comments,
  admin = false,
}: {
  postId: string;
  comments: Comment[];
  admin?: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(addCommentAction, initialState);
  const [bodyLength, setBodyLength] = useState(0);
  const [page, setPage] = useState(1);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [color, setColor] = useState("#f1faee");

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  const totalPages = Math.max(1, Math.ceil(comments.length / COMMENTS_PER_PAGE));
  const startIndex = (page - 1) * COMMENTS_PER_PAGE;
  const visibleComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE);

  return (
    <div className="mt-10 wrap-break-word">
      <h2 className="text-lg font-libre font-semibold">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <div className="mt-4 space-y-4 wrap-break-word">
        {comments.length === 0 && (
          <p className="text-sm text-[#f1faee]">No comments yet.</p>
        )}
        {visibleComments.map((comment) => (
          <div key={comment.id} className="border-b border-[#283618]/80 pb-4">
            <div className="flex items-center gap-2 text-sm">

              <span className="font-semibold">{comment.authorName}</span>

              <span className="text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>

              {admin && comment.status !== "approved" && (
                <span
                  className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${
                    comment.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {comment.status}
                </span>
              )}

              {admin && comment.status === "pending" && (
                <ModerationControls commentId={comment.id} postId={postId} />
              )}

            </div>

            <p
              className="text-sm text-[#f1faee]/70 mt-1"
              style={parseStyle(comment.style)}
            >
              {comment.body}
            </p>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-sm">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-[#f1faee]/70 hover:text-[#f1faee] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <span className="text-[#f1faee]/50 text-xs">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-[#f1faee]/70 hover:text-[#f1faee] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* LEAVE A COMMENT */}
      <form action={formAction} className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="postId" value={postId} />

        <div>
          <input
            type="text"
            name="authorName"
            placeholder="Name (optional)"
            maxLength={NAME_MAX}
            suppressHydrationWarning
            className="border rounded border-[#283618]/70 px-3 py-2 text-sm w-full"
          />
          {state.errors.authorName && (
            <p className="text-red-500 text-xs mt-1">{state.errors.authorName}</p>
          )}
        </div>

        <div>
          <textarea
            name="body"
            placeholder="Leave a comment..."
            rows={3}
            maxLength={BODY_MAX}
            onChange={(e) => setBodyLength(e.target.value.length)}
            style={{
              fontWeight: bold ? "bold" : undefined,
              fontStyle: italic ? "italic" : undefined,
              color,
            }}
            className="border rounded border-[#283618]/70 px-3 py-2 text-sm w-full"
          />
          <div className="flex justify-between items-start mt-1">
            {state.errors.body ? (
              <p className="text-red-500 text-xs">{state.errors.body}</p>
            ) : (
              <span />
            )}
            <span
              className={`text-xs ${
                bodyLength >= BODY_MAX ? "text-red-500" : "text-gray-400"
              }`}
            >
              {bodyLength}/{BODY_MAX}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              name="bold"
              checked={bold}
              onChange={(e) => setBold(e.target.checked)}
            />
            <span className="font-bold">B</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              name="italic"
              checked={italic}
              onChange={(e) => setItalic(e.target.checked)}
            />
            <span className="italic">I</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setColor(preset)}
                  className={`w-5 h-5 rounded-full border-2 transition cursor-pointer ${
                    color === preset ? "border-white scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: preset }}
                  aria-label={`Set color ${preset}`}
                />
              ))}
            </div>
            <input type="hidden" name="color" value={color} />
          </div>

          <SubmitButton />
        </div>

        {state.success && (
          <p className="text-green-600 text-xs">
            {admin ? "Comment posted!" : "Comment submitted for review!"}
          </p>
        )}
      </form>
    </div>
  );
}