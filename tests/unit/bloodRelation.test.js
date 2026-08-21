import BloodRelationDiagram from '../../src/diagrams/bloodRelation/renderer';
import { bloodRelationSample, bloodRelationSampleLarge, bloodRelationSampleSimple } from '../../src/samples/bloodRelation.sample';

describe('BloodRelationDiagram', () => {
  test('should create instance with valid data', () => {
    const diagram = new BloodRelationDiagram(bloodRelationSample);
    expect(diagram).toBeInstanceOf(BloodRelationDiagram);
  });

  test('should validate data correctly', () => {
    const diagram = new BloodRelationDiagram(bloodRelationSample);
    expect(() => diagram.validate()).not.toThrow();
  });

  test('should throw error on missing persons', () => {
    const invalidData = {
      type: 'bloodRelation',
      data: {
        relationships: []
      }
    };
    const diagram = new BloodRelationDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Blood relation tree requires a persons array');
  });

  test('should throw error on missing relationships', () => {
    const invalidData = {
      type: 'bloodRelation',
      data: {
        persons: [{ id: 1, name: 'Person' }]
      }
    };
    const diagram = new BloodRelationDiagram(invalidData);
    expect(() => diagram.validate()).toThrow('Blood relation tree requires a relationships array');
  });

  test('should generate SVG for family tree', () => {
    const diagram = new BloodRelationDiagram(bloodRelationSample);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    expect(svg.tagName).toBe('svg');
    
    // Check for nodes (rectangles)
    const rects = svg.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(0);
  });

  test('should handle large family tree', () => {
    const diagram = new BloodRelationDiagram(bloodRelationSampleLarge);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Should render all nodes
    const rects = svg.querySelectorAll('rect');
    expect(rects.length).toBeGreaterThan(5);
  });

  test('should handle simple family tree', () => {
    const diagram = new BloodRelationDiagram(bloodRelationSampleSimple);
    const svg = diagram.generate();
    expect(svg).toBeInstanceOf(SVGElement);
    
    // Check for gender symbols
    const texts = svg.querySelectorAll('text');
    const hasGenderSymbol = Array.from(texts).some(t => t.textContent === '♂' || t.textContent === '♀');
    expect(hasGenderSymbol).toBe(true);
  });

  test('should export SVG string', () => {
    const diagram = new BloodRelationDiagram(bloodRelationSample);
    diagram.generate();
    const svgString = diagram.toSVGString();
    expect(svgString).toContain('<svg');
    expect(svgString).toContain('</svg>');
  });
});