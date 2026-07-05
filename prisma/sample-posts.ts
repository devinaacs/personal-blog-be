export type SamplePost = {
  slug: string;
  title: string;
  number: string;
  publishedAt: Date;
  paragraphs: string[];
  subheading?: string;
  quote?: string;
  quoteAuthor?: string;
  list?: string[];
};

export const samplePosts: SamplePost[] = [
  {
    slug: "the-todo-app-paradox-why-i-keep-building-what-i-never-use",
    title: "the todo app paradox: why i keep building what i never use",
    number: "006",
    publishedAt: new Date("2026-01-16"),
    paragraphs: [
      "It's 11 PM on a Tuesday and I'm knee-deep in building yet another todo app. This one is different, I tell myself. This one has the perfect balance of features—not too simple, not too complex. Just right. Three hours later, I've got a beautiful task management system with tags, priorities, and a slick dark mode.",
      "By Thursday, I'm back to using a crumpled piece of paper and a pen I found in my junk drawer.",
      "This pattern has repeated itself at least seven times in the past two years. I've built todo apps in React, Vue, vanilla JavaScript, and once, in a fit of ambition, as a CLI tool. Each time, I convince myself that this is the one that will finally stick. Each time, I'm wrong within a week.",
      "The problem isn't the apps themselves. They work fine. Some of them are actually pretty good. The problem is that building the perfect productivity system has become a form of procrastination itself. It's productive procrastination—the kind that feels like work but is really just another way to avoid doing the actual work.",
      "There's something deeply ironic about spending three hours building a tool to save yourself time, only to abandon it before you've recouped that investment. But I think I've finally figured out why we do this.",
      "Building a todo app is concrete. It has a clear beginning, middle, and end. You can see progress. Every feature you add is a small win. The dopamine hits are consistent and predictable. Actually using a todo app? That's messy. It requires discipline, honesty about your limitations, and confronting the reality of how much you can actually accomplish in a day.",
    ],
    subheading: "The uncomfortable truth about productivity",
    quote:
      "We don't want to be more productive. We want to feel like we're being more productive.",
    list: [
      "Building the perfect system feels like progress without requiring you to actually do the hard work.",
      "Every new feature is a small, achievable goal that gives you a sense of accomplishment.",
      "The act of organizing tasks feels productive even if you never complete them.",
      "A new system represents possibility and a fresh start without confronting past failures.",
    ],
  },
  {
    slug: "finding-signal-in-the-noise",
    title: "finding signal in the noise",
    number: "005",
    publishedAt: new Date("2026-01-12"),
    paragraphs: [
      "Last Sunday, I deleted Twitter from my phone. Not my account—just the app. A small distinction, but an important one. I gave myself an out, a way to check in 'if I really needed to.' Predictably, by Wednesday I'd opened it in Safari 47 times.",
      "The issue wasn't the platform itself. It was my relationship with information. I'd convinced myself that staying informed meant constantly consuming. Every thread, every hot take, every breaking news alert. If I didn't know about it, I was falling behind.",
      "But behind what, exactly? Behind people who also spend their days refreshing feeds? Behind the collective anxiety of millions of people mainlining dopamine through tiny screens?",
      "So I tried something radical. I cut my information diet by 90%. Unsubscribed from 23 newsletters. Unfollowed everyone except close friends. Deleted my RSS reader with its 147 unread articles that I was definitely going to get to someday.",
      "The first few days were uncomfortable. I felt like I was missing something important. I wasn't. A week in, something shifted. The constant background hum of other people's thoughts started to fade, and my own thoughts got a little louder.",
      "I started reading books again. Not listening to them at 1.5x speed while doing something else, but actually reading them. I went for walks without podcasts. I sat at coffee shops without pulling out my laptop. Just sat there. Like a psychopath, apparently.",
    ],
    quote:
      "The cost of information is not just attention—it's the space for original thought.",
    subheading: "What I found in the silence",
    list: [
      "Most 'breaking news' isn't urgent or relevant to your actual life.",
      "Reading one book deeply is worth more than skimming fifty articles.",
      "Boredom is where creativity lives—filling every moment kills it.",
      "Other people's curated highlights are a terrible benchmark for your life.",
    ],
  },
  {
    slug: "monospace-fonts-and-other-obsessions",
    title: "monospace fonts & other obsessions",
    number: "004",
    publishedAt: new Date("2026-01-08"),
    paragraphs: [
      "I spent $200 on programming fonts this year. Not tools that make me a better developer. Not courses or books. Fonts. JetBrains Mono, Fira Code, Operator Mono, even that ridiculous Comic Code that everyone loves to hate but secretly tried at least once.",
      "My terminal theme has changed 47 times in the past six months. I keep meticulous notes about which color schemes work best in different lighting conditions. I've written more configuration files for my editor than actual code some weeks.",
      "And you know what? My code hasn't gotten any better.",
      "There's this thing developers do where we convince ourselves that the perfect setup will unlock some hidden level of productivity. If we just find the right font, the right color scheme, the right keyboard, suddenly we'll write beautiful, bug-free code that scales to millions of users.",
      "It's nonsense, obviously. But it's comforting nonsense. Because tweaking your environment is way easier than confronting the fact that writing good software is hard and you're going to make mistakes regardless of whether your ligatures are perfectly kerned.",
      "I'm not saying tools don't matter. A good keyboard can reduce strain. A readable font can reduce eye fatigue. But there's a point where optimization becomes procrastination, where the pursuit of the perfect environment becomes an excuse to avoid doing the actual work.",
    ],
    quote:
      "Perfect tools won't make you a better craftsperson. They'll just give you something to blame when things don't work out.",
    quoteAuthor: "Someone smarter than me, probably",
    subheading: "The real lesson",
    list: [
      "Ship code in Comic Sans if that's what it takes to actually ship.",
      "Your users don't care what font you use in your editor.",
      "The best tool is the one you already know how to use.",
      "Every hour spent configuring is an hour not spent creating.",
    ],
  },
  {
    slug: "the-myth-of-clean-code",
    title: "the myth of clean code",
    number: "003",
    publishedAt: new Date("2026-01-03"),
    paragraphs: [
      "I've read Clean Code, The Pragmatic Programmer, Design Patterns, and about a dozen other books that promise to teach me how to write better software. I've spent years trying to apply SOLID principles, avoid code smells, and architect systems that are 'maintainable and scalable.'",
      "And after all that, I've realized something that feels almost sacrilegious to admit: perfect code doesn't exist. More importantly, chasing it might be making things worse.",
      "Don't get me wrong—these principles exist for good reasons. Code that's completely unstructured, with no thought to design, is a nightmare to maintain. But there's a point where the pursuit of perfection becomes paralysis.",
      "I've seen developers spend days refactoring perfectly functional code because it violated some abstract principle. I've been that developer. We bikeshed over naming conventions while features languish. We argue about whether to use inheritance or composition while bugs pile up in production.",
      "The dirty secret of software development is that most code is a mess. Even at big tech companies with unlimited resources and brilliant engineers, most codebases are held together with duct tape and prayers. And they work fine.",
      "Sometimes the best code is the code that ships. The code that solves the actual problem, even if it's not architected perfectly. The code that's good enough for now, with the understanding that we can make it better later if we need to.",
    ],
    quote:
      "Premature optimization is the root of all evil. Premature abstraction is a close second.",
    quoteAuthor: "Donald Knuth (paraphrased)",
    subheading: "Good enough is often good enough",
    list: [
      "Working software beats perfect architecture that never ships.",
      "You can't predict the future—build for today's requirements, not hypothetical ones.",
      "Refactoring is easier when you understand the actual use cases.",
      "Sometimes a big messy function is clearer than five small abstracted ones.",
    ],
  },
  {
    slug: "analog-thinking-in-a-digital-world",
    title: "analog thinking in a digital world",
    number: "002",
    publishedAt: new Date("2025-12-28"),
    paragraphs: [
      "There's a beat-up Moleskine on my desk that cost me eight dollars. Next to it is a laptop that cost me two thousand. Guess which one I reach for when I need to think through a hard problem?",
      "It's the notebook. Always the notebook.",
      "I've tried digital note-taking apps. All of them. Notion, Obsidian, Roam, Apple Notes, even gave Evernote another shot in 2024. They're all fine. Some are even great. But they don't make me think the way paper does.",
      "There's something about the friction of writing by hand that forces clarity. You can't brain-dump as fast, so you have to be more selective. You can't easily delete and reorganize, so you have to think before you write. The limitations are features, not bugs.",
      "Plus, there's no temptation to switch tabs, check Twitter, or 'quickly' look something up. A notebook is just a notebook. It does one thing. In a world where every tool wants to be an everything app, that focus is almost radical.",
      "My best ideas don't come from staring at a screen. They come from walks where I'm not listening to anything. From coffee shops where I'm scribbling in that eight-dollar notebook. From moments where I'm bored enough that my mind starts wandering.",
    ],
    quote:
      "The best interface is no interface. The best tool is the one that gets out of your way.",
    subheading: "Digital tools, analog mindset",
    list: [
      "Use technology for execution, not for thinking.",
      "Constraints force creativity—embrace limitations.",
      "Boredom is where the interesting ideas hide.",
      "Sometimes the slowest method is the fastest route to clarity.",
    ],
  },
  {
    slug: "conversations-with-rubber-ducks",
    title: "conversations with rubber ducks",
    number: "001",
    publishedAt: new Date("2025-12-20"),
    paragraphs: [
      "There's a yellow rubber duck on my desk. It doesn't do anything. It just sits there, looking vaguely pleased with itself. But that duck has helped me solve more bugs than Stack Overflow.",
      "Rubber duck debugging is a real technique, and it sounds absolutely ridiculous until you try it. The idea is simple: when you're stuck on a problem, you explain it out loud to an inanimate object. Could be a rubber duck, could be a houseplant, could be a confused cat.",
      "The magic isn't the duck. The duck is not sentient (as far as I know). The magic is in the act of articulating the problem. When you have to explain something out loud, you can't hand-wave the confusing parts. You can't skip over the bits that don't quite make sense.",
      "I can't tell you how many times I've been mid-sentence, explaining my code to my duck, when I suddenly stop and go 'oh, that's the problem.' The duck didn't say anything. The duck never says anything. But forcing myself to explain my assumptions exposed the flaw.",
      "This works for more than just debugging. Stuck on a design decision? Explain it to the duck. Not sure how to structure an essay? Tell the duck about it. Can't figure out why your tests are failing? You guessed it—duck time.",
      "The best tools are often the simplest. You don't need AI-powered code completion or fancy debugging tools. Sometimes you just need to slow down and talk to a duck.",
    ],
    quote:
      "If you can't explain it simply, you don't understand it well enough.",
    quoteAuthor: "Albert Einstein (allegedly)",
    subheading: "Why this works",
    list: [
      "Articulating a problem forces you to understand it clearly.",
      "You can't skip steps when explaining to someone (or something) else.",
      "Speaking out loud uses different neural pathways than thinking silently.",
      "Debugging is often about examining assumptions, not finding typos.",
    ],
  },
];
