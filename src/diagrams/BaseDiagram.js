/**
 * BaseDiagram - Abstract base class for all diagram renderers
 * 
 * All diagram renderers must extend this class and implement:
 * - validate(): Validate input data
 * - render(): Generate SVG elements
 */
export default class BaseDiagram {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      width: options.width || data.width || 800,
      height: options.height || data.height || 600,
      margin: options.margin || { top: 40, right: 40, bottom: 60, left: 60 },
      backgroundColor: options.backgroundColor || '#ffffff',
      ...options
    };
    this.svg = null;
    this.container = null;
    this._validateCalled = false;
  }

  /**
   * Generate the diagram SVG
   * @returns {SVGElement} The SVG element
   */
  generate() {
    this.validate();
    this._validateCalled = true;
    this.container = this.createContainer();
    this.svg = this.render();
    this.applyStyles();
    return this.svg;
  }

  /**
   * Validate input data
   * @throws {Error} If validation fails
   */
  validate() {
    // Basic validation - ensure data exists
    if (!this.data) {
      throw new Error('No data provided');
    }
    
    if (!this.data.type) {
      throw new Error('Missing required field: type');
    }
    
    return true;
  }

  /**
   * Render the diagram
   * @returns {SVGElement} The rendered SVG
   */
  render() {
    throw new Error('render() must be implemented by child class');
  }

  /**
   * Create SVG container
   * @returns {SVGElement} The SVG container
   */
  createContainer() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.options.width);
    svg.setAttribute('height', this.options.height);
    svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return svg;
  }

  /**
   * Apply styles to SVG
   */
  applyStyles() {
    if (this.svg) {
      this.svg.style.backgroundColor = this.options.backgroundColor;
      this.svg.style.display = 'block';
      this.svg.style.maxWidth = '100%';
      this.svg.style.maxHeight = '100%';
    }
  }

  /**
   * Create a group element
   * @param {Object} attrs - Attributes for the group
   * @returns {SVGGElement}
   */
  createGroup(attrs = {}) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Object.entries(attrs).forEach(([key, value]) => {
      group.setAttribute(key, value);
    });
    return group;
  }

  /**
   * Create a rect element
   * @param {Object} attrs - Attributes for the rect
   * @returns {SVGRectElement}
   */
  createRect(attrs = {}) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries(attrs).forEach(([key, value]) => {
      rect.setAttribute(key, value);
    });
    return rect;
  }

  /**
   * Create a circle element
   * @param {Object} attrs - Attributes for the circle
   * @returns {SVGCircleElement}
   */
  createCircle(attrs = {}) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    Object.entries(attrs).forEach(([key, value]) => {
      circle.setAttribute(key, value);
    });
    return circle;
  }

  /**
   * Create a text element
   * @param {Object} attrs - Attributes for the text
   * @param {string} content - Text content
   * @returns {SVGTextElement}
   */
  createText(attrs = {}, content = '') {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const { maxWidth, minFontSize = 8, ...svgAttrs } = attrs;

    Object.entries(svgAttrs).forEach(([key, value]) => {
      text.setAttribute(key, value);
    });
    text.textContent = content;

    const resolvedMaxWidth = maxWidth || this.options.width * 0.45;
    if (content && resolvedMaxWidth) {
      this.fitTextElement(text, resolvedMaxWidth, minFontSize);
    }

    return text;
  }

  /**
   * Keep a single-line SVG label inside its allocated width.
   */
  fitTextElement(text, maxWidth, minFontSize = 8) {
    const original = text.textContent || '';
    const initialFontSize = parseFloat(text.getAttribute('font-size')) || 12;
    const availableWidth = Math.max(Number(maxWidth) || 0, 1);
    const estimatedWidth = this.estimateTextWidth(original, initialFontSize);

    if (estimatedWidth <= availableWidth) return text;

    const fittedFontSize = Math.max(
      Number(minFontSize) || 8,
      Math.floor((initialFontSize * availableWidth) / estimatedWidth * 10) / 10
    );
    text.setAttribute('font-size', `${fittedFontSize}px`);

    if (this.estimateTextWidth(original, fittedFontSize) > availableWidth) {
      let shortened = original;
      while (shortened.length > 1 && this.estimateTextWidth(`${shortened}…`, fittedFontSize) > availableWidth) {
        shortened = shortened.slice(0, -1).trimEnd();
      }
      text.textContent = shortened === original ? original : `${shortened}…`;
    }

    text.setAttribute('aria-label', original);
    return text;
  }

  /**
   * Estimate rendered width without requiring the SVG to be mounted.
   */
  estimateTextWidth(content, fontSize) {
    return Array.from(String(content)).reduce((width, character) => {
      if (/\s/.test(character)) return width + fontSize * 0.32;
      if (/[ilI1.,'`|!]/.test(character)) return width + fontSize * 0.3;
      if (/[MW@#%&]/.test(character)) return width + fontSize * 0.9;
      return width + fontSize * 0.58;
    }, 0);
  }

  /**
   * Create a line element
   * @param {Object} attrs - Attributes for the line
   * @returns {SVGLineElement}
   */
  createLine(attrs = {}) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    Object.entries(attrs).forEach(([key, value]) => {
      line.setAttribute(key, value);
    });
    return line;
  }

  /**
   * Create a path element
   * @param {Object} attrs - Attributes for the path
   * @returns {SVGPathElement}
   */
  createPath(attrs = {}) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    Object.entries(attrs).forEach(([key, value]) => {
      path.setAttribute(key, value);
    });
    return path;
  }

  /**
   * Get SVG as string
   * @returns {string} SVG string
   */
  toSVGString() {
    if (!this.svg) {
      throw new Error('No SVG generated');
    }
    return new XMLSerializer().serializeToString(this.svg);
  }

  /**
   * Get available width for chart area
   */
  getChartWidth() {
    return this.options.width - this.options.margin.left - this.options.margin.right;
  }

  /**
   * Get available height for chart area
   */
  getChartHeight() {
    return this.options.height - this.options.margin.top - this.options.margin.bottom;
  }

  /**
   * Get chart area (for D3)
   */
  getChartArea() {
    return {
      width: this.getChartWidth(),
      height: this.getChartHeight(),
      x: this.options.margin.left,
      y: this.options.margin.top
    };
  }
}
