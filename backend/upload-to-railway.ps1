# Upload bot files to Railway
# Run this from the backend directory

Write-Host "🚀 Uploading bot files to Railway..." -ForegroundColor Green
Write-Host ""

# Create directories
Write-Host "📁 Creating directories on Railway..." -ForegroundColor Yellow
railway run "mkdir -p src/jobs"
railway run "mkdir -p src/routes"
railway run "mkdir -p scripts"

# Upload bot generation file
Write-Host "📤 Uploading userGeneratorBot.js..." -ForegroundColor Yellow
Get-Content src/jobs/userGeneratorBot.js | railway run "cat > src/jobs/userGeneratorBot.js"

# Upload bot activity manager
Write-Host "📤 Uploading botActivityManager.js..." -ForegroundColor Yellow
Get-Content src/jobs/botActivityManager.js | railway run "cat > src/jobs/botActivityManager.js"

# Upload bots route
Write-Host "📤 Uploading bots.js route..." -ForegroundColor Yellow
Get-Content src/routes/bots.js | railway run "cat > src/routes/bots.js"

# Upload scripts
Write-Host "📤 Uploading makeAdmin.js..." -ForegroundColor Yellow
Get-Content scripts/makeAdmin.js | railway run "cat > scripts/makeAdmin.js"

Write-Host "📤 Uploading listUsers.js..." -ForegroundColor Yellow
Get-Content scripts/listUsers.js | railway run "cat > scripts/listUsers.js"

Write-Host "📤 Uploading testBotGeneration.js..." -ForegroundColor Yellow
Get-Content scripts/testBotGeneration.js | railway run "cat > scripts/testBotGeneration.js"

Write-Host "📤 Uploading testBotActivity.js..." -ForegroundColor Yellow
Get-Content scripts/testBotActivity.js | railway run "cat > scripts/testBotActivity.js"

Write-Host ""
Write-Host "✅ All files uploaded successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart Railway: railway restart" -ForegroundColor White
Write-Host "2. Generate bots: railway run node scripts/testBotGeneration.js 100" -ForegroundColor White
Write-Host "3. Make admin: railway run node scripts/makeAdmin.js meet.maheshin@gmail.com" -ForegroundColor White
