import DocumentDroparea from "@/app/app/load-document/components/DocumentDroparea";
import { GrCircleInformation } from "react-icons/gr";


export default function Home() {
    return (
        <div className="w-full">
            <DocumentDroparea/>
            <div className="rounded-xl bg-info/40 text-blue-600 flex gap-x-3 items-center w-1/2 mt-6 p-3 text-sm">
                <GrCircleInformation size={40}/>
                <p>Результаты проверки <span className="font-bold">[InfoMarker]*</span> носят строго рекомендательный
                    характер и не могут использоваться в качестве
                    юридического документа</p>
            </div>
        </div>

    );
}
