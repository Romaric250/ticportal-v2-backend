import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const regions = [
  { name: "Adamawa", country: "Cameroon" },
  { name: "Centre", country: "Cameroon" },
  { name: "East", country: "Cameroon" },
  { name: "Far North", country: "Cameroon" },
  { name: "Littoral", country: "Cameroon" },
  { name: "North", country: "Cameroon" },
  { name: "North West", country: "Cameroon" },
  { name: "South", country: "Cameroon" },
  { name: "South West", country: "Cameroon" },
  { name: "West", country: "Cameroon" },
];

const schools = [
  // South West Region
  {
    name: "Government Bilingual High School Molyko",
    region: "South West",
    country: "Cameroon",
  },
  {
    name: "Government Technical High School Buea",
    region: "South West",
    country: "Cameroon",
  },
  {
    name: "Sacred Heart College Mankon",
    region: "South West",
    country: "Cameroon",
  },
  {
    name: "Saker Baptist College Limbe",
    region: "South West",
    country: "Cameroon",
  },
  {
    name: "Government Bilingual High School Tiko",
    region: "South West",
    country: "Cameroon",
  },

  // North West Region
  {
    name: "Government Technical High School Bamenda",
    region: "North West",
    country: "Cameroon",
  },
  {
    name: "Government Bilingual High School Bamenda",
    region: "North West",
    country: "Cameroon",
  },
  {
    name: "Presbyterian Secondary School Mankon",
    region: "North West",
    country: "Cameroon",
  },
  {
    name: "St. Joseph's College Sasse",
    region: "North West",
    country: "Cameroon",
  },
  {
    name: "Government High School Fundong",
    region: "North West",
    country: "Cameroon",
  },

  // Littoral Region
  {
    name: "Lycée Général Leclerc",
    region: "Littoral",
    country: "Cameroon",
  },
  {
    name: "Government Bilingual High School Deido",
    region: "Littoral",
    country: "Cameroon",
  },
  {
    name: "Collège Libermann",
    region: "Littoral",
    country: "Cameroon",
  },
  {
    name: "Government Technical High School Nylon",
    region: "Littoral",
    country: "Cameroon",
  },
  {
    name: "Lycée de New Bell",
    region: "Littoral",
    country: "Cameroon",
  },

  // Centre Region
  {
    name: "Lycée de Ngoa-Ekelle",
    region: "Centre",
    country: "Cameroon",
  },
  {
    name: "Government Bilingual High School Yaoundé",
    region: "Centre",
    country: "Cameroon",
  },
  {
    name: "Collège Vogt",
    region: "Centre",
    country: "Cameroon",
  },
  {
    name: "Lycée Bilingue de Yaoundé",
    region: "Centre",
    country: "Cameroon",
  },
  {
    name: "Government Technical High School Etoug-Ebe",
    region: "Centre",
    country: "Cameroon",
  },

  // West Region
  {
    name: "Government Bilingual High School Bafoussam",
    region: "West",
    country: "Cameroon",
  },
  {
    name: "Lycée Classique de Bafoussam",
    region: "West",
    country: "Cameroon",
  },
  {
    name: "Government High School Dschang",
    region: "West",
    country: "Cameroon",
  },
  {
    name: "Collège Mazenod Mbouda",
    region: "West",
    country: "Cameroon",
  },

  // Adamawa Region
  {
    name: "Government Bilingual High School Ngaoundéré",
    region: "Adamawa",
    country: "Cameroon",
  },
  {
    name: "Lycée de Ngaoundéré",
    region: "Adamawa",
    country: "Cameroon",
  },

  // East Region
  {
    name: "Government Bilingual High School Bertoua",
    region: "East",
    country: "Cameroon",
  },
  {
    name: "Lycée de Bertoua",
    region: "East",
    country: "Cameroon",
  },

  // Far North Region
  {
    name: "Government Bilingual High School Maroua",
    region: "Far North",
    country: "Cameroon",
  },
  {
    name: "Lycée de Maroua",
    region: "Far North",
    country: "Cameroon",
  },

  // North Region
  {
    name: "Government Bilingual High School Garoua",
    region: "North",
    country: "Cameroon",
  },
  {
    name: "Lycée de Garoua",
    region: "North",
    country: "Cameroon",
  },

  // South Region
  {
    name: "Government Bilingual High School Ebolowa",
    region: "South",
    country: "Cameroon",
  },
  {
    name: "Lycée d'Ebolowa",
    region: "South",
    country: "Cameroon",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  await prisma.defaultSchool.deleteMany({});
  await prisma.defaultRegion.deleteMany({});

  // Seed regions
  console.log("🌍 Seeding regions...");
  for (const region of regions) {
    await prisma.defaultRegion.create({
      data: region,
    });
  }
  console.log(`✅ Created ${regions.length} regions`);

  // Seed schools
  console.log("🏫 Seeding schools...");
  for (const school of schools) {
    await prisma.defaultSchool.create({
      data: school,
    });
  }
  console.log(`✅ Created ${schools.length} schools`);

  // Summary
  console.log("\n📊 Seed Summary:");
  console.log(`   Regions: ${regions.length}`);
  console.log(`   Schools: ${schools.length}`);
  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
