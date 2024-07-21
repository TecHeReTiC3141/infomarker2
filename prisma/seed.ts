import prisma from "@/app/lib/db/prisma";
import { getForeignAgents, getForeignOrganizationsData } from "@/prisma/dataScraping/scrapeForeignAgentsData";
import { createForeignAgent } from "@/app/lib/db/foreignAgent";
import { recreateAgentOccurrences } from "@/app/lib/db/report";

async function main() {
    await updateAgents();
}

export async function updateAgents() {
    let [ organizations, agents ] = await Promise.all([
        getForeignOrganizationsData(),
        getForeignAgents()
    ]);
    organizations = organizations.filter(org => org && true);
    agents = agents.filter(agent => agent && true);

    const agentFilter = (s: string) => s
            .split(" ").length == 3 && // Only Surname+name+lastname
        s.replaceAll("«", "").length == s.length // count of « == 0
    organizations.push(...agents.filter(s => !agentFilter(s)));
    agents = agents.filter(agentFilter);

    const regexFullBrackets = RegExp(/\(.*?\)/gm)
    const regexHalfBracket = RegExp(/\([^(]*?$/gm)
    organizations = organizations.map(org => org.replace(regexFullBrackets, '').replace(regexHalfBracket, ''));
    agents = agents.map(agent => agent.replace(regexFullBrackets, '').replace(regexHalfBracket, ''));
    organizations = [...new Set(organizations)];
    agents = [...new Set(agents)];

    await prisma.foreignAgent.deleteMany();
    for (let organization of organizations) {
        await createForeignAgent({
            name: organization,
            type: "ORGANISATION",
        });
    }
    console.log("Organizations have been created");
    for (let person of agents) {
        await createForeignAgent({
            name: person,
            type: "PERSON",
        });
    }
    console.log("Persons have been created");
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