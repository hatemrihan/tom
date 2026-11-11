"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { TypingAnimation } from "@/components/ui/typing-animation";

import JayashOneImage from "../../public/images/JayashOne-image.jpg";
import JayashTwoImage from "../../public/images/JayashTwo-image.png";
import JayashThreeImage from "../../public/images/JayashThree-image.png";
import JayashFourImage from "../../public/images/JayashFour-image.png";
import JayashFiveImage from "../../public/images/JayashFive-image.png";
import JayashSixImage from "../../public/images/JayashSix-image.png";
import JayashSevenImage from "../../public/images/JayashSeven-image.png";
import UnlimitedOneImage from "../../public/images/UnlimitedOne-image.jpg";
import UnlimitedTwoImage from "../../public/images/UnlimitedTwo-image.png";
import UnlimitedThreeImage from "../../public/images/UnlimitedThree-image.png";
import UnlimitedFourImage from "../../public/images/UnlimitedFour-image.png";
import NaderOneImage from "../../public/images/NaderOne-image.png";
import NaderTwoImage from "../../public/images/NaderTwo-image.png";
import NaderThreeImage from "../../public/images/NaderThree-image.png";
import NaderFourImage from "../../public/images/NaderFour-image.png";
import FaragOneImage from "../../public/images/FaragOne-image.png";
import FaragTwoImage from "../../public/images/FaragTwo-image.png";
import FaragThreeImage from "../../public/images/FaragThree-image.png";
import FaragFourImage from "../../public/images/FaragFour-image.png";
import FaragFiveImage from "../../public/images/FaragFive-image.png";
import FaragSixImage from "../../public/images/FaragSix-image.png";

interface Project {
  id: number;
  name: string;
  cover: StaticImageData;
  video?: { src: string; poster: string };
  previewImages: StaticImageData[];
  link: string;
  description: string;
  type: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "JAYASH",
    cover: JayashOneImage,
    previewImages: [
      JayashOneImage,
      JayashTwoImage,
      JayashThreeImage,
      JayashFourImage,
      JayashFiveImage,
      JayashSixImage,
      JayashSevenImage,
    ],
    link: "https://jayashatelier.com",
    description:
      "Collaboration on the graphic design for album. Custom typeface inspired by modern lettering, designed fan-style merch, and developed cohesive packaging working closely with the artist.",
    type: "E-commerce — Branding",
  },
  {
    id: 2,
    name: "UNLIMITED",
    cover: UnlimitedOneImage,
    previewImages: [UnlimitedOneImage, UnlimitedTwoImage, UnlimitedThreeImage, UnlimitedFourImage],
    link: "https://unlimited-sw.com",
    description:
      "Developed a cohesive visual identity, custom typeface, interface and data specifications using Next.js.",
    type: "E-commerce — Branding",
  },
  {
    id: 3,
    name: "NE - COACH PROFILE",
    cover: NaderOneImage,
    video: { src: "/videos/nader.mp4", poster: "/videos/nader-poster.jpg" },
    previewImages: [NaderOneImage, NaderTwoImage, NaderThreeImage, NaderFourImage],
    link: "https://nader-emad.vercel.app/",
    description:
      "Turning it digital: a powerful interface where clients subscribe and get coaching services through live chat powered by TalkJS.",
    type: "Coaching Portfolio",
  },
  {
    id: 4,
    name: "FARAG",
    cover: FaragOneImage,
    previewImages: [FaragOneImage, FaragTwoImage, FaragThreeImage, FaragFourImage, FaragFiveImage, FaragSixImage],
    link: "https://faragg.vercel.app/",
    description:
      "A brand identity for a photography studio with a focus on minimalist design principles — built with Three.js, GSAP and Framer Motion.",
    type: "Photography — Branding",
  },
];

/* -------------------------------------------------------------------------- */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        className="relative mx-4 max-h-[80vh] w-[92vw] max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl md:max-h-[85vh] md:w-full md:max-w-4xl"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 bg-[#f2f2f2] px-4 py-3">
          <div className="flex gap-2">
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close project"
              className="h-3 w-3 rounded-full bg-red-500 outline-offset-2 transition-colors hover:bg-red-600"
            />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 truncate text-center font-sans text-sm font-medium text-gray-700">{project.name}</div>
          <div className="w-14" />
        </div>

        <div className="max-h-[calc(80vh-44px)] overflow-y-auto md:max-h-[calc(85vh-44px)]">
          <div className="p-4 md:p-6">
            <div className="mb-5 flex items-center gap-3 md:gap-4">
              <Image
                src={project.cover}
                alt=""
                sizes="80px"
                placeholder="blur"
                className="h-12 w-12 object-cover md:h-20 md:w-20"
              />
              <div>
                <h2 id="project-modal-title" className="text-base font-bold text-gray-900 md:text-xl">
                  {project.name}
                </h2>
                <p className="font-sans text-xs text-gray-500 md:text-sm">{project.type}</p>
              </div>
            </div>

            <p className="mb-5 font-sans text-sm leading-relaxed text-gray-700">{project.description}</p>

            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 inline-flex items-center gap-1 rounded-full bg-black px-4 py-2 font-sans text-xs font-medium text-white transition hover:bg-black/80"
            >
              Visit live site ↗
            </a>

            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-900">Preview</h3>
            <div className="space-y-4">
              {project.previewImages.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${project.name} — screen ${index + 1}`}
                  placeholder="blur"
                  sizes="(min-width: 768px) 820px, 92vw"
                  className="h-auto w-full rounded-md"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */

const Explore = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="work" className="min-h-screen w-full overflow-x-hidden bg-[#f2f2f2] px-6 md:px-12 lg:px-24">
      <div className="mb-4 text-center md:mb-10 lg:mb-50">
        <div className="h-0.5 w-full bg-black/50 opacity-20" />
        <h2 className="text-4xl font-bold leading-tight tracking-tight">
          Explore My{" "}
          <TypingAnimation
            className="inline-block text-4xl font-bold leading-tight tracking-tight"
            duration={120}
            startOnView
            showCursor
            blinkCursor
            loop={false}
          >
            Work.
          </TypingAnimation>
        </h2>
        <div className="h-0.5 w-full bg-black/50 opacity-20" />
      </div>

      <div className="w-full -space-y-80 md:-space-y-60 lg:-space-y-60">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="relative w-full px-4"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
          >
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setSelected(project)}
                aria-label={`Open ${project.name}`}
                className="group relative h-[70vh] w-auto max-w-full origin-left scale-[0.4] cursor-pointer overflow-hidden md:h-[75vh] lg:h-[80vh]"
              >
                {project.video ? (
                  <video
                    src={project.video.src}
                    poster={project.video.poster}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={project.cover}
                    alt={project.name}
                    placeholder="blur"
                    sizes="(min-width: 1024px) 40vw, 80vw"
                    className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </button>

              <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2 lg:right-84">
                <div className="text-center">
                  <h3 className="font-open-sans-light mb-2 text-sm uppercase tracking-wide text-gray-800 md:text-base lg:text-lg">
                    {project.name}
                  </h3>
                  <button
                    onClick={() => setSelected(project)}
                    className="mt-1 cursor-pointer text-xs font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-black md:text-sm"
                  >
                    View Project →
                  </button>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-open-sans-light mt-3 block text-xs text-gray-600 transition-colors hover:text-gray-800 md:text-sm"
                  >
                    View Live Site ↗
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={close} />}
      </AnimatePresence>
    </section>
  );
};

export default Explore;
