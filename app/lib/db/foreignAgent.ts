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
            const variants = response.data.map(va => va.toLowerCase());
            // console.log(variants);
            return await prisma?.foreignAgent.create({
                data: {
                    ...data,
                    variants,
                }
            })
        }
        console.error(response.statusText);
        return null;
    } catch (error) {
        console.error("Не удалось просклонять: ", data.name)
    }
}