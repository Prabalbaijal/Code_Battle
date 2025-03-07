import { useState, useEffect } from "react";

export default function TypingEffect() {
    const words = ["Coding", "Connections", "Practice", "Upskilling", "Healthy Competition"];
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[index];
        let typingSpeed = isDeleting ? 100 : 150;

        const type = () => {
            setText((prev) =>
                isDeleting ? currentWord.substring(0, prev.length - 1) : currentWord.substring(0, prev.length + 1)
            );

            if (!isDeleting && text === currentWord) {
                setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setIndex((prev) => (prev + 1) % words.length);
            }
        };

        const timer = setTimeout(type, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, index]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 flex justify-center items-center h-screen">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                ► <span className="text-orange-500">{text}</span>
                <span className="text-orange-500 animate-blink">|</span> {/* Blinking Cursor */}
                <span className="text-gray-500"> on </span>
                <span className="text-blue-500">Coding Battle</span>
                ►
            </h1>
        </div>
    );
}
