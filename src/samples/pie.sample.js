export const pieSample = {
  type: 'pie',
  width: 800,
  height: 600,
  data: [
    { label: 'Technology', value: 35 },
    { label: 'Healthcare', value: 25 },
    { label: 'Finance', value: 20 },
    { label: 'Retail', value: 12 },
    { label: 'Education', value: 8 }
  ],
  options: {
    title: 'Market Share by Sector',
    showPercentages: true,
    showLabels: true,
    labelPosition: 'outside',
    sortSlices: false,
    colors: ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181']
  }
};

// Donut chart sample
export const pieSampleDonut = {
  type: 'pie',
  width: 800,
  height: 600,
  data: [
    { label: 'Product A', value: 45 },
    { label: 'Product B', value: 30 },
    { label: 'Product C', value: 15 },
    { label: 'Product D', value: 10 }
  ],
  options: {
    title: 'Product Revenue Distribution',
    showPercentages: true,
    showLabels: true,
    labelPosition: 'both',
    innerRadius: 0.5,
    colors: ['#4CAF50', '#2196F3', '#FF9800', '#F44336']
  }
};

// Sample with many small segments
export const pieSampleManySegments = {
  type: 'pie',
  width: 900,
  height: 600,
  data: [
    { label: 'Very Large Segment', value: 40 },
    { label: 'Large Segment', value: 25 },
    { label: 'Medium Segment', value: 15 },
    { label: 'Small Segment', value: 8 },
    { label: 'Tiny Segment', value: 5 },
    { label: 'Minute Segment', value: 3 },
    { label: 'Micro Segment', value: 2 },
    { label: 'Nano Segment', value: 2 }
  ],
  options: {
    title: 'Many Segments Example',
    showPercentages: true,
    showLabels: true,
    labelPosition: 'outside',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
  }
};