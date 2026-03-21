import React, { useEffect, useRef } from "react";

type HintPopupProps = {
    hints: string[];
    //   hints: [string, string, string];
    onClose: () => void;
};

const HintPopup: React.FC<HintPopupProps> = ({ hints, onClose }) => {
    const popupRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div
                ref={popupRef}
                className="
          bg-white
          rounded-2xl
          shadow-xl
          w-[40vw]
          max-h-[300px]
          p-6
          flex flex-col
        "
            >
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    💡 Hints
                </h3>

                {/* Scrollable content if needed */}
                {hints.length === 0 ? (
                    <div className="w-full text-center"> No Hints Available </div>
                ) : (
                    <ul className="space-y-2 overflow-y-auto flex-1">
                        {hints.map((hint, index) => (
                            <li
                                key={index}
                                className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2"
                            >
                                {hint}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
                >
                    Close
                </button>
            </div>
        </div >
    );
};

export default HintPopup;