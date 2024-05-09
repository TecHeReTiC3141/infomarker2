import { getTextById } from "@/app/app/load-document/actions";
import TextSection from "@/app/app/reports/[reportId]/TextSection";
import { GrCircleInformation } from "react-icons/gr";

interface DocumentPageProps {
    params: {
        reportId: string,
    }
}

export default async function DocumentPage({ params: { reportId } }: DocumentPageProps) {

    const fileText = await getTextById(reportId);

    return (
        <div className="w-full min-h-full pb-4 flex justify-between gap-x-6">
            <TextSection text={fileText} />
            <div className="flex-[2]">
                <div className="rounded-xl bg-info/40 text-blue-600 flex gap-x-3 items-center w-1/2 p-3 text-sm">
                    <GrCircleInformation size={60}/>
                    <p>Результаты проверки <span className="font-bold">[InfoMarker]*</span> носят строго
                        рекомендательный
                        характер и не могут использоваться в качестве
                        юридического документа</p>
                </div>
                <div className="mt-10">
                    <h4 className="text-xl font-bold">Обнаруженные упоминания</h4>
                </div>
            </div>
        </div>
    );
}