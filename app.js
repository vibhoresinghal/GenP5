/* ========================================
   PatternFlow - Main Application
   Core Logic & State Management
   ======================================== */

class PatternFlowApp {
    constructor() {
        // State
        this.currentPattern = null;
        this.currentPatternKey = null;
        this.p5Instance = null;
        this.thumbnailSketches = [];
        this.controlSystem = null;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];

        // DOM Elements
        this.templateGrid = document.getElementById('template-grid');
        this.workspace = document.getElementById('workspace');
        this.templatesContainer = document.getElementById('templates');
        this.canvasContainer = document.getElementById('canvas-container');
        this.controlsContainer = document.getElementById('controls-container');
        this.modal = document.getElementById('export-modal');
        this.toast = document.getElementById('toast');

        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.renderTemplates();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => this.goToTemplates());

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => this.resetPattern());

        // Finish button
        document.getElementById('finish-btn').addEventListener('click', () => this.openModal());

        // Modal close
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());

        // Export options
        document.getElementById('copy-code-btn').addEventListener('click', () => this.showCodePreview());
        document.getElementById('record-video-btn').addEventListener('click', () => this.startRecording());

        // Copy button
        document.getElementById('copy-btn').addEventListener('click', () => this.copyCode());

        // Fullscreen
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.modal.classList.contains('active')) {
                    this.closeModal();
                } else if (this.workspace.classList.contains('active')) {
                    this.goToTemplates();
                }
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (this.p5Instance && this.currentPattern) {
                this.resizeCanvas();
            }
        });
    }

    /**
     * Render template cards with live thumbnails
     */
    renderTemplates() {
        const patternKeys = Object.keys(Patterns);

        patternKeys.forEach((key, index) => {
            const pattern = Patterns[key];
            const card = this.createTemplateCard(key, pattern, index);
            this.templatesContainer.appendChild(card);
        });

        // Create thumbnails after cards are in DOM and have dimensions
        requestAnimationFrame(() => {
            patternKeys.forEach((key, index) => {
                const pattern = Patterns[key];
                const card = document.getElementById(`template-${key}`);
                if (card) {
                    setTimeout(() => {
                        this.createThumbnailSketch(key, pattern, card);
                    }, index * 50);
                }
            });
        });
    }


    /**
     * Create a template card element
     */
    createTemplateCard(key, pattern, index) {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.id = `template-${key}`;
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div id="thumb-${key}" class="thumb-canvas"></div>
            <div class="template-info">
                <div class="template-name">${pattern.name}</div>
                <div class="template-desc">${pattern.description}</div>
            </div>
            <div class="template-overlay">
                <button class="open-btn">
                    <span>Open</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        `;

        card.addEventListener('click', () => this.openPattern(key));

        return card;
    }

    /**
     * Create a thumbnail p5.js sketch
     */
    createThumbnailSketch(key, pattern, card) {
        const container = card.querySelector(`#thumb-${key}`);
        if (!container) return;

        const sketch = (p) => {
            let params = { ...pattern.defaults };

            // Create a clone of pattern that includes all methods
            let patternInstance = Object.create(pattern);

            p.setup = () => {
                // Mock container with fixed dimensions for thumbnails
                const mockContainer = {
                    clientWidth: 400,
                    clientHeight: 300
                };

                try {
                    if (pattern.setup) {
                        // Let pattern create its own canvas
                        const canvas = pattern.setup.call(patternInstance, p, params, mockContainer);
                        // Parent it to our container
                        if (canvas && canvas.parent) {
                            canvas.parent(container);
                        } else {
                            // If pattern didn't return canvas, find it
                            const canvasEl = document.querySelector(`#thumb-${key} canvas`) ||
                                p.canvas ||
                                (p._renderer && p._renderer.canvas);
                            if (canvasEl && canvasEl.parentElement !== container) {
                                container.appendChild(canvasEl);
                            }
                        }
                    }
                } catch (e) {
                    console.warn(`Error in ${key} setup:`, e);
                    // Create fallback canvas
                    p.createCanvas(400, 300);
                    p.background(30);
                }
            };

            p.draw = () => {
                try {
                    if (pattern.draw) {
                        pattern.draw.call(patternInstance, p, params);
                    }
                } catch (e) {
                    // Silently fail
                }
            };
        };

        const p5Instance = new p5(sketch, container);
        this.thumbnailSketches.push(p5Instance);
    }

    /**
     * Open a pattern in the workspace
     */
    openPattern(key) {
        // Clean up thumbnails to save resources
        this.thumbnailSketches.forEach(sketch => sketch.remove());
        this.thumbnailSketches = [];

        this.currentPatternKey = key;
        this.currentPattern = Patterns[key];

        // Update title
        document.getElementById('pattern-title').textContent = this.currentPattern.name;

        // Switch views
        this.templateGrid.classList.remove('active');
        this.workspace.classList.add('active');

        // Initialize control system
        this.controlSystem = new ControlSystem(
            this.controlsContainer,
            (params) => this.onControlUpdate(params)
        );
        this.controlSystem.generateControls(this.currentPattern);

        // Create main sketch
        this.createMainSketch();
    }

    /**
     * Create the main p5.js sketch
     */
    createMainSketch() {
        // Remove existing sketch
        if (this.p5Instance) {
            this.p5Instance.remove();
        }
        this.canvasContainer.innerHTML = '';

        const pattern = this.currentPattern;
        let params = this.controlSystem.getParams();

        const sketch = (p) => {
            p.setup = () => {
                const canvas = pattern.setup.call(pattern, p, params, this.canvasContainer);
                canvas.parent(this.canvasContainer);
            };

            p.draw = () => {
                params = this.controlSystem.getParams();
                pattern.draw.call(pattern, p, params);
            };
        };

        this.p5Instance = new p5(sketch);
    }

    /**
     * Handle control updates
     */
    onControlUpdate(params) {
        // The draw loop will pick up the new params automatically
    }

    /**
     * Reset pattern to defaults
     */
    resetPattern() {
        if (this.currentPattern && this.controlSystem) {
            this.controlSystem.resetToDefaults(this.currentPattern.defaults);

            if (this.currentPattern.reset) {
                this.currentPattern.reset.call(
                    this.currentPattern,
                    this.p5Instance,
                    this.controlSystem.getParams()
                );
            }

            this.showToast('Pattern reset to defaults');
        }
    }

    /**
     * Go back to templates view
     */
    goToTemplates() {
        // Remove main sketch
        if (this.p5Instance) {
            this.p5Instance.remove();
            this.p5Instance = null;
        }

        this.currentPattern = null;
        this.currentPatternKey = null;

        // Switch views
        this.workspace.classList.remove('active');
        this.templateGrid.classList.add('active');

        // Clear thumbnails container
        this.templatesContainer.innerHTML = '';

        // Recreate thumbnails
        this.renderTemplates();
    }

    /**
     * Resize canvas on window resize
     */
    resizeCanvas() {
        if (this.p5Instance) {
            const width = this.canvasContainer.clientWidth - 48;
            const height = this.canvasContainer.clientHeight - 48;
            this.p5Instance.resizeCanvas(width, height);
        }
    }

    /**
     * Toggle fullscreen
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.canvasContainer.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Open export modal
     */
    openModal() {
        this.modal.classList.add('active');
        document.getElementById('code-preview').classList.add('hidden');
        document.getElementById('recording-progress').classList.add('hidden');
        document.querySelector('.modal-body').classList.remove('hidden');
    }

    /**
     * Close export modal
     */
    closeModal() {
        this.modal.classList.remove('active');

        // Stop recording if in progress
        if (this.isRecording && this.mediaRecorder) {
            this.mediaRecorder.stop();
            this.isRecording = false;
        }
    }

    /**
     * Show code preview
     */
    showCodePreview() {
        if (!this.currentPattern) return;

        const params = this.controlSystem.getParams();
        const code = this.currentPattern.getCode.call(this.currentPattern, params);

        document.getElementById('code-content').textContent = code;
        document.querySelector('.modal-body').classList.add('hidden');
        document.getElementById('code-preview').classList.remove('hidden');
    }

    /**
     * Copy code to clipboard
     */
    async copyCode() {
        const code = document.getElementById('code-content').textContent;

        try {
            await navigator.clipboard.writeText(code);
            this.showToast('Code copied to clipboard!');
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('Code copied to clipboard!');
        }
    }

    /**
     * Start recording video
     */
    async startRecording() {
        if (this.isRecording) return;

        const canvas = this.canvasContainer.querySelector('canvas');
        if (!canvas) {
            this.showToast('No canvas found');
            return;
        }

        try {
            const stream = canvas.captureStream(60);

            // Try WebM first, fallback to mp4
            const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : MediaRecorder.isTypeSupported('video/webm')
                    ? 'video/webm'
                    : 'video/mp4';

            this.mediaRecorder = new MediaRecorder(stream, { mimeType });
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.isRecording = false;
                this.downloadRecording();
                document.getElementById('recording-progress').classList.add('hidden');
                document.querySelector('.modal-body').classList.remove('hidden');
            };

            // Show progress
            document.querySelector('.modal-body').classList.add('hidden');
            document.getElementById('recording-progress').classList.remove('hidden');

            this.isRecording = true;
            this.mediaRecorder.start();

            // Update progress
            const duration = 5000; // 5 seconds
            const startTime = Date.now();
            const progressFill = document.getElementById('progress-fill');
            const progressText = document.getElementById('progress-text');

            const updateProgress = () => {
                if (!this.isRecording) return;

                const elapsed = Date.now() - startTime;
                const progress = Math.min((elapsed / duration) * 100, 100);
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${(elapsed / 1000).toFixed(1)} / 5 seconds`;

                if (elapsed < duration) {
                    requestAnimationFrame(updateProgress);
                }
            };

            updateProgress();

            // Stop after 5 seconds
            setTimeout(() => {
                if (this.isRecording && this.mediaRecorder) {
                    this.mediaRecorder.stop();
                }
            }, duration);

        } catch (err) {
            console.error('Recording error:', err);
            this.showToast('Recording not supported in this browser');
        }
    }

    /**
     * Download the recorded video
     */
    downloadRecording() {
        if (this.recordedChunks.length === 0) {
            this.showToast('No recording data');
            return;
        }

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `patternflow-${this.currentPatternKey}-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        this.showToast('Video downloaded!');
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        const toast = this.toast;
        document.getElementById('toast-message').textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2500);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PatternFlowApp();
});
