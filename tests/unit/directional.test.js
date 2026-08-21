import DirectionalDiagram from '../../src/diagrams/directional/renderer';
import { directionalSample, directionalSampleNetwork, directionalSampleWorkflow } from '../../src/samples/directional.sample';

describe('DirectionalDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new DirectionalDiagram(directionalSample);
    expect(diagram).toBeInstanceOf(DirectionalDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new DirectionalDiagram(directionalSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on missing nodes', () => {
    const invalidData = {
      type: 'directional',
      data: {
        connections: [{ from: 1, to: 2 }]
      }
    };
    const diagram = new DirectionalDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Directional layout requires a nodes array');
  });

  test('should throw error on missing connections', () => {
    const invalidData = {
      type: 'directional',
      data: {
        nodes: [{ id: 1, label: 'Node 1' }, { id: 2, label: 'Node 2' }]
      }
    };
    const diagram = new DirectionalDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Directional layout requires at least one connection');
  });

  test('should generate SVG', () => {
    const diagram = new DirectionalDiagram(directionalSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
    
    // Check for nodes (circles or paths)
    const nodes = svg.querySelectorAll('circle, path');
    expect(nodes.length).toBeGreaterThan(0);
  });

  test('should handle network topology', () => {
    const diagram = new DirectionalDiagram(directionalSampleNetwork);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should have connections with weights
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  test('should handle workflow diagram', () => {
    const diagram = new DirectionalDiagram(directionalSampleWorkflow);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should render all nodes
    const circles = svg.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  test('should export SVG string', () => {
    const diagram = new DirectionalDiagram(directionalSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});