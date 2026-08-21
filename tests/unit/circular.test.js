import CircularDiagram from '../../src/diagrams/circular/renderer';
import { circularSample, circularSampleSimple, circularSampleTech } from '../../src/samples/circular.sample';

describe('CircularDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new CircularDiagram(circularSample);
    expect(diagram).toBeInstanceOf(CircularDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new CircularDiagram(circularSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on missing nodes', () => {
    const invalidData = {
      type: 'circular',
      data: {}
    };
    const diagram = new CircularDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Circular layout requires a nodes array');
  });

  test('should throw error on insufficient nodes', () => {
    const invalidData = {
      type: 'circular',
      data: {
        nodes: [{ id: 1, label: 'Only One' }]
      }
    };
    const diagram = new CircularDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Circular layout requires at least 2 nodes');
  });

  test('should generate SVG', () => {
    const diagram = new CircularDiagram(circularSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
    
    // Check for nodes (circles)
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  test('should handle simple circular layout', () => {
    const diagram = new CircularDiagram(circularSampleSimple);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Check for connections (paths)
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should handle tech architecture diagram', () => {
    const diagram = new CircularDiagram(circularSampleTech);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should have nodes and connections
    const circles = svg.querySelectorAll('circle');
    const paths = svg.querySelectorAll('path');
    expect(circles.length).toBeGreaterThan(0);
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should export SVG string', () => {
    const diagram = new CircularDiagram(circularSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});