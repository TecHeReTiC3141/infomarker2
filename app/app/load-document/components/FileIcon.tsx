import { BsFiletypeDoc, BsFiletypeDocx, BsFiletypePdf, BsFiletypeTxt, } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { IconType } from "react-icons";

interface FileIconProps {
    filename: string;
    clearFile?: () => void,
}

interface FileExtensionIcons {
    "txt": IconType,
    "pdf": IconType,
    "doc": IconType,
    "docx": IconType,
}

export default function FileIcon({ filename, clearFile }: FileIconProps) {
    const fileIcons: { [key in keyof FileExtensionIcons]: FileExtensionIcons[key] } = {
        txt: BsFiletypeTxt,
        pdf: BsFiletypePdf,
        doc: BsFiletypeDoc,
        docx: BsFiletypeDocx,
    };
    const extension = filename.split(".").at(-1);
    if (!extension || !(extension in fileIcons)) {
        return <div>Unsupported file</div>;
    }
    const Icon = fileIcons[ extension as keyof FileExtensionIcons ];

    return (
        <div className="bg-base-100 rounded-lg relative max-w-80 p-3 flex flex-col items-center gap-y-3 pt-5">
            {clearFile &&
                <button className="btn btn-xs btn-circle absolute right-1 top-1 hover:text-error" onClick={clearFile}>
                    <FaXmark size={12}/>
                </button>
            }
            <Icon size={80}/>
            <p className="text-sm">{filename}</p>
        </div>
    )
}