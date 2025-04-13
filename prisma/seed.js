const { PrismaClient} = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding database...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { email: 'admin@imf.com' },
      update: {},
      create: {
        email: 'admin@imf.com',
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    const agentPassword = await bcrypt.hash('agent123', 10);
    await prisma.user.upsert({
      where: { email: 'agent@imf.com' },
      update: {},
      create: {
        email: 'agent@imf.com',
        username: 'agent',
        password: agentPassword,
        role: 'AGENT',
      },
    });


    const gadgets = [
      {
        name: 'Explosive Gum',
        codename: 'The Shadow Eagle',
        description: 'Chewing gum that explodes when heated',
        status: 'AVAILABLE',
      },
      {
        name: 'Disguise Mask',
        codename: 'The Phantom Wolf',
        description: 'Realistic face mask that can mimic any person',
        status: 'DEPLOYED',
      },
      {
        name: 'Laser Watch',
        codename: 'The Crimson Viper',
        description: 'Watch with built-in high-intensity laser',
        status: 'AVAILABLE',
      },
    ];

    for (const gadget of gadgets) {
      await prisma.gadget.upsert({
        where: { codename: gadget.codename },
        update: {},
        create: gadget,
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();