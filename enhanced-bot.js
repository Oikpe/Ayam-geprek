// Ultra-Optimized Beelingua Bot v4.1 - Memory Safe + 15ms Speed
(() => {
    'use strict';
    
    console.log('Ultra-Optimized Bot v4.1 Loading...');
    
    if (window.ultraBotActive) {
        console.log('Bot already active');
        return;
    }
    window.ultraBotActive = true;

    // MEMORY-SAFE Storage System (Max 1MB, Auto-cleanup)
    const safeMemory = {
        storage: null,
        data: new Map(), // Use Map for better performance
        maxSize: 1000, // Maximum 1000 questions
        maxStorageSize: 1024 * 1024, // 1MB limit
        
        init() {
            try {
                if (typeof Storage !== 'undefined' && localStorage) {
                    this.storage = 'localStorage';
                    this.loadFromStorage();
                } else {
                    this.storage = 'memory';
                    console.log('Using memory-only storage');
                }
            } catch (e) {
                this.storage = 'memory';
                console.warn('Storage unavailable, using memory only');
            }
            
            console.log(`Memory system: ${this.storage} | Questions: ${this.data.size}`);
            return this;
        },
        
        loadFromStorage() {
            try {
                const stored = localStorage.getItem('beelingua_safe_v4');
                if (stored && stored.length < this.maxStorageSize) {
                    const parsed = JSON.parse(stored);
                    this.data = new Map(Object.entries(parsed.questions || {}));
                    this.cleanup(); // Auto-cleanup on load
                }
            } catch (e) {
                console.warn('Failed to load memory:', e);
                this.data = new Map();
            }
        },
        
        save() {
            if (this.storage === 'memory') return;
            
            try {
                const obj = { questions: Object.fromEntries(this.data) };
                const serialized = JSON.stringify(obj);
                
                if (serialized.length > this.maxStorageSize) {
                    this.cleanup();
                    return this.save(); // Retry after cleanup
                }
                
                localStorage.setItem('beelingua_safe_v4', serialized);
                return true;
            } catch (e) {
                console.warn('Memory save failed:', e);
                this.cleanup();
                return false;
            }
        },
        
        cleanup() {
            if (this.data.size <= this.maxSize) return;
            
            // Keep only most recent 80% of entries
            const keepCount = Math.floor(this.maxSize * 0.8);
            const entries = Array.from(this.data.entries());
            
            // Sort by timestamp (assuming newer entries have later keys)
            entries.sort((a, b) => a[0].localeCompare(b[0]));
            
            // Keep only recent entries
            this.data.clear();
            entries.slice(-keepCount).forEach(([key, value]) => {
                this.data.set(key, value);
            });
            
            console.log(`Memory cleanup: kept ${keepCount} entries`);
        },
        
        learn(question, answer) {
            if (!question || !answer || question.length < 10) return false;
            
            // Generate efficient key (max 50 chars)
            const key = question.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 50);
            
            this.data.set(key, answer);
            
            // Auto-cleanup if needed
            if (this.data.size > this.maxSize) {
                this.cleanup();
            }
            
            // Async save to not block execution
            setTimeout(() => this.save(), 0);
            
            console.log(`Learned: "${question.substring(0, 30)}..." -> ${answer}`);
            return true;
        },
        
        recall(question) {
            if (!question) return null;
            
            const key = question.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 50);
            
            // Exact match first (O(1) lookup)
            if (this.data.has(key)) {
                console.log(`Memory hit: ${this.data.get(key)}`);
                return this.data.get(key);
            }
            
            // Quick fuzzy search (limited to prevent performance issues)
            const words = key.split(' ').filter(w => w.length > 3);
            if (words.length < 2) return null;
            
            let bestMatch = null;
            let bestScore = 0;
            let checked = 0;
            
            for (const [storedKey, answer] of this.data) {
                if (checked++ > 100) break; // Limit search to prevent lag
                
                const storedWords = storedKey.split(' ').filter(w => w.length > 3);
                const commonWords = words.filter(w => storedWords.includes(w));
                const score = commonWords.length / Math.max(words.length, storedWords.length);
                
                if (score > bestScore && score > 0.6) {
                    bestScore = score;
                    bestMatch = answer;
                }
            }
            
            if (bestMatch) {
                console.log(`Fuzzy match: ${bestMatch} (${Math.round(bestScore * 100)}%)`);
            }
            
            return bestMatch;
        },
        
        getStats() {
            return {
                total: this.data.size,
                storage: this.storage,
                memoryUsage: this.storage === 'localStorage' ? 
                    Math.round(JSON.stringify(Object.fromEntries(this.data)).length / 1024) + 'KB' : 
                    'Memory only'
            };
        },
        
        export() {
            const data = Object.fromEntries(this.data);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `beelingua_memory_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
        
        clear() {
            this.data.clear();
            if (this.storage === 'localStorage') {
                try {
                    localStorage.removeItem('beelingua_safe_v4');
                } catch (e) {}
            }
            console.log('Memory cleared');
        }
    }.init();

    // ULTRA-AGGRESSIVE Video Controller (15ms intervals)
    const ultraVideo = {
        videos: [],
        forceInterval: null,
        
        findVideos() {
            this.videos = Array.from(document.querySelectorAll('video'));
            return this.videos.length;
        },
        
        setSpeed(speed) {
            this.findVideos();
            
            if (this.videos.length === 0) {
                console.log('No videos found');
                return false;
            }
            
            // Clear any existing interval
            if (this.forceInterval) {
                clearInterval(this.forceInterval);
            }
            
            // Apply initial speed
            this.videos.forEach(video => {
                this.forceVideoSpeed(video, speed);
            });
            
            // Force speed every 15ms (ultra-aggressive)
            this.forceInterval = setInterval(() => {
                this.videos.forEach(video => {
                    if (Math.abs(video.playbackRate - speed) > 0.1) {
                        this.forceVideoSpeed(video, speed);
                    }
                });
            }, 15);
            
            // Stop forcing after 10 seconds
            setTimeout(() => {
                if (this.forceInterval) {
                    clearInterval(this.forceInterval);
                    this.forceInterval = null;
                }
            }, 10000);
            
            console.log(`Ultra-aggressive speed control: ${speed}x on ${this.videos.length} videos`);
            return true;
        },
        
        forceVideoSpeed(video, speed) {
            try {
                // Method 1: Direct assignment
                video.playbackRate = speed;
                
                // Method 2: Property override
                Object.defineProperty(video, 'playbackRate', {
                    get: () => speed,
                    set: () => {},
                    configurable: true
                });
                
                // Method 3: Prototype manipulation
                video.__proto__.playbackRate = speed;
                
                // Method 4: Default rate
                video.defaultPlaybackRate = speed;
                
                // Method 5: Dispatch custom event
                video.dispatchEvent(new Event('ratechange'));
                
            } catch (e) {
                // Silently continue if any method fails
            }
        },
        
        skip() {
            this.findVideos();
            let skipped = 0;
            
            this.videos.forEach(video => {
                try {
                    if (video.duration) {
                        video.currentTime = Math.max(0, video.duration - 1);
                        skipped++;
                    }
                } catch (e) {}
            });
            
            return skipped;
        }
    };

    // HYPER-SPEED Quiz Engine (15ms delays)
    const ultraBot = {
        running: false,
        stats: { q: 0, correct: 0, learned: 0 },
        
        // Ultra-fast element finding (cached selectors)
        questionCache: null,
        choiceCache: null,
        
        getQuestion() {
            if (this.questionCache && document.contains(this.questionCache)) {
                return this.questionCache.innerText?.trim();
            }
            
            // Fast selector strategy
            const selectors = ['h1', 'h2', 'h3', '[class*="question"]'];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el?.innerText && el.innerText.trim().length > 20) {
                    this.questionCache = el;
                    return el.innerText.trim();
                }
            }
            
            this.questionCache = null;
            return null;
        },
        
        getChoices() {
            if (this.choiceCache && this.choiceCache.every(el => document.contains(el))) {
                return this.choiceCache;
            }
            
            // Multiple fast strategies
            const strategies = [
                () => document.querySelectorAll('p').values(),
                () => document.querySelectorAll('[class*="choice"], [class*="option"]').values(),
                () => document.querySelectorAll('button, input[type="radio"]').values()
            ];
            
            for (const strategy of strategies) {
                const elements = Array.from(strategy()).filter(el => {
                    const text = el.innerText?.trim();
                    return text && (['A', 'B', 'C', 'D', 'E'].includes(text) || el.offsetHeight > 0);
                });
                
                if (elements.length >= 2) {
                    this.choiceCache = elements;
                    return elements;
                }
            }
            
            this.choiceCache = null;
            return [];
        },
        
        getDragElements() {
            return {
                draggable: Array.from(document.querySelectorAll('[draggable="true"], .draggable')),
                dropzones: Array.from(document.querySelectorAll('.dropzone, [class*="drop"]')),
                blanks: Array.from(document.querySelectorAll('input[type="text"], .blank'))
            };
        },
        
        isCorrect() {
            return document.querySelector('[class*="correct"], [class*="success"]') !== null ||
                   /correct|success|benar/i.test(document.body.innerText);
        },
        
        isWrong() {
            return document.querySelector('[class*="incorrect"], [class*="wrong"], [class*="error"]') !== null ||
                   /incorrect|wrong|error|salah/i.test(document.body.innerText);
        },
        
        // ULTRA-FAST click (no delays)
        instantClick(element) {
            if (!element) return false;
            
            element.click();
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        },
        
        // Find and click buttons instantly
        findAndClick(texts) {
            const buttons = Array.from(document.querySelectorAll('button, p, a, div'))
                .filter(el => {
                    const text = el.innerText?.trim().toLowerCase();
                    return text && texts.some(t => text.includes(t.toLowerCase()));
                });
            
            if (buttons.length > 0) {
                this.instantClick(buttons[0]);
                return true;
            }
            return false;
        },
        
        clearErrors() {
            document.querySelectorAll('[class*="error"], [class*="incorrect"], [class*="wrong"]')
                .forEach(el => {
                    try { el.remove(); } catch (e) {}
                });
        },
        
        // HYPER-SPEED Multiple Choice (15ms delays)
        async ultraMultipleChoice() {
            const question = this.getQuestion();
            const choices = this.getChoices();
            
            if (!choices.length) return false;
            
            // Try memory first (instant)
            if (question) {
                const remembered = safeMemory.recall(question);
                if (remembered) {
                    const target = choices.find(el => el.innerText?.trim() === remembered);
                    if (target) {
                        this.instantClick(target);
                        await new Promise(r => setTimeout(r, 15));
                        this.findAndClick(['check', 'submit']);
                        await new Promise(r => setTimeout(r, 15));
                        this.findAndClick(['next', 'continue']);
                        this.stats.correct++;
                        this.stats.q++;
                        return true;
                    }
                }
            }
            
            // Ultra-fast brute force (15ms delays)
            for (const choice of choices) {
                if (!this.running) break;
                
                this.clearErrors();
                this.instantClick(choice);
                await new Promise(r => setTimeout(r, 15));
                
                this.findAndClick(['check', 'submit']);
                await new Promise(r => setTimeout(r, 30));
                
                if (this.isCorrect()) {
                    // Learn instantly
                    if (question) {
                        const answer = choice.innerText?.trim();
                        if (answer) {
                            safeMemory.learn(question, answer);
                            this.stats.learned++;
                        }
                    }
                    
                    this.stats.correct++;
                    this.stats.q++;
                    
                    await new Promise(r => setTimeout(r, 15));
                    this.findAndClick(['next', 'continue']);
                    return true;
                }
                
                if (this.isWrong()) {
                    this.clearErrors();
                    await new Promise(r => setTimeout(r, 15));
                }
            }
            
            this.stats.q++;
            return false;
        },
        
        // Ultra-fast Drag & Drop
        async ultraDragDrop() {
            const elements = this.getDragElements();
            
            if (!elements.draggable.length || !elements.dropzones.length) {
                return false;
            }
            
            // Try all combinations rapidly (15ms delays)
            for (const draggable of elements.draggable) {
                for (const dropzone of elements.dropzones) {
                    if (!this.running) break;
                    
                    try {
                        // Instant drag simulation
                        const dataTransfer = new DataTransfer();
                        
                        draggable.dispatchEvent(new DragEvent('dragstart', {
                            bubbles: true,
                            dataTransfer
                        }));
                        
                        dropzone.dispatchEvent(new DragEvent('drop', {
                            bubbles: true,
                            dataTransfer
                        }));
                        
                        draggable.dispatchEvent(new DragEvent('dragend', { bubbles: true }));
                        
                        await new Promise(r => setTimeout(r, 15));
                        this.findAndClick(['check', 'submit']);
                        await new Promise(r => setTimeout(r, 30));
                        
                        if (this.isCorrect()) {
                            this.stats.correct++;
                            this.stats.q++;
                            this.findAndClick(['next', 'continue']);
                            return true;
                        }
                        
                        this.clearErrors();
                        
                    } catch (e) {}
                }
            }
            
            return false;
        },
        
        // Ultra-fast Fill Blanks
        async ultraFillBlanks() {
            const elements = this.getDragElements();
            
            if (!elements.blanks.length) return false;
            
            // Common answers (limited for speed)
            const answers = ['a', 'an', 'the', 'is', 'are', 'was', 'were', 'have', 'has'];
            
            // Try memory first
            const question = this.getQuestion();
            if (question) {
                const remembered = safeMemory.recall(question);
                if (remembered) {
                    elements.blanks.forEach(blank => {
                        blank.value = remembered;
                        blank.dispatchEvent(new Event('input', { bubbles: true }));
                    });
                    
                    await new Promise(r => setTimeout(r, 15));
                    this.findAndClick(['check', 'submit']);
                    await new Promise(r => setTimeout(r, 30));
                    
                    if (this.isCorrect()) {
                        this.stats.correct++;
                        this.stats.q++;
                        this.findAndClick(['next', 'continue']);
                        return true;
                    }
                }
            }
            
            // Ultra-fast answer trying (15ms delays)
            for (const answer of answers) {
                if (!this.running) break;
                
                elements.blanks.forEach(blank => {
                    blank.value = answer;
                    blank.dispatchEvent(new Event('input', { bubbles: true }));
                });
                
                await new Promise(r => setTimeout(r, 15));
                this.findAndClick(['check', 'submit']);
                await new Promise(r => setTimeout(r, 30));
                
                if (this.isCorrect()) {
                    if (question) {
                        safeMemory.learn(question, answer);
                        this.stats.learned++;
                    }
                    
                    this.stats.correct++;
                    this.stats.q++;
                    this.findAndClick(['next', 'continue']);
                    return true;
                }
                
                this.clearErrors();
            }
            
            return false;
        },
        
        // Auto-detect and solve (ultra-fast)
        async autoSolve() {
            const choices = this.getChoices();
            const dragElements = this.getDragElements();
            
            if (choices.length >= 2) {
                return await this.ultraMultipleChoice();
            } else if (dragElements.draggable.length && dragElements.dropzones.length) {
                return await this.ultraDragDrop();
            } else if (dragElements.blanks.length) {
                return await this.ultraFillBlanks();
            }
            
            return false;
        },
        
        // MAIN ULTRA MODE
        async startUltra() {
            if (this.running) return;
            
            this.running = true;
            this.stats = { q: 0, correct: 0, learned: 0 };
            
            ui.updateStatus('⚡ ULTRA MODE: 15ms speed...', 'info');
            ui.setActive('ultra-btn', true);
            
            for (let i = 0; i < 300 && this.running; i++) {
                const success = await this.autoSolve();
                
                if (success) {
                    ui.updateStatus(`ULTRA: Q${this.stats.q} | ✅${this.stats.correct} | 🧠${this.stats.learned}`, 'success');
                } else {
                    ui.updateStatus(`ULTRA: Q${this.stats.q} | Processing...`, 'info');
                }
                
                // Ultra-short delay between questions
                await new Promise(r => setTimeout(r, 100));
                
                // Check if finished
                if (!this.getChoices().length && !this.getDragElements().draggable.length && !this.getDragElements().blanks.length) {
                    ui.updateStatus('Quiz completed!', 'success');
                    break;
                }
            }
            
            this.stop();
        },
        
        removeBlur() {
            const elements = document.querySelectorAll('[class*="blur"], [class*="disabled"], .locked');
            elements.forEach(el => {
                el.style.filter = 'none';
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            });
            ui.updateStatus(`Removed ${elements.length} blur elements`, 'success');
        },
        
        stop() {
            this.running = false;
            this.questionCache = null;
            this.choiceCache = null;
            
            // Clear video intervals
            if (ultraVideo.forceInterval) {
                clearInterval(ultraVideo.forceInterval);
                ultraVideo.forceInterval = null;
            }
            
            document.querySelectorAll('.btn.active').forEach(btn => btn.classList.remove('active'));
            
            const stats = safeMemory.getStats();
            ui.updateStatus(`STOPPED | Q${this.stats.q}, ✅${this.stats.correct}, 🧠${this.stats.learned} | Memory: ${stats.total}`, 'warning');
        }
    };

    // MINIMAL UI
    const ui = {
        create() {
            if (document.getElementById('ultra-bot')) return;
            
            const stats = safeMemory.getStats();
            const videos = ultraVideo.findVideos();
            
            const container = document.createElement('div');
            container.id = 'ultra-bot';
            container.innerHTML = `
                <style>
                    #ultra-bot {
                        position: fixed !important;
                        top: 10px !important;
                        right: 10px !important;
                        z-index: 999999 !important;
                        background: linear-gradient(135deg, #2c3e50, #34495e) !important;
                        color: white !important;
                        font-family: Arial, sans-serif !important;
                        font-size: 10px !important;
                        border-radius: 6px !important;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
                        min-width: 240px !important;
                    }
                    .ultra-header {
                        background: rgba(0,0,0,0.4) !important;
                        padding: 6px 10px !important;
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        font-weight: bold !important;
                        border-radius: 6px 6px 0 0 !important;
                        font-size: 11px !important;
                    }
                    .ultra-body { padding: 10px !important; }
                    .btn {
                        background: rgba(255,255,255,0.15) !important;
                        border: none !important;
                        color: white !important;
                        padding: 4px 6px !important;
                        border-radius: 3px !important;
                        cursor: pointer !important;
                        margin: 2px !important;
                        font-size: 9px !important;
                        transition: all 0.2s !important;
                        width: 48% !important;
                    }
                    .btn:hover { background: rgba(255,255,255,0.25) !important; }
                    .btn.active { background: #27ae60 !important; }
                    .btn.full { width: 100% !important; }
                    .btn.danger { background: #e74c3c !important; }
                    .status {
                        background: rgba(0,0,0,0.3) !important;
                        padding: 5px !important;
                        border-radius: 3px !important;
                        margin-top: 6px !important;
                        font-size: 8px !important;
                        text-align: center !important;
                    }
                    .stats {
                        background: rgba(0,0,0,0.2) !important;
                        padding: 3px !important;
                        border-radius: 2px !important;
                        margin-bottom: 4px !important;
                        font-size: 8px !important;
                    }
                    .minimize { cursor: pointer !important; padding: 1px 3px !important; background: rgba(255,255,255,0.2) !important; border-radius: 2px !important; }
                </style>
                
                <div class="ultra-header">
                    <span>⚡ ULTRA v4.1</span>
                    <span class="minimize">−</span>
                </div>
                
                <div class="ultra-body">
                    <div class="stats">
                        Memory: ${stats.total} (${stats.memoryUsage}) | Videos: ${videos}
                    </div>
                    
                    <button class="btn" id="ultra-btn">⚡ ULTRA MODE</button>
                    <button class="btn" id="blur-btn">👁️ Blur</button>
                    
                    <button class="btn" id="speed-2">2x</button>
                    <button class="btn" id="speed-5">5x</button>
                    
                    <button class="btn" id="export-btn">💾 Export</button>
                    <button class="btn" id="clear-btn">🗑️ Clear</button>
                    
                    <button class="btn full danger" id="stop-btn">⏹️ STOP</button>
                    
                    <div class="status" id="status">Ready | 15ms speed | Memory safe</div>
                </div>
            `;
            
            document.body.appendChild(container);
            this.bindEvents();
        },
        
        bindEvents() {
            document.querySelector('.minimize').onclick = () => {
                const body = document.querySelector('.ultra-body');
                const min = document.querySelector('.minimize');
                if (body.style.display === 'none') {
                    body.style.display = 'block';
                    min.textContent = '−';
                } else {
                    body.style.display = 'none';
                    min.textContent = '+';
                }
            };
            
            document.getElementById('ultra-btn').onclick = () => ultraBot.startUltra();
            document.getElementById('blur-btn').onclick = () => ultraBot.removeBlur();
            document.getElementById('stop-btn').onclick = () => ultraBot.stop();
            
            document.getElementById('speed-2').onclick = () => {
                if (ultraVideo.setSpeed(2)) {
                    this.updateStatus('Video speed: 2x', 'success');
                    document.getElementById('speed-2').classList.add('active');
                    document.getElementById('speed-5').classList.remove('active');
                } else {
                    this.updateStatus('No videos found', 'error');
                }
            };
            
            document.getElementById('speed-5').onclick = () => {
                if (ultraVideo.setSpeed(5)) {
                    this.updateStatus('Video speed: 5x', 'success');
                    document.getElementById('speed-5').classList.add('active');
                    document.getElementById('speed-2').classList.remove('active');
                } else {
                    this.updateStatus('No videos found', 'error');
                }
            };
            
            document.getElementById('export-btn').onclick = () => {
                safeMemory.export();
                this.updateStatus('Memory exported', 'success');
            };
            
            document.getElementById('clear-btn').onclick = () => {
                if (confirm('Clear memory?')) {
                    safeMemory.clear();
                    this.updateStatus('Memory cleared', 'warning');
                }
            };
        },
        
        updateStatus(message, type = 'info') {
            const status = document.getElementById('status');
            if (status) {
                status.textContent = message;
                const colors = { info: 'white', success: '#2ecc71', error: '#e74c3c', warning: '#f39c12' };
                status.style.color = colors[type] || 'white';
            }
        },
        
        setActive(buttonId, active = true) {
            const btn = document.getElementById(buttonId);
            if (btn) {
                if (active) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }
    };

    // INITIALIZE
    try {
        ui.create();
        
        setTimeout(() => {
            const stats = safeMemory.getStats();
            ui.updateStatus(`Ultra Bot ready! Memory: ${stats.total} | 15ms speed`, 'success');
        }, 1000);
        
        console.log('✅ Ultra-Optimized Bot v4.1 Ready!');
        console.log(`Memory system: ${safeMemory.getStats().storage} (${safeMemory.getStats().memoryUsage})`);
        console.log('Speed: 15ms delays | Memory safe | Auto-cleanup');
        
    } catch (error) {
        console.error('Initialization failed:', error);
    }

})();
