import PieDiagram from '../../src/diagrams/pie/renderer';
import { pieSample, pieSampleDonut, pieSampleManySegments } from '../../src/samples/pie.sample';

describe('PieDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new PieDiagram(pieSample);
    expect(diagram).toBeInstanceOf(PieDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new PieDiagram(pieSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on empty data', () => {
    const invalidData = {
      type: 'pie',
      data: []
    };
    const diagram = new PieDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Pie chart requires a non-empty data array');
  });

  test('should throw error on all zero values', () => {
    const invalidData = {
      type: 'pie',
      data: [
        { label: 'A', value: 0 },
        { label: 'B', value: 0 }
      ]
    };
    const diagram = new PieDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('All values are zero');
  });

  test('should generate SVG for pie chart', () => {
    const diagram = new PieDiagram(pieSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
    
    // Check for slices (paths)
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should generate donut chart', () => {
    const diagram = new PieDiagram(pieSampleDonut);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Donut should have an empty center
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should handle many segments', () => {
    const diagram = new PieDiagram(pieSampleManySegments);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should have labels for each segment
    const texts = svg.querySelectorAll('text');
    expect(texts.length).toBeGreaterThan(0);
  });

  test('should export SVG string', () => {
    const diagram = new PieDiagram(pieSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});