/* ========================================
   PatternFlow - Pattern Definitions
   6 Unique p5.js Generative Art Patterns
   ======================================== */

const Patterns = {

    // ========================================
    // 1. FLOW FIELD (Perlin Noise)
    // ========================================
    flowField: {
        name: 'Flow Field',
        description: 'Perlin noise particles',
        thumbnail: { width: 400, height: 300 },

        defaults: {
            particleCount: 1200,
            speed: 2,
            noiseScale: 0.005,
            noiseDetail: 4,
            noiseFalloff: 0.5,
            strokeWeight: 1.5,
            particleOpacity: 150,
            fadeAmount: 12,
            colorMode: 0,
            showTrails: true,
            zSpeed: 0.002,
        },

        controls: [
            { group: 'Particles', icon: 'sparkles' },
            { name: 'particleCount', label: 'Density', type: 'slider', min: 100, max: 4000, step: 100 },
            { name: 'speed', label: 'Movement Speed', type: 'slider', min: 0.2, max: 10, step: 0.2 },
            { name: 'particleOpacity', label: 'Particle Opacity', type: 'slider', min: 10, max: 255, step: 5 },
            { group: 'Noise Engine', icon: 'waves' },
            { name: 'noiseScale', label: 'Noise Scale', type: 'slider', min: 0.001, max: 0.05, step: 0.001 },
            { name: 'noiseDetail', label: 'Octaves', type: 'slider', min: 1, max: 8, step: 1 },
            { name: 'noiseFalloff', label: 'Falloff', type: 'slider', min: 0.1, max: 0.9, step: 0.05 },
            { name: 'zSpeed', label: 'Field Evolution', type: 'slider', min: 0, max: 0.02, step: 0.001 },
            { group: 'Visual Style', icon: 'palette' },
            { name: 'strokeWeight', label: 'Line Thickness', type: 'slider', min: 0.5, max: 8, step: 0.5 },
            { name: 'fadeAmount', label: 'Trail Persistence', type: 'slider', min: 1, max: 80, step: 1 },
            {
                name: 'colorMode', label: 'Color Palette', type: 'palette', options: [
                    ['#a855f7', '#3b82f6', '#06b6d4'],
                    ['#ef4444', '#f97316', '#eab308'],
                    ['#0ea5e9', '#06b6d4', '#14b8a6'],
                    ['#22c55e', '#84cc16', '#eab308']
                ]
            },
            { name: 'showTrails', label: 'Enable Trails', type: 'toggle' },
        ],

        setup: function (p, params, container) {
            // Note: If p is an offscreen graphic (for export), createCanvas might not be needed or behaves differently
            // We check if it's the main canvas or offscreen
            let canvas;
            if (p.createCanvas) {
                // Main p5 instance uses createCanvas
                // If it's the main app instance, we use the container dimensions
                // If it's the offscreen export instance, it has already been set up with createCanvas
                // But for safety, we only call createCanvas if width is 0 or we explicitly need to (screen mode)
                if (p.width === 0 || (container && container.clientWidth)) {
                    // We prefer to resize if it already exists, or create new
                    // But for export we passed a headless 'p' which already ran createCanvas
                    if (container && container.clientWidth) {
                        canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
                    }
                }
            }

            this.particles = [];
            this.zOff = 0;
            this.colors = this.getColors(p, params.colorMode);

            for (let i = 0; i < params.particleCount; i++) {
                this.particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    color: p.random(this.colors)
                });
            }

            p.background(10, 10, 11);
            return canvas;
        },

        draw: function (p, params) {
            if (params.showTrails) {
                p.fill(10, 10, 11, params.fadeAmount);
                p.noStroke();
                p.rect(0, 0, p.width, p.height);
            } else {
                p.background(10, 10, 11);
            }

            // Noise settings
            p.noiseDetail(params.noiseDetail, params.noiseFalloff);
            this.zOff += params.zSpeed;

            // Update colors if palette changed
            this.colors = this.getColors(p, params.colorMode);

            // Adjust particle count
            while (this.particles.length < params.particleCount) {
                this.particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    color: p.random(this.colors)
                });
            }
            while (this.particles.length > params.particleCount) {
                this.particles.pop();
            }

            p.strokeWeight(params.strokeWeight);

            for (let particle of this.particles) {
                let angle = p.noise(particle.x * params.noiseScale, particle.y * params.noiseScale, this.zOff) * p.TWO_PI * 4;
                let vx = p.cos(angle) * params.speed;
                let vy = p.sin(angle) * params.speed;

                let c = p.color(particle.color);
                p.stroke(p.red(c), p.green(c), p.blue(c), params.particleOpacity);
                p.point(particle.x, particle.y);

                particle.x += vx;
                particle.y += vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
            }
        },


        getColors: function (p, mode) {
            const palettes = [
                [p.color(168, 85, 247), p.color(59, 130, 246), p.color(6, 182, 212)],
                [p.color(239, 68, 68), p.color(249, 115, 22), p.color(234, 179, 8)],
                [p.color(14, 165, 233), p.color(6, 182, 212), p.color(20, 184, 166)],
                [p.color(34, 197, 94), p.color(132, 204, 22), p.color(234, 179, 8)]
            ];
            return palettes[mode] || palettes[0];
        },

        reset: function (p, params) {
            this.particles = [];
            for (let i = 0; i < params.particleCount; i++) {
                this.particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    color: p.random(this.getColors(p, params.colorMode))
                });
            }
            p.background(10, 10, 11);
        },
        // ... (getCode remains the same)

        // ========================================
        // 2. GEOMETRIC MANDALA
        // ========================================
        // ...
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth) {
                const size = Math.min(container.clientWidth - 48, container.clientHeight - 48);
                canvas = p.createCanvas(size, size);
            }
            this.rotation = 0;
            p.angleMode(p.RADIANS);
            return canvas;
        },
        // ... (rest of mandala draw is fine as it uses p.width/height)

        // ========================================
        // 3. RECURSIVE TREE
        // ========================================
        // ...
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            p.angleMode(p.DEGREES);
            return canvas;
        },
        // ... (rest of recursive tree draw is fine)

        // ========================================
        // 4. PARTICLE SYSTEM
        // ========================================
        // ...
        setup: function (p, params, container) {
            let canvas;
            if (container && container.clientWidth) {
                canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            }
            this.particles = [];
            this.colors = this.getColors(p, params.colorMode);

            // Re-initialize for new dimensions if we're in export mode
            // For export mode, p.width/height are already set
            for (let i = 0; i < params.particleCount; i++) {
                this.particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-1, 1) * params.speed,
                    vy: p.random(-1, 1) * params.speed,
                    color: p.random(this.colors)
                });
            }

            return canvas;
        },

        draw: function (p, params) {
            p.background(10, 10, 11);

            if (params.bloom) {
                p.drawingContext.shadowBlur = 10;
                p.drawingContext.shadowColor = 'white';
            } else {
                p.drawingContext.shadowBlur = 0;
            }

            this.colors = this.getColors(p, params.colorMode);

            // Adjust particle count
            while (this.particles.length < params.particleCount) {
                this.particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-1, 1) * params.speed,
                    vy: p.random(-1, 1) * params.speed,
                    color: p.random(this.colors)
                });
            }
            while (this.particles.length > params.particleCount) {
                this.particles.pop();
            }

            // Draw connections
            if (params.showLinks) {
                p.strokeWeight(0.6);
                for (let i = 0; i < this.particles.length; i++) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        const d = p.dist(this.particles[i].x, this.particles[i].y,
                            this.particles[j].x, this.particles[j].y);

                        if (d < params.connectionDistance) {
                            const alpha = p.map(d, 0, params.connectionDistance, 180, 0);
                            const c1 = p.color(this.particles[i].color);
                            p.stroke(p.red(c1), p.green(c1), p.blue(c1), alpha);
                            p.line(this.particles[i].x, this.particles[i].y,
                                this.particles[j].x, this.particles[j].y);
                        }
                    }
                }
            }

            // Update and draw particles
            for (let particle of this.particles) {
                // Mouse interaction
                if (p.mouseX > 0 && p.mouseY > 0) {
                    const dx = p.mouseX - particle.x;
                    const dy = p.mouseY - particle.y;
                    const d = p.sqrt(dx * dx + dy * dy);

                    if (d < 200) {
                        const force = p.map(d, 0, 200, 0.8, 0) * params.mouseForce;
                        particle.vx += (dx / d) * force;
                        particle.vy += (dy / d) * force;
                    }
                }

                // Gravity
                particle.vy += params.gravity;

                // Apply velocity with friction
                particle.vx *= params.friction;
                particle.vy *= params.friction;

                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off edges
                if (particle.x < 0 || particle.x > p.width) {
                    particle.vx *= -0.8;
                    particle.x = p.constrain(particle.x, 0, p.width);
                }
                if (particle.y < 0 || particle.y > p.height) {
                    particle.vy *= -0.8;
                    particle.y = p.constrain(particle.y, 0, p.height);
                }

                // Draw particle
                p.noStroke();
                p.fill(particle.color);
                p.ellipse(particle.x, particle.y, params.particleSize, params.particleSize);
            }
        },

        getColors: function (p, mode) {
            const palettes = [
                [p.color(168, 85, 247), p.color(59, 130, 246), p.color(6, 182, 212)],
                [p.color(239, 68, 68), p.color(249, 115, 22), p.color(251, 191, 36)],
                [p.color(16, 185, 129), p.color(6, 182, 212), p.color(59, 130, 246)],
                [p.color(236, 72, 153), p.color(244, 114, 182), p.color(252, 165, 165)]
            ];
            return palettes[mode] || palettes[0];
        },

        reset: function (p, params) {
            this.particles = [];
            for (let i = 0; i < params.particleCount; i++) {
                this.particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-1, 1) * params.speed,
                    vy: p.random(-1, 1) * params.speed,
                    color: p.random(this.getColors(p, params.colorMode))
                });
            }
        },

        getCode: function (params) {
            return `// Particle System
// Generated by PatternFlow

let particles = [];
const PARTICLE_COUNT = ${params.particleCount};
const PARTICLE_SIZE = ${params.particleSize};
const CONNECTION_DISTANCE = ${params.connectionDistance};
const SPEED = ${params.speed};
const MOUSE_INTERACTION = ${params.mouseInteraction};

const COLORS = [
    ${this.getColors({ color: (r, g, b) => `[${r}, ${g}, ${b}]` }, params.colorMode).join(',\n    ')}
];

function setup() {
    createCanvas(800, 600);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: random(-1, 1) * SPEED,
            vy: random(-1, 1) * SPEED,
            color: random(COLORS)
        });
    }
}

function draw() {
    background(10, 10, 11);
    
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const d = dist(particles[i].x, particles[i].y, 
                          particles[j].x, particles[j].y);
            
            if (d < CONNECTION_DISTANCE) {
                const alpha = map(d, 0, CONNECTION_DISTANCE, 150, 0);
                stroke(100, 100, 120, alpha);
                strokeWeight(0.5);
                line(particles[i].x, particles[i].y, 
                     particles[j].x, particles[j].y);
            }
        }
    }
    
    // Update and draw particles
    for (let particle of particles) {
        if (MOUSE_INTERACTION && mouseX > 0 && mouseY > 0) {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const d = sqrt(dx * dx + dy * dy);
            
            if (d < 150) {
                const force = map(d, 0, 150, 0.5, 0);
                particle.vx += (dx / d) * force;
                particle.vy += (dy / d) * force;
            }
        }
        
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        const speed = sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > SPEED * 2) {
            particle.vx = (particle.vx / speed) * SPEED * 2;
            particle.vy = (particle.vy / speed) * SPEED * 2;
        }
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        particle.x = constrain(particle.x, 0, width);
        particle.y = constrain(particle.y, 0, height);
        
        noStroke();
        fill(particle.color[0], particle.color[1], particle.color[2]);
        ellipse(particle.x, particle.y, PARTICLE_SIZE, PARTICLE_SIZE);
    }
}`;
        }
    },

    // ========================================
    // 5. WAVE INTERFERENCE
    // ========================================
    waveInterference: {
        name: 'Wave Interference',
        description: 'Mesmerizing wave patterns',
        thumbnail: { width: 400, height: 300 },

        defaults: {
            waveCount: 5,
            amplitude: 80,
            frequency: 0.02,
            speed: 2,
            resolution: 6,
            strokeWeight: 2,
            fillWaves: false,
            phaseShift: 0.5,
            colorMode: 0,
        },

        controls: [
            { group: 'Waves', icon: 'waves' },
            { name: 'waveCount', label: 'Layer Count', type: 'slider', min: 1, max: 15, step: 1 },
            { name: 'amplitude', label: 'Vertical Swing', type: 'slider', min: 10, max: 200, step: 5 },
            { name: 'frequency', label: 'Wave Tightness', type: 'slider', min: 0.005, max: 0.1, step: 0.005 },
            { group: 'Dynamics', icon: 'play' },
            { name: 'speed', label: 'Travel Speed', type: 'slider', min: 0.1, max: 6, step: 0.1 },
            { name: 'phaseShift', label: 'Offset Sync', type: 'slider', min: 0, max: 2, step: 0.1 },
            { name: 'resolution', label: 'Smoothness', type: 'slider', min: 2, max: 30, step: 2 },
            { group: 'Appearance', icon: 'palette' },
            { name: 'fillWaves', label: 'Fill Volume', type: 'toggle' },
            { name: 'strokeWeight', label: 'Line Border', type: 'slider', min: 0.5, max: 10, step: 0.5 },
            {
                name: 'colorMode', label: 'Wave Theme', type: 'palette', options: [
                    ['#06b6d4', '#3b82f6', '#8b5cf6'],
                    ['#f97316', '#ef4444', '#ec4899'],
                    ['#22c55e', '#06b6d4', '#3b82f6'],
                    ['#fbbf24', '#f472b6', '#a855f7']
                ]
            },
        ],

        setup: function (p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            this.time = 0;
            return canvas;
        },

        draw: function (p, params) {
            p.background(10, 10, 11);

            const colors = this.getColors(p, params.colorMode);
            this.time += params.speed * 0.01;

            p.strokeWeight(params.strokeWeight);

            for (let wave = 0; wave < params.waveCount; wave++) {
                const waveOffset = (p.height / (params.waveCount + 1)) * (wave + 1);
                const phaseOffset = wave * p.PI * params.phaseShift;
                const color = colors[wave % colors.length];

                if (params.fillWaves) {
                    p.fill(p.red(color), p.green(color), p.blue(color), 40);
                    p.noStroke();
                } else {
                    p.noFill();
                    p.stroke(color);
                }

                p.beginShape();
                if (params.fillWaves) p.vertex(0, p.height);

                for (let x = 0; x <= p.width; x += params.resolution) {
                    let y = waveOffset;
                    y += p.sin(x * params.frequency + this.time + phaseOffset) * params.amplitude;
                    y += p.sin(x * params.frequency * 2 + this.time * 1.3) * (params.amplitude * 0.2); // Adding harmonics
                    p.curveVertex(x, y);
                }

                if (params.fillWaves) {
                    p.vertex(p.width, p.height);
                    p.endShape(p.CLOSE);
                } else {
                    p.endShape();
                }
            }
        },

        getColors: function (p, mode) {
            const palettes = [
                [p.color(6, 182, 212), p.color(59, 130, 246), p.color(139, 92, 246)],
                [p.color(249, 115, 22), p.color(239, 68, 68), p.color(236, 72, 153)],
                [p.color(34, 197, 94), p.color(6, 182, 212), p.color(59, 130, 246)],
                [p.color(251, 191, 36), p.color(244, 114, 182), p.color(168, 85, 247)]
            ];
            return palettes[mode] || palettes[0];
        },

        reset: function (p, params) {
            this.time = 0;
        },

        getCode: function (params) {
            return `// Wave Interference
// Generated by PatternFlow

let time = 0;
const WAVE_COUNT = ${params.waveCount};
const AMPLITUDE = ${params.amplitude};
const FREQUENCY = ${params.frequency};
const SPEED = ${params.speed};
const RESOLUTION = ${params.resolution};
const STROKE_WEIGHT = ${params.strokeWeight};

const COLORS = [
    ${this.getColors({ color: (r, g, b) => `[${r}, ${g}, ${b}]` }, params.colorMode).join(',\n    ')}
];

function setup() {
    createCanvas(800, 600);
}

function draw() {
    background(10, 10, 11);
    
    time += SPEED * 0.01;
    
    noFill();
    strokeWeight(STROKE_WEIGHT);
    
    for (let wave = 0; wave < WAVE_COUNT; wave++) {
        const waveOffset = (height / (WAVE_COUNT + 1)) * (wave + 1);
        const phaseOffset = wave * PI * 0.5;
        const c = COLORS[wave % COLORS.length];
        
        stroke(c[0], c[1], c[2]);
        beginShape();
        
        for (let x = 0; x <= width; x += RESOLUTION) {
            let y = waveOffset;
            y += sin(x * FREQUENCY + time + phaseOffset) * AMPLITUDE;
            y += sin(x * FREQUENCY * 2 + time * 1.5 + phaseOffset) * (AMPLITUDE * 0.3);
            y += sin(x * FREQUENCY * 0.5 + time * 0.7 + phaseOffset) * (AMPLITUDE * 0.5);
            curveVertex(x, y);
        }
        
        endShape();
    }
}`;
        }
    },

    // ========================================
    // 6. SPIRAL GALAXY
    // ========================================
    spiralGalaxy: {
        name: 'Spiral Galaxy',
        description: 'Cosmic spiral formation',
        thumbnail: { width: 400, height: 300 },

        defaults: {
            arms: 4,
            starCount: 1000,
            rotationSpeed: 0.3,
            spiralTightness: 0.15,
            starSize: 2.5,
            spread: 0.4,
            nebulaIntensity: 0.2,
            twinkle: true,
            colorMode: 0,
        },

        controls: [
            { group: 'Cosmic Structure', icon: 'star' },
            { name: 'arms', label: 'Spiral Arms', type: 'slider', min: 2, max: 12, step: 1 },
            { name: 'starCount', label: 'Star Population', type: 'slider', min: 200, max: 3000, step: 100 },
            { name: 'spiralTightness', label: 'Vortex Power', type: 'slider', min: 0.02, max: 0.5, step: 0.01 },
            { name: 'spread', label: 'Arm Dispersion', type: 'slider', min: 0.1, max: 1.0, step: 0.05 },
            { group: 'Atmosphere', icon: 'sparkles' },
            { name: 'nebulaIntensity', label: 'Nebula Glow', type: 'slider', min: 0, max: 1, step: 0.1 },
            { name: 'twinkle', label: 'Star Flicker', type: 'toggle' },
            { group: 'Motion', icon: 'rotate' },
            { name: 'rotationSpeed', label: 'Orbital Speed', type: 'slider', min: 0, max: 2, step: 0.05 },
            { group: 'Style', icon: 'palette' },
            { name: 'starSize', label: 'Luminosity Size', type: 'slider', min: 0.5, max: 8, step: 0.5 },
            {
                name: 'colorMode', label: 'Galaxy Type', type: 'palette', options: [
                    ['#fef3c7', '#fbbf24', '#a855f7'],
                    ['#bfdbfe', '#60a5fa', '#ec4899'],
                    ['#d1fae5', '#34d399', '#06b6d4'],
                    ['#fecdd3', '#fb7185', '#f472b6']
                ]
            },
        ],

        setup: function (p, params, container) {
            const size = Math.min(container.clientWidth - 48, container.clientHeight - 48);
            const canvas = p.createCanvas(size, size);
            this.rotation = 0;
            this.stars = this.generateStars(p, params);
            return canvas;
        },

        generateStars: function (p, params) {
            const stars = [];
            const maxRadius = p.width * 0.45;
            for (let i = 0; i < params.starCount; i++) {
                const arm = Math.floor(p.random(params.arms));
                const armAngle = (p.TWO_PI / params.arms) * arm;
                const t = p.random();
                const radius = maxRadius * p.pow(t, 0.5);
                const spiralAngle = radius * params.spiralTightness;
                const spread = params.spread * radius * p.randomGaussian(0, 0.3);
                const angleSpread = spread / (radius + 1);
                const angle = armAngle + spiralAngle + angleSpread;
                const brightness = p.constrain(p.map(radius, 0, maxRadius, 255, 80) + p.random(-30, 30), 50, 255);
                stars.push({ radius, baseAngle: angle, brightness, size: p.random(0.5, 1.5) });
            }
            return stars;
        },

        draw: function (p, params) {
            p.background(5, 5, 8);
            p.translate(p.width / 2, p.height / 2);

            this.rotation += params.rotationSpeed * 0.005;

            if (this.stars.length !== params.starCount) {
                this.stars = this.generateStars(p, params);
            }

            const colors = this.getColors(p, params.colorMode);

            // Nebula effect
            if (params.nebulaIntensity > 0) {
                p.noStroke();
                for (let i = 0; i < 3; i++) {
                    const c = colors[i % colors.length];
                    p.fill(p.red(c), p.green(c), p.blue(c), 15 * params.nebulaIntensity);
                    const nr = p.width * (0.6 - i * 0.1);
                    p.ellipse(0, 0, nr + p.sin(p.frameCount * 0.01) * 20, nr + p.cos(p.frameCount * 0.01) * 20);
                }
            }

            p.noStroke();
            for (let star of this.stars) {
                const angle = star.baseAngle + this.rotation;
                const x = p.cos(angle) * star.radius;
                const y = p.sin(angle) * star.radius;

                const colorT = p.map(star.radius, 0, p.width * 0.45, 0, 1.5);
                let c;
                if (colorT < 0.5) c = p.lerpColor(p.color(colors[0]), p.color(colors[1]), colorT * 2);
                else c = p.lerpColor(p.color(colors[1]), p.color(colors[2]), (colorT - 0.5) * 2);

                let b = star.brightness;
                if (params.twinkle) {
                    b *= (0.7 + p.noise(star.radius, p.frameCount * 0.1) * 0.3);
                }

                p.fill(p.red(c), p.green(c), p.blue(c), b);
                p.ellipse(x, y, params.starSize * star.size, params.starSize * star.size);
            }

            // Black hole core
            const coreColor = colors[0];
            p.fill(0);
            p.ellipse(0, 0, 15, 15);
            p.stroke(coreColor);
            p.strokeWeight(2);
            p.noFill();
            p.ellipse(0, 0, 18 + p.sin(p.frameCount * 0.1) * 2, 18 + p.sin(p.frameCount * 0.1) * 2);
        },

        getColors: function (p, mode) {
            const palettes = [
                [p.color(254, 243, 199), p.color(251, 191, 36), p.color(168, 85, 247)],
                [p.color(191, 219, 254), p.color(96, 165, 250), p.color(236, 72, 153)],
                [p.color(209, 250, 229), p.color(52, 211, 153), p.color(6, 182, 212)],
                [p.color(254, 205, 211), p.color(251, 113, 133), p.color(244, 114, 182)]
            ];
            return palettes[mode] || palettes[0];
        },

        reset: function (p, params) {
            this.rotation = 0;
            this.stars = this.generateStars(p, params);
        },

        getCode: function (params) {
            return `// Spiral Galaxy
// Generated by PatternFlow

let rotation = 0;
let stars = [];
const ARMS = ${params.arms};
const STAR_COUNT = ${params.starCount};
const ROTATION_SPEED = ${params.rotationSpeed};
const SPREAD = ${params.spread};
const SPIRAL_TIGHTNESS = ${params.spiralTightness};
const STAR_SIZE = ${params.starSize};

const COLORS = [
    ${this.getColors({ color: (r, g, b) => `[${r}, ${g}, ${b}]` }, params.colorMode).join(',\n    ')}
];

function setup() {
    createCanvas(600, 600);
    generateStars();
}

function generateStars() {
    const maxRadius = width * 0.45;
    
    for (let i = 0; i < STAR_COUNT; i++) {
        const arm = floor(random(ARMS));
        const armAngle = (TWO_PI / ARMS) * arm;
        
        const t = random();
        const radius = maxRadius * pow(t, 0.5);
        const spiralAngle = radius * SPIRAL_TIGHTNESS;
        const spread = SPREAD * radius * randomGaussian(0, 0.3);
        const angleSpread = spread / (radius + 1);
        const angle = armAngle + spiralAngle + angleSpread;
        const brightness = constrain(map(radius, 0, maxRadius, 255, 80) + random(-30, 30), 50, 255);
        
        stars.push({ radius, baseAngle: angle, brightness, size: random(0.5, 1.5) });
    }
    
    for (let i = 0; i < STAR_COUNT * 0.3; i++) {
        stars.push({
            radius: random() * maxRadius * 0.2,
            baseAngle: random(TWO_PI),
            brightness: random(150, 255),
            size: random(0.3, 1),
            isBulge: true
        });
    }
}

function draw() {
    background(5, 5, 8);
    translate(width / 2, height / 2);
    
    rotation += ROTATION_SPEED * 0.002;
    noStroke();
    
    for (let star of stars) {
        const angle = star.baseAngle + rotation * (star.isBulge ? 0.5 : 1);
        const x = cos(angle) * star.radius;
        const y = sin(angle) * star.radius;
        
        const colorT = map(star.radius, 0, width * 0.45, 0, 2);
        let c;
        if (colorT < 1) {
            c = lerpColor(color(COLORS[0]), color(COLORS[1]), colorT);
        } else {
            c = lerpColor(color(COLORS[1]), color(COLORS[2]), colorT - 1);
        }
        
        fill(red(c), green(c), blue(c), star.brightness);
        ellipse(x, y, STAR_SIZE * star.size, STAR_SIZE * star.size);
    }
}`;
        }
    }
};

// Export patterns
window.Patterns = Patterns;
