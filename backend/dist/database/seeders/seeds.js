"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedLeavePolicy = seedLeavePolicy;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedLeavePolicy(prisma) {
    console.log('Seeding leave policy and attendance config...');
    try {
        await prisma.leave_policy.upsert({
            where: { leaveType: 'ANNUAL' },
            update: {},
            create: { leaveType: 'ANNUAL', defaultBalance: 14 },
        });
        await prisma.leave_policy.upsert({
            where: { leaveType: 'CASUAL' },
            update: {},
            create: { leaveType: 'CASUAL', defaultBalance: 7 },
        });
        await prisma.attendanceConfig.create({
            data: {
                workStart: new Date('1970-01-01T08:00:00Z'),
                workEnd: new Date('1970-01-01T16:30:00Z'),
                otEnd: new Date('1970-01-01T20:00:00Z'),
                earlyStart: new Date('1970-01-01T07:00:00Z'),
            },
        });
        console.log(`🌱 Created new leave policy entries and attendance config.`);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}
seedLeavePolicy(prisma)
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seeds.js.map