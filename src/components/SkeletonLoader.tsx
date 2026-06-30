import React from "react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const pulseProps = {
  animate: { opacity: [0.35, 0.65, 0.35] },
  transition: {
    duration: 1.6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const BandSkeletonList: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className="bg-neutral-900/60 border border-neutral-850 p-5 rounded-xl flex flex-col justify-between space-y-4"
        >
          <div>
            {/* Header / Title skeleton */}
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-2 flex-1">
                <motion.div 
                  className="h-5 w-1/2 bg-neutral-800 rounded-md" 
                  {...pulseProps}
                />
                <motion.div 
                  className="h-3 w-1/4 bg-red-950/40 rounded-md" 
                  {...pulseProps}
                />
              </div>
              <motion.div 
                className="h-8 w-8 bg-neutral-800 rounded-lg" 
                {...pulseProps}
              />
            </div>

            {/* Core facts skeleton */}
            <div className="grid grid-cols-2 gap-2 my-4 p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-850/50">
              <div className="space-y-1.5 flex flex-col items-center">
                <motion.div className="h-2 w-12 bg-neutral-800 rounded" {...pulseProps} />
                <motion.div className="h-4 w-20 bg-neutral-850 rounded" {...pulseProps} />
              </div>
              <div className="space-y-1.5 flex flex-col items-center">
                <motion.div className="h-2 w-12 bg-neutral-800 rounded" {...pulseProps} />
                <motion.div className="h-4 w-12 bg-neutral-850 rounded" {...pulseProps} />
              </div>
            </div>

            {/* Bio paragraph skeleton */}
            <div className="space-y-2 mt-3">
              <motion.div className="h-3 w-full bg-neutral-800/70 rounded" {...pulseProps} />
              <motion.div className="h-3 w-11/12 bg-neutral-800/70 rounded" {...pulseProps} />
              <motion.div className="h-3 w-4/5 bg-neutral-800/70 rounded" {...pulseProps} />
            </div>
          </div>

          {/* Bottom actions skeleton */}
          <div className="flex justify-between items-center pt-3 border-t border-neutral-850/40">
            <motion.div className="h-7 w-24 bg-neutral-800 rounded-lg" {...pulseProps} />
            <motion.div className="h-6 w-16 bg-neutral-850 rounded-md" {...pulseProps} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export const EventSkeletonList: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className="bg-neutral-900/60 border border-neutral-850 p-5 rounded-xl flex flex-col justify-between space-y-4"
        >
          <div className="flex gap-4">
            {/* Thumbnail/Poster skeleton */}
            <motion.div 
              className="w-16 h-16 md:w-20 md:h-20 bg-neutral-800 rounded-lg shrink-0 border border-neutral-800"
              {...pulseProps}
            />

            {/* Content area */}
            <div className="flex-1 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <motion.div className="h-4 w-3/4 bg-neutral-800 rounded-md" {...pulseProps} />
                <motion.div className="h-7 w-7 bg-neutral-800 rounded" {...pulseProps} />
              </div>
              
              <div className="space-y-1.5">
                <motion.div className="h-3 w-1/2 bg-neutral-800/70 rounded" {...pulseProps} />
                <motion.div className="h-3 w-1/3 bg-neutral-850 rounded" {...pulseProps} />
              </div>
            </div>
          </div>

          {/* Tags and Actions footer skeleton */}
          <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-neutral-850/40">
            <div className="flex gap-1.5">
              <motion.div className="h-5 w-16 bg-neutral-800 rounded" {...pulseProps} />
              <motion.div className="h-5 w-12 bg-neutral-850 rounded" {...pulseProps} />
            </div>
            <motion.div className="h-7 w-20 bg-neutral-800 rounded-md" {...pulseProps} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export const NewsSkeletonList: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className="bg-neutral-900/60 border border-neutral-850 p-5 rounded-xl flex flex-col md:flex-row gap-5 items-start justify-between"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start flex-1 w-full">
            {/* News banner skeleton */}
            <motion.div 
              className="w-full md:w-36 h-28 bg-neutral-800 rounded-lg shrink-0 border border-neutral-800"
              {...pulseProps}
            />

            {/* News content skeleton */}
            <div className="flex-1 space-y-3 w-full">
              <motion.div className="h-4 w-20 bg-amber-950/20 border border-amber-950/30 rounded" {...pulseProps} />
              <motion.div className="h-5 w-3/4 bg-neutral-800 rounded-md" {...pulseProps} />
              
              <div className="space-y-1.5 pt-1">
                <motion.div className="h-3 w-full bg-neutral-800/70 rounded" {...pulseProps} />
                <motion.div className="h-3 w-5/6 bg-neutral-800/70 rounded" {...pulseProps} />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
