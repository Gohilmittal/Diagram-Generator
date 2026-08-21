import { createDiagram, getSupportedTypes } from './diagrams';
import { validateDiagram } from './schemas/validator';
import { exportSVG, exportPNG } from './export';
import { getSampleData } from './samples';

export default class App {
  constructor(container) {
    this.container = document.querySelector(container);
    this.currentType = 'bar';
    this.currentData = null;
    this.currentSvg = null;
    this.diagramInstance = null;
    
    // State
    this.state = {
      jsonInput: '',
      errors: [],
      isValid: false,
      isGenerating: false
    };
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.loadSample('bar');
  }

  render() {
    this.container.innerHTML = `
      <div class="app-container">
        <div class="sidebar">
          <div class="control-group">
            <label for="diagram-type">Diagram Type</label>
            <select id="diagram-type">
              ${getSupportedTypes().map(type => 
                `<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`
              ).join('')}
            </select>
          </div>
          
          <div class="control-group">
            <label for="json-input">JSON Data</label>
            <div class="json-controls">
              <button id="load-sample" class="btn btn-secondary">Load Sample</button>
              <button id="format-json" class="btn btn-secondary">Format</button>
              <button id="validate-json" class="btn btn-secondary">Validate</button>
            </div>
            <textarea id="json-input" rows="20" spellcheck="false"></textarea>
          </div>
          
          <div class="control-group">
            <div class="error-display" id="error-display"></div>
          </div>
          
          <div class="control-group">
            <button id="generate-btn" class="btn btn-primary">Generate Diagram</button>
          </div>
          
          <div class="control-group">
            <div class="export-controls">
              <button id="export-svg" class="btn btn-secondary" disabled>Export SVG</button>
              <button id="export-png" class="btn btn-secondary" disabled>Export PNG</button>
            </div>
          </div>
        </div>
        
        <div class="preview-container">
          <div class="diagram-wrapper" id="diagram-wrapper">
            <div class="placeholder">
              <p>Select a diagram type and generate</p>
              <p class="hint">Or load a sample to get started</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Type selector
    const typeSelect = this.container.querySelector('#diagram-type');
    typeSelect.addEventListener('change', () => {
      this.currentType = typeSelect.value;
      this.loadSample(this.currentType);
    });

    // JSON input
    const jsonInput = this.container.querySelector('#json-input');
    jsonInput.addEventListener('input', () => {
      this.state.jsonInput = jsonInput.value;
      this.validateInput();
    });

    // Load sample
    const loadSampleBtn = this.container.querySelector('#load-sample');
    loadSampleBtn.addEventListener('click', () => {
      this.loadSample(this.currentType);
    });

    // Format JSON
    const formatBtn = this.container.querySelector('#format-json');
    formatBtn.addEventListener('click', () => {
      this.formatJson();
    });

    // Validate JSON
    const validateBtn = this.container.querySelector('#validate-json');
    validateBtn.addEventListener('click', () => {
      this.validateInput(true);
    });

    // Generate
    const generateBtn = this.container.querySelector('#generate-btn');
    generateBtn.addEventListener('click', () => {
      this.generateDiagram();
    });

    // Export SVG
    const exportSvgBtn = this.container.querySelector('#export-svg');
    exportSvgBtn.addEventListener('click', () => {
      this.exportDiagram('svg');
    });

    // Export PNG
    const exportPngBtn = this.container.querySelector('#export-png');
    exportPngBtn.addEventListener('click', () => {
      this.exportDiagram('png');
    });
  }

  loadSample(type) {
    const sampleData = getSampleData(type);
    if (sampleData) {
      const jsonString = JSON.stringify(sampleData, null, 2);
      const jsonInput = this.container.querySelector('#json-input');
      jsonInput.value = jsonString;
      this.state.jsonInput = jsonString;
      this.validateInput();
      this.generateDiagram();
    }
  }

  formatJson() {
    const jsonInput = this.container.querySelector('#json-input');
    try {
      const parsed = JSON.parse(jsonInput.value);
      jsonInput.value = JSON.stringify(parsed, null, 2);
      this.state.jsonInput = jsonInput.value;
      this.validateInput();
    } catch (e) {
      this.showErrors(['Invalid JSON: ' + e.message]);
    }
  }

  validateInput(showErrors = false) {
    try {
      const data = JSON.parse(this.state.jsonInput);
      const result = validateDiagram(data);
      
      if (result.valid) {
        this.state.isValid = true;
        this.state.errors = [];
        this.clearErrors();
        return true;
      } else {
        this.state.isValid = false;
        this.state.errors = result.errors;
        if (showErrors) {
          this.showErrors(result.errors);
        }
        return false;
      }
    } catch (e) {
      this.state.isValid = false;
      this.state.errors = ['Invalid JSON: ' + e.message];
      if (showErrors) {
        this.showErrors(this.state.errors);
      }
      return false;
    }
  }

  showErrors(errors) {
    const errorDisplay = this.container.querySelector('#error-display');
    errorDisplay.innerHTML = `
      <div class="error-list">
        ${errors.map(err => `<div class="error-item">❌ ${err}</div>`).join('')}
      </div>
    `;
  }

  clearErrors() {
    const errorDisplay = this.container.querySelector('#error-display');
    errorDisplay.innerHTML = '';
  }

  generateDiagram() {
    if (!this.validateInput(false)) {
      this.showErrors(['Please fix validation errors before generating']);
      return;
    }

    try {
      const data = JSON.parse(this.state.jsonInput);
      const wrapper = this.container.querySelector('#diagram-wrapper');
      
      // Clear previous diagram
      wrapper.innerHTML = '<div class="diagram-loading">Generating...</div>';
      
      // Create diagram
      this.diagramInstance = createDiagram(data.type || this.currentType, data);
      this.currentSvg = this.diagramInstance.generate();
      
      // Render in wrapper
      wrapper.innerHTML = '';
      wrapper.appendChild(this.currentSvg);
      
      // Enable export buttons
      this.container.querySelector('#export-svg').disabled = false;
      this.container.querySelector('#export-png').disabled = false;
      
      this.clearErrors();
      
    } catch (e) {
      this.showErrors(['Error generating diagram: ' + e.message]);
    }
  }

  async exportDiagram(format) {
    if (!this.currentSvg) {
      this.showErrors(['No diagram to export']);
      return;
    }

    try {
      if (format === 'svg') {
        await exportSVG(this.currentSvg, `diagram-${Date.now()}.svg`);
      } else if (format === 'png') {
        await exportPNG(this.currentSvg, `diagram-${Date.now()}.png`);
      }
    } catch (e) {
      this.showErrors(['Export failed: ' + e.message]);
    }
  }
}