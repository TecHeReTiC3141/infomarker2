import SectionButton, { SectionButtonProps } from "@/app/app/components/SectionButton";

interface ProfileLayoutProps {
    children: React.ReactNode,
}

const sections: SectionButtonProps[] = [
    {
        text: "Загрузить",
        section: "load-document",
    },
    {
        text: "Отчеты",
        section: "reports",
    },
    {
        text: "Профиль",
        section: "profile",
    },
    {
        text: "Настройки",
        section: "settings",
    },
]

export default function AppLayout({children}: ProfileLayoutProps) {
    return (
        <div className="container mx-auto flex justify-between gap-x-12 h-full">
            <div className="flex flex-col gap-y-4">
                {
                    sections.map(section => (
                        <SectionButton {...section} key={section.text} />
                    ))
                }
            </div>
            {children}
        </div>
    )
}