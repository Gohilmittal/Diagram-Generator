import LinearDiagram from '../../src/diagrams/linear/renderer';
import { linearSample, linearSampleVertical, linearSampleWithValues } from '../../src/samples/linear.sample';

describe('LinearDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new LinearDiagram(linearSample);
    expect(diagram).toBeInstanceOf(LinearDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new LinearDiagram(linearSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on missing nodes', () => {
    const invalidData = {
      type: 'linear',
      data: {}
    };
    const diagram = new LinearDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Linear layout requires a nodes array');
  });

  test('should throw error on insufficient nodes', () => {
    const invalidData = {
      type: 'linear',
      data: {
        nodes: [{ id: 1, label: 'Only One' }]
      }
    };
    const diagram = new LinearDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Linear layout requires at least 2 nodes');
  });

  test('should generate SVG', () => {
    const diagram = new LinearDiagram(linearSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
    
    // Check for nodes (circles)
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  test('should handle vertical orientation', () => {
    const diagram = new LinearDiagram(linearSampleVertical);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should still render
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  test('should show values on nodes', () => {
    const diagram = new LinearDiagram(linearSampleWithValues);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should have text elements with values
    const texts = svg.querySelectorAll('text');
    const hasValue = Array.from(texts).some(t => t.textContent.includes('45'));
    expect(hasValue).toBe(true);
  });

  test('should export SVG string', () => {
    const diagram = new LinearDiagram(linearSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});