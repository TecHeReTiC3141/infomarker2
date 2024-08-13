import prisma from "@/app/lib/db/prisma";
import { getForeignAgents, getForeignOrganizationsData } from "@/prisma/dataScraping/scrapeForeignAgentsData";
import { createForeignAgent } from "@/app/lib/db/foreignAgent";
import { recreateAgentOccurrences } from "@/app/lib/db/report";
import { SingleBar, Presets } from "cli-progress";
import pMap from "p-map";
import { ForeignAgent, ForeignAgentType } from "@prisma/client";

async function main() {
    await updateAgents();
}

const BATCH_SIZE = 7;

async function createAgentsInBatches(items: string[], type: ForeignAgentType) {
    const bar = new SingleBar({ stopOnComplete: true }, Presets.shades_classic);
    bar.start(items.length, 0);

    // Create a function to handle creating agents
    const createAgent = async (item: string) => {
        await createForeignAgent({
            name: item,
            type: type,
        });
        bar.increment();
    };

    await pMap(items, createAgent, { concurrency: BATCH_SIZE });

    bar.stop();
}

async function recreateAgentsInBatches(reports: { id: number }[]) {
    const bar = new SingleBar({ stopOnComplete: true }, Presets.shades_classic);
    bar.start(reports.length, 0);

    // Create a function to handle creating agents
    const createAgent = async (report:  { id: number }) => {
        await recreateAgentOccurrences(report.id);
        bar.increment();
    };

    // Use pMap to process items in parallel batches
    await pMap(reports, createAgent, { concurrency: BATCH_SIZE });

    bar.stop();
}

export async function updateAgents() {

    // TODO: turn it into transaction
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
    organizations = [ ...new Set(organizations) ];
    agents = [ ...new Set(agents) ];

    await prisma.foreignAgent.deleteMany();
    console.log("Creating organizations...");
    await createAgentsInBatches(organizations, "ORGANISATION");
    console.log("Organizations have been created");

    console.log("Creating persons...");
    await createAgentsInBatches(agents, "PERSON");
    console.log("Persons have been created");

    const reports = await prisma.report.findMany({
        select: {
            id: true,
        }
    });
    console.log("Recreating agent occurrences in all reports...");
    await recreateAgentsInBatches(reports);
    console.log("Seeding completed");
}

main().then(() => prisma.$disconnect()).catch(err => {
    console.log(err);
    prisma.$disconnect();
})