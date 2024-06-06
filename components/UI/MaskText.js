import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export function MaskText({ children }) {
  const animation = {
    initial: { y: "100%" },
    enter: (i) => ({
      y: "0",
      transition: {
        duration: 0.75,
        ease: [0.33, 1, 0.68, 1],
        delay: 0.075 * i,
      },
    }),
  };

  const { ref, inView, entry } = useInView({
    threshold: 0.75,
    triggerOnce: true,
  });

  const customValue = 3; // Sostituisci con il valore desiderato

  return (
    <div ref={ref} className="body">
      <div className="linemask">
        <motion.div
          variants={animation}
          initial="initial"
          animate={inView ? "enter" : ""}
          custom={customValue}
          className="text"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
