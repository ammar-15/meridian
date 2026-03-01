import "@fontsource/montserrat/800.css";
import Image from "next/image";
import { motion } from "framer-motion";
import TextBlur from "@/components/ui/text-blur";
import AnimatedShinyText from "@/components/ui/shimmer-text";
import { containerVariants, itemVariants } from "@/lib/animation-variants";

export default function CTA() {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center">
          <div className="flex w-fit items-center justify-center rounded-full bg-muted/80 text-center">
            <AnimatedShinyText className="px-4 py-1">
              <span>Coming soon!</span>
            </AnimatedShinyText>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Image src="/logo.svg" alt="Meridian logo" width={55} height={55} />
          <h1
            className="text-center text-4xl tracking-tight sm:text-6xl"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}>
            Meridian
          </h1>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TextBlur
          className="mx-auto max-w-[27rem] whitespace-pre-line pt-1.5 text-center text-base text-zinc-300 sm:text-lg"
          text={"Transit, tailored to you.\nJoin the waitlist and be first to try it!🚀"}
          duration={0.8}
        />
      </motion.div>
    </motion.div>
  );
}
