// hooks/useInView.ts
import { useEffect, useRef, useState } from "react";

export default function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current; // ✅ Store ref snapshot

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold }
    );

    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef); // ✅ Use the stored value
    };
  }, [threshold]);

  return { ref, isVisible };
}
