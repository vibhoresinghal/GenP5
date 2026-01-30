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
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                const size = Math.min(container.clientWidth - 48, container.clientHeight - 48);
                canvas = p.createCanvas(size, size);
            }
            this.time = 0;
            this.rot = 0;
            return canvas;
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
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
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
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            this.time = 0;
            return canvas;
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
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
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
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
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
    },

    // ========================================
    // DOT GRID (Interactive)
    // ========================================
    dotGrid: {
        name: 'Dot Grid',
        description: 'Interactive dot matrix with noise',
        defaults: {
            gridSize: 25,
            dotSize: 8,
            mouseRadius: 150,
            mouseForce: 1.5,
            noiseAmount: 0,
            noiseSpeed: 0.01,
            colorMode: 0
        },
        controls: [
            { group: 'Grid', icon: 'layers' },
            { name: 'gridSize', label: 'Grid Spacing', type: 'slider', min: 10, max: 60, step: 5 },
            { name: 'dotSize', label: 'Dot Size', type: 'slider', min: 2, max: 30, step: 1 },
            { group: 'Interaction', icon: 'sparkles' },
            { name: 'mouseRadius', label: 'Mouse Radius', type: 'slider', min: 50, max: 400, step: 10 },
            { name: 'mouseForce', label: 'Mouse Force', type: 'slider', min: 0, max: 3, step: 0.1 },
            { group: 'Noise', icon: 'waves' },
            { name: 'noiseAmount', label: 'Noise Distortion', type: 'slider', min: 0, max: 50, step: 1 },
            { name: 'noiseSpeed', label: 'Noise Animation', type: 'slider', min: 0, max: 0.05, step: 0.005 },
            { group: 'Style', icon: 'palette' },
            {
                name: 'colorMode', label: 'Color Theme', type: 'palette', options: [
                    ['#a855f7', '#3b82f6', '#06b6d4'],
                    ['#22c55e', '#84cc16', '#fbbf24'],
                    ['#ef4444', '#f97316', '#fbbf24'],
                    ['#ffffff', '#a1a1aa', '#52525b']
                ]
            }
        ],
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            this.time = 0;
            return canvas;
        },
        draw: function (p, params) {
            p.background(10, 10, 11);
            this.time += params.noiseSpeed;

            const colors = this.getColors(p, params.colorMode);
            p.noStroke();

            for (let x = params.gridSize; x < p.width; x += params.gridSize) {
                for (let y = params.gridSize; y < p.height; y += params.gridSize) {
                    let dx = 0, dy = 0;

                    // Mouse interaction
                    const dist = p.dist(p.mouseX, p.mouseY, x, y);
                    if (dist < params.mouseRadius && p.mouseX > 0 && p.mouseY > 0) {
                        const force = p.map(dist, 0, params.mouseRadius, params.mouseForce, 0);
                        const angle = p.atan2(y - p.mouseY, x - p.mouseX);
                        dx += p.cos(angle) * force * 20;
                        dy += p.sin(angle) * force * 20;
                    }

                    // Noise distortion
                    if (params.noiseAmount > 0) {
                        dx += (p.noise(x * 0.01, y * 0.01, this.time) - 0.5) * params.noiseAmount * 2;
                        dy += (p.noise(x * 0.01 + 100, y * 0.01, this.time) - 0.5) * params.noiseAmount * 2;
                    }

                    // Color based on position
                    const colorIndex = Math.floor((x + y) / params.gridSize) % colors.length;
                    p.fill(colors[colorIndex]);

                    // Size based on distance from mouse
                    let size = params.dotSize;
                    if (dist < params.mouseRadius && p.mouseX > 0) {
                        size *= p.map(dist, 0, params.mouseRadius, 1.5, 1);
                    }

                    p.ellipse(x + dx, y + dy, size, size);
                }
            }
        },
        getColors: function (p, mode) {
            const palettes = [
                [p.color(168, 85, 247), p.color(59, 130, 246), p.color(6, 182, 212)],
                [p.color(34, 197, 94), p.color(132, 204, 22), p.color(251, 191, 36)],
                [p.color(239, 68, 68), p.color(249, 115, 22), p.color(251, 191, 36)],
                [p.color(255), p.color(161, 161, 170), p.color(82, 82, 91)]
            ];
            return palettes[mode] || palettes[0];
        }
    },

    // ========================================
    // ASCII GENERATOR
    // ========================================
    asciiGenerator: {
        name: 'ASCII Art',
        description: 'Convert images to ASCII characters',
        defaults: {
            charSet: 0,
            fontSize: 10,
            contrast: 1,
            invert: false,
            colored: true,
            sourceImage: null
        },
        controls: [
            { group: 'Source', icon: 'layers' },
            { name: 'sourceImage', label: 'Upload Image', type: 'imageUpload' },
            { group: 'Character Set', icon: 'sparkles' },
            { name: 'charSet', label: 'Density Ramp', type: 'select', options: ['Standard', 'Simple', 'Blocks', 'Binary'] },
            { name: 'fontSize', label: 'Character Size', type: 'slider', min: 6, max: 20, step: 1 },
            { group: 'Adjustments', icon: 'palette' },
            { name: 'contrast', label: 'Contrast', type: 'slider', min: 0.5, max: 2, step: 0.1 },
            { name: 'invert', label: 'Invert', type: 'toggle' },
            { name: 'colored', label: 'Use Colors', type: 'toggle' }
        ],
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            this.img = null;
            this.charRamps = [
                '@%#*+=-:. ',
                '@#:. ',
                '█▓▒░ ',
                '10 '
            ];
            return canvas;
        },
        draw: function (p, params) {
            p.background(10, 10, 11);

            // Load image if provided
            if (params.sourceImage && !this.img) {
                p.loadImage(params.sourceImage, (loadedImg) => {
                    this.img = loadedImg;
                });
            }

            if (!this.img) {
                // Show placeholder text
                p.fill(100);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(16);
                p.text('Upload an image to generate ASCII art', p.width / 2, p.height / 2);
                return;
            }

            const charRamp = this.charRamps[params.charSet] || this.charRamps[0];
            const cellSize = params.fontSize;
            const cols = Math.floor(p.width / cellSize);
            const rows = Math.floor(p.height / cellSize);

            // Resize image to fit
            const img = this.img;
            img.resize(cols, rows);
            img.loadPixels();

            p.textSize(cellSize);
            p.textAlign(p.CENTER, p.CENTER);
            p.noStroke();

            for (let j = 0; j < rows; j++) {
                for (let i = 0; i < cols; i++) {
                    const idx = (i + j * cols) * 4;
                    let r = img.pixels[idx];
                    let g = img.pixels[idx + 1];
                    let b = img.pixels[idx + 2];

                    // Calculate brightness
                    let brightness = (r + g + b) / 3;
                    brightness = p.constrain(brightness * params.contrast, 0, 255);

                    if (params.invert) brightness = 255 - brightness;

                    // Map brightness to character
                    const charIndex = Math.floor(p.map(brightness, 0, 255, charRamp.length - 1, 0));
                    const char = charRamp[charIndex];

                    if (params.colored) {
                        p.fill(r, g, b);
                    } else {
                        p.fill(brightness);
                    }

                    p.text(char, i * cellSize + cellSize / 2, j * cellSize + cellSize / 2);
                }
            }
        },
        reset: function (p, params) {
            this.img = null;
        }
    },

    // ========================================
    // DITHER GENERATOR
    // ========================================
    ditherGenerator: {
        name: 'Dither Art',
        description: 'Apply dithering effects to images',
        defaults: {
            ditherType: 0,
            threshold: 128,
            pixelScale: 2,
            colorCount: 0,
            sourceImage: null
        },
        controls: [
            { group: 'Source', icon: 'layers' },
            { name: 'sourceImage', label: 'Upload Image', type: 'imageUpload' },
            { group: 'Dithering', icon: 'sparkles' },
            { name: 'ditherType', label: 'Algorithm', type: 'select', options: ['Floyd-Steinberg', 'Ordered 4x4', 'Atkinson', 'Threshold'] },
            { name: 'threshold', label: 'Threshold', type: 'slider', min: 0, max: 255, step: 5 },
            { name: 'pixelScale', label: 'Pixel Size', type: 'slider', min: 1, max: 8, step: 1 },
            { group: 'Color', icon: 'palette' },
            {
                name: 'colorCount', label: 'Palette', type: 'palette', options: [
                    ['#ffffff', '#000000'],
                    ['#22c55e', '#000000'],
                    ['#3b82f6', '#fbbf24'],
                    ['#ec4899', '#06b6d4', '#fbbf24', '#000000']
                ]
            }
        ],
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            this.img = null;
            this.processed = null;
            this.bayerMatrix = [
                [0, 8, 2, 10],
                [12, 4, 14, 6],
                [3, 11, 1, 9],
                [15, 7, 13, 5]
            ];
            return canvas;
        },
        draw: function (p, params) {
            p.background(10, 10, 11);

            if (params.sourceImage && !this.img) {
                p.loadImage(params.sourceImage, (loadedImg) => {
                    this.img = loadedImg;
                    this.processed = null;
                });
            }

            if (!this.img) {
                p.fill(100);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(16);
                p.text('Upload an image to apply dithering', p.width / 2, p.height / 2);
                return;
            }

            // Process image
            const scale = params.pixelScale;
            const w = Math.floor(p.width / scale);
            const h = Math.floor(p.height / scale);

            const img = this.img.get();
            img.resize(w, h);
            img.loadPixels();

            p.noStroke();

            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    const idx = (x + y * w) * 4;
                    let brightness = (img.pixels[idx] + img.pixels[idx + 1] + img.pixels[idx + 2]) / 3;

                    let output;
                    switch (params.ditherType) {
                        case 1: // Ordered
                            const bayerValue = this.bayerMatrix[y % 4][x % 4] * 16;
                            output = brightness > bayerValue ? 255 : 0;
                            break;
                        case 2: // Atkinson (simplified)
                            output = brightness > params.threshold ? 255 : 0;
                            break;
                        case 3: // Simple threshold
                            output = brightness > params.threshold ? 255 : 0;
                            break;
                        default: // Floyd-Steinberg (simplified visual)
                            output = brightness > params.threshold + (Math.random() - 0.5) * 50 ? 255 : 0;
                    }

                    const colorVal = output > 127 ? 255 : 0;
                    p.fill(colorVal);
                    p.rect(x * scale, y * scale, scale, scale);
                }
            }
        },
        reset: function (p, params) {
            this.img = null;
            this.processed = null;
        }
    },

    // ========================================
    // TOPOGRAPHY
    // ========================================
    topography: {
        name: 'Topography',
        description: 'Contour lines like a terrain map',
        defaults: {
            lineCount: 15,
            noiseScale: 0.008,
            lineWeight: 1.5,
            animate: true,
            speed: 0.005,
            colorMode: 0
        },
        controls: [
            { group: 'Terrain', icon: 'layers' },
            { name: 'lineCount', label: 'Contour Levels', type: 'slider', min: 5, max: 40, step: 1 },
            { name: 'noiseScale', label: 'Feature Scale', type: 'slider', min: 0.002, max: 0.02, step: 0.001 },
            { group: 'Appearance', icon: 'sparkles' },
            { name: 'lineWeight', label: 'Line Weight', type: 'slider', min: 0.5, max: 4, step: 0.25 },
            { group: 'Animation', icon: 'play' },
            { name: 'animate', label: 'Animate', type: 'toggle' },
            { name: 'speed', label: 'Speed', type: 'slider', min: 0, max: 0.02, step: 0.001 },
            { group: 'Style', icon: 'palette' },
            {
                name: 'colorMode', label: 'Color Theme', type: 'palette', options: [
                    ['#22c55e', '#16a34a', '#15803d'],
                    ['#f97316', '#ea580c', '#c2410c'],
                    ['#3b82f6', '#2563eb', '#1d4ed8'],
                    ['#a1a1aa', '#71717a', '#52525b']
                ]
            }
        ],
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            this.time = 0;
            return canvas;
        },
        draw: function (p, params) {
            p.background(10, 10, 11);

            if (params.animate) {
                this.time += params.speed;
            }

            const colors = this.getColors(p, params.colorMode);
            p.strokeWeight(params.lineWeight);
            p.noFill();

            const resolution = 4;
            const cols = Math.floor(p.width / resolution) + 1;
            const rows = Math.floor(p.height / resolution) + 1;

            // Generate noise field
            const field = [];
            for (let y = 0; y < rows; y++) {
                field[y] = [];
                for (let x = 0; x < cols; x++) {
                    field[y][x] = p.noise(x * params.noiseScale * resolution, y * params.noiseScale * resolution, this.time);
                }
            }

            // Draw contour lines using marching squares concept
            for (let level = 0; level < params.lineCount; level++) {
                const threshold = level / params.lineCount;
                const colorIndex = level % colors.length;
                p.stroke(colors[colorIndex]);

                for (let y = 0; y < rows - 1; y++) {
                    for (let x = 0; x < cols - 1; x++) {
                        const a = field[y][x];
                        const b = field[y][x + 1];
                        const c = field[y + 1][x + 1];
                        const d = field[y + 1][x];

                        const x1 = x * resolution;
                        const y1 = y * resolution;
                        const x2 = (x + 1) * resolution;
                        const y2 = (y + 1) * resolution;

                        // Simplified contour: draw line segment where threshold crosses
                        const crossings = [];
                        if ((a > threshold) !== (b > threshold)) {
                            crossings.push([p.lerp(x1, x2, (threshold - a) / (b - a)), y1]);
                        }
                        if ((b > threshold) !== (c > threshold)) {
                            crossings.push([x2, p.lerp(y1, y2, (threshold - b) / (c - b))]);
                        }
                        if ((c > threshold) !== (d > threshold)) {
                            crossings.push([p.lerp(x2, x1, (threshold - c) / (d - c)), y2]);
                        }
                        if ((d > threshold) !== (a > threshold)) {
                            crossings.push([x1, p.lerp(y2, y1, (threshold - d) / (a - d))]);
                        }

                        if (crossings.length >= 2) {
                            p.line(crossings[0][0], crossings[0][1], crossings[1][0], crossings[1][1]);
                        }
                    }
                }
            }
        },
        getColors: function (p, mode) {
            const palettes = [
                [p.color(34, 197, 94), p.color(22, 163, 74), p.color(21, 128, 61)],
                [p.color(249, 115, 22), p.color(234, 88, 12), p.color(194, 65, 12)],
                [p.color(59, 130, 246), p.color(37, 99, 235), p.color(29, 78, 216)],
                [p.color(161, 161, 170), p.color(113, 113, 122), p.color(82, 82, 91)]
            ];
            return palettes[mode] || palettes[0];
        }
    },

    // ========================================
    // TESSELLATIONS
    // ========================================
    tessellations: {
        name: 'Tessellations',
        description: 'Repeating geometric tile patterns',
        defaults: {
            shapeType: 0,
            tileSize: 50,
            rotation: 0,
            colorVariation: 0.3,
            strokeWeight: 1,
            fillOpacity: 200,
            colorMode: 0
        },
        controls: [
            { group: 'Shape', icon: 'layers' },
            { name: 'shapeType', label: 'Tile Shape', type: 'select', options: ['Hexagon', 'Triangle', 'Square', 'Diamond', 'Penrose'] },
            { name: 'tileSize', label: 'Tile Size', type: 'slider', min: 20, max: 120, step: 5 },
            { group: 'Transform', icon: 'rotate' },
            { name: 'rotation', label: 'Rotation', type: 'slider', min: 0, max: 360, step: 5 },
            { group: 'Appearance', icon: 'sparkles' },
            { name: 'colorVariation', label: 'Color Jitter', type: 'slider', min: 0, max: 1, step: 0.05 },
            { name: 'strokeWeight', label: 'Outline', type: 'slider', min: 0, max: 5, step: 0.5 },
            { name: 'fillOpacity', label: 'Fill Opacity', type: 'slider', min: 0, max: 255, step: 10 },
            { group: 'Style', icon: 'palette' },
            {
                name: 'colorMode', label: 'Palette', type: 'palette', options: [
                    ['#a855f7', '#ec4899', '#f472b6'],
                    ['#22c55e', '#84cc16', '#fbbf24'],
                    ['#3b82f6', '#06b6d4', '#22d3ee'],
                    ['#f97316', '#ef4444', '#fbbf24']
                ]
            }
        ],
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth && p.createCanvas) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            p.angleMode(p.DEGREES);
            return canvas;
        },
        draw: function (p, params) {
            p.background(10, 10, 11);

            p.push();
            p.translate(p.width / 2, p.height / 2);
            p.rotate(params.rotation);
            p.translate(-p.width / 2, -p.height / 2);

            const colors = this.getColors(p, params.colorMode);

            if (params.strokeWeight > 0) {
                p.stroke(255, 80);
                p.strokeWeight(params.strokeWeight);
            } else {
                p.noStroke();
            }

            const size = params.tileSize;

            switch (params.shapeType) {
                case 0: // Hexagon
                    this.drawHexGrid(p, size, colors, params);
                    break;
                case 1: // Triangle
                    this.drawTriangleGrid(p, size, colors, params);
                    break;
                case 2: // Square
                    this.drawSquareGrid(p, size, colors, params);
                    break;
                case 3: // Diamond
                    this.drawDiamondGrid(p, size, colors, params);
                    break;
                case 4: // Penrose-like
                    this.drawPenroseGrid(p, size, colors, params);
                    break;
            }

            p.pop();
        },
        drawHexGrid: function (p, size, colors, params) {
            const h = size * Math.sqrt(3);
            for (let row = -2; row < p.height / h + 2; row++) {
                for (let col = -2; col < p.width / (size * 1.5) + 2; col++) {
                    const x = col * size * 1.5 + size;
                    const y = row * h + (col % 2 === 0 ? 0 : h / 2) + h / 2;

                    const c = this.getVariedColor(p, colors, row + col, params.colorVariation);
                    p.fill(p.red(c), p.green(c), p.blue(c), params.fillOpacity);
                    this.hexagon(p, x, y, size);
                }
            }
        },
        drawTriangleGrid: function (p, size, colors, params) {
            const h = size * Math.sqrt(3) / 2;
            for (let row = -2; row < p.height / h + 2; row++) {
                for (let col = -2; col < p.width / (size / 2) + 2; col++) {
                    const x = col * size / 2;
                    const y = row * h;
                    const flip = (row + col) % 2 === 0;

                    const c = this.getVariedColor(p, colors, row + col, params.colorVariation);
                    p.fill(p.red(c), p.green(c), p.blue(c), params.fillOpacity);

                    p.beginShape();
                    if (flip) {
                        p.vertex(x, y);
                        p.vertex(x + size / 2, y + h);
                        p.vertex(x - size / 2, y + h);
                    } else {
                        p.vertex(x, y + h);
                        p.vertex(x + size / 2, y);
                        p.vertex(x - size / 2, y);
                    }
                    p.endShape(p.CLOSE);
                }
            }
        },
        drawSquareGrid: function (p, size, colors, params) {
            for (let y = 0; y < p.height + size; y += size) {
                for (let x = 0; x < p.width + size; x += size) {
                    const c = this.getVariedColor(p, colors, Math.floor(x / size) + Math.floor(y / size), params.colorVariation);
                    p.fill(p.red(c), p.green(c), p.blue(c), params.fillOpacity);
                    p.rect(x, y, size, size);
                }
            }
        },
        drawDiamondGrid: function (p, size, colors, params) {
            const halfSize = size / 2;
            for (let row = -2; row < p.height / halfSize + 2; row++) {
                for (let col = -2; col < p.width / size + 2; col++) {
                    const x = col * size + (row % 2 === 0 ? 0 : halfSize);
                    const y = row * halfSize;

                    const c = this.getVariedColor(p, colors, row + col, params.colorVariation);
                    p.fill(p.red(c), p.green(c), p.blue(c), params.fillOpacity);

                    p.beginShape();
                    p.vertex(x, y - halfSize);
                    p.vertex(x + halfSize, y);
                    p.vertex(x, y + halfSize);
                    p.vertex(x - halfSize, y);
                    p.endShape(p.CLOSE);
                }
            }
        },
        drawPenroseGrid: function (p, size, colors, params) {
            // Simplified Penrose-like pattern using kites
            for (let y = -size; y < p.height + size * 2; y += size * 0.8) {
                for (let x = -size; x < p.width + size * 2; x += size * 1.2) {
                    const jitterX = (p.noise(x * 0.01, y * 0.01) - 0.5) * size * 0.3;
                    const jitterY = (p.noise(x * 0.01 + 100, y * 0.01) - 0.5) * size * 0.3;

                    const c = this.getVariedColor(p, colors, Math.floor(x / size) + Math.floor(y / size), params.colorVariation);
                    p.fill(p.red(c), p.green(c), p.blue(c), params.fillOpacity);

                    p.push();
                    p.translate(x + jitterX, y + jitterY);
                    p.rotate(p.noise(x, y) * 72);
                    p.beginShape();
                    p.vertex(0, -size * 0.6);
                    p.vertex(size * 0.4, 0);
                    p.vertex(0, size * 0.3);
                    p.vertex(-size * 0.4, 0);
                    p.endShape(p.CLOSE);
                    p.pop();
                }
            }
        },
        hexagon: function (p, x, y, size) {
            p.beginShape();
            for (let i = 0; i < 6; i++) {
                const angle = p.radians(60 * i - 30);
                p.vertex(x + p.cos(angle) * size, y + p.sin(angle) * size);
            }
            p.endShape(p.CLOSE);
        },
        getVariedColor: function (p, colors, seed, variation) {
            const baseColor = colors[Math.abs(seed) % colors.length];
            if (variation === 0) return baseColor;

            const r = p.red(baseColor) + (p.noise(seed * 10) - 0.5) * variation * 100;
            const g = p.green(baseColor) + (p.noise(seed * 10 + 100) - 0.5) * variation * 100;
            const b = p.blue(baseColor) + (p.noise(seed * 10 + 200) - 0.5) * variation * 100;

            return p.color(p.constrain(r, 0, 255), p.constrain(g, 0, 255), p.constrain(b, 0, 255));
        },
        getColors: function (p, mode) {
            const palettes = [
                [p.color(168, 85, 247), p.color(236, 72, 153), p.color(244, 114, 182)],
                [p.color(34, 197, 94), p.color(132, 204, 22), p.color(251, 191, 36)],
                [p.color(59, 130, 246), p.color(6, 182, 212), p.color(34, 211, 238)],
                [p.color(249, 115, 22), p.color(239, 68, 68), p.color(251, 191, 36)]
            ];
            return palettes[mode] || palettes[0];
        }
    }
};

// Merge additional patterns into main Patterns object
Object.assign(Patterns, AdditionalPatterns);

