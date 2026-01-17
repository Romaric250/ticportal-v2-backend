#!/usr/bin/env node
/**
 * Test Badge Cron Job
 * Run this to test if the badge award cron is working
 */
import { BadgeService } from "../modules/badges/service.js";
import { logger } from "../shared/utils/logger.js";
async function testBadgeCron() {
    try {
        console.log('🧪 Testing Badge Award Cron...\n');
        console.log('⏰ Starting badge check at:', new Date().toISOString());
        const totalAwarded = await BadgeService.checkBadgesForAllUsers();
        console.log('\n✅ Test completed!');
        console.log(`📊 Total badges awarded: ${totalAwarded}`);
        if (totalAwarded > 0) {
            console.log('🎉 SUCCESS! Badges were awarded!');
        }
        else {
            console.log('ℹ️  No new badges to award (users may already have all earned badges)');
        }
        process.exit(0);
    }
    catch (error) {
        console.error('\n❌ Test failed!');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}
testBadgeCron();
//# sourceMappingURL=test-badge-cron.js.map