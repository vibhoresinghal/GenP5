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
            particleCount: 1000,
            speed: 2,
            noiseScale: 0.005,
            strokeWeight: 1,
            fadeAmount: 10,
            colorMode: 0, // 0: purple-cyan, 1: fire, 2: ocean, 3: forest
            showTrails: true,
        },
        
        controls: [
            { group: 'Particles', icon: 'sparkles' },
            { name: 'particleCount', label: 'Particle Count', type: 'slider', min: 100, max: 3000, step: 100 },
            { name: 'speed', label: 'Speed', type: 'slider', min: 0.5, max: 8, step: 0.5 },
            { name: 'noiseScale', label: 'Noise Scale', type: 'slider', min: 0.001, max: 0.02, step: 0.001 },
            { group: 'Appearance', icon: 'palette' },
            { name: 'strokeWeight', label: 'Stroke Weight', type: 'slider', min: 0.5, max: 4, step: 0.5 },
            { name: 'fadeAmount', label: 'Trail Length', type: 'slider', min: 1, max: 50, step: 1 },
            { name: 'colorMode', label: 'Color Palette', type: 'palette', options: [
                ['#a855f7', '#3b82f6', '#06b6d4'],
                ['#ef4444', '#f97316', '#eab308'],
                ['#0ea5e9', '#06b6d4', '#14b8a6'],
                ['#22c55e', '#84cc16', '#eab308']
            ]},
            { name: 'showTrails', label: 'Show Trails', type: 'toggle' },
        ],
        
        setup: function(p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            this.particles = [];
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
        
        draw: function(p, params) {
            if (params.showTrails) {
                p.fill(10, 10, 11, params.fadeAmount);
                p.noStroke();
                p.rect(0, 0, p.width, p.height);
            } else {
                p.background(10, 10, 11);
            }
            
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
                let angle = p.noise(particle.x * params.noiseScale, particle.y * params.noiseScale) * p.TWO_PI * 2;
                let vx = p.cos(angle) * params.speed;
                let vy = p.sin(angle) * params.speed;
                
                p.stroke(particle.color);
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
        
        getColors: function(p, mode) {
            const palettes = [
                [p.color(168, 85, 247), p.color(59, 130, 246), p.color(6, 182, 212)],
                [p.color(239, 68, 68), p.color(249, 115, 22), p.color(234, 179, 8)],
                [p.color(14, 165, 233), p.color(6, 182, 212), p.color(20, 184, 166)],
                [p.color(34, 197, 94), p.color(132, 204, 22), p.color(234, 179, 8)]
            ];
            return palettes[mode] || palettes[0];
        },
        
        reset: function(p, params) {
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
        
        getCode: function(params) {
            return `// Flow Field - Perlin Noise Particles
// Generated by PatternFlow

let particles = [];
const PARTICLE_COUNT = ${params.particleCount};
const SPEED = ${params.speed};
const NOISE_SCALE = ${params.noiseScale};
const STROKE_WEIGHT = ${params.strokeWeight};
const FADE_AMOUNT = ${params.fadeAmount};
const SHOW_TRAILS = ${params.showTrails};

const COLORS = [
    ${this.getColors({ color: (r, g, b) => `[${r}, ${g}, ${b}]` }, params.colorMode).join(',\n    ')}
];

function setup() {
    createCanvas(800, 600);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            color: random(COLORS)
        });
    }
    
    background(10, 10, 11);
}

function draw() {
    if (SHOW_TRAILS) {
        fill(10, 10, 11, FADE_AMOUNT);
        noStroke();
        rect(0, 0, width, height);
    } else {
        background(10, 10, 11);
    }
    
    strokeWeight(STROKE_WEIGHT);
    
    for (let particle of particles) {
        let angle = noise(particle.x * NOISE_SCALE, particle.y * NOISE_SCALE) * TWO_PI * 2;
        let vx = cos(angle) * SPEED;
        let vy = sin(angle) * SPEED;
        
        stroke(particle.color[0], particle.color[1], particle.color[2]);
        point(particle.x, particle.y);
        
        particle.x += vx;
        particle.y += vy;
        
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
    }
}`;
        }
    },

    // ========================================
    // 2. GEOMETRIC MANDALA
    // ========================================
    mandala: {
        name: 'Geometric Mandala',
        description: 'Rotating symmetric patterns',
        thumbnail: { width: 400, height: 300 },
        
        defaults: {
            layers: 8,
            segments: 12,
            rotationSpeed: 0.5,
            scale: 1,
            strokeWeight: 1.5,
            colorMode: 0,
            animate: true,
        },
        
        controls: [
            { group: 'Structure', icon: 'layers' },
            { name: 'layers', label: 'Layers', type: 'slider', min: 3, max: 16, step: 1 },
            { name: 'segments', label: 'Segments', type: 'slider', min: 4, max: 24, step: 1 },
            { name: 'scale', label: 'Scale', type: 'slider', min: 0.5, max: 2, step: 0.1 },
            { group: 'Animation', icon: 'play' },
            { name: 'rotationSpeed', label: 'Rotation Speed', type: 'slider', min: 0, max: 2, step: 0.1 },
            { name: 'animate', label: 'Animate', type: 'toggle' },
            { group: 'Style', icon: 'palette' },
            { name: 'strokeWeight', label: 'Line Weight', type: 'slider', min: 0.5, max: 4, step: 0.5 },
            { name: 'colorMode', label: 'Color Palette', type: 'palette', options: [
                ['#a855f7', '#ec4899', '#f472b6'],
                ['#3b82f6', '#06b6d4', '#22d3ee'],
                ['#f97316', '#eab308', '#fbbf24'],
                ['#ffffff', '#a1a1aa', '#71717a']
            ]},
        ],
        
        setup: function(p, params, container) {
            const size = Math.min(container.clientWidth - 48, container.clientHeight - 48);
            const canvas = p.createCanvas(size, size);
            this.rotation = 0;
            p.angleMode(p.RADIANS);
            return canvas;
        },
        
        draw: function(p, params) {
            p.background(10, 10, 11);
            p.translate(p.width / 2, p.height / 2);
            
            if (params.animate) {
                this.rotation += params.rotationSpeed * 0.01;
            }
            
            const colors = this.getColors(p, params.colorMode);
            p.strokeWeight(params.strokeWeight);
            p.noFill();
            
            const maxRadius = (p.width / 2 - 40) * params.scale;
            
            for (let layer = 0; layer < params.layers; layer++) {
                const radius = (maxRadius / params.layers) * (layer + 1);
                const layerRotation = this.rotation * (layer % 2 === 0 ? 1 : -1) * (layer + 1) * 0.5;
                
                p.push();
                p.rotate(layerRotation);
                
                const colorIndex = layer % colors.length;
                const alpha = p.map(layer, 0, params.layers, 255, 100);
                const c = colors[colorIndex];
                p.stroke(p.red(c), p.green(c), p.blue(c), alpha);
                
                for (let i = 0; i < params.segments; i++) {
                    const angle = (p.TWO_PI / params.segments) * i;
                    
                    p.push();
                    p.rotate(angle);
                    
                    // Draw various geometric shapes
                    if (layer % 3 === 0) {
                        // Circles
                        p.ellipse(radius * 0.7, 0, radius * 0.3, radius * 0.3);
                    } else if (layer % 3 === 1) {
                        // Lines
                        p.line(0, 0, radius, 0);
                        p.line(radius * 0.8, -radius * 0.1, radius * 0.8, radius * 0.1);
                    } else {
                        // Arcs
                        p.arc(0, 0, radius * 2, radius * 2, 0, p.PI / params.segments);
                    }
                    
                    p.pop();
                }
                
                p.pop();
            }
        },
        
        getColors: function(p, mode) {
            const palettes = [
                [p.color(168, 85, 247), p.color(236, 72, 153), p.color(244, 114, 182)],
                [p.color(59, 130, 246), p.color(6, 182, 212), p.color(34, 211, 238)],
                [p.color(249, 115, 22), p.color(234, 179, 8), p.color(251, 191, 36)],
                [p.color(255, 255, 255), p.color(161, 161, 170), p.color(113, 113, 122)]
            ];
            return palettes[mode] || palettes[0];
        },
        
        reset: function(p, params) {
            this.rotation = 0;
        },
        
        getCode: function(params) {
            return `// Geometric Mandala
// Generated by PatternFlow

let rotation = 0;
const LAYERS = ${params.layers};
const SEGMENTS = ${params.segments};
const ROTATION_SPEED = ${params.rotationSpeed};
const SCALE = ${params.scale};
const STROKE_WEIGHT = ${params.strokeWeight};
const ANIMATE = ${params.animate};

const COLORS = [
    ${this.getColors({ color: (r, g, b) => `[${r}, ${g}, ${b}]` }, params.colorMode).join(',\n    ')}
];

function setup() {
    createCanvas(600, 600);
    angleMode(RADIANS);
}

function draw() {
    background(10, 10, 11);
    translate(width / 2, height / 2);
    
    if (ANIMATE) {
        rotation += ROTATION_SPEED * 0.01;
    }
    
    strokeWeight(STROKE_WEIGHT);
    noFill();
    
    const maxRadius = (width / 2 - 40) * SCALE;
    
    for (let layer = 0; layer < LAYERS; layer++) {
        const radius = (maxRadius / LAYERS) * (layer + 1);
        const layerRotation = rotation * (layer % 2 === 0 ? 1 : -1) * (layer + 1) * 0.5;
        
        push();
        rotate(layerRotation);
        
        const colorIndex = layer % COLORS.length;
        const alpha = map(layer, 0, LAYERS, 255, 100);
        stroke(COLORS[colorIndex][0], COLORS[colorIndex][1], COLORS[colorIndex][2], alpha);
        
        for (let i = 0; i < SEGMENTS; i++) {
            const angle = (TWO_PI / SEGMENTS) * i;
            
            push();
            rotate(angle);
            
            if (layer % 3 === 0) {
                ellipse(radius * 0.7, 0, radius * 0.3, radius * 0.3);
            } else if (layer % 3 === 1) {
                line(0, 0, radius, 0);
                line(radius * 0.8, -radius * 0.1, radius * 0.8, radius * 0.1);
            } else {
                arc(0, 0, radius * 2, radius * 2, 0, PI / SEGMENTS);
            }
            
            pop();
        }
        
        pop();
    }
}`;
        }
    },

    // ========================================
    // 3. RECURSIVE TREE
    // ========================================
    recursiveTree: {
        name: 'Recursive Tree',
        description: 'Fractal branching structure',
        thumbnail: { width: 400, height: 300 },
        
        defaults: {
            depth: 9,
            branchAngle: 25,
            branchRatio: 0.67,
            initialLength: 120,
            strokeWeight: 1,
            colorMode: 0,
            swayAmount: 0,
        },
        
        controls: [
            { group: 'Structure', icon: 'tree' },
            { name: 'depth', label: 'Branch Depth', type: 'slider', min: 4, max: 12, step: 1 },
            { name: 'branchAngle', label: 'Branch Angle', type: 'slider', min: 10, max: 60, step: 1 },
            { name: 'branchRatio', label: 'Branch Ratio', type: 'slider', min: 0.5, max: 0.85, step: 0.01 },
            { name: 'initialLength', label: 'Trunk Length', type: 'slider', min: 60, max: 200, step: 10 },
            { group: 'Animation', icon: 'wind' },
            { name: 'swayAmount', label: 'Wind Sway', type: 'slider', min: 0, max: 15, step: 1 },
            { group: 'Style', icon: 'palette' },
            { name: 'strokeWeight', label: 'Line Weight', type: 'slider', min: 0.5, max: 3, step: 0.5 },
            { name: 'colorMode', label: 'Color Palette', type: 'palette', options: [
                ['#22c55e', '#84cc16', '#4ade80'],
                ['#f472b6', '#ec4899', '#a855f7'],
                ['#06b6d4', '#3b82f6', '#8b5cf6'],
                ['#fbbf24', '#f97316', '#ef4444']
            ]},
        ],
        
        setup: function(p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            p.angleMode(p.DEGREES);
            return canvas;
        },
        
        draw: function(p, params) {
            p.background(10, 10, 11);
            p.translate(p.width / 2, p.height);
            
            const colors = this.getColors(p, params.colorMode);
            const sway = params.swayAmount > 0 ? p.sin(p.frameCount * 0.02) * params.swayAmount : 0;
            
            this.drawBranch(p, params.initialLength, params.depth, params, colors, sway, 0);
        },
        
        drawBranch: function(p, len, depth, params, colors, sway, currentDepth) {
            if (depth === 0) return;
            
            const colorIndex = Math.floor(p.map(currentDepth, 0, params.depth, 0, colors.length - 0.01));
            const thickness = p.map(depth, 0, params.depth, 0.5, params.strokeWeight * 3);
            
            p.stroke(colors[colorIndex]);
            p.strokeWeight(thickness);
            
            const swayOffset = sway * (params.depth - depth) * 0.1;
            
            p.line(0, 0, swayOffset, -len);
            p.translate(swayOffset, -len);
            
            p.push();
            p.rotate(params.branchAngle + swayOffset);
            this.drawBranch(p, len * params.branchRatio, depth - 1, params, colors, sway, currentDepth + 1);
            p.pop();
            
            p.push();
            p.rotate(-params.branchAngle + swayOffset);
            this.drawBranch(p, len * params.branchRatio, depth - 1, params, colors, sway, currentDepth + 1);
            p.pop();
        },
        
        getColors: function(p, mode) {
            const palettes = [
                [p.color(34, 197, 94), p.color(132, 204, 22), p.color(74, 222, 128)],
                [p.color(244, 114, 182), p.color(236, 72, 153), p.color(168, 85, 247)],
                [p.color(6, 182, 212), p.color(59, 130, 246), p.color(139, 92, 246)],
                [p.color(251, 191, 36), p.color(249, 115, 22), p.color(239, 68, 68)]
            ];
            return palettes[mode] || palettes[0];
        },
        
        reset: function(p, params) {
            // No state to reset
        },
        
        getCode: function(params) {
            return `// Recursive Tree
// Generated by PatternFlow

const DEPTH = ${params.depth};
const BRANCH_ANGLE = ${params.branchAngle};
const BRANCH_RATIO = ${params.branchRatio};
const INITIAL_LENGTH = ${params.initialLength};
const STROKE_WEIGHT = ${params.strokeWeight};
const SWAY_AMOUNT = ${params.swayAmount};

const COLORS = [
    ${this.getColors({ color: (r, g, b) => `[${r}, ${g}, ${b}]` }, params.colorMode).join(',\n    ')}
];

function setup() {
    createCanvas(800, 600);
    angleMode(DEGREES);
}

function draw() {
    background(10, 10, 11);
    translate(width / 2, height);
    
    const sway = SWAY_AMOUNT > 0 ? sin(frameCount * 0.02) * SWAY_AMOUNT : 0;
    
    drawBranch(INITIAL_LENGTH, DEPTH, sway, 0);
}

function drawBranch(len, depth, sway, currentDepth) {
    if (depth === 0) return;
    
    const colorIndex = floor(map(currentDepth, 0, DEPTH, 0, COLORS.length - 0.01));
    const thickness = map(depth, 0, DEPTH, 0.5, STROKE_WEIGHT * 3);
    
    stroke(COLORS[colorIndex][0], COLORS[colorIndex][1], COLORS[colorIndex][2]);
    strokeWeight(thickness);
    
    const swayOffset = sway * (DEPTH - depth) * 0.1;
    
    line(0, 0, swayOffset, -len);
    translate(swayOffset, -len);
    
    push();
    rotate(BRANCH_ANGLE + swayOffset);
    drawBranch(len * BRANCH_RATIO, depth - 1, sway, currentDepth + 1);
    pop();
    
    push();
    rotate(-BRANCH_ANGLE + swayOffset);
    drawBranch(len * BRANCH_RATIO, depth - 1, sway, currentDepth + 1);
    pop();
}`;
        }
    },

    // ========================================
    // 4. PARTICLE SYSTEM
    // ========================================
    particleSystem: {
        name: 'Particle System',
        description: 'Interactive particle physics',
        thumbnail: { width: 400, height: 300 },
        
        defaults: {
            particleCount: 150,
            particleSize: 4,
            connectionDistance: 120,
            speed: 1,
            mouseInteraction: true,
            colorMode: 0,
        },
        
        controls: [
            { group: 'Particles', icon: 'sparkles' },
            { name: 'particleCount', label: 'Particle Count', type: 'slider', min: 50, max: 300, step: 10 },
            { name: 'particleSize', label: 'Particle Size', type: 'slider', min: 2, max: 12, step: 1 },
            { name: 'speed', label: 'Speed', type: 'slider', min: 0.2, max: 3, step: 0.1 },
            { group: 'Connections', icon: 'link' },
            { name: 'connectionDistance', label: 'Connection Distance', type: 'slider', min: 50, max: 200, step: 10 },
            { name: 'mouseInteraction', label: 'Mouse Interaction', type: 'toggle' },
            { group: 'Style', icon: 'palette' },
            { name: 'colorMode', label: 'Color Palette', type: 'palette', options: [
                ['#a855f7', '#3b82f6', '#06b6d4'],
                ['#ef4444', '#f97316', '#fbbf24'],
                ['#10b981', '#06b6d4', '#3b82f6'],
                ['#ec4899', '#f472b6', '#fca5a5']
            ]},
        ],
        
        setup: function(p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            this.particles = [];
            this.colors = this.getColors(p, params.colorMode);
            
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
        
        draw: function(p, params) {
            p.background(10, 10, 11);
            
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
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const d = p.dist(this.particles[i].x, this.particles[i].y, 
                                     this.particles[j].x, this.particles[j].y);
                    
                    if (d < params.connectionDistance) {
                        const alpha = p.map(d, 0, params.connectionDistance, 150, 0);
                        p.stroke(100, 100, 120, alpha);
                        p.strokeWeight(0.5);
                        p.line(this.particles[i].x, this.particles[i].y, 
                               this.particles[j].x, this.particles[j].y);
                    }
                }
            }
            
            // Update and draw particles
            for (let particle of this.particles) {
                // Mouse interaction
                if (params.mouseInteraction && p.mouseX > 0 && p.mouseY > 0) {
                    const dx = p.mouseX - particle.x;
                    const dy = p.mouseY - particle.y;
                    const d = p.sqrt(dx * dx + dy * dy);
                    
                    if (d < 150) {
                        const force = p.map(d, 0, 150, 0.5, 0);
                        particle.vx += (dx / d) * force;
                        particle.vy += (dy / d) * force;
                    }
                }
                
                // Apply velocity with damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;
                
                // Constrain speed
                const speed = p.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (speed > params.speed * 2) {
                    particle.vx = (particle.vx / speed) * params.speed * 2;
                    particle.vy = (particle.vy / speed) * params.speed * 2;
                }
                
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                particle.x = p.constrain(particle.x, 0, p.width);
                particle.y = p.constrain(particle.y, 0, p.height);
                
                // Draw particle
                p.noStroke();
                p.fill(particle.color);
                p.ellipse(particle.x, particle.y, params.particleSize, params.particleSize);
            }
        },
        
        getColors: function(p, mode) {
            const palettes = [
                [p.color(168, 85, 247), p.color(59, 130, 246), p.color(6, 182, 212)],
                [p.color(239, 68, 68), p.color(249, 115, 22), p.color(251, 191, 36)],
                [p.color(16, 185, 129), p.color(6, 182, 212), p.color(59, 130, 246)],
                [p.color(236, 72, 153), p.color(244, 114, 182), p.color(252, 165, 165)]
            ];
            return palettes[mode] || palettes[0];
        },
        
        reset: function(p, params) {
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
        
        getCode: function(params) {
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
            waveCount: 3,
            amplitude: 80,
            frequency: 0.02,
            speed: 2,
            resolution: 8,
            strokeWeight: 2,
            colorMode: 0,
        },
        
        controls: [
            { group: 'Waves', icon: 'waves' },
            { name: 'waveCount', label: 'Wave Count', type: 'slider', min: 1, max: 8, step: 1 },
            { name: 'amplitude', label: 'Amplitude', type: 'slider', min: 20, max: 150, step: 5 },
            { name: 'frequency', label: 'Frequency', type: 'slider', min: 0.005, max: 0.05, step: 0.005 },
            { group: 'Animation', icon: 'play' },
            { name: 'speed', label: 'Speed', type: 'slider', min: 0.5, max: 5, step: 0.5 },
            { name: 'resolution', label: 'Resolution', type: 'slider', min: 2, max: 20, step: 1 },
            { group: 'Style', icon: 'palette' },
            { name: 'strokeWeight', label: 'Line Weight', type: 'slider', min: 1, max: 6, step: 0.5 },
            { name: 'colorMode', label: 'Color Palette', type: 'palette', options: [
                ['#06b6d4', '#3b82f6', '#8b5cf6'],
                ['#f97316', '#ef4444', '#ec4899'],
                ['#22c55e', '#06b6d4', '#3b82f6'],
                ['#fbbf24', '#f472b6', '#a855f7']
            ]},
        ],
        
        setup: function(p, params, container) {
            const canvas = p.createCanvas(container.clientWidth - 48, container.clientHeight - 48);
            this.time = 0;
            return canvas;
        },
        
        draw: function(p, params) {
            p.background(10, 10, 11);
            
            const colors = this.getColors(p, params.colorMode);
            this.time += params.speed * 0.01;
            
            p.noFill();
            p.strokeWeight(params.strokeWeight);
            
            for (let wave = 0; wave < params.waveCount; wave++) {
                const waveOffset = (p.height / (params.waveCount + 1)) * (wave + 1);
                const phaseOffset = wave * p.PI * 0.5;
                const color = colors[wave % colors.length];
                
                p.stroke(color);
                p.beginShape();
                
                for (let x = 0; x <= p.width; x += params.resolution) {
                    let y = waveOffset;
                    
                    // Add multiple sine waves for complexity
                    y += p.sin(x * params.frequency + this.time + phaseOffset) * params.amplitude;
                    y += p.sin(x * params.frequency * 2 + this.time * 1.5 + phaseOffset) * (params.amplitude * 0.3);
                    y += p.sin(x * params.frequency * 0.5 + this.time * 0.7 + phaseOffset) * (params.amplitude * 0.5);
                    
                    p.curveVertex(x, y);
                }
                
                p.endShape();
                
                // Draw glow effect
                const glowColor = p.color(p.red(color), p.green(color), p.blue(color), 30);
                p.stroke(glowColor);
                p.strokeWeight(params.strokeWeight * 4);
                
                p.beginShape();
                for (let x = 0; x <= p.width; x += params.resolution) {
                    let y = waveOffset;
                    y += p.sin(x * params.frequency + this.time + phaseOffset) * params.amplitude;
                    y += p.sin(x * params.frequency * 2 + this.time * 1.5 + phaseOffset) * (params.amplitude * 0.3);
                    y += p.sin(x * params.frequency * 0.5 + this.time * 0.7 + phaseOffset) * (params.amplitude * 0.5);
                    p.curveVertex(x, y);
                }
                p.endShape();
                
                p.strokeWeight(params.strokeWeight);
            }
        },
        
        getColors: function(p, mode) {
            const palettes = [
                [p.color(6, 182, 212), p.color(59, 130, 246), p.color(139, 92, 246)],
                [p.color(249, 115, 22), p.color(239, 68, 68), p.color(236, 72, 153)],
                [p.color(34, 197, 94), p.color(6, 182, 212), p.color(59, 130, 246)],
                [p.color(251, 191, 36), p.color(244, 114, 182), p.color(168, 85, 247)]
            ];
            return palettes[mode] || palettes[0];
        },
        
        reset: function(p, params) {
            this.time = 0;
        },
        
        getCode: function(params) {
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
            starCount: 800,
            rotationSpeed: 0.3,
            spread: 0.4,
            spiralTightness: 0.15,
            starSize: 2,
            colorMode: 0,
        },
        
        controls: [
            { group: 'Galaxy Structure', icon: 'star' },
            { name: 'arms', label: 'Spiral Arms', type: 'slider', min: 2, max: 8, step: 1 },
            { name: 'starCount', label: 'Star Count', type: 'slider', min: 200, max: 2000, step: 100 },
            { name: 'spiralTightness', label: 'Spiral Tightness', type: 'slider', min: 0.05, max: 0.3, step: 0.01 },
            { name: 'spread', label: 'Arm Spread', type: 'slider', min: 0.1, max: 0.8, step: 0.05 },
            { group: 'Animation', icon: 'rotate' },
            { name: 'rotationSpeed', label: 'Rotation Speed', type: 'slider', min: 0, max: 1, step: 0.05 },
            { group: 'Style', icon: 'palette' },
            { name: 'starSize', label: 'Star Size', type: 'slider', min: 1, max: 5, step: 0.5 },
            { name: 'colorMode', label: 'Color Palette', type: 'palette', options: [
                ['#fef3c7', '#fbbf24', '#a855f7'],
                ['#bfdbfe', '#60a5fa', '#ec4899'],
                ['#d1fae5', '#34d399', '#06b6d4'],
                ['#fecdd3', '#fb7185', '#f472b6']
            ]},
        ],
        
        setup: function(p, params, container) {
            const size = Math.min(container.clientWidth - 48, container.clientHeight - 48);
            const canvas = p.createCanvas(size, size);
            
            this.rotation = 0;
            this.stars = this.generateStars(p, params);
            
            return canvas;
        },
        
        generateStars: function(p, params) {
            const stars = [];
            const maxRadius = p.width * 0.45;
            
            for (let i = 0; i < params.starCount; i++) {
                const arm = Math.floor(p.random(params.arms));
                const armAngle = (p.TWO_PI / params.arms) * arm;
                
                // Distance from center (weighted toward center)
                const t = p.random();
                const radius = maxRadius * p.pow(t, 0.5);
                
                // Spiral angle
                const spiralAngle = radius * params.spiralTightness;
                
                // Add spread
                const spread = params.spread * radius * p.randomGaussian(0, 0.3);
                const angleSpread = spread / (radius + 1);
                
                const angle = armAngle + spiralAngle + angleSpread;
                
                // Brightness based on position
                const brightness = p.map(radius, 0, maxRadius, 255, 80) + p.random(-30, 30);
                
                stars.push({
                    radius,
                    baseAngle: angle,
                    brightness: p.constrain(brightness, 50, 255),
                    size: p.random(0.5, 1.5)
                });
            }
            
            // Add central bulge
            for (let i = 0; i < params.starCount * 0.3; i++) {
                const radius = p.random() * maxRadius * 0.2;
                const angle = p.random(p.TWO_PI);
                
                stars.push({
                    radius,
                    baseAngle: angle,
                    brightness: p.random(150, 255),
                    size: p.random(0.3, 1),
                    isBulge: true
                });
            }
            
            return stars;
        },
        
        draw: function(p, params) {
            p.background(5, 5, 8);
            p.translate(p.width / 2, p.height / 2);
            
            this.rotation += params.rotationSpeed * 0.002;
            
            // Regenerate stars if count changed significantly
            if (Math.abs(this.stars.length - params.starCount * 1.3) > params.starCount * 0.3) {
                this.stars = this.generateStars(p, params);
            }
            
            const colors = this.getColors(p, params.colorMode);
            
            p.noStroke();
            
            for (let star of this.stars) {
                const angle = star.baseAngle + this.rotation * (star.isBulge ? 0.5 : 1);
                const x = p.cos(angle) * star.radius;
                const y = p.sin(angle) * star.radius;
                
                // Color based on distance
                const colorT = p.map(star.radius, 0, p.width * 0.45, 0, 2);
                let starColor;
                
                if (colorT < 1) {
                    starColor = p.lerpColor(colors[0], colors[1], colorT);
                } else {
                    starColor = p.lerpColor(colors[1], colors[2], colorT - 1);
                }
                
                p.fill(p.red(starColor), p.green(starColor), p.blue(starColor), star.brightness);
                
                const size = params.starSize * star.size;
                p.ellipse(x, y, size, size);
                
                // Occasional bright star with glow
                if (star.brightness > 220 && star.size > 1) {
                    p.fill(255, 255, 255, 50);
                    p.ellipse(x, y, size * 3, size * 3);
                }
            }
            
            // Central glow
            const gradient = p.drawingContext.createRadialGradient(0, 0, 0, 0, 0, p.width * 0.15);
            gradient.addColorStop(0, 'rgba(255, 250, 230, 0.3)');
            gradient.addColorStop(0.5, 'rgba(255, 200, 150, 0.1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            p.drawingContext.fillStyle = gradient;
            p.ellipse(0, 0, p.width * 0.3, p.width * 0.3);
        },
        
        getColors: function(p, mode) {
            const palettes = [
                [p.color(254, 243, 199), p.color(251, 191, 36), p.color(168, 85, 247)],
                [p.color(191, 219, 254), p.color(96, 165, 250), p.color(236, 72, 153)],
                [p.color(209, 250, 229), p.color(52, 211, 153), p.color(6, 182, 212)],
                [p.color(254, 205, 211), p.color(251, 113, 133), p.color(244, 114, 182)]
            ];
            return palettes[mode] || palettes[0];
        },
        
        reset: function(p, params) {
            this.rotation = 0;
            this.stars = this.generateStars(p, params);
        },
        
        getCode: function(params) {
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
