"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

/* ══════════════════════════════════════════════════════════════════
   Page transition — simple, reliable curtain wipe.

   One overlay, two tweens: slide in from the top on exit, slide out
   the bottom on enter. `isPending` is bounded by GSAP onComplete so
   it can never get stuck and block future link clicks.
   ══════════════════════════════════════════════════════════════════ */

const EXIT_DURATION = 0.55;
const ENTER_DURATION = 0.55;
const EXIT_EASE = "power3.inOut";
const ENTER_EASE = "power3.inOut";

/* ─── Context ────────────────────────────────────────────────────── */
interface TransitionContextValue {
  triggerTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  triggerTransition: () => {},
});

export function useTransitionContext() {
  return useContext(TransitionContext);
}

export function useTransitionRouter() {
  const { triggerTransition } = useTransitionContext();
  return { push: triggerTransition };
}

/* ─── Hash helper ────────────────────────────────────────────────── */
function scrollToHash(hash: string) {
  if (!hash) return;
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (!el) {
    window.setTimeout(() => {
      const retry = document.getElementById(id);
      if (retry) retry.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Link component ─────────────────────────────────────────────── */
type TransitionLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string;
};

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, onClick, children, ...rest }, ref) {
    const { triggerTransition } = useTransitionContext();
    const pathname = usePathname();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Let modifier clicks (open in new tab, etc.) fall through
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const [rawPath, rawHash] = href.split("#");
        const targetPath = rawPath || "/";
        const targetHash = rawHash ? `#${rawHash}` : "";

        e.preventDefault();
        onClick?.(e);

        // Pure hash link on the same page
        if (!rawPath && rawHash) {
          scrollToHash(targetHash);
          return;
        }

        // Same-path navigation — just scroll
        if (targetPath === pathname) {
          if (targetHash) scrollToHash(targetHash);
          else window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        triggerTransition(href);
      },
      [href, pathname, triggerTransition, onClick]
    );

    return (
      <a ref={ref} href={href} onClick={handleClick} {...rest}>
        {children}
      </a>
    );
  }
);

/* ─── Provider ───────────────────────────────────────────────────── */
export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const isPending = useRef(false);
  const prevPathname = useRef<string | null>(null);
  const pendingHash = useRef<string | null>(null);

  /* ── ENTER — curtain slides down off-screen, revealing new page ── */
  useEffect(() => {
    // First mount — just record the pathname, no animation
    if (prevPathname.current === null) {
      prevPathname.current = pathname;
      isPending.current = false;
      return;
    }
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    const overlay = overlayRef.current;

    // Handle hash / scroll on the new page
    if (pendingHash.current) {
      const hash = pendingHash.current;
      pendingHash.current = null;
      const id = hash.startsWith("#") ? hash.slice(1) : hash;
      // Slight delay so the new page has mounted
      window.setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    if (!overlay) {
      // No overlay — just unblock interaction
      document.body.style.overflow = "";
      isPending.current = false;
      return;
    }

    // Fade/slide overlay away
    gsap.to(overlay, {
      yPercent: 100,
      duration: ENTER_DURATION,
      ease: ENTER_EASE,
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0, yPercent: -100 });
        document.body.style.overflow = "";
        isPending.current = false;
      },
    });

    // Reveal any [data-transition-reveal] content on the new page
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-transition-reveal]"
    );
    if (targets.length) {
      gsap.fromTo(
        targets,
        { yPercent: 24, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.15,
        }
      );
    }
  }, [pathname]);

  /* ── EXIT — curtain slides down from above to cover page ───────── */
  const triggerTransition = useCallback(
    (href: string) => {
      if (isPending.current) return;
      isPending.current = true;

      const [rawPath, rawHash] = href.split("#");
      const navPath = rawPath || "/";
      pendingHash.current = rawHash ? `#${rawHash}` : null;

      const overlay = overlayRef.current;

      // Graceful fallback if the overlay isn't mounted for any reason
      if (!overlay) {
        router.push(navPath);
        isPending.current = false;
        return;
      }

      document.body.style.overflow = "hidden";

      // Reset and show curtain above viewport, then slide down
      gsap.set(overlay, { autoAlpha: 1, yPercent: -100 });
      gsap.to(overlay, {
        yPercent: 0,
        duration: EXIT_DURATION,
        ease: EXIT_EASE,
        onComplete: () => {
          router.push(navPath);
        },
      });

      // Safety fallback — if router.push somehow doesn't trigger a pathname
      // change within 2s, force-reset pending so the UI isn't locked.
      window.setTimeout(() => {
        if (isPending.current && prevPathname.current === pathname) {
          // Navigation never completed — reset
          gsap.set(overlay, { autoAlpha: 0, yPercent: -100 });
          document.body.style.overflow = "";
          isPending.current = false;
        }
      }, 2000);
    },
    [router, pathname]
  );

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}

      {/* Single curtain overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#02021e",
          visibility: "hidden",
          pointerEvents: "none",
          transform: "translateY(-100%)",
          willChange: "transform",
        }}
      />
    </TransitionContext.Provider>
  );
}
