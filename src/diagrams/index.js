import BaseDiagram from './BaseDiagram';
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
    throw new Error(`Unsupported diagram type: ${type}. Supported types: ${Object.keys(diagramMap).join(', ')}`);
  }
  return new DiagramClass(data, options);
}

export function getSupportedTypes() {
  return Object.keys(diagramMap);
}

export { BaseDiagram };