import React from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface AnimatedElementProps {
  children: React.ReactNode;
  animation: "fade-in" | "slide-in-left" | "slide-in-right" | "scale-in";
  delay?: "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500";
  className?: string;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation,
  delay,
  className = "",
}) => {
  const elementRef = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
  }) as React.RefObject<HTMLDivElement>;

  return (
    <div
      ref={elementRef}
      className={`${animation} ${delay || ""} ${className}`}
    >
      {children}
    </div>
  );
};
