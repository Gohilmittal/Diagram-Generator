const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING src/index.js...\n');

// 1. FIX src/index.js - This should be the main entry point
const mainIndexPath = 'src/index.js';
const mainIndexContent = `import App from './app';
import './styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App('#app');
  app.init();
});

export { App };`;

fs.writeFileSync(mainIndexPath, mainIndexContent);
console.log('✅ Fixed src/index.js (main entry point)');

// 2. MAKE SURE src/diagrams/index.js exists with correct content
const diagramsIndexPath = 'src/diagrams/index.js';
const diagramsIndexContent = `import BaseDiagram from './BaseDiagram';
import BarDiagram from './bar';
import PieDiagram from './pie';
import LineDiagram from './line';
import CircularDiagram from './circular';
import LinearDiagram from './linear';
import DirectionalDiagram from './directional';
import VennDiagram from './venn';
import BloodRelationDiagram from './bloodRelation';

const diagramMap = {
  bar: BarDiagram,
  pie: PieDiagram,
  line: LineDiagram,
  circular: CircularDiagram,
  linear: LinearDiagram,
  directional: DirectionalDiagram,
  venn: VennDiagram,
  bloodRelation: BloodRelationDiagram
};

export function createDiagram(type, data, options = {}) {
  const DiagramClass = diagramMap[type];
  if (!DiagramClass) {
    throw new Error(\`Unsupported diagram type: \${type}. Supported types: \${Object.keys(diagramMap).join(', ')}\`);
  }
  return new DiagramClass(data, options);
}

export function getSupportedTypes() {
  return Object.keys(diagramMap);
}

export { BaseDiagram };`;

fs.writeFileSync(diagramsIndexPath, diagramsIndexContent);
console.log('✅ Fixed src/diagrams/index.js (diagrams registry)');

// 3. Check if BaseDiagram exists
const baseDiagramPath = 'src/diagrams/BaseDiagram.js';
if (fs.existsSync(baseDiagramPath)) {
  console.log('✅ BaseDiagram.js exists');
} else {
  console.log('❌ BaseDiagram.js missing - creating it...');
  const baseContent = `export default class BaseDiagram {
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
  }

  generate() {
    this.validate();
    this.container = this.createContainer();
    this.svg = this.render();
    this.applyStyles();
    return this.svg;
  }

  validate() {
    if (!this.data) throw new Error('No data provided');
    if (!this.data.type) throw new Error('Missing required field: type');
    return true;
  }

  render() {
    throw new Error('render() must be implemented by child class');
  }

  createContainer() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.options.width);
    svg.setAttribute('height', this.options.height);
    svg.setAttribute('viewBox', \`0 0 \${this.options.width} \${this.options.height}\`);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return svg;
  }

  applyStyles() {
    if (this.svg) {
      this.svg.style.backgroundColor = this.options.backgroundColor;
      this.svg.style.display = 'block';
      this.svg.style.maxWidth = '100%';
      this.svg.style.maxHeight = '100%';
    }
  }

  createRect(attrs = {}) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    Object.entries(attrs).forEach(([k, v]) => rect.setAttribute(k, v));
    return rect;
  }

  createCircle(attrs = {}) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    Object.entries(attrs).forEach(([k, v]) => circle.setAttribute(k, v));
    return circle;
  }

  createText(attrs = {}, content = '') {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    Object.entries(attrs).forEach(([k, v]) => text.setAttribute(k, v));
    text.textContent = content;
    return text;
  }

  createLine(attrs = {}) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    Object.entries(attrs).forEach(([k, v]) => line.setAttribute(k, v));
    return line;
  }

  createPath(attrs = {}) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    Object.entries(attrs).forEach(([k, v]) => path.setAttribute(k, v));
    return path;
  }

  createGroup(attrs = {}) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Object.entries(attrs).forEach(([k, v]) => group.setAttribute(k, v));
    return group;
  }

  toSVGString() {
    if (!this.svg) throw new Error('No SVG generated');
    return new XMLSerializer().serializeToString(this.svg);
  }
}`;
  fs.writeFileSync(baseDiagramPath, baseContent);
  console.log('✅ Created BaseDiagram.js');
}

// 4. Check if all diagram renderers exist
const renderers = [
  ['bar', 'BarDiagram'],
  ['pie', 'PieDiagram'],
  ['line', 'LineDiagram'],
  ['circular', 'CircularDiagram'],
  ['linear', 'LinearDiagram'],
  ['directional', 'DirectionalDiagram'],
  ['venn', 'VennDiagram'],
  ['bloodRelation', 'BloodRelationDiagram']
];

console.log('\n📁 Checking diagram renderers:');
renderers.forEach(([name, className]) => {
  const filePath = `src/diagrams/${name}/index.js`;
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${name}/index.js exists`);
  } else {
    console.log(`  ❌ ${name}/index.js MISSING - creating placeholder...`);
    // Create directory
    if (!fs.existsSync(`src/diagrams/${name}`)) {
      fs.mkdirSync(`src/diagrams/${name}`, { recursive: true });
    }
    const placeholderContent = `import BaseDiagram from '../BaseDiagram';

export default class ${className} extends BaseDiagram {
  constructor(data, options = {}) {
    super(data, options);
  }

  validate() {
    super.validate();
  }

  render() {
    const { width, height } = this.options;
    const svg = this.createContainer();
    svg.appendChild(this.createRect({ width, height, fill: '#ffffff' }));
    const text = this.createText({
      x: width / 2,
      y: height / 2,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      'font-size': '20px',
      fill: '#a0aec0'
    }, '${name} diagram');
    svg.appendChild(text);
    return svg;
  }
}`;
    fs.writeFileSync(filePath, placeholderContent);
    console.log(`  ✅ Created placeholder for ${name}/index.js`);
  }
});

console.log('\n🎉 All fixes applied!');
console.log('\n🚀 Now run:');
console.log('  npm run dev');