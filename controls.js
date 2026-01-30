/* ========================================
   PatternFlow - Controls System
   Dynamic GUI Control Generation
   ======================================== */

class ControlSystem {
    constructor(container, onUpdate) {
        this.container = container;
        this.onUpdate = onUpdate;
        this.params = {};
        this.controls = [];
    }

    /**
     * Generate controls for a pattern
     */
    generateControls(patternConfig) {
        this.container.innerHTML = '';
        this.params = { ...patternConfig.defaults };
        this.controls = [];

        let currentGroup = null;

        for (const control of patternConfig.controls) {
            if (control.group) {
                // Create a new control group
                currentGroup = this.createGroup(control.group, control.icon);
                this.container.appendChild(currentGroup);
            } else {
                // Create the control
                const controlElement = this.createControl(control);
                if (currentGroup) {
                    currentGroup.querySelector('.control-group-content').appendChild(controlElement);
                } else {
                    this.container.appendChild(controlElement);
                }
            }
        }
    }

    /**
     * Create a control group
     */
    createGroup(title, iconName) {
        const group = document.createElement('div');
        group.className = 'control-group';

        const icon = this.getIcon(iconName);

        group.innerHTML = `
            <div class="control-group-title">
                ${icon}
                <span>${title}</span>
            </div>
            <div class="control-group-content"></div>
        `;

        return group;
    }

    /**
     * Create a single control
     */
    createControl(config) {
        const wrapper = document.createElement('div');
        wrapper.className = 'control-item';

        switch (config.type) {
            case 'slider':
                wrapper.appendChild(this.createSlider(config));
                break;
            case 'toggle':
                wrapper.appendChild(this.createToggle(config));
                break;
            case 'palette':
                wrapper.appendChild(this.createPalette(config));
                break;
            case 'color':
                wrapper.appendChild(this.createColorPicker(config));
                break;
            case 'imageUpload':
                wrapper.appendChild(this.createImageUpload(config));
                break;
            case 'select':
                wrapper.appendChild(this.createSelect(config));
                break;
        }

        return wrapper;
    }

    /**
     * Create a slider control
     */
    createSlider(config) {
        const container = document.createElement('div');
        const value = this.params[config.name];

        // Format display value
        const displayValue = Number.isInteger(config.step) && config.step >= 1
            ? value
            : value.toFixed(config.step < 0.01 ? 3 : 2);

        container.innerHTML = `
            <div class="control-label">
                <span>${config.label}</span>
                <span class="control-value" id="value-${config.name}">${displayValue}</span>
            </div>
            <input type="range" 
                   class="control-slider" 
                   id="slider-${config.name}"
                   min="${config.min}" 
                   max="${config.max}" 
                   step="${config.step}" 
                   value="${value}">
        `;

        const slider = container.querySelector('input');
        const valueDisplay = container.querySelector('.control-value');

        slider.addEventListener('input', (e) => {
            const newValue = parseFloat(e.target.value);
            this.params[config.name] = newValue;

            const display = Number.isInteger(config.step) && config.step >= 1
                ? newValue
                : newValue.toFixed(config.step < 0.01 ? 3 : 2);
            valueDisplay.textContent = display;

            this.onUpdate(this.params);
        });

        this.controls.push({ name: config.name, element: slider, type: 'slider', config });

        return container;
    }

    /**
     * Create a toggle control
     */
    createToggle(config) {
        const container = document.createElement('div');
        container.className = 'toggle-container';

        const isActive = this.params[config.name];

        container.innerHTML = `
            <span class="toggle-label">${config.label}</span>
            <div class="toggle-switch ${isActive ? 'active' : ''}" id="toggle-${config.name}"></div>
        `;

        const toggle = container.querySelector('.toggle-switch');

        toggle.addEventListener('click', () => {
            this.params[config.name] = !this.params[config.name];
            toggle.classList.toggle('active');
            this.onUpdate(this.params);
        });

        this.controls.push({ name: config.name, element: toggle, type: 'toggle', config });

        return container;
    }

    /**
     * Create a color palette selector
     */
    createPalette(config) {
        const container = document.createElement('div');
        const currentValue = this.params[config.name];

        container.innerHTML = `
            <div class="control-label">
                <span>${config.label}</span>
            </div>
            <div class="palette-container" id="palette-${config.name}">
                ${config.options.map((palette, index) => `
                    <div class="palette-option ${index === currentValue ? 'active' : ''}" data-index="${index}">
                        ${palette.map(color => `<div class="palette-color" style="background: ${color}"></div>`).join('')}
                    </div>
                `).join('')}
            </div>
        `;

        const paletteContainer = container.querySelector('.palette-container');
        const options = container.querySelectorAll('.palette-option');

        options.forEach((option, index) => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.params[config.name] = index;
                this.onUpdate(this.params);
            });
        });

        this.controls.push({ name: config.name, element: paletteContainer, type: 'palette', config });

        return container;
    }

    /**
     * Create a color picker
     */
    createColorPicker(config) {
        const container = document.createElement('div');
        const currentValue = this.params[config.name];

        container.innerHTML = `
            <div class="control-label">
                <span>${config.label}</span>
            </div>
            <div class="color-picker-container" id="colors-${config.name}">
                ${config.options.map((color, index) => `
                    <div class="color-option ${index === currentValue ? 'active' : ''}" 
                         style="background: ${color}" 
                         data-index="${index}"></div>
                `).join('')}
            </div>
        `;

        const options = container.querySelectorAll('.color-option');

        options.forEach((option, index) => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.params[config.name] = index;
                this.onUpdate(this.params);
            });
        });

        this.controls.push({ name: config.name, element: container, type: 'color', config });

        return container;
    }

    /**
     * Create an image upload control
     */
    createImageUpload(config) {
        const container = document.createElement('div');
        container.className = 'image-upload-container';

        container.innerHTML = `
            <div class="control-label">
                <span>${config.label}</span>
            </div>
            <div class="upload-area" id="upload-${config.name}">
                <input type="file" accept="image/*" id="file-${config.name}" class="file-input">
                <label for="file-${config.name}" class="upload-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>Upload Image</span>
                </label>
                <div id="preview-${config.name}" class="image-preview hidden"></div>
            </div>
        `;

        const fileInput = container.querySelector('.file-input');
        const preview = container.querySelector('.image-preview');
        const uploadLabel = container.querySelector('.upload-label');

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    // Store the data URL in params
                    this.params[config.name] = evt.target.result;

                    // Show preview
                    preview.innerHTML = `<img src="${evt.target.result}" alt="Preview">`;
                    preview.classList.remove('hidden');
                    uploadLabel.classList.add('hidden');

                    this.onUpdate(this.params);
                };
                reader.readAsDataURL(file);
            }
        });

        // Click preview to re-upload
        preview.addEventListener('click', () => {
            fileInput.click();
        });

        this.controls.push({ name: config.name, element: container, type: 'imageUpload', config });

        return container;
    }

    /**
     * Create a select dropdown control
     */
    createSelect(config) {
        const container = document.createElement('div');
        const currentValue = this.params[config.name];

        container.innerHTML = `
            <div class="control-label">
                <span>${config.label}</span>
            </div>
            <select class="control-select" id="select-${config.name}">
                ${config.options.map((opt, i) => `
                    <option value="${i}" ${i === currentValue ? 'selected' : ''}>${opt}</option>
                `).join('')}
            </select>
        `;

        const select = container.querySelector('select');

        select.addEventListener('change', (e) => {
            this.params[config.name] = parseInt(e.target.value);
            this.onUpdate(this.params);
        });

        this.controls.push({ name: config.name, element: select, type: 'select', config });

        return container;
    }

    /**
     * Reset all controls to default values
     */
    resetToDefaults(defaults) {
        this.params = { ...defaults };

        for (const control of this.controls) {
            const value = this.params[control.name];

            switch (control.type) {
                case 'slider':
                    control.element.value = value;
                    const valueDisplay = document.getElementById(`value-${control.name}`);
                    if (valueDisplay) {
                        const display = Number.isInteger(control.config.step) && control.config.step >= 1
                            ? value
                            : value.toFixed(control.config.step < 0.01 ? 3 : 2);
                        valueDisplay.textContent = display;
                    }
                    break;

                case 'toggle':
                    control.element.classList.toggle('active', value);
                    break;

                case 'palette':
                    const paletteOptions = control.element.querySelectorAll('.palette-option');
                    paletteOptions.forEach((opt, i) => opt.classList.toggle('active', i === value));
                    break;

                case 'color':
                    const colorOptions = control.element.querySelectorAll('.color-option');
                    colorOptions.forEach((opt, i) => opt.classList.toggle('active', i === value));
                    break;
            }
        }

        this.onUpdate(this.params);
    }

    /**
     * Get current parameters
     */
    getParams() {
        return { ...this.params };
    }

    /**
     * Get SVG icon
     */
    getIcon(name) {
        const icons = {
            sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/><path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z"/><path d="M19 11l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L17 13l1.5-.5.5-1.5z"/></svg>',
            palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="6.5" cy="12.5" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.75-.67 1.75-1.5 0-.38-.15-.74-.41-1.02-.26-.28-.41-.63-.41-1.01 0-.83.67-1.47 1.5-1.47H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"/></svg>',
            layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>',
            play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5,3 19,12 5,21"/></svg>',
            tree: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-7"/><path d="M9 9l3-4.5L15 9l-3 4.5L9 9z"/><path d="M6 15l6-9 6 9H6z"/></svg>',
            wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2"/><path d="M12.59 19.41A2 2 0 1 0 14 16H2"/><path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
            link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
            waves: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
            star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>',
            rotate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"/></svg>'
        };

        return icons[name] || '';
    }
}

// Export
window.ControlSystem = ControlSystem;
