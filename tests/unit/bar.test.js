import BarDiagram from '../../src/diagrams/bar/renderer';
import { barSample, barSampleWithNegative, barSampleHorizontal } from '../../src/samples/bar.sample';

describe('BarDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new BarDiagram(barSample);
    expect(diagram).toBeInstanceOf(BarDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new BarDiagram(barSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on invalid data', () => {
    const invalidData = {
      type: 'bar',
      data: []
    };
    const diagram = new BarDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Bar diagram requires a non-empty data array');
  });

  test('should generate SVG', () => {
    const diagram = new BarDiagram(barSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
  });

  test('should handle negative values', () => {
    const diagram = new BarDiagram(barSampleWithNegative);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    // Check that bars exist
    const rects = svg.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  test('should handle horizontal orientation', () => {
    const diagram = new BarDiagram(barSampleHorizontal);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    // Check that we have bars
    const rects = svg.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  test('should export SVG string', () => {
    const diagram = new BarDiagram(barSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});