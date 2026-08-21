export const vennSample = {
  type: 'venn',
  width: 700,
  height: 600,
  data: {
    sets: [
      { name: 'Mathematics', color: '#4299e1', size: 140 },
      { name: 'Physics', color: '#48bb78', size: 130 },
      { name: 'Chemistry', color: '#ed8936', size: 120 }
    ],
    regions: {
      '1': 'Pure Math',
      '2': 'Classical Physics',
      '3': 'Organic Chem',
      '12': 'Math Physics',
      '13': 'Math Chemistry',
      '23': 'Physical Chem',
      '123': 'Quantum Chemistry'
    }
  },
  options: {
    title: 'STEM Field Overlap',
    showLabels: true,
    showRegionLabels: true,
    labelPosition: 'outside',
    opacity: 0.5,
    strokeWidth: 2
  }
};

export const vennSampleTwoSet = {
  type: 'venn',
  width: 600,
  height: 500,
  data: {
    sets: [
      { name: 'Option A', color: '#4299e1', size: 150 },
      { name: 'Option B', color: '#48bb78', size: 150 }
    ],
    regions: {
      '1': 'A Only',
      '2': 'B Only',
      '12': 'Both A and B'
    }
  },
  options: {
    title: 'Feature Comparison',
    showLabels: true,
    showRegionLabels: true,
    labelPosition: 'outside',
    opacity: 0.6,
    strokeWidth: 2
  }
};

export const vennSampleSales = {
  type: 'venn',
  width: 700,
  height: 600,
  data: {
    sets: [
      { name: 'Online Store', color: '#4299e1', size: 130 },
      { name: 'Physical Store', color: '#48bb78', size: 120 },
      { name: 'Mobile App', color: '#ed8936', size: 110 }
    ],
    regions: {
      '1': 'Web Only: 45%',
      '2': 'Store Only: 30%',
      '3': 'App Only: 15%',
      '12': 'Web + Store: 8%',
      '13': 'Web + App: 12%',
      '23': 'Store + App: 5%',
      '123': 'All Channels: 10%'
    }
  },
  options: {
    title: 'Sales Channel Overlap',
    showLabels: true,
    showRegionLabels: true,
    labelPosition: 'outside',
    opacity: 0.4,
    strokeWidth: 2
  }
};