/* Additional Patterns for PatternFlow - Highly Customizable Version */

const AdditionalPatterns = {

    // 7. NEON RINGS
    neonRings: {
        name: 'Neon Rings',
        description: 'Pulsing concentric circles',
        defaults: {
            ringCount: 12,
            pulseSpeed: 1,
            thickness: 3,
            jitter: 0,
            rotationSpeed: 0.5,
            glowIntensity: 15,
            showInner: false,
            colorMode: 0
        },
        controls: [
            { group: 'Rings', icon: 'layers' },
            { name: 'ringCount', label: 'Layer Count', type: 'slider', min: 3, max: 30, step: 1 },
            { name: 'thickness', label: 'Ring Weight', type: 'slider', min: 0.5, max: 15, step: 0.5 },
            { name: 'jitter', label: 'Vibration', type: 'slider', min: 0, max: 10, step: 0.5 },
            { group: 'Animation', icon: 'play' },
            { name: 'pulseSpeed', label: 'Pulse Frequency', type: 'slider', min: 0, max: 5, step: 0.1 },
            { name: 'rotationSpeed', label: 'Orbit Speed', type: 'slider', min: 0, max: 4, step: 0.1 },
            { group: 'Visuals', icon: 'sparkles' },
            { name: 'glowIntensity', label: 'Bloom Power', type: 'slider', min: 0, max: 40, step: 1 },
            { name: 'showInner', label: 'Solid Core', type: 'toggle' },
            { group: 'Style', icon: 'palette' },
            {
                name: 'colorMode', label: 'Neon Theme', type: 'palette', options: [
                    ['#a855f7', '#ec4899', '#06b6d4'],
                    ['#22c55e', '#eab308', '#ef4444'],
                    ['#3b82f6', '#8b5cf6', '#ec4899'],
                    ['#ffffff', '#a1a1aa', '#71717a']
                ]
            }
        ],
        setup: function (p, params, container) {
            const size = Math.min(container.clientWidth - 48, container.clientHeight - 48);
            this.time = 0;
            this.rot = 0;
            return p.createCanvas(size, size);
        },
        draw: function (p, params) {
            p.background(10, 10, 11);
            p.translate(p.width / 2, p.height / 2);

            this.time += params.pulseSpeed * 0.02;
            this.rot += params.rotationSpeed * 0.01;

            p.rotate(this.rot);
            const colors = this.getColors(p, params.colorMode);
            const maxR = p.width * 0.45;

            if (params.glowIntensity > 0) {
                p.drawingContext.shadowBlur = params.glowIntensity;
            } else {
                p.drawingContext.shadowBlur = 0;
            }

            for (let i = 0; i < params.ringCount; i++) {
                const rBase = (maxR / params.ringCount) * (i + 1);
                const pulse = p.sin(this.time + i * 0.3) * 0.2 + 0.8;
                const r = rBase * pulse;
                const c = colors[i % colors.length];

                p.drawingContext.shadowColor = c.toString();
                p.stroke(c);
                p.strokeWeight(params.thickness);

                if (params.showInner) {
                    p.fill(p.red(c), p.green(c), p.blue(c), 40);
                } else {
                    p.noFill();
                }

                if (params.jitter > 0) {
                    p.beginShape();
                    for (let a = 0; a < p.TWO_PI; a += 0.1) {
                        const j = p.noise(a, i, p.frameCount * 0.05) * params.jitter;
                        const x = p.cos(a) * (r + j);
                        const y = p.sin(a) * (r + j);
                        p.vertex(x, y);
                    }
                    p.endShape(p.CLOSE);
                } else {
                    p.ellipse(0, 0, r * 2, r * 2);
                }
            }
        },
        getColors: function (p, m) {
            const palettes = [
                [p.color(168, 85, 247), p.color(236, 72, 153), p.color(6, 182, 212)],
                [p.color(34, 197, 94), p.color(234, 179, 8), p.color(239, 68, 68)],
                [p.color(59, 130, 246), p.color(139, 92, 246), p.color(236, 72, 153)],
                [p.color(255, 255, 255), p.color(161, 161, 170), p.color(113, 113, 122)]
            ];
            return palettes[m] || palettes[0];
        }
    },

    // 8. MATRIX RAIN
    matrixRain: {
        name: 'Matrix Rain',
        description: 'Digital rain effect',
        defaults: {
            columnCount: 50,
            speed: 6,
            fontSize: 16,
            trailLength: 15,
            glitchiness: 0.1,
            fadeSpeed: 60,
            colorMode: 0
        },
        controls: [
            { group: 'Density', icon: 'sparkles' },
            { name: 'columnCount', label: 'Rain Density', type: 'slider', min: 20, max: 120, step: 5 },
            { name: 'fontSize', label: 'Symbol Size', type: 'slider', min: 8, max: 32, step: 2 },
            { name: 'trailLength', label: 'Tail Length', type: 'slider', min: 5, max: 40, step: 1 },
            { group: 'Behavior', icon: 'play' },
            { name: 'speed', label: 'Fall Speed', type: 'slider', min: 1, max: 20, step: 1 },
            { name: 'glitchiness', label: 'Glitch Rate', type: 'slider', min: 0, max: 1, step: 0.05 },
            { group: 'Style', icon: 'palette' },
            { name: 'fadeSpeed', label: 'Persistence', type: 'slider', min: 20, max: 100, step: 5 },
            {
                name: 'colorMode', label: 'Matrix Color', type: 'palette', options: [
                    ['#22c55e', '#4ade80', '#86efac'],
                    ['#06b6d4', '#22d3ee', '#67e8f9'],
                    ['#a855f7', '#c084fc', '#d8b4fe'],
                    ['#f97316', '#fb923c', '#fdba74']
                ]
            }
        ],
        setup: function (p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            this.columns = [];
            const colW = p.width / params.columnCount;
            for (let i = 0; i < params.columnCount; i++) {
                this.columns.push({
                    x: i * colW,
                    y: p.random(-p.height, 0),
                    speed: p.random(2, 6),
                    chars: []
                });
            }
            p.textFont('monospace');
            return canvas;
        },
        draw: function (p, params) {
            p.background(10, 10, 11, params.fadeSpeed);
            p.textSize(params.fontSize);
            const colors = this.getColors(p, params.colorMode);
            const colW = p.width / params.columnCount;

            // Maintain column count
            while (this.columns.length < params.columnCount) {
                this.columns.push({ x: this.columns.length * colW, y: p.random(-p.height, 0), speed: p.random(2, 6), chars: [] });
            }
            while (this.columns.length > params.columnCount) this.columns.pop();

            for (let col of this.columns) {
                // Occasional glitch
                if (p.random() < params.glitchiness * 0.1) {
                    col.speed = p.random(2, 8);
                }

                for (let j = 0; j < params.trailLength; j++) {
                    const y = col.y - j * params.fontSize;
                    if (y > 0 && y < p.height + 100) {
                        const alpha = p.map(j, 0, params.trailLength, 255, 0);
                        const c = colors[j % colors.length];
                        p.fill(p.red(c), p.green(c), p.blue(c), alpha);

                        // Head characters are brighter
                        if (j === 0) p.fill(255, 255, 255, 255);

                        const char = String.fromCharCode(0x30A0 + p.floor(p.random(96)));
                        p.text(char, col.x, y);
                    }
                }

                col.y += col.speed * params.speed * 0.2;
                if (col.y > p.height + (params.trailLength * params.fontSize)) {
                    col.y = p.random(-300, 0);
                    col.x = (this.columns.indexOf(col)) * colW;
                }
            }
        },
        getColors: function (p, m) {
            const palettes = [
                [p.color(34, 197, 94), p.color(74, 222, 128), p.color(134, 239, 172)],
                [p.color(6, 182, 212), p.color(34, 211, 238), p.color(103, 232, 249)],
                [p.color(168, 85, 247), p.color(192, 132, 252), p.color(216, 180, 254)],
                [p.color(249, 115, 22), p.color(251, 146, 60), p.color(253, 186, 116)]
            ];
            return palettes[m] || palettes[0];
        }
    },

    // 9. AURORA BOREALIS
    aurora: {
        name: 'Aurora Borealis',
        description: 'Northern lights simulation',
        defaults: {
            waveCount: 8,
            speed: 1,
            intensity: 0.8,
            noiseScale: 0.005,
            spread: 40,
            colorMode: 0
        },
        controls: [
            { group: 'Aurora', icon: 'waves' },
            { name: 'waveCount', label: 'Layer Depth', type: 'slider', min: 3, max: 15, step: 1 },
            { name: 'intensity', label: 'Luminescence', type: 'slider', min: 0.1, max: 1, step: 0.1 },
            { name: 'noiseScale', label: 'Turbulence', type: 'slider', min: 0.001, max: 0.02, step: 0.001 },
            { name: 'spread', label: 'Vertical Offset', type: 'slider', min: 10, max: 100, step: 5 },
            { group: 'Motion', icon: 'play' },
            { name: 'speed', label: 'Wind Speed', type: 'slider', min: 0.1, max: 4, step: 0.1 },
            { group: 'Style', icon: 'palette' },
            {
                name: 'colorMode', label: 'Atmosphere', type: 'palette', options: [
                    ['#22c55e', '#06b6d4', '#8b5cf6'],
                    ['#ec4899', '#a855f7', '#3b82f6'],
                    ['#eab308', '#22c55e', '#06b6d4'],
                    ['#f472b6', '#c084fc', '#60a5fa']
                ]
            }
        ],
        setup: function (p, params, container) {
            this.time = 0;
            return p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
        },
        draw: function (p, params) {
            p.background(5, 5, 12);
            this.time += params.speed * 0.005;
            const colors = this.getColors(p, params.colorMode);

            p.noStroke();
            for (let w = 0; w < params.waveCount; w++) {
                const layerT = w / params.waveCount;
                const baseY = p.height * 0.2 + w * params.spread;
                const c = colors[w % colors.length];

                // Dynamic opacity based on noise
                const masterAlpha = 40 * params.intensity * p.noise(w, this.time * 0.5);
                p.fill(p.red(c), p.green(c), p.blue(c), masterAlpha);

                p.beginShape();
                p.vertex(0, p.height);
                for (let x = 0; x <= p.width; x += 15) {
                    const nx = x * params.noiseScale;
                    const nt = this.time + w * 0.1;
                    const y = baseY + p.noise(nx, nt) * 250 - 100;
                    p.vertex(x, y);
                }
                p.vertex(p.width, p.height);
                p.endShape(p.CLOSE);
            }
        },
        getColors: function (p, m) {
            const palettes = [
                [p.color(34, 197, 94), p.color(6, 182, 212), p.color(139, 92, 246)],
                [p.color(236, 72, 153), p.color(168, 85, 247), p.color(59, 130, 246)],
                [p.color(234, 179, 8), p.color(34, 197, 94), p.color(6, 182, 212)],
                [p.color(244, 114, 182), p.color(192, 132, 252), p.color(96, 165, 250)]
            ];
            return palettes[m] || palettes[0];
        }
    },

    // 17. METABALLS
    metaballs: {
        name: 'Metaballs',
        description: 'Organic blob simulation',
        defaults: {
            ballCount: 8,
            threshold: 1.2,
            speed: 2,
            resolution: 4,
            glow: true,
            colorMode: 0
        },
        controls: [
            { group: 'Protoplasm', icon: 'sparkles' },
            { name: 'ballCount', label: 'Blob Count', type: 'slider', min: 2, max: 15, step: 1 },
            { name: 'threshold', label: 'Viscosity', type: 'slider', min: 0.5, max: 3, step: 0.1 },
            { group: 'Simulation', icon: 'play' },
            { name: 'speed', label: 'Flow Speed', type: 'slider', min: 0.1, max: 8, step: 0.1 },
            { name: 'resolution', label: 'Fidelity', type: 'slider', min: 2, max: 10, step: 1 },
            { name: 'glow', label: 'Enable Membrane', type: 'toggle' },
            { group: 'Style', icon: 'palette' },
            {
                name: 'colorMode', label: 'Bio Palette', type: 'palette', options: [
                    ['#a855f7', '#3b82f6'],
                    ['#22c55e', '#06b6d4'],
                    ['#ef4444', '#f97316'],
                    ['#ec4899', '#fca5a5']
                ]
            }
        ],
        setup: function (p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            this.balls = [];
            for (let i = 0; i < params.ballCount; i++) {
                this.balls.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-2, 2),
                    vy: p.random(-2, 2),
                    r: p.random(60, 120)
                });
            }
            p.pixelDensity(1);
            return canvas;
        },
        draw: function (p, params) {
            p.background(10, 10, 11);

            // Dynamics
            while (this.balls.length < params.ballCount) {
                this.balls.push({ x: p.random(p.width), y: p.random(p.height), vx: p.random(-2, 2), vy: p.random(-2, 2), r: p.random(60, 120) });
            }
            while (this.balls.length > params.ballCount) this.balls.pop();

            for (let ball of this.balls) {
                ball.x += ball.vx * params.speed * 0.4;
                ball.y += ball.vy * params.speed * 0.4;
                if (ball.x < 0 || ball.x > p.width) ball.vx *= -1;
                if (ball.y < 0 || ball.y > p.height) ball.vy *= -1;
            }

            const colors = this.getColors(p, params.colorMode);
            const res = params.resolution;

            p.noStroke();
            for (let x = 0; x < p.width; x += res) {
                for (let y = 0; y < p.height; y += res) {
                    let sum = 0;
                    for (let ball of this.balls) {
                        const d = p.dist(x, y, ball.x, ball.y);
                        sum += (ball.r * ball.r) / (d * d);
                    }

                    if (sum > params.threshold) {
                        const alpha = p.constrain(p.map(sum, params.threshold, params.threshold * 2, 100, 255), 0, 255);
                        p.fill(p.red(colors[0]), p.green(colors[0]), p.blue(colors[0]), alpha);
                        p.rect(x, y, res, res);

                        if (params.glow && sum < params.threshold + 0.2) {
                            p.fill(255, 255, 255, 150);
                            p.rect(x, y, res, res);
                        }
                    }
                }
            }
        },
        getColors: function (p, m) {
            const palettes = [
                [p.color(168, 85, 247), p.color(59, 130, 246)],
                [p.color(34, 197, 94), p.color(6, 182, 212)],
                [p.color(239, 68, 68), p.color(249, 115, 22)],
                [p.color(236, 72, 153), p.color(252, 165, 165)]
            ];
            return palettes[m] || palettes[0];
        }
    },

    // 18. CIRCUIT BOARD
    circuitBoard: {
        name: 'Circuit Board',
        description: 'Digital circuit patterns',
        defaults: {
            gridSize: 30,
            traceSpeed: 4,
            density: 0.4,
            glow: true,
            showComponents: true,
            colorMode: 0
        },
        controls: [
            { group: 'Hardware', icon: 'link' },
            { name: 'gridSize', label: 'Grid Scale', type: 'slider', min: 10, max: 60, step: 5 },
            { name: 'density', label: 'Node Density', type: 'slider', min: 0.1, max: 0.8, step: 0.1 },
            { name: 'showComponents', label: 'Render Nodes', type: 'toggle' },
            { group: 'Current', icon: 'play' },
            { name: 'traceSpeed', label: 'Signal Velocity', type: 'slider', min: 1, max: 15, step: 1 },
            { name: 'glow', label: 'Energy Surge', type: 'toggle' },
            { group: 'Style', icon: 'palette' },
            {
                name: 'colorMode', label: 'Circuit Color', type: 'palette', options: [
                    ['#22c55e', '#4ade80'],
                    ['#06b6d4', '#22d3ee'],
                    ['#a855f7', '#c084fc'],
                    ['#f97316', '#fb923c']
                ]
            }
        ],
        setup: function (p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            this.traces = [];
            this.nodes = [];
            this.initNodes(p, params);
            return canvas;
        },
        initNodes: function (p, params) {
            this.nodes = [];
            const cols = Math.floor(p.width / params.gridSize);
            const rows = Math.floor(p.height / params.gridSize);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (p.random() < params.density) {
                        this.nodes.push({
                            x: i * params.gridSize + params.gridSize / 2,
                            y: j * params.gridSize + params.gridSize / 2,
                            active: false
                        });
                    }
                }
            }
        },
        draw: function (p, params) {
            p.background(5, 8, 5);

            if (this.nodes.length === 0 || p.frameCount % 100 === 0) {
                // this.initNodes(p, params); // Too disruptive, let's just spawn traces
            }

            const colors = this.getColors(p, params.colorMode);

            // Randomly spawn new signals
            if (p.random() < 0.1 && this.nodes.length > 1) {
                const start = p.random(this.nodes);
                const end = p.random(this.nodes);
                if (p.dist(start.x, start.y, end.x, end.y) < params.gridSize * 10) {
                    this.traces.push({
                        x1: start.x, y1: start.y,
                        x2: end.x, y2: end.y,
                        progress: 0,
                        color: colors[p.floor(p.random(colors.length))]
                    });
                }
            }

            for (let i = this.traces.length - 1; i >= 0; i--) {
                const t = this.traces[i];
                t.progress += params.traceSpeed * 0.005;

                if (params.glow) {
                    p.drawingContext.shadowBlur = 10;
                    p.drawingContext.shadowColor = t.color.toString();
                } else {
                    p.drawingContext.shadowBlur = 0;
                }

                p.stroke(t.color);
                p.strokeWeight(2);
                p.noFill();

                const midX = (t.x1 + t.x2) / 2;
                if (t.progress < 0.5) {
                    const lx = p.lerp(t.x1, midX, t.progress * 2);
                    p.line(t.x1, t.y1, lx, t.y1);
                } else {
                    p.line(t.x1, t.y1, midX, t.y1);
                    const ly = p.lerp(t.y1, t.y2, (t.progress - 0.5) * 2);
                    const lx = p.lerp(midX, t.x2, (t.progress - 0.5) * 2);
                    p.line(midX, t.y1, midX, ly);
                    p.line(midX, ly, lx, ly);
                }

                if (t.progress >= 1) this.traces.splice(i, 1);
            }

            if (params.showComponents) {
                p.drawingContext.shadowBlur = 0;
                for (let node of this.nodes) {
                    p.fill(colors[0]);
                    p.noStroke();
                    p.rect(node.x - 3, node.y - 3, 6, 6);
                }
            }
        },
        getColors: function (p, m) {
            const palettes = [
                [p.color(34, 197, 94), p.color(74, 222, 128)],
                [p.color(6, 182, 212), p.color(34, 211, 238)],
                [p.color(168, 85, 247), p.color(192, 132, 252)],
                [p.color(249, 115, 22), p.color(251, 146, 60)]
            ];
            return palettes[m] || palettes[0];
        }
    }
};

// Merge additional patterns into main Patterns object
Object.assign(Patterns, AdditionalPatterns);
