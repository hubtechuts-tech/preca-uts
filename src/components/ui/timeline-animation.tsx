'use client'

import { motion, Variants } from "framer-motion"
import { ReactNode, RefObject } from "react"
import { cn } from "@/lib/utils"

interface TimelineContentProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  animationNum: number
  timelineRef: RefObject<HTMLElement>
  customVariants?: Variants
}

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
}

export function TimelineContent({
  children,
  className,
  as: Component = "div",
  animationNum,
  timelineRef,
  customVariants,
}: TimelineContentProps) {
  const variants = customVariants || defaultVariants

  return (
    <motion.div
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={cn(className)}
    >
      {Component !== "div" ? (
        <Component className={className}>{children}</Component>
      ) : (
        children
      )}
    </motion.div>
  )
}
