# URGENT: Schema Fix Required

## Current Status

The Prisma schema has errors that need to be fixed before we can proceed with the admin API implementation.

## Issues:

1. Duplicate model declarations
2. Models referenced before they're defined
3. UserStatus enum not defined

## Quick Fix Steps:

### Step 1: Add UserStatus Enum

Add this after the UserRole enum (around line 62):

```prisma
enum UserStatus {
  ACTIVE
  PENDING
  SUSPENDED
  INACTIVE
}
```

### Step 2: Update User Model

Change the User model's `status` field from:
```prisma
status       UserStatus  @default(PENDING)
```

To ensure UserStatus enum exists first.

### Step 3: Remove Duplicate Models

Search for duplicate "model TeamDeliverable" and remove all but one definition.

### Step 4: Move New Models to End

All new models (DeliverableTemplate, TeamDeliverable, LearningPath, etc.) should be added AFTER the DefaultRegion model at the very end of the file.

## Correct Schema Structure:

```prisma
// ... existing models ...

model DefaultRegion {
  // ... existing fields ...
}

// NEW: Add these at the end
enum DeliverableType {
  PROPOSAL
  PROTOTYPE
  FINAL_SUBMISSION
  DOCUMENTATION
}

enum DeliverableStatus {
  PENDING
  APPROVED
  REJECTED
}

enum LearningPathAudience {
  STUDENTS
  MENTORS
  EVERYONE
}

model DeliverableTemplate {
  id          String           @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  type        DeliverableType
  hackathonId String?          @db.ObjectId
  dueDate     DateTime
  required    Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  
  hackathon    Hackathon?       @relation(fields: [hackathonId], references: [id], onDelete: SetNull)
  deliverables TeamDeliverable[]
  
  @@map("deliverable_templates")
}

model TeamDeliverable {
  id           String             @id @default(auto()) @map("_id") @db.ObjectId
  teamId       String             @db.ObjectId
  templateId   String             @db.ObjectId
  type         DeliverableType
  fileUrl      String
  description  String?
  status       DeliverableStatus  @default(PENDING)
  feedback     String?
  submittedAt  DateTime           @default(now())
  reviewedAt   DateTime?
  reviewedBy   String?            @db.ObjectId
  
  team         Team               @relation(fields: [teamId], references: [id], onDelete: Cascade)
  template     DeliverableTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
  reviewer     User?              @relation("DeliverableReviewer", fields: [reviewedBy], references: [id])
  
  @@map("team_deliverables")
}

model LearningPath {
  id          String                @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  audience    LearningPathAudience
  isCore      Boolean               @default(false)
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
  
  modules     LearningModule[]
  progress    UserLearningProgress[]
  
  @@map("learning_paths")
}

model LearningModule {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId
  pathId        String         @db.ObjectId
  title         String
  content       String
  order         Int
  quiz          Json?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  path          LearningPath   @relation(fields: [pathId], references: [id], onDelete: Cascade)
  completions   ModuleCompletion[]
  
  @@unique([pathId, order])
  @@map("learning_modules")
}

model UserLearningProgress {
  id              String       @id @default(auto()) @map("_id") @db.ObjectId
  userId          String       @db.ObjectId
  pathId          String       @db.ObjectId
  completedModules Int         @default(0)
  totalModules    Int
  progress        Float        @default(0)
  startedAt       DateTime     @default(now())
  completedAt     DateTime?
  
  user            User         @relation("UserLearningProgress", fields: [userId], references: [id], onDelete: Cascade)
  path            LearningPath @relation(fields: [pathId], references: [id], onDelete: Cascade)
  
  @@unique([userId, pathId])
  @@map("user_learning_progress")
}

model ModuleCompletion {
  id          String         @id @default(auto()) @map("_id") @db.ObjectId
  userId      String         @db.ObjectId
  moduleId    String         @db.ObjectId
  quizScore   Float?
  completedAt DateTime       @default(now())
  
  user        User           @relation("ModuleCompletions", fields: [userId], references: [id], onDelete: Cascade)
  module      LearningModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  
  @@unique([userId, moduleId])
  @@map("module_completions")
}
```

## After Schema is Fixed:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Push to database
npx prisma db push

# 3. Start implementing services
```

## Implementation Priority:

1. **Fix schema** (URGENT) ← We are here
2. Create admin service
3. Create deliverable service  
4. Create learning service
5. Create controllers
6. Create routes
7. Test endpoints

I'll wait for you to fix the schema, then I can continue with the service implementations.

Would you like me to:
A) Provide a complete, clean schema.prisma file?
B) Continue with service implementations assuming schema is fixed?
C) Create a migration script to add the new tables?
