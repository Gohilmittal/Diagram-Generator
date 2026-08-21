export const circularSample = {
  type: 'circular',
  width: 800,
  height: 600,
  data: {
    nodes: [
      { id: 1, label: 'Central Hub', size: 60, color: '#4299e1', icon: '🏢' },
      { id: 2, label: 'Team A', size: 45, color: '#48bb78', icon: '👥' },
      { id: 3, label: 'Team B', size: 45, color: '#ed8936', icon: '👥' },
      { id: 4, label: 'Team C', size: 45, color: '#9f7aea', icon: '👥' },
      { id: 5, label: 'Client X', size: 40, color: '#fc8181', icon: '🤝' },
      { id: 6, label: 'Client Y', size: 40, color: '#68d391', icon: '🤝' },
      { id: 7, label: 'Partner Z', size: 40, color: '#63b3ed', icon: '🤝' }
    ],
    connections: [
      { from: 1, to: 2, label: 'leads' },
      { from: 1, to: 3, label: 'leads' },
      { from: 1, to: 4, label: 'leads' },
      { from: 2, to: 5, label: 'serves' },
      { from: 3, to: 5, label: 'serves' },
      { from: 4, to: 6, label: 'serves' },
      { from: 4, to: 7, label: 'partners' },
      { from: 1, to: 7, label: 'partners', type: 'dashed' }
    ]
  },
  options: {
    title: 'Organization Network',
    radius: 220,
    nodeSize: 45,
    showLabels: true,
    labelOffset: 20,
    showConnections: true,
    connectionColor: '#718096'
  }
};

export const circularSampleSimple = {
  type: 'circular',
  width: 700,
  height: 600,
  data: {
    nodes: [
      { id: 'A', label: 'Node A', color: '#4299e1' },
      { id: 'B', label: 'Node B', color: '#48bb78' },
      { id: 'C', label: 'Node C', color: '#ed8936' },
      { id: 'D', label: 'Node D', color: '#9f7aea' },
      { id: 'E', label: 'Node E', color: '#fc8181' },
      { id: 'F', label: 'Node F', color: '#68d391' }
    ],
    connections: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'E', to: 'F' },
      { from: 'F', to: 'A' }
    ]
  },
  options: {
    title: 'Simple Circular Network',
    radius: 180,
    nodeSize: 40,
    showLabels: true,
    labelOffset: 18
  }
};

export const circularSampleTech = {
  type: 'circular',
  width: 900,
  height: 700,
  data: {
    nodes: [
      { id: 'web', label: 'Web App', size: 55, color: '#4299e1', icon: '🌐' },
      { id: 'api', label: 'API Gateway', size: 50, color: '#48bb78', icon: '🔌' },
      { id: 'auth', label: 'Auth Service', size: 45, color: '#ed8936', icon: '🔐' },
      { id: 'db', label: 'Database', size: 45, color: '#9f7aea', icon: '🗄️' },
      { id: 'cache', label: 'Cache', size: 40, color: '#fc8181', icon: '⚡' },
      { id: 'queue', label: 'Queue', size: 40, color: '#68d391', icon: '📨' },
      { id: 'cdn', label: 'CDN', size: 40, color: '#63b3ed', icon: '🌍' }
    ],
    connections: [
      { from: 'web', to: 'api', label: 'requests', type: 'curved' },
      { from: 'api', to: 'auth', label: 'authenticates' },
      { from: 'api', to: 'db', label: 'queries' },
      { from: 'api', to: 'cache', label: 'reads', type: 'dashed' },
      { from: 'api', to: 'queue', label: 'enqueues' },
      { from: 'web', to: 'cdn', label: 'serves' },
      { from: 'db', to: 'cache', label: 'invalidates', type: 'dashed' }
    ]
  },
  options: {
    title: 'System Architecture',
    radius: 250,
    nodeSize: 45,
    showLabels: true,
    labelOffset: 22,
    showConnections: true,
    connectionColor: '#a0aec0'
  }
};