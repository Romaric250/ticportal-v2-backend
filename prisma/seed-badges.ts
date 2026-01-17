import { PrismaClient } from '@prisma/client';
import { ALL_BADGES } from '../src/modules/badges/badges';

const prisma = new PrismaClient();

async function seedBadges() {
  console.log('🌱 Seeding badges...');

  try {
    // Delete existing badges
    await prisma.badge.deleteMany();
    console.log('🗑️  Cleared existing badges');

    // Create all badges
    const badgePromises = ALL_BADGES.map((badge) => {
      return prisma.badge.create({
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
    });

    const createdBadges = await Promise.all(badgePromises);

    console.log(`✅ Created ${createdBadges.length} badges`);
    console.log('\n📋 Badge Summary:');
    console.log(`   POINTS: ${ALL_BADGES.filter(b => b.category === 'POINTS').length}`);
    console.log(`   CONTENT: ${ALL_BADGES.filter(b => b.category === 'CONTENT').length}`);
    console.log(`   SOCIAL: ${ALL_BADGES.filter(b => b.category === 'SOCIAL').length}`);
    console.log(`   TEAM: ${ALL_BADGES.filter(b => b.category === 'TEAM').length}`);
    console.log(`   ACHIEVEMENT: ${ALL_BADGES.filter(b => b.category === 'ACHIEVEMENT').length}`);
    console.log(`   SPECIAL: ${ALL_BADGES.filter(b => b.category === 'SPECIAL').length}`);

    console.log('\n🎉 Badge seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    throw error;
  }
}

async function main() {
  await seedBadges();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
