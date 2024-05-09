interface TextSectionProps {
    text: string,
}

export default function TextSection({text}: TextSectionProps) {
    return (
        <textarea className="overflow-y-auto flex-1 w-full mb-3 text-wrap border-2 rounded-md p-3 border-base-300 resize-none">
            {text.replace(/\n{2,}/g, '\n').trim()}
        </textarea>
    );
}