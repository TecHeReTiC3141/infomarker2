interface TextSectionProps {
    text: string,
}

export default function TextSection({ text }: TextSectionProps) {

    return (
        <div className="overflow-auto flex-1 border-2 rounded-md p-3 border-base-300 resize-none">
            <p className="w-full mb-3 text-wrap whitespace-pre-line break-words">
                {text.replace(/\n{2,}/g, '\n').trim()}
            </p>
        </div>
    );
}