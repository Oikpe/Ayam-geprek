// Enhanced Beelingua Bot Loader
(function() {
    console.log('🐝 Loading Enhanced Beelingua Bot...');
    
    // GANTI INI dengan username GitHub kamu
    const GITHUB_USER = 'YOUR_GITHUB_USERNAME';  // ⚠️ EDIT INI!
    const REPO = 'beelingua-enhanced-bot';
    
    const urls = [
        `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${REPO}/enhanced-bot.js`,
        `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/main/enhanced-bot.js`
    ];
    
    // Hide webdriver
    try {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    } catch (e) {}
    
    async function loadBot() {
        for (const url of urls) {
            try {
                console.log(`🔄 Trying: ${url}`);
                const response = await fetch(url, { 
                    cache: 'no-cache',
                    headers: { 'User-Agent': 'Mozilla/5.0 Chrome/91.0' }
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const code = await response.text();
                eval(code);
                
                console.log('✅ Enhanced Bee Bot loaded successfully!');
                console.log('📱 Look for orange panel in top-right corner');
                return;
                
            } catch (error) {
                console.warn(`❌ Failed ${url}: ${error.message}`);
            }
        }
        throw new Error('All download URLs failed');
    }
    
    loadBot().catch(error => {
        console.error('🚫 Complete loading failure:', error);
        alert('Failed to load Enhanced Bee Bot.\n\nTroubleshooting:\n1. Check internet connection\n2. Verify GitHub username is correct\n3. Try refreshing page');
    });
})();
