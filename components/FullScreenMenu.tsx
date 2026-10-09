"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

const links = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Art Lab", href: "/art" },
];

export default function FullScreenMenu() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className={`relative z-[100] flex items-center gap-2 text-xs tracking-wider sm:text-sm 2xl:text-base ${
                    isOpen ? "text-black" : "text-current"
                }`}
            >
                <span>{isOpen ? "CLOSE" : "MENU"}</span>

                <span className="relative flex h-4 w-4 items-center justify-center">
                    <span
                        className={`absolute h-px w-4 bg-current transition-transform duration-300 ${
                            isOpen ? "rotate-45" : "-translate-y-[3px]"
                        }`}
                    />
                    <span
                        className={`absolute h-px w-4 bg-current transition-transform duration-300 ${
                            isOpen ? "-rotate-45" : "translate-y-[3px]"
                        }`}
                    />
                </span>
            </button>

            {/* Panel: enters from the LEFT, leaves to the RIGHT (always left -> right) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="menu-panel"
                        className="fixed inset-0 z-[90] bg-[#EFEEEB] text-black"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <nav className="absolute left-0 top-0 flex h-full w-full flex-col items-start justify-start gap-4 pl-[5vw] pt-[18vh] intro-tagline intro-font-1 sm:gap-7">
                            {links.map((link, index) => (
                                <div key={link.label} className="overflow-hidden">
                                    <motion.div
                                        initial={{ y: "110%", opacity: 0 }}
                                        animate={{ y: "0%", opacity: 1 }}
                                        transition={{
                                            duration: 0.9,
                                            delay: 0.25 + index * 0.18,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block w-fit text-5xl tracking-tight intro-font-3 font-[400] sm:text-5xl md:text-6xl lg:text-6xl hover:text-neutral-400"
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                </div>
                            ))}

                            <motion.p
                                className="mt-20 text-[0.9rem] text-gray-700 uppercase underline"
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.8 }}
                            >
                                tejasyadav246@gmail.com
                            </motion.p>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}