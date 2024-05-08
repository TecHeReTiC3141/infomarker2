interface TextSectionProps {
    text: string,
}

export default function TextSection({text}: TextSectionProps) {
    return (
        <textarea className="overflow-y-auto min-h-full flex-[4] text-wrap border-2 rounded-md p-3 border-base-300 resize-none">
            {text}
        </textarea>
    );
}