import cron from 'node-cron';
import { updateAgents } from "@/prisma/seed";

// Запуск скрипта каждую неделю в понедельник в 00:00 - шаблон 0 0 * * MON
cron.schedule('*/1 * * * *', async () => {
    console.log('Запуск обновления данных...');
    await updateAgents();
});