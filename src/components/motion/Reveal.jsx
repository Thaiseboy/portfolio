import { motion } from "motion/react";

// Fades and slides its children in once they scroll into view.
export default function Reveal({ as = "div", delay = 0, y = 32, className = "", children, ...props }) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}
