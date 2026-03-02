import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animation-variants";
import TextBlur from "./ui/text-blur";

const screenshots = [
  { src: "/snapshots/1.png", alt: "App screenshot 1" },
  { src: "/snapshots/2.png", alt: "App screenshot 2" },
];

export default function Logos() {
  return (
    <motion.div
      className="flex h-full w-full flex-col gap-2 pb-12 pt-12 md:pb-24 md:pt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <TextBlur
          className="text-center text-2xl font-medium tracking-tight text-zinc-200 md:text-3xl"
          text="Progress"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-4 grid w-full grid-cols-1 items-center justify-center gap-4 md:mt-6 md:grid-cols-2 md:gap-6"
      >
        {screenshots.map((shot, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900/80 p-2 md:mx-auto md:w-4/5"
              >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={720}
              height={1280}
              priority={index === 0}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
