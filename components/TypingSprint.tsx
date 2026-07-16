"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROUND_SECONDS = 30;

const WORD_POOL = [
	"quick",
	"brown",
	"fox",
	"jumps",
	"over",
	"lazy",
	"dog",
	"cloud",
	"river",
	"stone",
	"light",
	"shadow",
	"quiet",
	"storm",
	"field",
	"amber",
	"coffee",
	"window",
	"garden",
	"signal",
	"ember",
	"harbor",
	"velvet",
	"canyon",
	"spark",
	"willow",
	"granite",
	"meadow",
	"twilight",
	"compass",
	"ripple",
	"lantern",
	"orbit",
	"thicket",
	"prairie",
	"cinder",
	"hollow",
	"drift",
	"beacon",
	"cobalt",
	"juniper",
	"marble",
	"vapor",
	"echo",
	"current",
	"frost",
	"linen",
	"maple",
	"pebble",
	"quartz",
	"rustle",
	"minecraft",
	"stratpoint",
	"blog",
];

function generateWords(count: number): string[] {
	const words: string[] = [];
	for (let i = 0; i < count; i++) {
		words.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
	}
	return words;
}

type CharState = "pending" | "correct" | "incorrect";

export default function TypingSprint() {
	// Start empty on both server and client so the very first render matches.
	// The actual (random) word list is generated client-side after mount.
	const [words, setWords] = useState<string[]>([]);
	const [mounted, setMounted] = useState(false);
	const [wordIndex, setWordIndex] = useState(0);
	const [charStates, setCharStates] = useState<CharState[]>([]);
	const [input, setInput] = useState("");
	const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
	const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
	const [correctChars, setCorrectChars] = useState(0);
	const [typedChars, setTypedChars] = useState(0);
	const [errors, setErrors] = useState(0);

	const inputRef = useRef<HTMLInputElement>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const wpm =
		status === "done" ? Math.round(correctChars / 5 / (ROUND_SECONDS / 60)) : 0;
	const accuracy =
		typedChars > 0
			? Math.round(((typedChars - errors) / typedChars) * 100)
			: 100;

	const resetGame = useCallback(() => {
		setWords(generateWords(60));
		setWordIndex(0);
		setCharStates([]);
		setInput("");
		setTimeLeft(ROUND_SECONDS);
		setStatus("idle");
		setCorrectChars(0);
		setTypedChars(0);
		setErrors(0);
		if (intervalRef.current) clearInterval(intervalRef.current);
		requestAnimationFrame(() => inputRef.current?.focus());
	}, []);

	const startTimer = useCallback(() => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					if (intervalRef.current) clearInterval(intervalRef.current);
					intervalRef.current = null;
					setStatus("done");
					return 0;
				}
				return t - 1;
			});
		}, 1000);
	}, []);

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	// Generate the (random) word list only after mount, client-side only.
	// Doing this in render (or as a useState initializer) runs on both the
	// server and the client, producing two different random sequences and
	// triggering a hydration mismatch.
	useEffect(() => {
		setWords(generateWords(60));
		setMounted(true);
	}, []);

	// Focus the input on mount instead of using the autoFocus attribute
	useEffect(() => {
		if (mounted) inputRef.current?.focus();
	}, [mounted]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (status === "done") return;
		const value = e.target.value;

		if (status === "idle") {
			setStatus("running");
			startTimer();
		}

		const currentWord = words[wordIndex];

		if (value.endsWith(" ")) {
			const typed = value.trim();
			const states: CharState[] = currentWord
				.split("")
				.map((c, i) => (typed[i] === c ? "correct" : "incorrect"));
			const roundErrors = states.filter((s) => s === "incorrect").length;
			const extra = Math.max(0, typed.length - currentWord.length);

			setCorrectChars((c) => c + states.filter((s) => s === "correct").length);
			setTypedChars((c) => c + Math.max(typed.length, currentWord.length));
			setErrors((e2) => e2 + roundErrors + extra);

			setWordIndex((i) => i + 1);
			setInput("");
			setCharStates([]);

			// extend the word pool if we're getting close to the end
			setWords((w) =>
				wordIndex > w.length - 15 ? [...w, ...generateWords(30)] : w,
			);
			return;
		}

		setInput(value);
		const states: CharState[] = value
			.split("")
			.map((c, i) => (currentWord[i] === c ? "correct" : "incorrect"));
		setCharStates(states);
	};

	return (
		<div className="w-full py-16 px-6 md:px-12 lg:px-20 text-center">
			<h3 className="text-xl font-black uppercase tracking-wider text-[#1f2421]/80 mb-4 font-serif">
				Taking a break? Try a 30-second typing sprint.
			</h3>

			<div className="relative w-full border border-[#1f2421]/20 rounded-sm overflow-hidden bg-white/60 px-6 md:px-12 py-8">
				<div className="flex items-center justify-between mb-4 font-mono text-sm text-[#1f2421]">
					<span>{timeLeft}s</span>
					<span>
						{status === "running"
							? `${typedChars ? Math.round(((typedChars - errors) / typedChars) * 100) : 100}% acc`
							: status === "done"
								? `${wpm} WPM · ${accuracy}% acc`
								: "ready"}
					</span>
				</div>

				{!mounted ? (
					<>
						<div className="h-24 overflow-hidden leading-8 text-lg font-mono text-left select-none animate-pulse">
							<span className="text-[#1f2421]/20">Loading typing sprint…</span>
						</div>
						<div className="mt-4 w-full h-10 border border-[#1f2421]/10 bg-white/40 rounded-lg" />
					</>
				) : status !== "done" ? (
					<>
						<div className="h-24 overflow-hidden leading-8 text-lg font-black font-quicksand text-left select-none">
							{words.slice(wordIndex, wordIndex + 18).map((word, wi) => {
								const isCurrent = wi === 0;
								return (
									<span
										// biome-ignore lint/suspicious/noArrayIndexKey: words in the visible window slide but never reorder among themselves
										key={`${wordIndex}-${wi}`}
										className="mr-3 inline-block"
									>
										{word.split("").map((char, ci) => {
											let color = "text-[#1f2421]/40";
											if (isCurrent && charStates[ci] === "correct")
												color = "text-[#1f2421]";
											if (isCurrent && charStates[ci] === "incorrect")
												color = "text-[#e63946]";
											return (
												<span
													// biome-ignore lint/suspicious/noArrayIndexKey: chars within a word never reorder or get inserted/removed, only replaced in place
													key={`${wordIndex}-${wi}-${ci}`}
													className={color}
												>
													{char}
												</span>
											);
										})}
										{isCurrent && input.length > word.length && (
											<span className="text-[#e63946]">
												{input.slice(word.length)}
											</span>
										)}
									</span>
								);
							})}
						</div>

						<input
							ref={inputRef}
							type="text"
							value={input}
							onChange={handleChange}
							autoComplete="off"
							autoCapitalize="off"
							autoCorrect="off"
							spellCheck={false}
							placeholder={status === "idle" ? "Start typing to begin..." : ""}
							className="mt-4 w-full border border-[#1f2421]/20 bg-white/80 rounded-lg py-2 px-3 text-center font-mono 
                        text-[#1f2421] placeholder:text-[#1f2421]/40 focus:outline-none focus:ring-2 focus:ring-[#1f2421]/30"
						/>
					</>
				) : (
					<div className="flex flex-col items-center gap-3 py-6">
						<span className="text-3xl font-bold font-serif text-[#1f2421]">
							{wpm} WPM
						</span>
						<span className="text-sm text-[#1f2421]/70 font-libre">
							{accuracy}% accuracy · {correctChars} characters
						</span>
						<button
							type="button"
							onClick={resetGame}
							className="mt-2 rounded-sm bg-[#1f2421] text-white px-4 py-2 text-sm font-medium hover:bg-[#1f2421]/90 transition"
						>
							Try again
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
