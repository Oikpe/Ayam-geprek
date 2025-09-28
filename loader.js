// Ultra Bot Loader
(function() {
    const GITHUB_USER = 'Oikpe'; 
    const REPO = 'Ayam-geprek';
    
    const urls = [
        `https://cdn.jsdelivr.net/gh/${Oikpe}/${Ayam-geprek}/enhanced-bot.js`,
        `https://raw.githubusercontent.com/${Oikpe}/${Ayam-geprek}/main/enhanced-bot.js`
    ];
    
    async function loadBot() {
        for (const url of urls) {
            try {
                const response = await fetch(url, { cache: 'no-cache' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const code = await response.text();
                eval(code);
                console.log('Ultra Bot v4.1 loaded successfully!');
                return;
            } catch (error) {
                console.warn(`Failed: ${error.message}`);
            }
        }
        throw new Error('All URLs failed');
    }
    
    loadBot().catch(error => {
        console.error('Loading failed:', error);
        alert('Ultra Bot loading failed. Check console.');
    });
})();
