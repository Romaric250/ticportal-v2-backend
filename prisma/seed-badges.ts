import { PrismaClient } from '@prisma/client';
import { BADGES } from '../src/modules/badges/badges';

const prisma = new PrismaClient();

async function seedPaidStudentBadge() {
  console.log('🌱 Seeding Paid Student badge...');

  try {
    const badge = BADGES.PAID_STUDENT;

    if (!badge) {
      throw new Error('PAID_STUDENT badge not found in badges.ts');
    }

    // Check if badge already exists
    const existingBadge = await prisma.badge.findUnique({
      where: { badgeId: badge.id }
    });

    if (existingBadge) {
      console.log('✅ Paid Student badge already exists in database');
      console.log(`   Badge ID: ${badge.id}`);
      console.log(`   Name: ${badge.name}`);
      console.log(`   Points: ${badge.points}`);
      return;
    }

    // Create the badge
    const createdBadge = await prisma.badge.create({
      data: {
        badgeId: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        tier: badge.tier,
        points: badge.points,
        rarity: badge.rarity,
        criteria: JSON.stringify(badge.requirement),
      },
    });

    console.log('✅ Paid Student badge created successfully!');
    console.log(`   Badge ID: ${createdBadge.badgeId}`);
    console.log(`   Name: ${createdBadge.name}`);
    console.log(`   Description: ${createdBadge.description}`);
    console.log(`   Points: ${createdBadge.points} TIC Points`);
    console.log(`   Category: ${createdBadge.category}`);
    console.log(`   Tier: ${createdBadge.tier}`);
    console.log('\n🎉 Badge seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding badge:', error);
    throw error;
  }
}

async function main() {
  await seedPaidStudentBadge();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
