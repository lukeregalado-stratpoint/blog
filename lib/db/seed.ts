import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

const seedPosts = [
	{
		title: "I Speedran Elden Ring Blind and Regretted Nothing",
		slug: "speedran-elden-ring-blind",
		body: `[header]The Rules I Made Up Five Minutes Before Starting[/header][paragraph]It started as a joke in the group chat. 
				Someone said speedrunners spend months theory-crafting routes, memorizing frame-perfect dodges, and mapping out 
				every shortcut before they even touch the controller. I said I could beat Elden Ring blind, with zero prior knowledge, 
				faster than that. Nobody believed me. I didn't believe me either. But at 11pm on a Tuesday with nothing better to do, 
				I opened a fresh save file and made exactly three rules: no guides, no builds planned in advance, and no turning back 
				once I picked a starting class.[/paragraph][paragraph]I picked the Wretch. If you know, you know. If you don't, the 
				Wretch starts with a club and a rock and absolutely nothing else. I didn't know this was considered one of the hardest 
				starting classes. I just liked that it had the lowest number next to its stats, which felt like a challenge rating I 
				could brag about later.[/paragraph][header]Limgrave Was Not Ready For Me[/header][paragraph]The first twenty minutes 
				were humbling. I died to a group of wandering soldiers I didn't realize were a pack. I died to a bird. I want to stress 
				that: a bird killed me. Not a boss bird, not a special bird, just a regular Limgrave bird that I assumed was scenery. 
				Somewhere around death number eight I started treating every new area as a puzzle instead of a fight, which honestly 
				should have been my approach from the start.[/paragraph][paragraph]Here's the thing nobody tells you about going in 
				blind: you accidentally sequence-break the game constantly. I wandered into a cave I wasn't supposed to find yet, 
				picked up a weapon I had no business having at that point, and suddenly the early bosses that were giving me trouble 
				felt like tutorial fodder. I didn't know I'd done anything unusual until I described the fight to a friend afterward 
				and he asked, completely confused, how I had that weapon so early.[/paragraph][paragraph]By the time I stumbled out 
				of that cave I'd also somehow picked up a talisman I wouldn't normally see for another ten hours of \"correct\" play, 
				a spirit ash I had no idea how to use yet, and a map fragment for a region I hadn't even unlocked travel to. None of 
				it made sense together. All of it made the next three hours significantly easier than they should have been, and I 
				had absolutely no idea why at the time.[/paragraph]
				[header]The Boss That Broke Me (A Bajillion Times)[/header]
				[paragraph]I won't say which boss. Partly because spoilers, partly because I still feel a phantom sense of dread typing 
				this. Eleven attempts. Eleven. Each one I learned exactly one new thing: don't roll into that specific attack, this 
				window is actually longer than it looks, healing here is a trap. By attempt eleven I wasn't even angry anymore, I was
				 just executing a routine I'd built entirely by trial and very expensive error.[/paragraph][paragraph]What made it worse 
				 is that I later found out, well after the fact, that most players fight this particular boss at a significantly higher 
				 level than I was, with better gear, after a much longer questline. I walked in early, underleveled, and armed with a 
				 weapon I'd found by accident in a cave I wasn't supposed to be in. In hindsight it's less impressive and more just 
				 reckless, but at 2am with adrenaline running the show, it felt like the single greatest achievement of my gaming life.[/paragraph]
				 [paragraph][bold]The run took just under nineteen hours total[/bold], which by any competitive speedrunning standard 
				 is embarrassingly slow. But compared to friends who spent forty-plus hours meticulously exploring every inch of the 
				 map, reading wikis between sessions, and carefully planning their build from level one, I finished first. Blind, 
				 chaotic, and mostly held together by stubbornness.[/paragraph]
				 [header]The Parts Nobody Talks About[/header]
				 [paragraph]There's a version of this story that's all victory laps and dramatic boss fights, but honestly a huge 
				 chunk of those nineteen hours were spent just wandering, confused, backtracking through areas I'd already cleared 
				 because I misremembered where an item was. I fell off more cliffs than I'd like to admit, mostly because I kept 
				 forgetting that certain enemies knock you backward and there is very often nothing behind you but a very long drop.[/paragraph]
				 [paragraph]There was also a solid ninety minutes where I was completely stuck, not because of a boss, but because 
				 I couldn't figure out how to open a door that turned out to require an item I'd walked past twice without noticing. 
				 No guide meant no shortcuts, but it also meant no safety net. Every mistake was mine to sit with and solve on my own 
				 terms, which is exhausting and, weirdly, exactly the point.[/paragraph]
				 [header]What I'd Actually Recommend[/header]
				 [paragraph]If you're going to try this yourself, don't do what I did. Or do, honestly, it was extremely fun. The real 
				 lesson here isn't about optimal routes or efficient leveling, it's that not knowing what's coming forces you to 
				 actually engage with the game's systems instead of executing a checklist someone else wrote. I got lost more, I 
				 died more, and somehow I enjoyed almost every second of it more than the one playthrough I did later with a guide 
				 open on a second monitor.[/paragraph][paragraph]That second playthrough, guide in hand, was efficient. It was also 
				 noticeably less memorable. I remember almost nothing specific about it beyond \"it went smoothly,\" which says a lot 
				 about what actually makes these games stick with you. It isn't efficiency. It's the eleven deaths, the accidental 
				 sequence break, the bird that got me in the first ten minutes.[/paragraph][paragraph]Would I do it again? 
				 [italic]Absolutely[/italic]. Next time I'm picking the class with the second lowest number.[/paragraph]`,
		imageSrc: "https://res.cloudinary.com/nk1xszyh/image/upload/v1784170731/elden-ring_o59pef.jpg",
	},
	{
		title: "Why Regex Still Terrifies Me After Ten Years",
		slug: "regex-still-terrifies-me",
		body: `[header]A Decade In, Still Googling the Basics[/header][paragraph]I have been writing code professionally for about ten years now. In that time I've learned new languages, migrated legacy systems, argued passionately in code reviews about tabs versus spaces, and generally accumulated the kind of pattern recognition that lets you glance at a stack trace and know roughly what went wrong before you even read the message. And yet, every single time I need to write a regular expression, I open a new tab and Google \"regex how to match anything but this one character\" like it's the first time I've ever encountered the concept.[/paragraph][paragraph]This isn't false modesty. Regex occupies a strange corner of my brain where the rules are simple enough to explain in five minutes and complex enough that I've genuinely never internalized them. I understand character classes. I understand quantifiers, mostly. The moment lookaheads or lookbehinds enter the conversation, my brain quietly leaves the room and takes the rest of my confidence with it.[/paragraph][header]The Email Validator That Took Down Signup[/header][paragraph]Early in my career I inherited a codebase with an email validation regex that looked, and I am not exaggerating, like a small novel. It had been copy-pasted from a forum post in what I assume was 2011 and never touched again. It worked fine for years, which is exactly the kind of setup that lulls you into a false sense of security.[/paragraph][paragraph]Then one day, someone tried to sign up with a perfectly valid email address containing a plus sign, something like [bold]name+newsletter@domain.com[/bold], a completely standard and widely supported convention. The regex rejected it instantly. Not gracefully either, it threw a five-hundred error that took our signup form down for six hours before anyone figured out what was happening, because nobody suspected the regex. Why would you suspect the regex? It had been sitting there quietly for years, seemingly working, like a sleeper agent waiting for the wrong input.[/paragraph][paragraph]Here's roughly what we replaced it with, after way too much debugging:[/paragraph][code]const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n\nfunction isValidEmail(value) {\n  return emailPattern.test(value.trim());\n}[/code][paragraph]Simple, permissive, and it hasn't caused an outage since. The lesson wasn't really about regex syntax at all, it was about trusting code you don't understand just because it's old and hasn't broken yet. We wrote a comment above the new version explaining exactly what it does and doesn't validate, mostly so the next person to touch it doesn't have to reverse-engineer a novel-length pattern under production pressure.[/paragraph][header]The Lookahead Nobody Could Explain[/header][paragraph]My personal least favorite memory involves a code review where a senior engineer submitted a password strength validator using a single regex with three separate lookaheads chained together. It worked. Nobody, including the person who wrote it, could explain exactly why it worked when asked to walk through it line by line in the review. We approved it anyway, mostly out of exhaustion, and added a comment above it that just said [italic]\"do not touch this, ask the original author first, godspeed\"[/italic]. That comment is, as far as I know, still there.[/paragraph][paragraph]Every so often someone new joins the team, finds that regex, and asks about it in the team channel. The response is always the same: a link to that code review, a shrug emoji, and a gentle warning not to touch it unless absolutely necessary. It has become something of a landmark in the codebase, less a piece of validation logic and more a monument to collective, cheerful confusion.[/paragraph][header]Making Peace With Not Knowing[/header][paragraph]At some point I stopped trying to memorize regex syntax and started treating it like a tool I look up fresh every time, the same way I look up the exact syntax for date formatting no matter how many times I've done it before. There's no shame in it. Regex is dense by design, optimized for the computer parsing it rather than the human writing it, and I've decided that's a reasonable enough excuse to keep a cheat sheet bookmarked permanently.[/paragraph][paragraph]These days my actual strategy is embarrassingly simple: write the smallest possible pattern that solves the immediate problem, add a comment explaining what it matches in plain English, and add a handful of test cases covering the inputs I actually care about. It's not elegant. It has, however, saved me from at least two more six-hour outages, which I'll take as a win.[/paragraph][paragraph]Ten years in, still terrified, still Googling. At this point it's less a skill gap and more a personality trait.[/paragraph]`,
		imageSrc: "https://res.cloudinary.com/nk1xszyh/image/upload/v1784170731/regex-inverted_l0vzko.png",
	},
	{
		title: "What My Cat Taught Me About Debugging",
		slug: "what-my-cat-taught-me-about-debugging",
		body: `[header]The Water Glass Experiment[/header][paragraph]My cat has a routine. Every morning, without fail, she walks over to whatever glass of water I've left on the desk, sits in front of it, and slowly, deliberately, pushes it toward the edge with one paw while maintaining full eye contact with me the entire time. This isn't malice, as far as I can tell. It's curiosity, methodical and unbothered by consequences. She wants to know what happens when the glass reaches the edge. She already knows, because she's done this roughly four hundred times, but she wants to know again.[/paragraph][paragraph]I used to find this mildly infuriating, in a low-stakes pet-owner kind of way. Then one day, mid-debugging session, staring at a function that was returning undefined for reasons I could not explain, I realized I was doing exactly the same thing she does with the glass. Poke the thing. Watch what happens. Poke it again slightly differently. Watch again. Repeat until you understand the shape of the problem, one small experiment at a time.[/paragraph][header]Debugging Isn't Knowing, It's Poking[/header][paragraph]Early in my career I assumed good debugging meant already knowing where the bug was, like some kind of intuition you developed with experience. Senior engineers seemed to glance at a stack trace and immediately point at the problem, and I assumed that was the goal, some eventual state of omniscience I hadn't reached yet.[/paragraph][paragraph]What I actually learned, slowly, is that even experienced engineers are mostly just poking things and observing the fallout, they've just gotten faster and more targeted about which things to poke first. A console.log here. A breakpoint there. Comment this line out and see if the error moves. It's [bold]the exact same methodology as a cat pushing a glass toward a table edge[/bold], just dressed up in professional language like \"isolating the failure domain.\"[/paragraph][paragraph]The difference, I've come to realize, isn't the process at all. It's the speed of the hypothesis loop. My cat needs about two seconds to form a hypothesis, test it, and observe the result. A good debugger does roughly the same thing, just with slightly more sophisticated tools than a single paw and a lot of patience.[/paragraph][header]The Bug That Took a Week[/header][paragraph]There was one bug, a genuinely nasty one, involving a race condition in some async code that only manifested about one time in twenty, which is the worst possible frequency for a bug to have. Frequent enough to know it's real, rare enough that every fix attempt required waiting an agonizing amount of time to see if it actually worked or if you'd just gotten lucky.[/paragraph][paragraph]I spent a week poking that thing from every angle. Added logging. Removed logging because the logging itself seemed to be changing the timing, which is its own special kind of nightmare. Isolated the function into a standalone test. Ran it in a loop overnight, checking the results first thing every morning like a very specific kind of ritual.[/paragraph][paragraph]Somewhere around day five, I found it: a promise that wasn't being awaited in one specific conditional branch, invisible in the normal code path, catastrophic in the edge case. [italic]It felt exactly like the moment the glass finally tips over the edge[/italic], a small, quiet, deeply satisfying click of understanding after a lot of seemingly pointless poking. My cat, notably, was asleep on my keyboard for the entire resolution. She did not seem impressed.[/paragraph][header]The Actual Lesson[/header][paragraph]My cat isn't going to stop pushing glasses off the desk, no matter how many times she's already seen it happen. And honestly, I've stopped trying to shortcut my way past the poking-and-observing phase of debugging too. Some understanding only comes from doing the experiment yourself, however many times it takes, however unglamorous it looks from the outside.[/paragraph][paragraph]I did start using coasters with slightly raised edges, though. Even cats deserve some friction. And I've started keeping a small text file next to my desk where I jot down each hypothesis and result during a stubborn bug, mostly so I stop repeating experiments I've already tried, something my cat has never once bothered to do.[/paragraph]`,
		imageSrc: "https://res.cloudinary.com/nk1xszyh/image/upload/v1784170731/cosmo_anjyof.jpg",
	},
];

async function seed() {
	console.log("Seeding posts...");

	const inserted = await db.insert(posts).values(seedPosts).returning();

	console.log(`Inserted ${inserted.length} posts.`);

	//   if (inserted[0]) {
	//     await db.insert(comments).values([
	//       {
	//         postId: inserted[0].id,
	//         authorName: "Jordan",
	//         body: "Great writeup, this helped me understand layouts a lot better.",
	//       },
	//       {
	//         postId: inserted[0].id,
	//         authorName: "Sam",
	//         body: "Would love a follow-up on parallel routes next.",
	//       },
	//     ]);
	//     console.log("Inserted sample comments.");
	//   }

	console.log("Done.");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});