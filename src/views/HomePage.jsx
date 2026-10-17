import { motion } from "motion/react";
import profilePhoto from "@/assets/foto/optimized/get.jpeg";
import AsciiPortrait from "@/components/motion/AsciiPortrait.jsx";
import Marquee from "@/components/motion/Marquee.jsx";

const stack = [
  "React",
  "TypeScript",
  "Tailwind",
  "JavaScript",
  "PHP",
  "Laravel",
  "Zend Framework",
  "Bootstrap 5",
  "Sanity",
];

const facts = [
  { label: "Base", value: "Netherlands" },
  { label: "Stack", value: "React · TypeScript · PHP" },
  { label: "Focus", value: "Frontend · UI" },
];

const rise = {
  hidden: { opacity: 0, y: 28 },
  visible: (step) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + step * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function HomePage() {
  return (
    <>
      <div className="grid-paper border-b-2 border-ink">
        <div className="container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial="hidden" animate="visible">
            <motion.p variants={rise} custom={0} className="tag m-0">
              Frontend developer — Netherlands
            </motion.p>

            <motion.h1
              variants={rise}
              custom={1}
              className="mb-6 mt-8 text-[clamp(4.5rem,16vw,10rem)] font-bold uppercase leading-[0.85] tracking-tighter"
            >
              Get<span className="animate-blink text-accent">_</span>
            </motion.h1>

            <motion.p
              variants={rise}
              custom={2}
              className="mb-3 font-mono text-sm font-bold uppercase tracking-wider text-accent"
            >
              Nice to meet you!
            </motion.p>
            <motion.p
              variants={rise}
              custom={3}
              className="mb-8 max-w-xl text-lg leading-relaxed text-grey md:text-xl"
            >
              Hi, my name is{" "}
              <strong className="text-ink">Master Supakon Karanyawad</strong>,
              but you can call me <strong className="text-ink">Get</strong>. I
              build dynamic web applications that are clear, fast and easy to
              use.
            </motion.p>

            <motion.div
              variants={rise}
              custom={4}
              className="mb-10 flex flex-wrap gap-4"
            >
              <a href="#project" className="btn">
                View projects →
              </a>
              <a href="#contact" className="btn btn-accent">
                Get in touch
              </a>
              <a
                href="https://github.com/Thaiseboy/Hi-"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                aria-label="GitHub profile"
              >
                <i className="bi bi-github text-base" /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/get-ms-karanyawad"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                aria-label="LinkedIn profile"
              >
                <i className="bi bi-linkedin text-base" /> LinkedIn
              </a>
            </motion.div>

            <motion.ul
              variants={rise}
              custom={5}
              className="m-0 flex list-none flex-wrap gap-3 p-0"
            >
              {facts.map((fact) => (
                <li key={fact.label} className="chip">
                  <b>{fact.label}</b> {fact.value}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            className="mx-auto w-full max-w-md lg:max-w-none"
            initial={{ opacity: 0, rotate: 3, y: 40 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            transition={{
              delay: 0.35,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <AsciiPortrait
              src={profilePhoto}
              alt="Portrait of Master Supakon Karanyawad"
            />
          </motion.div>
        </div>
      </div>

      <Marquee items={stack} />
    </>
  );
}
