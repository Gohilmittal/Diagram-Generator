import VennDiagram from '../../src/diagrams/venn/renderer';
import { vennSample, vennSampleTwoSet, vennSampleSales } from '../../src/samples/venn.sample';

describe('VennDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new VennDiagram(vennSample);
    expect(diagram).toBeInstanceOf(VennDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new VennDiagram(vennSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on missing sets', () => {
    const invalidData = {
      type: 'venn',
      data: {}
    };
    const diagram = new VennDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Venn diagram requires a sets array');
  });

  test('should throw error on invalid number of sets', () => {
    const invalidData = {
      type: 'venn',
      data: {
        sets: [{ name: 'Set 1' }]
      }
    };
    const diagram = new VennDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Venn diagram supports exactly 2 or 3 sets');
  });

  test('should generate SVG for 3-set Venn', () => {
    const diagram = new VennDiagram(vennSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
    
    // Check for circles
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBe(3);
  });

  test('should generate SVG for 2-set Venn', () => {
    const diagram = new VennDiagram(vennSampleTwoSet);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Check for circles
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  test('should handle region labels', () => {
    const diagram = new VennDiagram(vennSampleSales);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Check for text labels
    const texts = svg.querySelectorAll('text');
    expect(texts.length).toBeGreaterThan(0);
  });

  test('should export SVG string', () => {
    const diagram = new VennDiagram(vennSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});