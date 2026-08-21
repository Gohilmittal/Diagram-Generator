export const linearSample = {
  type: 'linear',
  width: 900,
  height: 400,
  data: {
    nodes: [
      { id: 1, label: 'Start', size: 45, color: '#48bb78' },
      { id: 2, label: 'Step 1', size: 40, color: '#4299e1' },
      { id: 3, label: 'Step 2', size: 40, color: '#4299e1' },
      { id: 4, label: 'Step 3', size: 40, color: '#4299e1' },
      { id: 5, label: 'Step 4', size: 40, color: '#4299e1' },
      { id: 6, label: 'End', size: 45, color: '#ed8936' }
    ],
    connections: [
      { from: 1, to: 2, label: 'start' },
      { from: 2, to: 3, label: 'next', type: 'arrow' },
      { from: 3, to: 4, label: 'next', type: 'arrow' },
      { from: 4, to: 5, label: 'next', type: 'arrow' },
      { from: 5, to: 6, label: 'finish', type: 'arrow' }
    ]
  },
  options: {
    title: 'Process Flow',
    orientation: 'horizontal',
    spacing: 120,
    nodeSize: 40,
    showLabels: true,
    labelPosition: 'bottom',
    showConnections: true,
    connectionColor: '#718096',
    showValues: false
  }
};

export const linearSampleVertical = {
  type: 'linear',
  width: 600,
  height: 700,
  data: {
    nodes: [
      { id: 'top', label: 'CEO', size: 50, color: '#9f7aea' },
      { id: 'vp1', label: 'VP Product', size: 40, color: '#4299e1' },
      { id: 'vp2', label: 'VP Engineering', size: 40, color: '#48bb78' },
      { id: 'vp3', label: 'VP Sales', size: 40, color: '#ed8936' },
      { id: 'm1', label: 'PM Lead', size: 35, color: '#63b3ed' },
      { id: 'm2', label: 'Tech Lead', size: 35, color: '#68d391' },
      { id: 'm3', label: 'Sales Lead', size: 35, color: '#f6ad55' }
    ],
    connections: [
      { from: 'top', to: 'vp1', type: 'arrow' },
      { from: 'top', to: 'vp2', type: 'arrow' },
      { from: 'top', to: 'vp3', type: 'arrow' },
      { from: 'vp1', to: 'm1', type: 'arrow' },
      { from: 'vp2', to: 'm2', type: 'arrow' },
      { from: 'vp3', to: 'm3', type: 'arrow' }
    ]
  },
  options: {
    title: 'Organization Hierarchy',
    orientation: 'vertical',
    spacing: 90,
    nodeSize: 40,
    showLabels: true,
    labelPosition: 'bottom',
    showConnections: true,
    connectionColor: '#a0aec0'
  }
};

export const linearSampleWithValues = {
  type: 'linear',
  width: 900,
  height: 450,
  data: {
    nodes: [
      { id: 'q1', label: 'Q1', value: 45, color: '#4299e1' },
      { id: 'q2', label: 'Q2', value: 62, color: '#48bb78' },
      { id: 'q3', label: 'Q3', value: 38, color: '#ed8936' },
      { id: 'q4', label: 'Q4', value: 71, color: '#9f7aea' },
      { id: 'q5', label: 'Q5', value: 55, color: '#fc8181' },
      { id: 'q6', label: 'Q6', value: 83, color: '#68d391' }
    ],
    connections: [
      { from: 'q1', to: 'q2', type: 'arrow' },
      { from: 'q2', to: 'q3', type: 'arrow' },
      { from: 'q3', to: 'q4', type: 'arrow' },
      { from: 'q4', to: 'q5', type: 'arrow' },
      { from: 'q5', to: 'q6', type: 'arrow' }
    ]
  },
  options: {
    title: 'Quarterly Performance',
    orientation: 'horizontal',
    spacing: 130,
    nodeSize: 45,
    showLabels: true,
    labelPosition: 'center',
    showConnections: true,
    connectionColor: '#718096',
    showValues: true
  }
};