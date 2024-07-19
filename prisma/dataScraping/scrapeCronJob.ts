import cron from 'node-cron';
import { getForeignAgents, getForeignOrganizationsData } from "@/prisma/dataScraping/scrapeForeignAgentsData";
import { updateAgents } from "@/prisma/seed";

// Запуск скрипта каждую неделю в понедельник в 00:00
cron.schedule('*/30 * * * * *', async () => {
    console.log('Запуск обновления данных...');
    await updateAgents()
});