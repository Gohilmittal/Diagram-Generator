import LineDiagram from '../../src/diagrams/line/renderer';
import { lineSample, lineSampleMultiple, lineSampleStep } from '../../src/samples/line.sample';

describe('LineDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new LineDiagram(lineSample);
    expect(diagram).toBeInstanceOf(LineDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new LineDiagram(lineSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on missing series', () => {
    const invalidData = {
      type: 'line',
      data: {}
    };
    const diagram = new LineDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Line graph requires a series array');
  });

  test('should throw error on empty series', () => {
    const invalidData = {
      type: 'line',
      data: { series: [] }
    };
    const diagram = new LineDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Line graph requires at least one series');
  });

  test('should generate SVG', () => {
    const diagram = new LineDiagram(lineSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
    
    // Check for paths (lines)
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should handle multiple series', () => {
    const diagram = new LineDiagram(lineSampleMultiple);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Check for multiple lines
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should handle step curve', () => {
    const diagram = new LineDiagram(lineSampleStep);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should still render
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should export SVG string', () => {
    const diagram = new LineDiagram(lineSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});