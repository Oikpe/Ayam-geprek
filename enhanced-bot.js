// Beelingua Enhanced Bot v3.0 - Production Ready
// Features: Quiz Automation + Memory System + Video Speed Control
(() => {
    'use strict';
    
    console.log('🚀 Beelingua Enhanced Bot v3.0 Loading...');
    
    if (window.beelinguaBotActive) {
        console.log('⚠️ Bot already running');
        return;
    }
    window.beeinguaBotActive = true;

    // Memory System - Stores question-answer pairs locally
    const memoryDB = {
        storageKey: 'beelingua_memory_enhanced',
        
        load() {
            try {
                const data = localStorage.getItem(this.storageKey);
                return data ? JSON.parse(data) : {
                    questions: {},
                    stats: { total: 0, learned: 0, lastUpdate: Date.now() }
                };
            } catch (e) {
                return { questions: {}, stats: { total: 0, learned: 0, lastUpdate: Date.now() } };
            }
        },
        
        save(data) {
            try {
                data.stats.lastUpdate = Date.now();
                localStorage.setItem(this.storageKey, JSON.stringify(data));
                return true;
            } catch (e) {
                console.warn('Save failed:', e);
                return false;
            }
        },
        
        createKey(questionText) {
            if (!questionText) return null;
            const clean = questionText.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            let hash = 0;
            for (let i = 0; i < clean.length; i++) {
                hash = ((hash << 5) - hash) + clean.charCodeAt(i);
                hash = hash & hash;
            }
            
            const words = clean.split(' ').filter(w => w.length > 2).slice(0, 3);
            return `${Math.abs(hash)}_${clean.length}_${words.join('_')}`;
        },
        
        learn(question, answer, source = 'auto') {
            const data = this.load();
            const key = this.createKey(question);
            
            if (!key) return false;
            
            data.questions[key] = {
                q: question.substring(0, 200),
                a: answer,
                count: (data.questions[key]?.count || 0) + 1,
                source: source,
                time: Date.now()
            };
            
            data.stats.total = Object.keys(data.questions).length;
            data.stats.learned++;
            
            console.log(`🧠 Learned: ${question.substring(0, 40)}... → ${answer}`);
            return this.save(data);
        },
        
        find(questionText) {
            const data = this.load();
            const key = this.createKey(questionText);
            
            if (key && data.questions[key]) {
                const result = data.questions[key];
                console.log(`🎯 Memory hit: ${result.a} (${result.count}x)`);
                return { answer: result.a, confidence: result.count, type: 'exact' };
            }
            
            // Fuzzy search
            const words = questionText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
            let bestMatch = null;
            let bestScore = 0;
            
            for (const [qKey, qData] of Object.entries(data.questions)) {
                const qWords = qData.q.toLowerCase().split(/\W+/).filter(w => w.length > 3);
                const common = words.filter(w => qWords.includes(w));
                const score = common.length / Math.max(words.length, qWords.length);
                
                if (score > bestScore && score > 0.5) {
                    bestScore = score;
                    bestMatch = qData;
                }
            }
            
            if (bestMatch) {
                console.log(`🔍 Fuzzy match: ${bestMatch.a} (${Math.round(bestScore * 100)}%)`);
                return { answer: bestMatch.a, confidence: bestMatch.count * bestScore, type: 'fuzzy' };
            }
            
            return null;
        },
        
        getStats() {
            const data = this.load();
            return {
                total: Object.keys(data.questions).length,
                learned: data.stats.learned,
                lastUpdate: new Date(data.stats.lastUpdate).toLocaleString()
            };
        },
        
        export() {
            const data = this.load();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `beelingua_memory_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
        
        clear() {
            localStorage.removeItem(this.storageKey);
            console.log('🗑️ Memory cleared');
        }
    };

    // Enhanced Video Control
    const videoController = {
        findAllVideos() {
            const videos = [];
            
            // Find direct video elements
            document.querySelectorAll('video').forEach(v => videos.push(v));
            
            // Find in iframes
            document.querySelectorAll('iframe').forEach(iframe => {
                try {
                    const iDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iDoc) {
                        iDoc.querySelectorAll('video').forEach(v => videos.push(v));
                    }
                } catch (e) {}
            });
            
            return videos;
        },
        
        setSpeed(speed) {
            const videos = this.findAllVideos();
            let changed = 0;
            
            videos.forEach(video => {
                try {
                    // Force set playback rate
                    Object.defineProperty(video, 'playbackRate', {
                        set: function(value) {
                            this._playbackRate = speed;
                            // Try multiple methods to ensure it sticks
                            if (this.duration && !isNaN(this.duration)) {
                                this.defaultPlaybackRate = speed;
                                try {
                                    this.mozPreservesPitch = false;
                                    this.webkitPreservesPitch = false;
                                    this.preservesPitch = false;
                                } catch (e) {}
                            }
                        },
                        get: function() {
                            return this._playbackRate || speed;
                        },
                        configurable: true
                    });
                    
                    video.playbackRate = speed;
                    video.defaultPlaybackRate = speed;
                    changed++;
                    
                } catch (e) {
                    console.warn('Failed to set video speed:', e);
                }
            });
            
            // Override any speed restrictions globally
            this.overrideGlobalControls(speed);
            
            console.log(`🎥 Set speed ${speed}x for ${changed} videos`);
            return changed > 0;
        },
        
        overrideGlobalControls(speed) {
            // Override HTMLVideoElement prototype
            if (window.HTMLVideoElement && HTMLVideoElement.prototype) {
                const originalSetter = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'playbackRate')?.set;
                
                if (originalSetter) {
                    Object.defineProperty(HTMLVideoElement.prototype, 'playbackRate', {
                        set: function(value) {
                            this._forcedSpeed = speed;
                            try {
                                originalSetter.call(this, speed);
                            } catch (e) {
                                this._playbackRate = speed;
                            }
                        },
                        get: function() {
                            return this._forcedSpeed || this._playbackRate || speed;
                        },
                        configurable: true
                    });
                }
            }
            
            // Inject CSS to show controls
            const css = `
                video {
                    -webkit-user-select: none !important;
                    user-select: none !important;
                }
                video::-webkit-media-controls-panel {
                    display: flex !important;
                }
                video::-webkit-media-controls-play-button {
                    display: flex !important;
                }
                video::-webkit-media-controls-timeline {
                    display: flex !important;
                }
            `;
            
            let style = document.getElementById('video-override');
            if (!style) {
                style = document.createElement('style');
                style.id = 'video-override';
                document.head.appendChild(style);
            }
            style.textContent = css;
        },
        
        skipTo(seconds) {
            const videos = this.findAllVideos();
            let skipped = 0;
            
            videos.forEach(video => {
                try {
                    if (video.duration && seconds <= video.duration) {
                        video.currentTime = seconds;
                        skipped++;
                    }
                } catch (e) {}
            });
            
            return skipped > 0;
        },
        
        skipToEnd() {
            const videos = this.findAllVideos();
            let skipped = 0;
            
            videos.forEach(video => {
                try {
                    if (video.duration) {
                        video.currentTime = Math.max(0, video.duration - 3);
                        skipped++;
                    }
                } catch (e) {}
            });
            
            return skipped > 0;
        },
        
        getCurrentInfo() {
            const videos = this.findAllVideos();
            const info = videos.map(v => ({
                currentTime: Math.round(v.currentTime || 0),
                duration: Math.round(v.duration || 0),
                speed: v.playbackRate || 1,
                src: v.src ? v.src.substring(0, 50) + '...' : 'blob/stream'
            }));
            
            return info;
        }
    };

    // Anti-detection
    const stealth = {
        init() {
            try {
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            } catch (e) {}
            this.baseDelay = 100 + Math.random() * 100;
        },
        
        wait(ms = 100) {
            const delay = ms + (Math.random() * ms * 0.2);
            return new Promise(r => setTimeout(r, delay));
        },
        
        async click(element) {
            if (!element) return false;
            try {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await this.wait(100);
                element.click();
                await this.wait(50);
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    // Enhanced UI
    const ui = {
        create() {
            if (document.getElementById('bee-bot-ui')) return;
            
            const stats = memoryDB.getStats();
            const videoInfo = videoController.getCurrentInfo();
            
            const container = document.createElement('div');
            container.id = 'bee-bot-ui';
            container.innerHTML = `
                <style>
                    #bee-bot-ui {
                        position: fixed !important;
                        top: 20px !important;
                        right: 20px !important;
                        z-index: 999999 !important;
                        background: linear-gradient(135deg, #ff6b6b, #ee5a24) !important;
                        color: white !important;
                        font-family: Arial, sans-serif !important;
                        font-size: 12px !important;
                        border-radius: 10px !important;
                        box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
                        min-width: 280px !important;
                        backdrop-filter: blur(10px) !important;
                    }
                    .bee-header {
                        background: rgba(0,0,0,0.2) !important;
                        padding: 10px 15px !important;
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        font-weight: bold !important;
                        border-radius: 10px 10px 0 0 !important;
                    }
                    .bee-body {
                        padding: 15px !important;
                    }
                    .bee-tabs {
                        display: flex !important;
                        margin-bottom: 10px !important;
                        background: rgba(0,0,0,0.2) !important;
                        border-radius: 5px !important;
                        padding: 2px !important;
                    }
                    .bee-tab {
                        flex: 1 !important;
                        padding: 5px 8px !important;
                        text-align: center !important;
                        cursor: pointer !important;
                        border-radius: 3px !important;
                        transition: all 0.3s !important;
                        font-size: 10px !important;
                    }
                    .bee-tab.active {
                        background: rgba(255,255,255,0.3) !important;
                    }
                    .bee-content {
                        display: none !important;
                    }
                    .bee-content.active {
                        display: block !important;
                    }
                    .bee-btn {
                        background: rgba(255,255,255,0.2) !important;
                        border: none !important;
                        color: white !important;
                        padding: 6px 10px !important;
                        border-radius: 4px !important;
                        cursor: pointer !important;
                        margin: 2px !important;
                        font-size: 10px !important;
                        transition: all 0.3s !important;
                        width: 48% !important;
                    }
                    .bee-btn:hover {
                        background: rgba(255,255,255,0.3) !important;
                        transform: translateY(-1px) !important;
                    }
                    .bee-btn.active {
                        background: #27ae60 !important;
                        box-shadow: 0 0 10px rgba(39,174,96,0.5) !important;
                    }
                    .bee-btn.full {
                        width: 100% !important;
                    }
                    .bee-btn.danger {
                        background: #e74c3c !important;
                    }
                    .bee-input, .bee-select {
                        background: rgba(255,255,255,0.2) !important;
                        border: none !important;
                        color: white !important;
                        padding: 5px !important;
                        border-radius: 3px !important;
                        width: 48% !important;
                        margin: 2px !important;
                        font-size: 10px !important;
                    }
                    .bee-input::placeholder {
                        color: rgba(255,255,255,0.7) !important;
                    }
                    .bee-status {
                        background: rgba(0,0,0,0.3) !important;
                        padding: 8px !important;
                        border-radius: 4px !important;
                        margin-top: 10px !important;
                        font-size: 10px !important;
                        text-align: center !important;
                    }
                    .bee-stats {
                        background: rgba(0,0,0,0.2) !important;
                        padding: 6px !important;
                        border-radius: 4px !important;
                        margin-bottom: 8px !important;
                        font-size: 9px !important;
                        line-height: 1.3 !important;
                    }
                    .bee-minimize {
                        cursor: pointer !important;
                        padding: 2px 6px !important;
                        border-radius: 3px !important;
                        background: rgba(255,255,255,0.2) !important;
                    }
                    .bee-video-info {
                        font-size: 9px !important;
                        margin-bottom: 8px !important;
                        padding: 4px !important;
                        background: rgba(0,0,0,0.2) !important;
                        border-radius: 3px !important;
                    }
                </style>
                
                <div class="bee-header">
                    <span>🐝 Bee Bot v3.0</span>
                    <span class="bee-minimize">−</span>
                </div>
                
                <div class="bee-body">
                    <div class="bee-tabs">
                        <div class="bee-tab active" data-tab="quiz">📝 Quiz</div>
                        <div class="bee-tab" data-tab="memory">🧠 Memory</div>
                        <div class="bee-tab" data-tab="video">🎥 Video</div>
                    </div>
                    
                    <!-- Quiz Tab -->
                    <div class="bee-content active" id="quiz-content">
                        <button class="bee-btn" id="smart-mode">🎯 Smart Mode</button>
                        <button class="bee-btn" id="brute-mode">🔄 Brute Force</button>
                        <button class="bee-btn" id="spam-toggle">🚀 Spam Answer</button>
                        <button class="bee-btn" id="remove-blur">👁️ Remove Blur</button>
                        
                        <div id="spam-controls" style="display: none; margin-top: 8px;">
                            <select class="bee-select" id="spam-answer">
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                            <input class="bee-input" type="number" id="spam-limit" value="30" min="1" max="100" placeholder="Limit">
                            <button class="bee-btn full" id="start-spam">Start Spam</button>
                        </div>
                        
                        <button class="bee-btn full danger" id="stop-all">⏹️ STOP ALL</button>
                    </div>
                    
                    <!-- Memory Tab -->
                    <div class="bee-content" id="memory-content">
                        <div class="bee-stats">
                            📊 Memory Database<br>
                            Total: ${stats.total} questions<br>
                            Learned: ${stats.learned}<br>
                            Updated: ${stats.lastUpdate}
                        </div>
                        <button class="bee-btn" id="export-mem">💾 Export</button>
                        <button class="bee-btn" id="import-mem">📁 Import</button>
                        <button class="bee-btn" id="clear-mem">🗑️ Clear</button>
                        <button class="bee-btn" id="refresh-mem">🔄 Refresh</button>
                        <input type="file" id="import-file" accept=".json" style="display: none;">
                    </div>
                    
                    <!-- Video Tab -->
                    <div class="bee-content" id="video-content">
                        <div class="bee-video-info">
                            🎥 Found: ${videoInfo.length} video(s)<br>
                            ${videoInfo.map(v => `${v.currentTime}/${v.duration}s @ ${v.speed}x`).join('<br>')}
                        </div>
                        <button class="bee-btn" id="speed-05">0.5x</button>
                        <button class="bee-btn" id="speed-1">1x</button>
                        <button class="bee-btn" id="speed-15">1.5x</button>
                        <button class="bee-btn" id="speed-2">2x</button>
                        <button class="bee-btn" id="speed-3">3x</button>
                        <button class="bee-btn" id="speed-5">5x</button>
                        <input class="bee-input" type="number" id="skip-time" placeholder="Skip to (sec)" style="width: 100%; margin: 4px 2px;">
                        <button class="bee-btn" id="skip-custom">⏩ Skip</button>
                        <button class="bee-btn" id="skip-end">⏭️ End</button>
                    </div>
                    
                    <div class="bee-status" id="status">Ready! Memory: ${stats.total} 🧠 Videos: ${videoInfo.length} 🎥</div>
                </div>
            `;
            
            document.body.appendChild(container);
            this.bindEvents();
        },
        
        bindEvents() {
            // Tab switching
            document.querySelectorAll('.bee-tab').forEach(tab => {
                tab.onclick = () => {
                    document.querySelectorAll('.bee-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.bee-content').forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
                };
            });
            
            // Minimize
            document.querySelector('.bee-minimize').onclick = () => {
                const body = document.querySelector('.bee-body');
                const min = document.querySelector('.bee-minimize');
                if (body.style.display === 'none') {
                    body.style.display = 'block';
                    min.textContent = '−';
                } else {
                    body.style.display = 'none';
                    min.textContent = '+';
                }
            };
            
            // Quiz controls
            document.getElementById('smart-mode').onclick = () => bot.startSmart();
            document.getElementById('brute-mode').onclick = () => bot.startBrute();
            document.getElementById('spam-toggle').onclick = () => {
                const controls = document.getElementById('spam-controls');
                controls.style.display = controls.style.display === 'none' ? 'block' : 'none';
            };
            document.getElementById('start-spam').onclick = () => {
                const answer = document.getElementById('spam-answer').value;
                const limit = parseInt(document.getElementById('spam-limit').value) || 30;
                bot.startSpam(answer, limit);
            };
            document.getElementById('remove-blur').onclick = () => bot.removeBlur();
            document.getElementById('stop-all').onclick = () => bot.stop();
            
            // Memory controls
            document.getElementById('export-mem').onclick = () => memoryDB.export();
            document.getElementById('import-mem').onclick = () => document.getElementById('import-file').click();
            document.getElementById('import-file').onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            localStorage.setItem(memoryDB.storageKey, e.target.result);
                            this.updateStatus('Memory imported! 🧠', 'success');
                        } catch (err) {
                            this.updateStatus('Import failed! ❌', 'error');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            document.getElementById('clear-mem').onclick = () => {
                if (confirm('Clear all memory?')) {
                    memoryDB.clear();
                    this.updateStatus('Memory cleared! 🗑️', 'warning');
                }
            };
            document.getElementById('refresh-mem').onclick = () => {
                this.updateMemoryStats();
            };
            
            // Video controls
            document.getElementById('speed-05').onclick = () => this.setVideoSpeed(0.5);
            document.getElementById('speed-1').onclick = () => this.setVideoSpeed(1);
            document.getElementById('speed-15').onclick = () => this.setVideoSpeed(1.5);
            document.getElementById('speed-2').onclick = () => this.setVideoSpeed(2);
            document.getElementById('speed-3').onclick = () => this.setVideoSpeed(3);
            document.getElementById('speed-5').onclick = () => this.setVideoSpeed(5);
            document.getElementById('skip-custom').onclick = () => {
                const time = parseInt(document.getElementById('skip-time').value);
                if (time) {
                    videoController.skipTo(time);
                    this.updateStatus(`Skipped to ${time}s ⏩`, 'success');
                }
            };
            document.getElementById('skip-end').onclick = () => {
                if (videoController.skipToEnd()) {
                    this.updateStatus('Skipped to end ⏭️', 'success');
                } else {
                    this.updateStatus('No videos found ❌', 'error');
                }
            };
        },
        
        setVideoSpeed(speed) {
            if (videoController.setSpeed(speed)) {
                this.updateStatus(`Video speed: ${speed}x 🎥`, 'success');
                // Update speed buttons visual feedback
                document.querySelectorAll('[id^="speed-"]').forEach(btn => btn.classList.remove('active'));
                document.getElementById(`speed-${speed.toString().replace('.', '')}`).classList.add('active');
            } else {
                this.updateStatus('No videos found ❌', 'error');
            }
        },
        
        updateStatus(message, type = 'info') {
            const status = document.getElementById('status');
            if (status) {
                status.textContent = message;
                const colors = { info: 'white', success: '#2ecc71', error: '#e74c3c', warning: '#f39c12' };
                status.style.color = colors[type] || 'white';
            }
            console.log(`📊 ${message}`);
        },
        
        setActive(buttonId, active = true) {
            const btn = document.getElementById(buttonId);
            if (btn) {
                if (active) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        },
        
        updateMemoryStats() {
            const stats = memoryDB.getStats();
            const statsEl = document.querySelector('.bee-stats');
            if (statsEl) {
                statsEl.innerHTML = `
                    📊 Memory Database<br>
                    Total: ${stats.total} questions<br>
                    Learned: ${stats.learned}<br>
                    Updated: ${stats.lastUpdate}
                `;
            }
        }
    };

    // Main Bot Logic
    const bot = {
        running: false,
        mode: null,
        stats: { q: 0, correct: 0, learned: 0 },
        
        getQuestion() {
            const selectors = ['h1', 'h2', '.question', '[class*="question"]', 'p'];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.innerText && el.innerText.trim().length > 15) {
                    return el.innerText.trim();
                }
            }
            return null;
        },
        
        getChoices() {
            const letters = ['A', 'B', 'C', 'D', 'E'];
            return Array.from(document.querySelectorAll('p')).filter(el => {
                const text = el.innerText?.trim();
                if (!text) return false;
                
                if (letters.includes(text)) return true;
                
                const style = getComputedStyle(el);
                return style.display === 'flex' && 
                       parseFloat(style.fontSize) > 14 && 
                       (style.fontWeight === 'bold' || parseInt(style.fontWeight) > 400);
            });
        },
        
        isCorrect() {
            return Array.from(document.querySelectorAll('*')).some(el => 
                el.innerText?.trim() === 'Correct!'
            );
        },
        
        isWrong() {
            return Array.from(document.querySelectorAll('*')).some(el => 
                el.innerText?.trim() === 'Incorrect!'
            );
        },
        
        async clickCheck() {
            const btns = Array.from(document.querySelectorAll('p, button')).filter(el => {
                const text = el.innerText?.trim().toLowerCase();
                return text === 'check' || text === 'submit' || text === 'periksa';
            });
            
            if (btns.length > 0) {
                await stealth.click(btns[0]);
                return true;
            }
            return false;
        },
        
        async clickNext() {
            const btns = Array.from(document.querySelectorAll('p, button, a')).filter(el => {
                const text = el.innerText?.trim().toLowerCase();
                return (text === 'next' || text === 'save & next' || text === 'continue') &&
                       getComputedStyle(el).display !== 'none';
            });
            
            if (btns.length > 0) {
                await stealth.click(btns[0]);
                return true;
            }
            return false;
        },
        
        clearWrong() {
            Array.from(document.querySelectorAll('*')).forEach(el => {
                if (el.innerText?.trim() === 'Incorrect!') {
                    try { el.remove(); } catch (e) {}
                }
            });
        },
        
        async startSmart() {
            if (this.running) {
                ui.updateStatus('Bot already running! ⚠️', 'warning');
                return;
            }
            
            this.running = true;
            this.mode = 'smart';
            this.stats = { q: 0, correct: 0, learned: 0 };
            
            ui.updateStatus('🧠 Smart Mode: Using memory...', 'info');
            ui.setActive('smart-mode', true);
            
            try {
                let memoryHits = 0;
                
                for (let i = 0; i < 100 && this.running; i++) {
                    const question = this.getQuestion();
                    
                    if (question) {
                        const memory = memoryDB.find(question);
                        
                        if (memory && memory.confidence > 1) {
                            console.log(`🧠 Using memory: ${memory.answer}`);
                            
                            if (await this.useMemoryAnswer(memory.answer)) {
                                memoryHits++;
                                this.stats.correct++;
                                ui.updateStatus(`Smart: Memory ${memoryHits} | Q${this.stats.q}`, 'success');
                                await stealth.wait(800);
                                continue;
                            }
                        }
                    }
                    
                    // Fallback to learning mode
                    if (await this.learnQuestion(question)) {
                        ui.updateStatus(`Smart: Learning | Q${this.stats.q} | 🧠${this.stats.learned}`, 'info');
                    }
                    
                    await stealth.wait(1000);
                }
                
            } catch (error) {
                ui.updateStatus(`Smart error: ${error.message}`, 'error');
            }
            
            this.stop();
        },
        
        async useMemoryAnswer(answer) {
            const choices = this.getChoices();
            const target = choices.find(el => el.innerText?.trim() === answer);
            
            if (!target) return false;
            
            await stealth.click(target);
            await stealth.wait(200);
            await this.clickCheck();
            await stealth.wait(400);
            
            if (this.isCorrect()) {
                await this.clickNext();
                this.stats.q++;
                return true;
            }
            
            return false;
        },
        
        async learnQuestion(questionText) {
            const choices = this.getChoices();
            if (choices.length === 0) return false;
            
            this.clearWrong();
            
            for (const choice of choices) {
                if (!this.running) break;
                
                const choiceText = choice.innerText?.trim();
                
                await stealth.click(choice);
                await stealth.wait(150);
                await this.clickCheck();
                await stealth.wait(500);
                
                if (this.isCorrect()) {
                    if (questionText && choiceText) {
                        memoryDB.learn(questionText, choiceText, 'learning');
                        this.stats.learned++;
                    }
                    
                    this.stats.correct++;
                    this.stats.q++;
                    await stealth.wait(200);
                    await this.clickNext();
                    return true;
                }
                
                if (this.isWrong()) {
                    this.clearWrong();
                    await stealth.wait(100);
                }
            }
            
            this.stats.q++;
            return false;
        },
        
        async startBrute() {
            if (this.running) {
                ui.updateStatus('Bot already running! ⚠️', 'warning');
                return;
            }
            
            this.running = true;
            this.mode = 'brute';
            this.stats = { q: 0, correct: 0, learned: 0 };
            
            ui.updateStatus('🔄 Brute Force: Learning mode...', 'info');
            ui.setActive('brute-mode', true);
            
            try {
                for (let i = 0; i < 150 && this.running; i++) {
                    const question = this.getQuestion();
                    
                    if (await this.learnQuestion(question)) {
                        ui.updateStatus(`Brute: Q${this.stats.q} | ✅${this.stats.correct} | 🧠${this.stats.learned}`, 'success');
                    } else {
                        ui.updateStatus(`Brute: Q${this.stats.q} | Trying...`, 'info');
                    }
                    
                    await stealth.wait(900);
                }
                
            } catch (error) {
                ui.updateStatus(`Brute error: ${error.message}`, 'error');
            }
            
            this.stop();
        },
        
        async startSpam(answer, limit) {
            if (this.running) {
                ui.updateStatus('Bot already running! ⚠️', 'warning');
                return;
            }
            
            this.running = true;
            this.mode = 'spam';
            this.stats = { q: 0, correct: 0, learned: 0 };
            
            ui.updateStatus(`🚀 Spam ${answer}: Starting...`, 'info');
            
            try {
                for (let i = 0; i < limit && this.running; i++) {
                    const question = this.getQuestion();
                    
                    if (await this.spamAnswer(answer, question)) {
                        this.stats.q++;
                        ui.updateStatus(`Spam ${answer}: ${i + 1}/${limit} | Q${this.stats.q}`, 'success');
                    }
                    
                    await stealth.wait(600);
                    
                    if (this.getChoices().length === 0) {
                        ui.updateStatus('No more questions! ✅', 'success');
                        break;
                    }
                }
                
            } catch (error) {
                ui.updateStatus(`Spam error: ${error.message}`, 'error');
            }
            
            this.stop();
        },
        
        async spamAnswer(answer, questionText) {
            const choices = this.getChoices();
            const target = choices.find(el => el.innerText?.trim() === answer);
            
            if (!target) return false;
            
            await stealth.click(target);
            await stealth.wait(150);
            await this.clickCheck();
            await stealth.wait(300);
            
            if (this.isCorrect() && questionText) {
                memoryDB.learn(questionText, answer, 'spam');
                this.stats.learned++;
            }
            
            await this.clickNext();
            return true;
        },
        
        removeBlur() {
            const selectors = [
                '.bl-p-l.bl-relative.bl-col-between',
                '[class*="blur"]',
                '[style*="blur"]'
            ];
            
            let count = 0;
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.filter = 'none';
                    el.style.webkitFilter = 'none';
                    if (el.onblur) el.onblur = null;
                    el.addEventListener('blur', e => {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }, true);
                    count++;
                });
            });
            
            ui.updateStatus(`Blur removed: ${count} elements 👁️`, 'success');
        },
        
        stop() {
            this.running = false;
            this.mode = null;
            
            document.querySelectorAll('.bee-btn.active').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const stats = memoryDB.getStats();
            ui.updateStatus(`Stopped | Session: Q${this.stats.q}, ✅${this.stats.correct}, 🧠${this.stats.learned} | Total: ${stats.total}`, 'warning');
        }
    };

    // Initialize
    try {
        stealth.init();
        ui.create();
        
        // Auto-learn from current page if possible
        setTimeout(() => {
            const question = bot.getQuestion();
            const isCurrentCorrect = bot.isCorrect();
            
            if (question && isCurrentCorrect) {
                const selected = document.querySelector('input:checked, .selected, [class*="selected"]');
                if (selected) {
                    const answer = selected.closest('*')?.innerText?.trim();
                    if (answer && ['A', 'B', 'C', 'D', 'E'].includes(answer)) {
                        memoryDB.learn(question, answer, 'auto_learn');
                        ui.updateStatus('Auto-learned from current page! 🧠', 'success');
                    }
                }
            }
        }, 1500);
        
        // Welcome
        setTimeout(() => {
            const stats = memoryDB.getStats();
            const videos = videoController.getCurrentInfo();
            ui.updateStatus(`Bee Bot ready! 🧠${stats.total} 🎥${videos.length} 🚀`, 'success');
        }, 2000);
        
        console.log('✅ Beelingua Enhanced Bot v3.0 Ready!');
        console.log('🧠 Memory System: Active');
        console.log('🎥 Video Control: Active');
        console.log('📱 UI Panel: Top-right corner');
        
        // Test video control immediately
        setTimeout(() => {
            const videos = videoController.findAllVideos();
            if (videos.length > 0) {
                console.log(`🎥 Found ${videos.length} video(s):`, videos.map(v => ({
                    src: v.src?.substring(0, 50) || 'blob/stream',
                    duration: Math.round(v.duration || 0),
                    currentTime: Math.round(v.currentTime || 0),
                    speed: v.playbackRate || 1
                })));
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Bot initialization failed:', error);
        alert('Bee Bot failed to load. Check console for details.');
    }

})();
