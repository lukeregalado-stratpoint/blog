// "use client";
// import { useScroll, useTransform, motion } from "framer-motion";

// export default function FloatingBlobs() {
//   const { scrollYProgress } = useScroll();

//   const yA = useTransform(scrollYProgress, [0, 1], [0, -120]);
//   const yB = useTransform(scrollYProgress, [0, 1], [0, 150]);
//   const yC = useTransform(scrollYProgress, [0, 1], [0, -80]);
//   const yD = useTransform(scrollYProgress, [0, 1], [0, 100]);
//   const yE = useTransform(scrollYProgress, [0, 1], [0, -140]);

//   return (
//     <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//       <svg className="absolute w-0 h-0" aria-label="goo">
//         <defs>
//           <filter id="goo">
//             <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
//             <feColorMatrix
//               in="blur"
//               mode="matrix"
//               values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
//               result="goo"
//             />
//             <feComposite in="SourceGraphic" in2="goo" operator="atop" />
//           </filter>
//         </defs>
//       </svg>

//       <div className="relative w-full h-full [filter:url(#goo)]">
//         <motion.div
//           style={{ y: yA }}
//           animate={{ x: [0, 35, -20, 0] }}
//           transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute w-44 h-40 top-[15%] left-[12%] bg-[#780000] opacity-90 rounded-full"
//         />
//         <motion.div
//           style={{ y: yB }}
//           animate={{ x: [0, -30, 25, 0] }}
//           transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute w-36 h-36 top-[25%] left-[30%] bg-[#c1121f] opacity-90 rounded-full"
//         />
//         <motion.div
//           style={{ y: yC }}
//           animate={{ x: [0, 25, -25, 0] }}
//           transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute w-52 h-48 bottom-[12%] left-[35%] bg-[#003049] opacity-90 rounded-full"
//         />
//         <motion.div
//           style={{ y: yD }}
//           animate={{ x: [0, -25, 20, 0] }}
//           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute w-32 h-32 bottom-[20%] right-[18%] bg-[#669bbc] opacity-90 rounded-full"
//         />
//         <motion.div
//           style={{ y: yE }}
//           animate={{ x: [0, 15, -20, 0] }}
//           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute w-28 h-24 top-[45%] left-[50%] bg-[#fdf0d5] opacity-90 rounded-full"
//         />
//       </div>
//     </div>
//   );
// }