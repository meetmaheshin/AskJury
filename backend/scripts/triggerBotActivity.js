import { runMultipleBotActivities } from '../src/jobs/botActivityManager.js';

console.log('🤖 Manually triggering bot activity...');

runMultipleBotActivities(5).then(() => {
  console.log('✅ Bot activity completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
