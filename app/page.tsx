"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import IntroAnimation from "../components/Intro_animation";
import Skills from "@/components/skills";
import HeroPortrait from "@/components/HeroPortrait";
import FullScreenMenu from "@/components/FullScreenMenu";
import ScrollRevealText from "@/components/ScrollRevealText";
import SelectedProjects from "@/components/SelectedProjects";
import StoryJourney from "@/components/StoryJourney";
import Experience from "@/components/Experience";
import Work from "@/components/work";
import Music from "@/components/Music";
import SkillsTools from "@/components/SkillsTools";
import Contact from "@/components/Contact";
import AudioStories from "@/components/AudioStories";


export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
  }, []);

  return (
    <main className="bg-[#f8f7f4] intro-title intro-font-3 flex flex-col ">
      {/* Intro animation overlay */}
      <AnimatePresence>
        {!introFinished && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[70]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <IntroAnimation onComplete={handleIntroComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main hero section (svh = real visible height on phones, no URL-bar jump) */}
      <section className="flex min-h-[100svh] w-full flex-col overflow-x-clip bg-[#f8f7f4] px-[clamp(1.25rem,5vw,5.5rem)] text-[#0A0A0A]">
        {/* One centered container so ultra-wide screens don't stretch */}
        <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col">
          {/* Header */}
          <header className="flex shrink-0 items-center justify-between gap-4 py-5 sm:py-7">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.08rem] sm:text-[0.8rem] 2xl:text-[0.95rem]">
              dehleez.studio ®
            </span>

            <FullScreenMenu />
          </header>

          {/* Hero content: stacked on phones, two columns from tablet up */}
          <div className="grid flex-1 grid-cols-1 items-stretch gap-8 pb-6 sm:pb-8 md:grid-cols-2 md:gap-10 lg:gap-16 2xl:gap-24">
            {/* Text content */}
            <div className="min-w-0 self-center py-2 md:py-6">
              <h1 className="-ml-[0.06em] text-[clamp(3.5rem,11vw,5.5rem)] font-[800] leading-[0.95] tracking-[0.02rem] md:text-[clamp(3.5rem,7vw,9rem)]">
                Tejas
              </h1>

              <p className="mt-4 max-w-[34ch] text-[clamp(1rem,1.15vw,1.5rem)] font-normal leading-[1.3] text-[#0A0A0A] sm:mt-6">
                Sound, stories &amp; the spaces in between.
                <br />
                I create what you hear.
              </p>

              <Skills />
            </div>

            {/* Image frame: tall ratio on phones, fills the column height on larger screens */}
            <div className="relative aspect-[4/5] max-h-[65svh] w-full min-w-0 overflow-hidden bg-neutral-200 sm:max-h-[70svh] md:aspect-auto md:h-full md:max-h-none md:min-h-[420px] lg:min-h-[520px] 2xl:min-h-[640px]">
              <HeroPortrait />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-500 h-[0.1rem] mb-10 w-[90%] "></div>

      <ScrollRevealText
        text="Hi, I’m Tejas- a sound designer, audio engineer and music producer exploring the space between sound, stories and technology. I create sound for films, animations, narrative audio and digital media, from dialogue and ambience to Foley, SFX, music and final mixes. "
        scrollLength={7}
        fromColor="#c9c7c1"
        toColor="#0A0A0A"
        className=""
      />

      <div className="bg-gray-500 h-[0.1rem] w-[90%] mx-auto my-10"></div>

      <SelectedProjects />

      <AudioStories />

      <StoryJourney />

      <div className="bg-gray-500 h-[0.1rem] w-[90%] mx-auto mb-10"></div>

      <Experience />
      
      <Work />

      <Music />

      <SkillsTools />

      <Contact />
    </main>
  );
}