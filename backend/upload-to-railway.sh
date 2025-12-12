#!/bin/bash

echo "🚀 Uploading bot files to Railway..."
echo ""

# Create directories
echo "📁 Creating directories..."
railway run mkdir -p src/jobs src/routes scripts

# Upload bot generation file
echo "📤 Uploading userGeneratorBot.js..."
cat src/jobs/userGeneratorBot.js | railway run "cat > src/jobs/userGeneratorBot.js"

# Upload bot activity manager
echo "📤 Uploading botActivityManager.js..."
cat src/jobs/botActivityManager.js | railway run "cat > src/jobs/botActivityManager.js"

# Upload bots route
echo "📤 Uploading bots.js route..."
cat src/routes/bots.js | railway run "cat > src/routes/bots.js"

# Upload scripts
echo "📤 Uploading management scripts..."
cat scripts/makeAdmin.js | railway run "cat > scripts/makeAdmin.js"
cat scripts/listUsers.js | railway run "cat > scripts/listUsers.js"
cat scripts/testBotGeneration.js | railway run "cat > scripts/testBotGeneration.js"
cat scripts/testBotActivity.js | railway run "cat > scripts/testBotActivity.js"

echo ""
echo "✅ All files uploaded successfully!"
echo ""
echo "Next steps:"
echo "1. Restart Railway service: railway restart"
echo "2. Generate initial bots: railway run node scripts/testBotGeneration.js 100"
echo "3. Make yourself admin: railway run node scripts/makeAdmin.js meet.maheshin@gmail.com"
