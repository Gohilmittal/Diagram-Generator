export const directionalSample = {
  type: 'directional',
  width: 900,
  height: 600,
  data: {
    nodes: [
      { id: 'start', label: 'Start', size: 45, color: '#48bb78', shape: 'circle' },
      { id: 'process1', label: 'Process A', size: 40, color: '#4299e1', shape: 'rectangle' },
      { id: 'process2', label: 'Process B', size: 40, color: '#4299e1', shape: 'rectangle' },
      { id: 'decision', label: 'Decision', size: 45, color: '#ed8936', shape: 'diamond' },
      { id: 'process3', label: 'Process C', size: 40, color: '#4299e1', shape: 'rectangle' },
      { id: 'end', label: 'End', size: 45, color: '#fc8181', shape: 'circle' }
    ],
    connections: [
      { from: 'start', to: 'process1', label: 'begin', direction: 'forward', type: 'direct' },
      { from: 'process1', to: 'process2', label: 'step 1', direction: 'forward', type: 'direct' },
      { from: 'process2', to: 'decision', label: 'check', direction: 'forward', type: 'direct' },
      { from: 'decision', to: 'process3', label: 'yes', direction: 'forward', type: 'curved' },
      { from: 'decision', to: 'process2', label: 'no', direction: 'backward', type: 'curved' },
      { from: 'process3', to: 'end', label: 'complete', direction: 'forward', type: 'direct' }
    ]
  },
  options: {
    title: 'Process Flow Diagram',
    nodeSize: 40,
    showLabels: true,
    showArrows: true,
    arrowSize: 10,
    layout: 'tree',
    spacing: 120,
    connectionColor: '#718096',
    colors: ['#48bb78', '#4299e1', '#ed8936', '#fc8181']
  }
};

export const directionalSampleNetwork = {
  type: 'directional',
  width: 900,
  height: 600,
  data: {
    nodes: [
      { id: 'A', label: 'Server A', size: 40, color: '#4299e1', shape: 'circle' },
      { id: 'B', label: 'Server B', size: 40, color: '#48bb78', shape: 'circle' },
      { id: 'C', label: 'Server C', size: 40, color: '#ed8936', shape: 'circle' },
      { id: 'D', label: 'Server D', size: 40, color: '#9f7aea', shape: 'circle' },
      { id: 'E', label: 'Server E', size: 40, color: '#fc8181', shape: 'circle' }
    ],
    connections: [
      { from: 'A', to: 'B', label: '10 Gbps', weight: 3, direction: 'bidirectional' },
      { from: 'A', to: 'C', label: '5 Gbps', weight: 2, direction: 'forward' },
      { from: 'B', to: 'D', label: '10 Gbps', weight: 3, direction: 'bidirectional' },
      { from: 'C', to: 'D', label: '5 Gbps', weight: 2, direction: 'forward' },
      { from: 'C', to: 'E', label: '1 Gbps', weight: 1, direction: 'forward' },
      { from: 'D', to: 'E', label: '10 Gbps', weight: 3, direction: 'bidirectional' }
    ]
  },
  options: {
    title: 'Network Topology',
    nodeSize: 45,
    showLabels: true,
    showArrows: true,
    arrowSize: 8,
    layout: 'grid',
    connectionColor: '#a0aec0'
  }
};

export const directionalSampleWorkflow = {
  type: 'directional',
  width: 800,
  height: 500,
  data: {
    nodes: [
      { id: 'user', label: 'User', size: 35, color: '#4299e1', shape: 'circle' },
      { id: 'frontend', label: 'Frontend', size: 35, color: '#48bb78', shape: 'rectangle' },
      { id: 'api', label: 'API Gateway', size: 40, color: '#ed8936', shape: 'hexagon' },
      { id: 'auth', label: 'Auth Service', size: 35, color: '#9f7aea', shape: 'diamond' },
      { id: 'db', label: 'Database', size: 35, color: '#fc8181', shape: 'rectangle' },
      { id: 'cache', label: 'Cache', size: 35, color: '#68d391', shape: 'rectangle' }
    ],
    connections: [
      { from: 'user', to: 'frontend', label: 'request', direction: 'forward' },
      { from: 'frontend', to: 'api', label: 'API call', direction: 'forward' },
      { from: 'api', to: 'auth', label: 'authenticate', direction: 'forward', type: 'orthogonal' },
      { from: 'auth', to: 'api', label: 'token', direction: 'backward', type: 'orthogonal' },
      { from: 'api', to: 'db', label: 'query', direction: 'forward' },
      { from: 'api', to: 'cache', label: 'read', direction: 'forward', type: 'curved' },
      { from: 'cache', to: 'api', label: 'data', direction: 'backward', type: 'curved' },
      { from: 'api', to: 'frontend', label: 'response', direction: 'backward' },
      { from: 'frontend', to: 'user', label: 'render', direction: 'backward' }
    ]
  },
  options: {
    title: 'System Workflow',
    nodeSize: 35,
    showLabels: true,
    showArrows: true,
    arrowSize: 10,
    layout: 'tree',
    connectionColor: '#718096'
  }
};