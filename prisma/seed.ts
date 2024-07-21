import prisma from "@/app/lib/db/prisma";
import { getForeignAgents, getForeignOrganizationsData } from "@/prisma/dataScraping/scrapeForeignAgentsData";
import { createForeignAgent } from "@/app/lib/db/foreignAgent";
import { recreateAgentOccurrences } from "@/app/lib/db/report";

async function main(){
    await updateAgents()
}

export async function updateAgents() {
    let organizations = await getForeignOrganizationsData();
    let agents = await getForeignAgents();
    organizations = organizations.filter(org => org && true );
    agents = agents.filter(agent => agent && true );
    const agentFilter = (s: string) => s
        .split(" ").length == 3 && // Only Surname+name+lastname
        s.replaceAll("«", "").length == s.length // count of « == 0
    organizations.push(...agents.filter(s => !agentFilter(s)));
    agents = agents.filter(agentFilter);

    const regexFullBrackets = RegExp(/\(.*?\)/gm)
    const regexHalfBracket = RegExp(/\([^(]*?$/gm)
    organizations = organizations.map(org => org.replace(regexFullBrackets, ''));
    organizations = organizations.map(org => org.replace(regexHalfBracket, ''));
    agents = agents.map(agent => agent.replace(regexFullBrackets, ''));
    agents = agents.map(agent => agent.replace(regexHalfBracket, ''));


    await prisma.foreignAgent.deleteMany();
    for (let organization of organizations) {
        await createForeignAgent({
            name: organization,
            type: "ORGANISATION",
        });
    }
    for (let person of agents) {
        await createForeignAgent({
            name: person,
            type: "PERSON",
        })
    }
    const reports = await prisma.report.findMany();
    await Promise.all(
        reports.map(async report => recreateAgentOccurrences(report.id))
    );
    console.log("Seeding completed");
}

main().then(() => prisma.$disconnect()).catch(err => {
    console.log(err);
    prisma.$disconnect();
})