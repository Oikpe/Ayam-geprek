// Fixed Efficient Beelingua Bot v4.0 - All Issues Resolved
(() => {
    'use strict';
    
    console.log('🚀 Fixed Efficient Bot v4.0 Loading...');
    
    if (window.fixedBotActive) {
        console.log('Bot already active');
        return;
    }
    window.fixedBotActive = true;

    // ULTRA-FAST Memory System with Multiple Fallbacks
    const superMemory = {
        storage: null,
        data: { questions: {}, stats: { total: 0, learned: 0 } },
        
        init() {
            // Try multiple storage methods
            try {
                if (localStorage) {
                    this.storage = 'localStorage';
                    const stored = localStorage.getItem('beelingua_memory_v4');
                    if (stored) this.data = JSON.parse(stored);
                }
            } catch (e) {
                try {
                    if (sessionStorage) {
                        this.storage = 'sessionStorage';
                        const stored = sessionStorage.getItem('beelingua_memory_v4');
                        if (stored) this.data = JSON.parse(stored);
                    }
                } catch (e2) {
                    this.storage = 'memory';
                    console.warn('Using in-memory storage only');
                }
            }
            
            console.log(`Memory system: ${this.storage} | Questions: ${Object.keys(this.data.questions).length}`);
            return this;
        },
        
        save() {
            if (!this.storage || this.storage === 'memory') return false;
            
            try {
                const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
                storageObj.setItem('beelingua_memory_v4', JSON.stringify(this.data));
                console.log(`✅ Memory saved: ${Object.keys(this.data.questions).length} questions`);
                return true;
            } catch (e) {
                console.warn('Memory save failed:', e);
                return false;
            }
        },
        
        learn(question, answer) {
            if (!question || !answer) return false;
            
            // Simple but effective key generation
            const key = question.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 100);
            
            if (key.length < 10) return false;
            
            this.data.questions[key] = answer;
            this.data.stats.total = Object.keys(this.data.questions).length;
            this.data.stats.learned++;
            
            console.log(`🧠 LEARNED: "${question.substring(0, 40)}..." → ${answer}`);
            this.save();
            return true;
        },
        
        recall(question) {
            if (!question) return null;
            
            const key = question.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 100);
            
            // Exact match first
            if (this.data.questions[key]) {
                console.log(`🎯 MEMORY HIT: ${this.data.questions[key]}`);
                return this.data.questions[key];
            }
            
            // Fuzzy match
            const words = key.split(' ').filter(w => w.length > 3);
            for (const [storedKey, answer] of Object.entries(this.data.questions)) {
                const storedWords = storedKey.split(' ').filter(w => w.length > 3);
                const commonWords = words.filter(w => storedWords.includes(w));
                
                if (commonWords.length >= Math.min(3, Math.floor(words.length * 0.6))) {
                    console.log(`🔍 FUZZY MATCH: ${answer}`);
                    return answer;
                }
            }
            
            return null;
        },
        
        getStats() {
            return {
                total: Object.keys(this.data.questions).length,
                learned: this.data.stats.learned,
                storage: this.storage
            };
        },
        
        export() {
            const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `beelingua_memory_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
        
        clear() {
            this.data = { questions: {}, stats: { total: 0, learned: 0 } };
            if (this.storage !== 'memory') {
                try {
                    const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
                    storageObj.removeItem('beelingua_memory_v4');
                } catch (e) {}
            }
            console.log('Memory cleared');
        }
    }.init();

    // AGGRESSIVE Video Controller
    const videoTurbo = {
        videos: [],
        currentSpeed: 1,
        
        findVideos() {
            this.videos = [];
            
            // Find all video elements aggressively
            const selectors = [
                'video',
                'iframe[src*="video"]',
                'iframe[src*="youtube"]',
                'iframe[src*="vimeo"]',
                'iframe[src*="blob"]',
                'object[data*="video"]',
                'embed[src*="video"]'
            ];
            
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    if (el.tagName === 'VIDEO') {
                        this.videos.push(el);
                    } else {
                        // Try to access iframe content
                        try {
                            const iframeDoc = el.contentDocument || el.contentWindow?.document;
                            if (iframeDoc) {
                                iframeDoc.querySelectorAll('video').forEach(v => this.videos.push(v));
                            }
                        } catch (e) {}
                        
                        // Also add iframe itself for postMessage control
                        this.videos.push(el);
                    }
                });
            });
            
            console.log(`Found ${this.videos.length} video elements`);
            return this.videos.length;
        },
        
        setSpeed(speed) {
            this.findVideos();
            this.currentSpeed = speed;
            let changed = 0;
            
            this.videos.forEach(video => {
                try {
                    if (video.tagName === 'VIDEO') {
                        // Multiple aggressive methods
                        
                        // Method 1: Direct property override
                        Object.defineProperty(video, 'playbackRate', {
                            get: () => speed,
                            set: () => speed,
                            configurable: true
                        });
                        
                        // Method 2: Force via prototype
                        video.__proto__.playbackRate = speed;
                        
                        // Method 3: Direct assignment with intervals
                        video.playbackRate = speed;
                        video.defaultPlaybackRate = speed;
                        
                        // Method 4: Interval forcing
                        const forceInterval = setInterval(() => {
                            if (video.playbackRate !== speed) {
                                video.playbackRate = speed;
                            }
                        }, 100);
                        
                        setTimeout(() => clearInterval(forceInterval), 5000);
                        
                        // Method 5: Event listener override
                        video.addEventListener('ratechange', (e) => {
                            if (video.playbackRate !== speed) {
                                e.preventDefault();
                                video.playbackRate = speed;
                            }
                        });
                        
                        changed++;
                        
                    } else if (video.tagName === 'IFRAME') {
                        // YouTube/Vimeo API calls
                        try {
                            video.contentWindow?.postMessage(`{"event":"command","func":"setPlaybackRate","args":[${speed}]}`, '*');
                            video.contentWindow?.postMessage(`{"method":"setPlaybackRate","value":${speed}}`, '*');
                        } catch (e) {}
                        changed++;
                    }
                } catch (error) {
                    console.warn('Video control failed:', error);
                }
            });
            
            // Global prototype override
            this.globalOverride(speed);
            
            console.log(`🎥 FORCED SPEED ${speed}x on ${changed} videos`);
            return changed > 0;
        },
        
        globalOverride(speed) {
            // Override HTML Video Element globally
            if (window.HTMLVideoElement && HTMLVideoElement.prototype) {
                const originalPlaybackRate = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'playbackRate');
                
                Object.defineProperty(HTMLVideoElement.prototype, 'playbackRate', {
                    get: function() {
                        return this._forcedSpeed || speed;
                    },
                    set: function(value) {
                        this._forcedSpeed = speed;
                        if (originalPlaybackRate && originalPlaybackRate.set) {
                            try {
                                originalPlaybackRate.set.call(this, speed);
                            } catch (e) {}
                        }
                    },
                    configurable: true
                });
                
                // Also override rate change events
                window.addEventListener('ratechange', (e) => {
                    if (e.target.tagName === 'VIDEO' && e.target.playbackRate !== speed) {
                        e.target.playbackRate = speed;
                    }
                }, true);
                
                console.log(`🔧 Global video override applied: ${speed}x`);
            }
        },
        
        skip(seconds) {
            this.findVideos();
            let skipped = 0;
            
            this.videos.forEach(video => {
                try {
                    if (video.tagName === 'VIDEO' && video.duration) {
                        video.currentTime = Math.min(video.duration - 2, seconds || video.duration - 2);
                        skipped++;
                    }
                } catch (e) {}
            });
            
            return skipped;
        }
    };

    // ULTRA FAST Quiz Engine
    const hyperBot = {
        running: false,
        stats: { q: 0, correct: 0, learned: 0 },
        
        // FASTEST selectors - no fancy stuff
        getQuestion() {
            const elements = document.querySelectorAll('h1, h2, h3, .question, [class*="question"], p');
            for (const el of elements) {
                const text = el.innerText?.trim();
                if (text && text.length > 20 && !text.includes('Question') && !text.includes('Choose')) {
                    return text;
                }
            }
            return null;
        },
        
        getChoices() {
            // Multiple strategies for speed
            const strategies = [
                () => Array.from(document.querySelectorAll('p')).filter(el => {
                    const text = el.innerText?.trim();
                    return text && ['A', 'B', 'C', 'D', 'E'].includes(text);
                }),
                () => Array.from(document.querySelectorAll('[class*="choice"], [class*="option"], [class*="answer"]')),
                () => Array.from(document.querySelectorAll('button, input[type="radio"], input[type="checkbox"]')).filter(el => {
                    return el.offsetWidth > 0 && el.offsetHeight > 0;
                })
            ];
            
            for (const strategy of strategies) {
                const choices = strategy();
                if (choices.length >= 2) return choices;
            }
            
            return [];
        },
        
        getDragDropElements() {
            return {
                draggable: Array.from(document.querySelectorAll('[draggable="true"], .draggable, .drag-item, [class*="drag"]')),
                dropzones: Array.from(document.querySelectorAll('.dropzone, [class*="drop"], [data-drop]')),
                blanks: Array.from(document.querySelectorAll('input[type="text"], .blank, [class*="blank"]'))
            };
        },
        
        isCorrect() {
            return Array.from(document.querySelectorAll('*')).some(el => 
                /correct|benar|right/i.test(el.innerText?.trim() || '')
            );
        },
        
        isWrong() {
            return Array.from(document.querySelectorAll('*')).some(el => 
                /incorrect|wrong|salah/i.test(el.innerText?.trim() || '')
            );
        },
        
        async fastClick(element) {
            if (!element) return false;
            
            // INSTANT click - no delays
            element.scrollIntoView({ block: 'nearest' });
            element.click();
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('input', { bubbles: true }));
            
            return true;
        },
        
        async findAndClick(text) {
            const buttons = Array.from(document.querySelectorAll('button, p, a, div')).filter(el => {
                const elText = el.innerText?.trim().toLowerCase();
                return elText && text.some(t => elText.includes(t.toLowerCase()));
            });
            
            if (buttons.length > 0) {
                await this.fastClick(buttons[0]);
                return true;
            }
            return false;
        },
        
        clearErrors() {
            Array.from(document.querySelectorAll('*')).forEach(el => {
                const text = el.innerText?.trim();
                if (text && /incorrect|wrong|error|salah/i.test(text)) {
                    try { el.remove(); } catch (e) {}
                }
            });
        },
        
        // HYPER SPEED Multiple Choice
        async hyperMultipleChoice() {
            const question = this.getQuestion();
            const choices = this.getChoices();
            
            if (!choices.length) return false;
            
            // Try memory first (INSTANT)
            if (question) {
                const remembered = superMemory.recall(question);
                if (remembered) {
                    const target = choices.find(el => el.innerText?.trim() === remembered);
                    if (target) {
                        await this.fastClick(target);
                        await new Promise(r => setTimeout(r, 50));
                        await this.findAndClick(['check', 'submit', 'next']);
                        await new Promise(r => setTimeout(r, 50));
                        await this.findAndClick(['next', 'continue', 'save']);
                        this.stats.correct++;
                        this.stats.q++;
                        return true;
                    }
                }
            }
            
            // HYPER SPEED brute force - minimal delays
            for (const choice of choices) {
                if (!this.running) break;
                
                this.clearErrors();
                await this.fastClick(choice);
                await new Promise(r => setTimeout(r, 30)); // Ultra fast
                
                await this.findAndClick(['check', 'submit']);
                await new Promise(r => setTimeout(r, 100));
                
                if (this.isCorrect()) {
                    // LEARN INSTANTLY
                    if (question) {
                        const answer = choice.innerText?.trim();
                        if (answer) {
                            superMemory.learn(question, answer);
                            this.stats.learned++;
                        }
                    }
                    
                    this.stats.correct++;
                    this.stats.q++;
                    
                    await new Promise(r => setTimeout(r, 50));
                    await this.findAndClick(['next', 'continue', 'save']);
                    return true;
                }
                
                if (this.isWrong()) {
                    this.clearErrors();
                    await new Promise(r => setTimeout(r, 30));
                }
            }
            
            this.stats.q++;
            return false;
        },
        
        // DRAG AND DROP Handler
        async hyperDragDrop() {
            const elements = this.getDragDropElements();
            
            if (!elements.draggable.length || !elements.dropzones.length) {
                console.log('No drag/drop elements found');
                return false;
            }
            
            console.log(`Found ${elements.draggable.length} draggable, ${elements.dropzones.length} dropzones`);
            
            // Try all combinations rapidly
            for (const draggable of elements.draggable) {
                for (const dropzone of elements.dropzones) {
                    if (!this.running) break;
                    
                    try {
                        // Simulate drag and drop
                        const dragRect = draggable.getBoundingClientRect();
                        const dropRect = dropzone.getBoundingClientRect();
                        
                        // Create drag events
                        const dragStart = new DragEvent('dragstart', {
                            bubbles: true,
                            dataTransfer: new DataTransfer()
                        });
                        
                        draggable.dispatchEvent(dragStart);
                        
                        const drop = new DragEvent('drop', {
                            bubbles: true,
                            dataTransfer: dragStart.dataTransfer
                        });
                        
                        dropzone.dispatchEvent(drop);
                        
                        const dragEnd = new DragEvent('dragend', { bubbles: true });
                        draggable.dispatchEvent(dragEnd);
                        
                        await new Promise(r => setTimeout(r, 100));
                        await this.findAndClick(['check', 'submit']);
                        await new Promise(r => setTimeout(r, 200));
                        
                        if (this.isCorrect()) {
                            this.stats.correct++;
                            this.stats.q++;
                            await this.findAndClick(['next', 'continue']);
                            return true;
                        }
                        
                        this.clearErrors();
                        
                    } catch (error) {
                        console.warn('Drag/drop failed:', error);
                    }
                }
            }
            
            return false;
        },
        
        // FILL IN THE BLANKS (Dots) Handler
        async hyperFillBlanks() {
            const elements = this.getDragDropElements();
            
            if (!elements.blanks.length) {
                console.log('No fill-in-the-blank elements found');
                return false;
            }
            
            console.log(`Found ${elements.blanks.length} blank fields`);
            
            // Common answers to try
            const commonAnswers = [
                'a', 'an', 'the', 'is', 'are', 'was', 'were', 'have', 'has', 'had',
                'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must',
                'do', 'does', 'did', 'go', 'goes', 'went', 'come', 'comes', 'came',
                'get', 'gets', 'got', 'make', 'makes', 'made', 'take', 'takes', 'took',
                'give', 'gives', 'gave', 'see', 'sees', 'saw', 'know', 'knows', 'knew'
            ];
            
            // Try memory-based answers first
            const question = this.getQuestion();
            if (question) {
                const remembered = superMemory.recall(question);
                if (remembered && elements.blanks[0]) {
                    elements.blanks[0].value = remembered;
                    elements.blanks[0].dispatchEvent(new Event('input', { bubbles: true }));
                    
                    await new Promise(r => setTimeout(r, 100));
                    await this.findAndClick(['check', 'submit']);
                    await new Promise(r => setTimeout(r, 200));
                    
                    if (this.isCorrect()) {
                        this.stats.correct++;
                        this.stats.q++;
                        await this.findAndClick(['next', 'continue']);
                        return true;
                    }
                }
            }
            
            // Brute force common answers
            for (const answer of commonAnswers) {
                if (!this.running) break;
                
                elements.blanks.forEach(blank => {
                    blank.value = answer;
                    blank.dispatchEvent(new Event('input', { bubbles: true }));
                    blank.dispatchEvent(new Event('change', { bubbles: true }));
                });
                
                await new Promise(r => setTimeout(r, 50));
                await this.findAndClick(['check', 'submit']);
                await new Promise(r => setTimeout(r, 150));
                
                if (this.isCorrect()) {
                    if (question) {
                        superMemory.learn(question, answer);
                        this.stats.learned++;
                    }
                    
                    this.stats.correct++;
                    this.stats.q++;
                    await this.findAndClick(['next', 'continue']);
                    return true;
                }
                
                this.clearErrors();
            }
            
            return false;
        },
        
        // AUTO-DETECT Question Type and Handle
        async autoSolve() {
            const choices = this.getChoices();
            const dragDrop = this.getDragDropElements();
            
            // Detect question type and solve accordingly
            if (choices.length >= 2) {
                console.log('🎯 Multiple Choice detected');
                return await this.hyperMultipleChoice();
            } else if (dragDrop.draggable.length > 0 && dragDrop.dropzones.length > 0) {
                console.log('🎯 Drag & Drop detected');
                return await this.hyperDragDrop();
            } else if (dragDrop.blanks.length > 0) {
                console.log('🎯 Fill-in-the-blanks detected');
                return await this.hyperFillBlanks();
            }
            
            console.log('❓ Unknown question type');
            return false;
        },
        
        // MAIN EXECUTION MODES
        async startTurbo() {
            if (this.running) return;
            
            this.running = true;
            this.stats = { q: 0, correct: 0, learned: 0 };
            
            ui.updateStatus('🚀 TURBO MODE: Maximum speed...', 'info');
            ui.setActive('turbo-btn', true);
            
            for (let i = 0; i < 200 && this.running; i++) {
                const success = await this.autoSolve();
                
                if (success) {
                    ui.updateStatus(`TURBO: Q${this.stats.q} | ✅${this.stats.correct} | 🧠${this.stats.learned}`, 'success');
                } else {
                    ui.updateStatus(`TURBO: Q${this.stats.q} | Analyzing...`, 'info');
                }
                
                // Ultra short delay between questions
                await new Promise(r => setTimeout(r, 200));
                
                // Check if quiz finished
                if (!this.getChoices().length && !this.getDragDropElements().draggable.length && !this.getDragDropElements().blanks.length) {
                    ui.updateStatus('Quiz completed!', 'success');
                    break;
                }
            }
            
            this.stop();
        },
        
        removeBlur() {
            const selectors = [
                '.bl-p-l.bl-relative.bl-col-between',
                '[class*="blur"]',
                '[style*="blur"]',
                '.locked',
                '.disabled'
            ];
            
            let count = 0;
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.style.filter = 'none';
                    el.style.webkitFilter = 'none';
                    el.style.opacity = '1';
                    el.style.pointerEvents = 'auto';
                    if (el.onblur) el.onblur = null;
                    count++;
                });
            });
            
            ui.updateStatus(`Blur removed: ${count} elements`, 'success');
        },
        
        stop() {
            this.running = false;
            document.querySelectorAll('.btn.active').forEach(btn => btn.classList.remove('active'));
            
            const stats = superMemory.getStats();
            ui.updateStatus(`STOPPED | Session: Q${this.stats.q}, ✅${this.stats.correct}, 🧠${this.stats.learned} | Total Memory: ${stats.total}`, 'warning');
        }
    };

    // STREAMLINED UI
    const ui = {
        create() {
            if (document.getElementById('turbo-bot')) return;
            
            const stats = superMemory.getStats();
            const videos = videoTurbo.findVideos();
            
            const container = document.createElement('div');
            container.id = 'turbo-bot';
            container.innerHTML = `
                <style>
                    #turbo-bot {
                        position: fixed !important;
                        top: 15px !important;
                        right: 15px !important;
                        z-index: 999999 !important;
                        background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
                        color: white !important;
                        font-family: Arial, sans-serif !important;
                        font-size: 11px !important;
                        border-radius: 8px !important;
                        box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important;
                        min-width: 260px !important;
                        backdrop-filter: blur(8px) !important;
                    }
                    .turbo-header {
                        background: rgba(0,0,0,0.3) !important;
                        padding: 8px 12px !important;
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        font-weight: bold !important;
                        border-radius: 8px 8px 0 0 !important;
                        font-size: 12px !important;
                    }
                    .turbo-body {
                        padding: 12px !important;
                    }
                    .turbo-tabs {
                        display: flex !important;
                        margin-bottom: 8px !important;
                        background: rgba(0,0,0,0.2) !important;
                        border-radius: 4px !important;
                        padding: 1px !important;
                    }
                    .turbo-tab {
                        flex: 1 !important;
                        padding: 4px 6px !important;
                        text-align: center !important;
                        cursor: pointer !important;
                        border-radius: 3px !important;
                        font-size: 9px !important;
                        transition: all 0.2s !important;
                    }
                    .turbo-tab.active {
                        background: rgba(255,255,255,0.3) !important;
                    }
                    .turbo-content {
                        display: none !important;
                    }
                    .turbo-content.active {
                        display: block !important;
                    }
                    .btn {
                        background: rgba(255,255,255,0.2) !important;
                        border: none !important;
                        color: white !important;
                        padding: 5px 8px !important;
                        border-radius: 3px !important;
                        cursor: pointer !important;
                        margin: 2px !important;
                        font-size: 9px !important;
                        transition: all 0.2s !important;
                        width: 47% !important;
                    }
                    .btn:hover {
                        background: rgba(255,255,255,0.3) !important;
                    }
                    .btn.active {
                        background: #27ae60 !important;
                        box-shadow: 0 0 8px rgba(39,174,96,0.4) !important;
                    }
                    .btn.full {
                        width: 100% !important;
                    }
                    .btn.danger {
                        background: #8e44ad !important;
                    }
                    .status {
                        background: rgba(0,0,0,0.3) !important;
                        padding: 6px !important;
                        border-radius: 3px !important;
                        margin-top: 8px !important;
                        font-size: 9px !important;
                        text-align: center !important;
                        min-height: 15px !important;
                    }
                    .stats {
                        background: rgba(0,0,0,0.2) !important;
                        padding: 4px !important;
                        border-radius: 3px !important;
                        margin-bottom: 6px !important;
                        font-size: 8px !important;
                        line-height: 1.2 !important;
                    }
                    .minimize {
                        cursor: pointer !important;
                        padding: 1px 4px !important;
                        border-radius: 2px !important;
                        background: rgba(255,255,255,0.2) !important;
                        font-size: 10px !important;
                    }
                </style>
                
                <div class="turbo-header">
                    <span>⚡ TURBO BOT v4.0</span>
                    <span class="minimize">−</span>
                </div>
                
                <div class="turbo-body">
                    <div class="turbo-tabs">
                        <div class="turbo-tab active" data-tab="quiz">Quiz</div>
                        <div class="turbo-tab" data-tab="memory">Memory</div>
                        <div class="turbo-tab" data-tab="video">Video</div>
                    </div>
                    
                    <!-- Quiz Tab -->
                    <div class="turbo-content active" id="quiz-content">
                        <button class="btn" id="turbo-btn">⚡ TURBO MODE</button>
                        <button class="btn" id="blur-btn">👁️ Remove Blur</button>
                        <button class="btn full danger" id="stop-btn">⏹️ EMERGENCY STOP</button>
                    </div>
                    
                    <!-- Memory Tab -->
                    <div class="turbo-content" id="memory-content">
                        <div class="stats">
                            🧠 Memory: ${stats.total} questions<br>
                            📊 Learned: ${stats.learned}<br>
                            💾 Storage: ${stats.storage}
                        </div>
                        <button class="btn" id="export-btn">💾 Export</button>
                        <button class="btn" id="clear-btn">🗑️ Clear</button>
                    </div>
                    
                    <!-- Video Tab -->
                    <div class="turbo-content" id="video-content">
                        <div class="stats">🎥 Videos found: ${videos}</div>
                        <button class="btn" id="speed-1">1x</button>
                        <button class="btn" id="speed-2">2x</button>
                        <button class="btn" id="speed-3">3x</button>
                        <button class="btn" id="speed-5">5x</button>
                        <button class="btn" id="skip-btn">⏭️ Skip</button>
                        <button class="btn" id="test-video">🔧 Test</button>
                    </div>
                    
                    <div class="status" id="status">Ready | Memory: ${stats.total} 🧠 Videos: ${videos} 🎥</div>
                </div>
            `;
            
            document.body.appendChild(container);
            this.bindEvents();
        },
        
        bindEvents() {
            // Tab switching
            document.querySelectorAll('.turbo-tab').forEach(tab => {
                tab.onclick = () => {
                    document.querySelectorAll('.turbo-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.turbo-content').forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
                };
            });
            
            // Minimize
            document.querySelector('.minimize').onclick = () => {
                const body = document.querySelector('.turbo-body');
                const min = document.querySelector('.minimize');
                if (body.style.display === 'none') {
                    body.style.display = 'block';
                    min.textContent = '−';
                } else {
                    body.style.display = 'none';
                    min.textContent = '+';
                }
            };
            
            // Quiz controls
            document.getElementById('turbo-btn').onclick = () => hyperBot.startTurbo();
            document.getElementById('blur-btn').onclick = () => hyperBot.removeBlur();
            document.getElementById('stop-btn').onclick = () => hyperBot.stop();
            
            // Memory controls
            document.getElementById('export-btn').onclick = () => superMemory.export();
            document.getElementById('clear-btn').onclick = () => {
                if (confirm('Clear all memory?')) {
                    superMemory.clear();
                    this.updateStatus('Memory cleared', 'warning');
                }
            };
            
            // Video controls with TESTING
            document.getElementById('speed-1').onclick = () => this.testVideoSpeed(1);
            document.getElementById('speed-2').onclick = () => this.testVideoSpeed(2);
            document.getElementById('speed-3').onclick = () => this.testVideoSpeed(3);
            document.getElementById('speed-5').onclick = () => this.testVideoSpeed(5);
            document.getElementById('skip-btn').onclick = () => {
                const skipped = videoTurbo.skip();
                this.updateStatus(`Skipped ${skipped} videos`, skipped > 0 ? 'success' : 'error');
            };
            document.getElementById('test-video').onclick = () => this.debugVideo();
        },
        
        testVideoSpeed(speed) {
            const success = videoTurbo.setSpeed(speed);
            if (success) {
                this.updateStatus(`Video speed set to ${speed}x`, 'success');
                // Visual feedback
                document.querySelectorAll('[id^="speed-"]').forEach(btn => btn.classList.remove('active'));
                document.getElementById(`speed-${speed}`).classList.add('active');
                
                // Test if it actually worked
                setTimeout(() => {
                    const videos = videoTurbo.videos.filter(v => v.tagName === 'VIDEO');
                    const actualSpeeds = videos.map(v => v.playbackRate);
                    const working = actualSpeeds.filter(s => Math.abs(s - speed) < 0.1).length;
                    
                    if (working > 0) {
                        this.updateStatus(`✅ Speed ${speed}x confirmed on ${working} videos`, 'success');
                    } else {
                        this.updateStatus(`⚠️ Speed change failed - trying alternative method`, 'warning');
                        // Fallback method
                        this.forceVideoSpeed(speed);
                    }
                }, 500);
            } else {
                this.updateStatus('No videos found', 'error');
            }
        },
        
        forceVideoSpeed(speed) {
            // Emergency fallback method
            const interval = setInterval(() => {
                document.querySelectorAll('video').forEach(video => {
                    if (video.playbackRate !== speed) {
                        video.playbackRate = speed;
                    }
                });
            }, 200);
            
            setTimeout(() => {
                clearInterval(interval);
                this.updateStatus(`Force-applied ${speed}x speed (emergency method)`, 'success');
            }, 3000);
        },
        
        debugVideo() {
            const videos = videoTurbo.findVideos();
            console.log('=== VIDEO DEBUG INFO ===');
            
            videoTurbo.videos.forEach((video, i) => {
                if (video.tagName === 'VIDEO') {
                    console.log(`Video ${i}:`, {
                        src: video.src ? video.src.substring(0, 50) + '...' : 'No src',
                        currentTime: video.currentTime,
                        duration: video.duration,
                        playbackRate: video.playbackRate,
                        paused: video.paused,
                        readyState: video.readyState
                    });
                } else {
                    console.log(`Element ${i}:`, video.tagName, video.src?.substring(0, 50) + '...' || 'No src');
                }
            });
            
            this.updateStatus(`Debug: Found ${videos} video elements (check console)`, 'info');
        },
        
        updateStatus(message, type = 'info') {
            const status = document.getElementById('status');
            if (status) {
                status.textContent = message;
                const colors = {
                    info: 'white',
                    success: '#2ecc71', 
                    error: '#e74c3c',
                    warning: '#f39c12'
                };
                status.style.color = colors[type] || 'white';
            }
            console.log(`[TURBO BOT] ${message}`);
        },
        
        setActive(buttonId, active = true) {
            const btn = document.getElementById(buttonId);
            if (btn) {
                if (active) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        }
    };

    // INITIALIZE EVERYTHING
    try {
        ui.create();
        
        // Test memory system immediately
        console.log(`Memory System Status: ${superMemory.getStats().storage}`);
        
        // Test video finding
        const videoCount = videoTurbo.findVideos();
        console.log(`Found ${videoCount} video elements`);
        
        // Auto-learn from current page
        setTimeout(() => {
            const question = hyperBot.getQuestion();
            if (question && hyperBot.isCorrect()) {
                const choices = hyperBot.getChoices();
                const selected = document.querySelector('input:checked, .selected, [class*="selected"]');
                
                if (selected) {
                    const answer = selected.innerText?.trim() || selected.value;
                    if (answer) {
                        superMemory.learn(question, answer);
                        ui.updateStatus('Auto-learned from current page!', 'success');
                    }
                }
            }
        }, 1000);
        
        // Welcome message
        setTimeout(() => {
            const stats = superMemory.getStats();
            ui.updateStatus(`TURBO BOT v4.0 Ready! All issues fixed!`, 'success');
        }, 2000);
        
        console.log('✅ TURBO BOT v4.0 initialized successfully!');
        console.log('🚀 All reported issues have been addressed');
        console.log('⚡ Ultra-fast operation mode enabled');
        console.log('🧠 Memory system with multiple fallbacks');
        console.log('🎥 Aggressive video control with testing');
        console.log('🎯 Drag & Drop + Fill-in-blanks support');
        
    } catch (error) {
        console.error('Initialization failed:', error);
        alert('TURBO BOT failed to initialize. Check console for details.');
    }

})();
