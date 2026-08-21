import BaseDiagram from '../BaseDiagram';

/**
 * CircularDiagram - Renders nodes arranged in a circle
 * 
 * Features:
 * - Nodes positioned around a circle
 * - Configurable radius
 * - Labels with offset
 * - Connections between nodes
 * - Different connection types (direct, curved, dashed)
 * - Configurable node sizes and colors
 */
export default class CircularDiagram extends BaseDiagram {
  constructor(data, options = {}) {
    super(data, options);
    this.margin = this.options.margin || { top: 60, right: 60, bottom: 60, left: 60 };
  }

  /**
   * Validate input data
   */
  validate() {
    super.validate();

    if (!this.data.data || !this.data.data.nodes || !Array.isArray(this.data.data.nodes)) {
      throw new Error('Circular layout requires a nodes array');
    }

    if (this.data.data.nodes.length < 2) {
      throw new Error('Circular layout requires at least 2 nodes');
    }

    // Validate nodes
    this.data.data.nodes.forEach((node, index) => {
      if (!node.id && node.id !== 0) {
        throw new Error(`Node ${index} missing id`);
      }
      if (!node.label || typeof node.label !== 'string') {
        throw new Error(`Node ${index} missing label (string required)`);
      }
      if (node.size && (node.size < 10 || node.size > 100)) {
        throw new Error(`Node ${index} size must be between 10 and 100`);
      }
      if (node.color && !/^#[0-9a-fA-F]{6}$/.test(node.color)) {
        throw new Error(`Node ${index} has invalid color format: ${node.color}`);
      }
    });

    // Validate connections if present
    if (this.data.data.connections) {
      const nodeIds = new Set(this.data.data.nodes.map(n => n.id.toString()));
      this.data.data.connections.forEach((conn, index) => {
        if (!conn.from && conn.from !== 0) {
          throw new Error(`Connection ${index} missing from field`);
        }
        if (!conn.to && conn.to !== 0) {
          throw new Error(`Connection ${index} missing to field`);
        }
        if (!nodeIds.has(conn.from.toString())) {
          throw new Error(`Connection ${index}: from node "${conn.from}" not found`);
        }
        if (!nodeIds.has(conn.to.toString())) {
          throw new Error(`Connection ${index}: to node "${conn.to}" not found`);
        }
      });
    }
  }

  /**
   * Render the circular layout
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const {
      title = '',
      radius = 200,
      nodeSize = 45,
      showLabels = true,
      labelOffset = 15,
      colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181', '#68d391', '#63b3ed', '#f6ad55'],
      showConnections = true,
      connectionColor = '#a0aec0'
    } = options;

    const nodes = data.nodes;
    const connections = data.connections || [];

    const largestNodeRadius = nodes.reduce(
      (largest, node) => Math.max(largest, (node.size || nodeSize) / 2),
      nodeSize / 2
    );
    const labelClearance = showLabels ? labelOffset + 12 : 8;
    const topBoundary = title ? 64 : 20;
    const bottomBoundary = 20;

    // Calculate center
    const centerX = width / 2;
    const centerY = (topBoundary + height - bottomBoundary) / 2;
    
    // Calculate actual radius (fit within bounds)
    const maxHorizontalRadius = width / 2 - this.margin.right - largestNodeRadius - labelClearance;
    const maxVerticalRadius = Math.min(
      centerY - topBoundary,
      height - bottomBoundary - centerY
    ) - largestNodeRadius - labelClearance;
    const maxRadius = Math.max(Math.min(maxHorizontalRadius, maxVerticalRadius), 40);
    const actualRadius = Math.min(radius, maxRadius);

    // Create SVG container
    const svg = this.createContainer();
    
    // Add background
    svg.appendChild(this.createRect({
      width: width,
      height: height,
      fill: this.options.backgroundColor || '#ffffff',
      rx: 0
    }));

    // Create main group
    const chart = this.createGroup({
      transform: `translate(${centerX}, ${centerY})`
    });
    svg.appendChild(chart);

    // Calculate node positions
    const nodePositions = this.calculatePositions(nodes, actualRadius);

    // Draw connections first (so they're behind nodes)
    if (showConnections && connections.length > 0) {
      this.drawConnections(chart, connections, nodePositions, connectionColor);
    }

    // Draw nodes
    this.drawNodes(chart, nodes, nodePositions, nodeSize, colors, showLabels, labelOffset);

    // Draw title
    if (title) {
      this.drawTitle(svg, title, centerX);
    }

    return svg;
  }

  /**
   * Calculate positions for nodes around the circle
   */
  calculatePositions(nodes, radius) {
    const positions = {};
    const totalNodes = nodes.length;
    
    nodes.forEach((node, index) => {
      const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      positions[node.id] = { x, y, angle };
    });
    
    return positions;
  }

  /**
   * Draw connections between nodes
   */
  drawConnections(chart, connections, nodePositions, connectionColor) {
    const connGroup = this.createGroup({ class: 'connections' });
    chart.appendChild(connGroup);

    connections.forEach((conn, index) => {
      const from = nodePositions[conn.from];
      const to = nodePositions[conn.to];
      
      if (!from || !to) return;

      const type = conn.type || 'direct';
      const label = conn.label || '';

      let pathData;
      let strokeDasharray = '';

      switch (type) {
        case 'curved':
          pathData = this.createCurvedPath(from, to);
          break;
        case 'dashed':
          strokeDasharray = '6,4';
          pathData = this.createDirectPath(from, to);
          break;
        case 'direct':
        default:
          pathData = this.createDirectPath(from, to);
          break;
      }

      // Create path
      const path = this.createPath({
        d: pathData,
        fill: 'none',
        stroke: conn.color || connectionColor,
        'stroke-width': 2,
        'stroke-dasharray': strokeDasharray,
        'opacity': 0.7
      });
      connGroup.appendChild(path);

      // Add label on connection
      if (label) {
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        // Offset slightly perpendicular to the line
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = -dy / len * 12;
        const offsetY = dx / len * 12;

        const text = this.createText({
          x: midX + offsetX,
          y: midY + offsetY,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': '10px',
          'fill': '#718096',
          'background': '#ffffff',
          'padding': '2px 6px',
          'border-radius': '4px'
        }, label);
        connGroup.appendChild(text);
      }
    });
  }

  /**
   * Create direct path between two points
   */
  createDirectPath(from, to) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  /**
   * Create curved path between two points
   */
  createCurvedPath(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Control point offset for curve
    const offset = dist * 0.3;
    const cx = (from.x + to.x) / 2 + offset * (dy / dist);
    const cy = (from.y + to.y) / 2 - offset * (dx / dist);
    
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }

  /**
   * Draw nodes on the circle
   */
  drawNodes(chart, nodes, nodePositions, defaultSize, colors, showLabels, labelOffset) {
    const nodeGroup = this.createGroup({ class: 'nodes' });
    chart.appendChild(nodeGroup);

    nodes.forEach((node, index) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      const size = node.size || defaultSize;
      const color = node.color || colors[index % colors.length];
      const x = pos.x;
      const y = pos.y;

      // Node circle
      const circle = this.createCircle({
        cx: x,
        cy: y,
        r: size / 2,
        fill: color,
        stroke: '#ffffff',
        'stroke-width': 3,
        'cursor': 'pointer'
      });
      
      // Add hover effect
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', size / 2 + 4);
        circle.setAttribute('opacity', '0.9');
      });
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', size / 2);
        circle.setAttribute('opacity', '1');
      });

      nodeGroup.appendChild(circle);

      // Node label
      if (showLabels) {
        const angle = pos.angle;
        const offset = size / 2 + labelOffset;
        
        // Position label outside the circle
        const labelX = x + offset * Math.cos(angle);
        const labelY = y + offset * Math.sin(angle);
        
        // Determine text anchor based on position
        const textAnchor = Math.abs(angle % (2 * Math.PI)) < Math.PI / 2 ? 'start' : 'end';
        
        const text = this.createText({
          x: labelX,
          y: labelY,
          'text-anchor': textAnchor,
          'dominant-baseline': 'central',
          'font-size': '13px',
          'font-weight': '600',
          maxWidth: Math.max(this.options.width / 5, 90),
          minFontSize: 8,
          'fill': '#1a202c',
          'pointer-events': 'none'
        }, node.label);
        nodeGroup.appendChild(text);

        // If node has an icon, display it
        if (node.icon) {
          // For now, just add a small indicator
          const iconText = this.createText({
            x: x,
            y: y + 2,
            'text-anchor': 'middle',
            'dominant-baseline': 'central',
            'font-size': '18px',
            'pointer-events': 'none'
          }, node.icon);
          nodeGroup.appendChild(iconText);
        }
      }
    });
  }

  /**
   * Draw title
   */
  drawTitle(svg, title, centerX) {
    const titleText = this.createText({
      x: centerX,
      y: 30,
      'text-anchor': 'middle',
      'font-size': '18px',
      'font-weight': '700',
      maxWidth: this.options.width - 40,
      fill: '#1a202c'
    }, title);
    svg.appendChild(titleText);
  }
}
