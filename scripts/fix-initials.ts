/**
 * Quick patch script to fix initials bug in leaderboard
 * Run with: npx tsx scripts/fix-initials.ts
 */

import fs from 'fs';
import path from 'path';

const serviceFilePath = path.join(__dirname, '../modules/leaderboard/service.ts');

console.log('🔧 Fixing initials bug in leaderboard service...\n');

try {
  let content = fs.readFileSync(serviceFilePath, 'utf-8');
  
  // Check if already has the helper method
  if (content.includes('generateInitials')) {
    console.log('✅ Helper method already exists');
  } else {
    console.log('❌ Helper method not found - needs manual fix');
  }

  // Check for the buggy line
  if (content.includes('user.firstName[0]') || content.includes('user.lastName[0]')) {
    console.log('⚠️  Found potential bug - using direct array access on firstName/lastName\n');
    
    console.log('📝 Manual fix required:');
    console.log('1. Find line with: initials: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),');
    console.log('2. Replace with: initials: this.generateInitials(user.firstName, user.lastName),');
    console.log('3. Also update name field to: name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User",\n');
  } else {
    console.log('✅ No buggy code found - might already be fixed\n');
  }

  console.log('📍 Location: src/modules/leaderboard/service.ts');
  console.log('📍 Method: getStudentsLeaderboard()');
  console.log('📍 Look for: StudentLeaderboardEntry creation (around line 145-165)\n');

} catch (error: any) {
  console.error('❌ Error:', error.message);
}
