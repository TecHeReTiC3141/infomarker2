import cron from 'node-cron';
import { getForeignOrganizationsData } from "@/prisma/dataScraping/scrapeForeignAgentsData";

// Запуск скрипта каждую неделю в понедельник в 00:00
cron.schedule('*/30 * * * * *', async () => {
    console.log('Запуск обновления данных...');
    await getForeignOrganizationsData();
});