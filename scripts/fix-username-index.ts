import { PrismaClient } from "@prisma/client";
import { MongoClient } from "mongodb";
import { env } from "../src/config/env";

async function fixUsernameIndex() {
  const mongoClient = new MongoClient(env.DATABASE_URL);
  
  try {
    console.log("🔧 Fixing unique indexes to allow multiple NULLs...");
    
    // Connect to MongoDB
    await mongoClient.connect();
    console.log("✅ Connected to MongoDB");
    
    const db = mongoClient.db();
    const userCollection = db.collection("User");
    
    // Fix username index
    try {
      await userCollection.dropIndex("User_username_key");
      console.log("✅ Dropped existing User_username_key index");
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log("ℹ️ User_username_key index doesn't exist, creating new one...");
      } else {
        throw error;
      }
    }
    
    await userCollection.createIndex(
      { username: 1 },
      { unique: true, sparse: true, name: "User_username_key" }
    );
    console.log("✅ Created sparse unique index on username");
    
    // Fix phone index
    try {
      await userCollection.dropIndex("User_phone_key");
      console.log("✅ Dropped existing User_phone_key index");
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log("ℹ️ User_phone_key index doesn't exist, creating new one...");
      } else {
        throw error;
      }
    }
    
    await userCollection.createIndex(
      { phone: 1 },
      { unique: true, sparse: true, name: "User_phone_key" }
    );
    console.log("✅ Created sparse unique index on phone");
    
    console.log("\n✨ All indexes fixed! Multiple NULL values are now allowed.");
    console.log("✨ You can now run: npx prisma db push");
    
  } catch (error) {
    console.error("❌ Error fixing indexes:", error);
    process.exit(1);
  } finally {
    await mongoClient.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
  }
}

fixUsernameIndex();
