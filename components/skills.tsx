"use client";

import { motion } from "motion/react";

const skills = [
    "Sound Design",
    "Audio Post-Production",
    "Music Production",
    "Foley & SFX",
    "Sound for Picture",
];

export default function SkillChips({
    show = true,
}: {
    show?: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className=""
        > <ul className="flex max-w-[600px] flex-wrap gap-3 mt-3">
                {skills.map((skill) => (<li
                    key={skill}
                    className="border border-[#b3b1ab] px-4 py-3 font-archivo text-[12px] font-normal tracking-[0.02em] text-[#161c2b]"
                >
                    {skill} </li>
                ))} </ul>
        </motion.div>
    );
}
