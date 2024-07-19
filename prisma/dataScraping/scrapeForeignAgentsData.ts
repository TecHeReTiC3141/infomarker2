import axios from "axios";
import * as cheerio from 'cheerio';
import * as https from "https";
import fs from "node:fs/promises";

// @ts-ignore
import { PdfDataParser } from "pdf-data-parser";

const UNDESIRED_ORGANIZATIONS_URL = "https://minjust.gov.ru/ru/documents/7756/";
const TERRORIST_ORGANIZATIONS_URL = "http://nac.gov.ru/terroristicheskie-i-ekstremistskie-organizacii-i-materialy.html";
const EXTREMIST_ORGANIZATIONS_URL = "https://minjust.gov.ru/ru/documents/7822/";

async function getUndesiredOrganizations() {
    const { data } = await axios.get(UNDESIRED_ORGANIZATIONS_URL, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }
    );
    const $ = cheerio.load(data);

    return $('table td:nth-child(4)')
        .map((_, element) => $(element).text().trim()).toArray();
}

async function getTerroristOrganizations() {
    const { data } = await axios.get(TERRORIST_ORGANIZATIONS_URL, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }
    );
    const $ = cheerio.load(data);

    // Пример извлечения данных. Настрой под структуру HTML внешнего сайта.
    return $('.table_nac td:nth-child(2)')
        .map((_, element) => $(element).text().trim()).toArray();
}

async function getExtremistOrganizations() {
    const { data } = await axios.get(EXTREMIST_ORGANIZATIONS_URL, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }
    );
    const $ = cheerio.load(data);
    // Пример извлечения данных. Настрой под структуру HTML внешнего сайта.
    return $(".doc p")
        .map((_, element) => $(element).text().trim()).toArray()
        .filter(org => /^[1-9][0-9]{0,2}\.\s/.test(org)).map(s => s.split(".")[1]);
}

export async function getForeignAgents() {
    const tableHeader = "Полное наименование /ФИО , прежнее ФИО"
    const { data } = await axios.get<ArrayBuffer>("https://minjust.gov.ru/uploaded/files/kopiya-reestr-inostrannyih-agentov-12-07-2024.pdf", {
        responseType: "arraybuffer",
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
    });
    console.log(typeof data);
    await fs.writeFile("./foreign-agents-list.pdf", Buffer.from(data));
    let parser = new PdfDataParser({url: "./foreign-agents-list.pdf"});
    const rows: string[][] = await parser.parse();
    const foreignAgents = rows
        .map(row => row[1])
        .filter(row => row && true)
        .map(row => row.trim())
        .filter(s => s != tableHeader);
    console.log(foreignAgents);


    // The next line crashing
    // await fs.rm("./foreign-agents-list.pdf");
    return foreignAgents;
}

export async function getForeignOrganizationsData() {
    try {
        const tableHeader = "Полное наименование /ФИО , прежнее ФИО"
        const results = await Promise.all([
            getExtremistOrganizations(),
            getTerroristOrganizations(),
            getUndesiredOrganizations(),
        ]);
        const organizations = results.flat().map(org => org.trim()).filter(s => s != tableHeader);
        console.log("Loaded organizations: ", organizations.length);
        console.log('Данные успешно обновлены!');
        return organizations;
    } catch (error) {
        console.error('Ошибка при обновлении данных:', error);
        return []
    }
}

getForeignAgents().then(() => console.log("List read successfully"));
// getForeignAgentsData().then(() => console.log("Scrape success"));
