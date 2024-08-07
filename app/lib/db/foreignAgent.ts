import { ForeignAgentType } from "@prisma/client";
import axios from "axios";

interface createForeignAgentData {
    name: string;
    type: ForeignAgentType;
}


export async function createForeignAgent(data: createForeignAgentData) {
    try {
        const response = await axios.post<string[]>(`${process.env.NLP_SERVER_BASE_URL}/get_foreign_agent_variants`, {
            ...data,
        });
        if (response.status === 200) {
            return await prisma?.foreignAgent.create({
                data: {
                    ...data,
                    variants: response.data,
                }
            })
        }
        console.error(response.statusText);
        return null;
    } catch (error) {
        console.error("Не удалось просклонять: ", data.name, (error as Error).message);
    }
}