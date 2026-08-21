import { barSample, barSampleWithNegative, barSampleHorizontal } from './bar.sample';
import { circularSample, circularSampleSimple, circularSampleTech } from './circular.sample';
import { linearSample, linearSampleVertical, linearSampleWithValues } from './linear.sample';
import { directionalSample, directionalSampleNetwork, directionalSampleWorkflow } from './directional.sample';
import { pieSample, pieSampleDonut, pieSampleManySegments } from './pie.sample';
import { 
  bloodRelationSample, 
  bloodRelationSampleLarge, 
  bloodRelationSampleSimple 
} from './bloodRelation.sample';
import { lineSample, lineSampleMultiple, lineSampleStep } from './line.sample';
import { vennSample, vennSampleTwoSet, vennSampleSales } from './venn.sample';

const sampleMap = {
  bar: barSample,
  circular: circularSample,
  linear: linearSample,
  directional: directionalSample,
  pie: pieSample,
  bloodRelation: bloodRelationSample,
  line: lineSample,
  venn: vennSample
};

// Additional samples for each type
const extraSamples = {
  bar: [barSampleWithNegative, barSampleHorizontal],
  pie: [pieSampleDonut, pieSampleManySegments],
  line: [lineSampleMultiple, lineSampleStep],
  circular: [circularSampleSimple, circularSampleTech],
  linear: [linearSampleVertical, linearSampleWithValues],
  directional: [directionalSampleNetwork, directionalSampleWorkflow],
  venn: [vennSampleTwoSet, vennSampleSales],
  bloodRelation: [bloodRelationSampleLarge, bloodRelationSampleSimple]
};

export function getSampleData(type) {
  return sampleMap[type] || null;
}

export function getExtraSamples(type) {
  return extraSamples[type] || [];
}

export function getAllSamples() {
  return sampleMap;
}