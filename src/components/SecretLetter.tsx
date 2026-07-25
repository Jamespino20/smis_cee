"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function SecretLetter() {
  const [phase, setPhase] = useState<"verify" | "unlocked" | "opened">("verify");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleVerify = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === "jamesy") {
      setPhase("unlocked");
      setError(false);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [answer]);

  const handleOpen = useCallback(() => {
    setPhase("opened");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 100%)" }}>
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px rounded-full"
            style={{
              background: "#f5f0e8",
              left: `${(i * 137) % 100}%`,
              top: `${(i * 97) % 100}%`,
              opacity: 0.1 + ((i * 7) % 5) * 0.1,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out ${(i * 0.3)}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-sunset-gold/20 p-8 sm:p-10">
              <motion.p
                className="font-display text-sunset-gold text-lg sm:text-xl text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                A Sealed Memory
              </motion.p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-sunset-gold to-transparent mx-auto mb-6" />
              <p className="font-serif text-cream/70 text-sm sm:text-base text-center mb-8 leading-relaxed">
                This letter is sealed with Vestian magic. Only its intended recipient may open it.
              </p>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="font-serif text-cream/50 text-xs tracking-wider uppercase block mb-2 text-center">
                    If you are really Smiscee, what nickname do you call me?
                  </label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value); setError(false); }}
                    placeholder="Type your answer..."
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none transition-colors text-base text-center ${
                      error ? "border-red-400/60" : "border-white/10 focus:border-sunset-gold/50"
                    }`}
                    autoFocus
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-serif text-red-400/70 text-xs text-center mt-2"
                    >
                      That&apos;s not quite right. Try again, Smiscee.
                    </motion.p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={shaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={shaking ? { duration: 0.4 } : {}}
                  className="w-full bg-gradient-to-r from-vine-green/80 to-sunset-gold/80 text-twilight-deep font-display text-sm tracking-widest uppercase py-3 rounded-lg hover:from-vine-green hover:to-sunset-gold transition-all"
                >
                  Unlock Letter
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {phase === "unlocked" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 cursor-pointer"
            onClick={handleOpen}
          >
            {/* Envelope */}
            <div className="relative w-64 h-44 sm:w-80 sm:h-56">
              {/* Envelope body */}
              <div className="absolute inset-0 rounded-b-lg" style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #ede4d4 50%, #e0d5c0 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }} />
              {/* Envelope flap (closed) */}
              <motion.div
                className="absolute top-0 left-0 right-0 origin-top"
                style={{ height: "55%" }}
                animate={{ rotateX: 0 }}
              >
                <div className="w-full h-full" style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #ede4d4 0%, #e0d5c0 100%)",
                  transform: "translateY(-1px)",
                }} />
              </motion.div>
              {/* Seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 z-10">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="22" fill="#8b3a3a" />
                  <circle cx="24" cy="24" r="20" fill="#a04545" />
                  <path d="M24 8 L28 18 L38 18 L30 24 L33 34 L24 28 L15 34 L18 24 L10 18 L20 18 Z" fill="#c9a96e" opacity="0.8" />
                  <circle cx="24" cy="24" r="4" fill="#d4a574" />
                </svg>
              </div>
              {/* Address label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <p className="font-serif text-xs tracking-wider" style={{ color: "#3d2b1f" }}>For: Smiscee</p>
                <p className="font-serif text-[10px] tracking-widest mt-1" style={{ color: "#3d2b1f60" }}>VESTIA · STARRY NIGHT</p>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center mt-6 font-serif text-sm tracking-widest text-sunset-gold/50"
            >
              TAP TO OPEN
            </motion.p>
          </motion.div>
        )}

        {phase === "opened" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl"
              style={{
                background: "linear-gradient(180deg, #faf8f0 0%, #f5f0e8 100%)",
                transformStyle: "preserve-3d",
                transformOrigin: "top center",
              }}
            >
              {/* Decorative header */}
              <div className="text-center mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-sunset-gold/60 to-transparent mx-auto mb-4" />
                <p className="font-display text-lg sm:text-xl tracking-wide" style={{ color: "#3d2b1f" }}>
                  My Darling,
                </p>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-sunset-gold/60 to-transparent mx-auto mt-4" />
              </div>

              {/* Letter body */}
              <div className="font-serif text-sm sm:text-base leading-relaxed space-y-5" style={{ color: "#3d2b1f" }}>
                <p>My Darling,</p>
                <p>
                  If you are reading this, then you found your way here.
                </p>
                <p>
                  I suppose I should have expected that you would. You have always been good at finding the things hidden beneath the surface.
                </p>
                <p>
                  And perhaps that is why I wanted this particular part of your birthday to be hidden.
                </p>
                <p>
                  Not because I wanted to keep you out.
                </p>
                <p>
                  Because I wanted to make a space that belonged only to you.
                </p>
                <p>
                  A place where, after all the stars and stories and worlds, I could finally say something directly.
                </p>
                <p>
                  So let me start here.
                </p>
                <p className="font-display text-lg" style={{ color: "#3d2b1f" }}>
                  Happy birthday, Darling.
                </p>
                <p>
                  I have known you for five or six years now.
                </p>
                <p>
                  It still feels strange to say that.
                </p>
                <p>
                  We met because I helped settle a dispute in a Discord group about a passion project. That was it. At least, that was how it began.
                </p>
                <p>
                  I had no idea that the person on the other side of that screen would eventually become one of the most important people in my life.
                </p>
                <p>
                  I had no idea that you would become my confidant.
                </p>
                <p>
                  My partner.
                </p>
                <p>
                  My Darling.
                </p>
                <p>
                  The person who gave me the nickname <strong>Jamesy</strong>.
                </p>
                <p>
                  The person who taught me that <strong>Wawa</strong> could mean something more than just a strange little word.
                </p>
                <p>
                  The person who would become part of so many of my memories that trying to imagine my life without you in it feels like trying to imagine a story with entire chapters torn out.
                </p>
                <p>
                  I still remember one of the moments when I think we really started connecting.
                </p>
                <p>
                  I was trying to cheer you up, and somehow the conversation ended with me talking about a bird crapping on my roof because I smelled something weird.
                </p>
                <p>
                  It was ridiculous.
                </p>
                <p>
                  It was stupid.
                </p>
                <p>
                  And somehow, it made you laugh.
                </p>
                <p>
                  I think there is something strangely beautiful about that.
                </p>
                <p>
                  Sometimes closeness does not begin with some grand, profound conversation.
                </p>
                <p>
                  Sometimes it begins with a bird committing an act of biological warfare on a roof.
                </p>
                <p>
                  And then, somehow, you find yourself years later looking back and realizing:
                </p>
                <p className="font-display" style={{ color: "#3d2b1f" }}>
                  That was one of the beginnings.
                </p>
                <p>
                  Since then, we have shared so much.
                </p>
                <p>
                  I remember helping you with your studies.
                </p>
                <p>
                  I remember you helping me with <em>Dawn of Dilemmas</em>.
                </p>
                <p>
                  You gave your voice to my characters. You helped me write. You helped me explore possibilities in my stories that I might never have considered on my own.
                </p>
                <p>
                  But you did not just help me with a project.
                </p>
                <p>
                  You opened doors.
                </p>
                <p>
                  You pushed me outside of the things I already knew.
                </p>
                <p>
                  You challenged me to explore ideas, perspectives, and possibilities that I might have never reached by myself.
                </p>
                <p>
                  And I want you to know that <em>Dawn of Dilemmas</em> would not be the same story without you.
                </p>
                <p>
                  Not just because of the work you contributed.
                </p>
                <p>
                  Because of the ways you changed the person writing it.
                </p>
                <p>
                  You have been a part of my imagination for years.
                </p>
                <p>
                  And I mean that in the most literal way possible.
                </p>
                <p>
                  You created characters that carried pieces of your life.
                </p>
                <p>
                  Pieces of your experiences.
                </p>
                <p>
                  Pieces of your pain.
                </p>
                <p>
                  Pieces of your hopes.
                </p>
                <p>
                  You took things that happened to you, things you felt, things you struggled with, and you transformed them into people and worlds.
                </p>
                <p>
                  That is one of the things I admire most about you.
                </p>
                <p>
                  You do not simply create characters.
                </p>
                <p>
                  You give pieces of yourself somewhere to exist.
                </p>
                <p>
                  And I think that is why your characters feel like they have weight.
                </p>
                <p>
                  Why they feel like they have lives.
                </p>
                <p>
                  Because somewhere inside them, there is you.
                </p>
                <p>
                  The parts of you that laughed.
                </p>
                <p>
                  The parts of you that hurt.
                </p>
                <p>
                  The parts of you that survived.
                </p>
                <p>
                  The parts of you that still wanted to dream.
                </p>
                <p>
                  And I wish you could see yourself the way I see you.
                </p>
                <p>
                  I genuinely do.
                </p>
                <p>
                  Because I know you have been hurt.
                </p>
                <p>
                  I know you have been made to feel like you were only a backburner for people.
                </p>
                <p>
                  Like you were something people could return to when they had nothing else.
                </p>
                <p>
                  I know there are parts of your past that have left marks on you.
                </p>
                <p>
                  I know you have made mistakes.
                </p>
                <p>
                  I know there are tendencies you have struggled with.
                </p>
                <p>
                  But, Darling, you are not the sum of the worst things that have happened to you.
                </p>
                <p>
                  You are not the worst thing you have done.
                </p>
                <p>
                  You are not every mistake you have made.
                </p>
                <p>
                  You are not the people who failed to see your value.
                </p>
                <p>
                  And you are not a backburner.
                </p>
                <p>
                  I wish I could somehow make you see that.
                </p>
                <p>
                  Not the version of you that you criticize.
                </p>
                <p>
                  Not the version of you that your past tries to convince you is all you are.
                </p>
                <p>
                  I wish you could see the person I have seen all these years.
                </p>
                <p>
                  The person who is creative enough to build entire worlds.
                </p>
                <p>
                  The person who can make people laugh with the most ridiculous things.
                </p>
                <p>
                  The person who can be chaotic and weird and make me laugh at memes that should probably never be shown to another human being.
                </p>
                <p>
                  The person who can talk about the darkest, most painful things and still somehow find a way to keep going.
                </p>
                <p>
                  The person who challenged me when I was not being the best version of myself.
                </p>
                <p>
                  The person who pushed me to look beyond the limits I had placed around my own life.
                </p>
                <p>
                  The person who has given so much of herself to the people and worlds she cares about.
                </p>
                <p>
                  I have seen you at your best.
                </p>
                <p>
                  I have seen you hurt.
                </p>
                <p>
                  I have seen you angry.
                </p>
                <p>
                  I have seen you afraid.
                </p>
                <p>
                  I have seen you exhausted.
                </p>
                <p>
                  I have seen you make mistakes.
                </p>
                <p>
                  And I have seen you keep being you through all of it.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sunset-gold/30 to-transparent my-6" />
                <p>
                  I do not want to pretend that everything between us has been perfect.
                </p>
                <p>
                  It has not.
                </p>
                <p>
                  We have had difficult moments.
                </p>
                <p>
                  Our parents.
                </p>
                <p>
                  The distance.
                </p>
                <p>
                  The arguments.
                </p>
                <p>
                  The things we said and the things we did not say.
                </p>
                <p>
                  The problems we thought we could carry by ourselves until they became too heavy for both of us.
                </p>
                <p>
                  And I need to say something that I should have said much earlier.
                </p>
                <p className="font-display" style={{ color: "#3d2b1f" }}>
                  I am sorry.
                </p>
                <p>
                  Not the convenient kind of sorry.
                </p>
                <p>
                  Not the kind that is only meant to make the uncomfortable conversation end.
                </p>
                <p>
                  I am sorry for the times I made mistakes and did not properly work on them.
                </p>
                <p>
                  I am sorry for the things I bottled up.
                </p>
                <p>
                  I am sorry for thinking I had to be the guy who could shoulder everything alone.
                </p>
                <p>
                  I thought that if I kept everything inside, if I endured enough, if I protected you from my doubts and my struggles, then I was somehow doing the right thing.
                </p>
                <p>
                  I was not.
                </p>
                <p>
                  I was only allowing everything to build until it eventually exploded.
                </p>
                <p>
                  And when it did, it hurt both of us.
                </p>
                <p>
                  I made mistakes that I am ashamed of.
                </p>
                <p>
                  Mistakes that contributed to the rift between us.
                </p>
                <p>
                  I cannot undo them.
                </p>
                <p>
                  I cannot rewrite those moments and make myself behave differently.
                </p>
                <p>
                  And I do not want to pretend that saying sorry erases what happened.
                </p>
                <p>
                  It does not.
                </p>
                <p>
                  I know that.
                </p>
                <p>
                  What I can do is finally be honest about them.
                </p>
                <p>
                  I can acknowledge that I was wrong.
                </p>
                <p>
                  I can admit that I had things I needed to work on and did not work on them enough.
                </p>
                <p>
                  I can stop pretending that loving someone means you should quietly carry every problem until you collapse under the weight of it.
                </p>
                <p>
                  I am still learning that.
                </p>
                <p>
                  I am still working on becoming better.
                </p>
                <p>
                  Not because I want to make some grand promise that everything will magically be perfect.
                </p>
                <p>
                  But because you deserved better from me in the places where I failed to give it.
                </p>
                <p>
                  And because I need to become better for myself, too.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sunset-gold/30 to-transparent my-6" />
                <p>
                  I want to say something else.
                </p>
                <p>
                  I do not know what the future holds for us.
                </p>
                <p>
                  I do not want to use your birthday as an excuse to pressure you into anything.
                </p>
                <p>
                  I do not want this letter to become a demand.
                </p>
                <p>
                  I do not want you to feel like you owe me a particular answer, a particular feeling, or a particular future.
                </p>
                <p>
                  You deserve the freedom to be honest with yourself.
                </p>
                <p>
                  And I need to respect that.
                </p>
                <p>
                  But even with all of that uncertainty, there is something I know.
                </p>
                <p>
                  You matter to me.
                </p>
                <p>
                  You have mattered to me for years.
                </p>
                <p>
                  That does not disappear simply because things became difficult.
                </p>
                <p>
                  It does not disappear because we are on a break.
                </p>
                <p>
                  It does not disappear because I have made mistakes.
                </p>
                <p>
                  And it does not disappear because life has become complicated.
                </p>
                <p>
                  You are still one of the people who changed the shape of my life.
                </p>
                <p>
                  You are still one of the people whose absence I would feel.
                </p>
                <p>
                  I would miss the conversations.
                </p>
                <p>
                  The ridiculous jokes.
                </p>
                <p>
                  The weird memes.
                </p>
                <p>
                  The difficult talks.
                </p>
                <p>
                  The moments where we helped each other.
                </p>
                <p>
                  The moments where we argued and somehow found our way back to each other.
                </p>
                <p>
                  I would miss the ordinary things.
                </p>
                <p>
                  And I think those are the things I would miss the most.
                </p>
                <p>
                  Because when I think about what you mean to me, I do not only think about the grand moments.
                </p>
                <p>
                  I think about the small ones.
                </p>
                <p>
                  The stupid ones.
                </p>
                <p>
                  The conversations that lasted too long.
                </p>
                <p>
                  The moments where one of us was having a terrible day and the other somehow made it a little less terrible.
                </p>
                <p>
                  The moments that would probably mean nothing to anyone else.
                </p>
                <p>
                  But meant something to us.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sunset-gold/30 to-transparent my-6" />
                <p>
                  And then there was that voice snippet.
                </p>
                <p>
                  You know the one.
                </p>
                <p>
                  The one with the shaky lyrics of <strong>&ldquo;Dying Inside to Hold You.&rdquo;</strong>
                </p>
                <p>
                  I still remember it.
                </p>
                <p>
                  I remember realizing what it was.
                </p>
                <p>
                  A confession in plain sight.
                </p>
                <p>
                  And I remember thinking that maybe the two of us had been moving toward something long before either of us had the courage to say it directly.
                </p>
                <p>
                  That moment is still part of our story.
                </p>
                <p>
                  Whatever happens next, it always will be.
                </p>
                <p>
                  And that is the strange thing about stories.
                </p>
                <p>
                  Sometimes we want to decide exactly where they go.
                </p>
                <p>
                  Sometimes we want to force them toward the ending we imagined.
                </p>
                <p>
                  But sometimes, the most important thing is simply acknowledging that a chapter mattered.
                </p>
                <p>
                  And you, Darling, have been one of the most important chapters of my life.
                </p>
                <p>
                  I do not know where the next chapters will take us.
                </p>
                <p>
                  But I know this:
                </p>
                <p>
                  I am grateful that you were here for the ones we have already shared.
                </p>
                <p>
                  I am grateful for every time you pushed me to see beyond what I already knew.
                </p>
                <p>
                  I am grateful for every time you helped me.
                </p>
                <p>
                  I am grateful for every time you challenged me.
                </p>
                <p>
                  I am grateful for every character, every idea, every conversation, every laugh, every argument, every reconciliation, every ridiculous meme, every difficult night, every moment where we chose to keep trying.
                </p>
                <p>
                  And I am grateful that, somehow, all those years ago, a dispute in a Discord group led me to you.
                </p>
                <p>
                  That is a ridiculous way for something so important to begin.
                </p>
                <p>
                  Which makes it feel appropriately ours.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sunset-gold/30 to-transparent my-6" />
                <p>
                  So, on your birthday, I want to tell you something I should have told you more often.
                </p>
                <p>
                  You are worth more than you think you are.
                </p>
                <p>
                  You are worth more than the people who treated you like an option.
                </p>
                <p>
                  You are worth more than your past.
                </p>
                <p>
                  You are worth more than your mistakes.
                </p>
                <p>
                  You are worth more than the version of yourself that you have learned to criticize.
                </p>
                <p>
                  You are worth being chosen.
                </p>
                <p>
                  You are worth being heard.
                </p>
                <p>
                  You are worth being loved.
                </p>
                <p>
                  And you are worth the effort it takes to understand you.
                </p>
                <p>
                  I hope that someday, you can see yourself with even a fraction of the kindness with which I see you.
                </p>
                <p>
                  I hope you keep creating.
                </p>
                <p>
                  I hope you keep writing.
                </p>
                <p>
                  I hope you keep making worlds.
                </p>
                <p>
                  I hope you keep finding new things to explore, even when you are afraid that you are not good enough to do them.
                </p>
                <p>
                  And when you forget who you are, I hope you remember this:
                </p>
                <p>
                  You have already created entire worlds out of the pieces of yourself that life gave you.
                </p>
                <p>
                  You have already survived things that once felt impossible.
                </p>
                <p>
                  You have already touched the lives of people who may never fully realize how much you affected them.
                </p>
                <p>
                  You are still becoming.
                </p>
                <p>
                  And that means your story is not finished.
                </p>
                <p>
                  Not even close.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sunset-gold/30 to-transparent my-6" />
                <p>
                  I know you love creating worlds.
                </p>
                <p>
                  So perhaps this is the part where I say something from one of the worlds that inspired the way I think about home.
                </p>
                <p className="font-display text-base italic" style={{ color: "#3d2b1f" }}>
                  No matter where you go, the Black Shores will always be your harbour.
                </p>
                <p>
                  I want to borrow that feeling for a moment.
                </p>
                <p>
                  Not to claim you.
                </p>
                <p>
                  Not to ask you to return to anything before you are ready.
                </p>
                <p>
                  Not to tell you where you belong.
                </p>
                <p>
                  Just to say this:
                </p>
                <p className="font-display text-base" style={{ color: "#3d2b1f" }}>
                  No matter where life takes you, I hope you always know that there will be a place where you are remembered.
                </p>
                <p>
                  A place where the things you created mattered.
                </p>
                <p>
                  A place where your laughter mattered.
                </p>
                <p>
                  A place where your presence mattered.
                </p>
                <p>
                  A place where you did not have to be perfect to be loved.
                </p>
                <p>
                  And if, someday, you find yourself lost, tired, or convinced that you are only someone else&apos;s second choice, I hope you remember that there are people who have seen you more clearly than that.
                </p>
                <p>
                  I hope you remember that I have.
                </p>
                <p>
                  You are not a backburner.
                </p>
                <p>
                  You are not a footnote.
                </p>
                <p>
                  You are not merely a character waiting for someone else to decide whether you deserve to remain in the story.
                </p>
                <p>
                  You are the person who created worlds.
                </p>
                <p>
                  And you are still writing your own.
                </p>
                <p>
                  So keep going, Darling.
                </p>
                <p>
                  Keep creating.
                </p>
                <p>
                  Keep becoming.
                </p>
                <p>
                  Keep finding the parts of yourself that you thought were lost.
                </p>
                <p>
                  And please, when you can, be gentler with yourself.
                </p>
                <p>
                  You deserve that.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sunset-gold/30 to-transparent my-6" />
                <p>
                  As for me...
                </p>
                <p>
                  I do not know exactly what the future holds.
                </p>
                <p>
                  But I know that I will always be grateful for the years we have shared.
                </p>
                <p>
                  I know that I will always be grateful that you were my partner, my confidant, my creative companion, my Darling.
                </p>
                <p>
                  I know that, no matter what happens next, I will never be able to look at the story of my life and pretend that you were a small part of it.
                </p>
                <p>
                  You were not.
                </p>
                <p>
                  You are not.
                </p>
                <p>
                  You are one of the people who helped me become who I am.
                </p>
                <p>
                  And I hope, in some small way, I have been able to do the same for you.
                </p>
                <p>
                  So this is my birthday wish for you:
                </p>
                <p>
                  I hope you find a life where you never have to beg to be valued.
                </p>
                <p>
                  I hope you find people who choose you clearly.
                </p>
                <p>
                  I hope you learn to see the person that I have always wished you could see.
                </p>
                <p>
                  I hope your worlds continue to grow.
                </p>
                <p>
                  I hope your characters continue to find their voices.
                </p>
                <p>
                  I hope you continue to surprise yourself.
                </p>
                <p>
                  And I hope that, wherever the story takes you, you remember that your existence has mattered.
                </p>
                <p>
                  To your characters.
                </p>
                <p>
                  To your friends.
                </p>
                <p>
                  To the people whose lives you have touched.
                </p>
                <p>
                  And to me.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-sunset-gold/30 to-transparent my-6" />
                <p className="font-display text-lg" style={{ color: "#3d2b1f" }}>
                  Happy birthday, my Darling.
                </p>
                <p>
                  Thank you for all the years.
                </p>
                <p>
                  Thank you for all the memories.
                </p>
                <p>
                  Thank you for all the worlds.
                </p>
                <p>
                  Thank you for being <strong>you</strong>.
                </p>
                <p>
                  And wherever we go from here, whatever the next chapter becomes, I hope you know this:
                </p>
                <p className="font-display text-base" style={{ color: "#3d2b1f" }}>
                  You will always have a harbour in the heart of someone who was lucky enough to know you.
                </p>
                <p className="font-display text-base mt-2" style={{ color: "#3d2b1f" }}>
                  Wawa.
                </p>
                <p className="font-display text-base" style={{ color: "#3d2b1f" }}>
                  &mdash; Jamesy
                </p>
              </div>

              {/* Signature area */}
              <div className="mt-8 pt-6 border-t border-sunset-gold/20 text-center">
                <p className="font-serif italic text-sm" style={{ color: "#3d2b1f80" }}>
                  Forever yours,
                </p>
                <p className="font-display text-lg mt-1" style={{ color: "#3d2b1f" }}>
                  James
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-8 h-px bg-sunset-gold/30" />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  <div className="w-8 h-px bg-sunset-gold/30" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}