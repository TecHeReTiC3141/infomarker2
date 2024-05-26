import clsx from "clsx";
import { FaRegCircleQuestion  } from "react-icons/fa6";
import { BsExclamationCircle } from "react-icons/bs";
import { IconType } from "react-icons";
import { occurVariants} from "@/app/app/reports/[reportId]/ReportSection";


interface SelectOccurVariantProps {
    active: keyof typeof occurVariants,
    setActive: (value: keyof typeof occurVariants) => void,
}

export default function SelectOccurVariant({ active, setActive }: SelectOccurVariantProps) {
    return (
            <div className="flex items-center gap-x-1 md:gap-x-3 px-1.5 py-1 bg-base-200
         border border-gray-600 dark:border-gray-400 rounded-md max-xs:rounded-tr-none ">
                {Object.entries(occurVariants)
                    .map(([ key, Icon ]) => (
                        <div key={key} className="border-r pr-1 md:pr-3 border-gray-700 last:border-r-0 last:pr-0">
                            <button className={clsx(" p-1 rounded-md", active === key ?
                                "bg-yellow-300 dark:bg-yellow-500" : "hover:bg-blue-300 hover:dark:bg-blue-400")}
                                    disabled={active === key} onClick={() => setActive(key)}>
                                <Icon size={24}/>
                            </button>
                        </div>
                    ))}
            </div>

    )
}