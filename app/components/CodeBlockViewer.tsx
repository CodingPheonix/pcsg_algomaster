'use client'

import { Code } from 'lucide-react';
import React from 'react'
import { useState } from 'react';


type CodeLang = {
    lang: string;
    code: string;
};

const CodeBlockViewer = ({ languages }: { languages: CodeLang[] }) => {
    const [activeLang, setActiveLang] = useState(languages[0]?.lang || "");
    const activeCode = languages.find((l) => l.lang === activeLang)?.code || "";

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center border-b border-border bg-secondary/50 px-2">
                <Code size={14} className="text-muted-foreground mr-2" />
                <div className="flex overflow-x-auto">
                    {languages.map((l) => (
                        <button
                            key={l.lang}
                            onClick={() => setActiveLang(l.lang)}
                            className={`px-3 py-2 text-xs font-mono whitespace-nowrap transition-colors border-b-2 ${l.lang === activeLang
                                    ? "border-blue-500 text-blue-500"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {l.lang}
                        </button>
                    ))}
                </div>
            </div>
            <pre className="p-4 text-xs font-mono text-foreground overflow-x-auto leading-relaxed">
                <code>{activeCode}</code>
            </pre>
        </div>
    );
};

export default CodeBlockViewer
