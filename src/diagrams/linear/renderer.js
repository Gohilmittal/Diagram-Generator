import BaseDiagram from '../BaseDiagram';

/**
 * LinearDiagram - Renders nodes arranged in a line
 * 
 * Features:
 * - Horizontal or vertical orientation
 * - Configurable spacing
 * - Labels with configurable position
 * - Connections between nodes
 * - Arrow support for connections
 * - Value display on nodes
 */
export default class LinearDiagram extends BaseDiagram {
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
      throw new Error('Linear layout requires a nodes array');
    }

    if (this.data.data.nodes.length < 2) {
      throw new Error('Linear layout requires at least 2 nodes');
    }

    // Validate nodes
    this.data.data.nodes.forEach((node, index) => {
      if (!node.id && node.id !== 0) {
        throw new Error(`Node ${index} missing id`);
      }
      if (!node.label || typeof node.label !== 'string') {
        throw new Error(`Node ${index} missing label (string required)`);
      }
      if (node.size && (node.size < 20 || node.size > 80)) {
        throw new Error(`Node ${index} size must be between 20 and 80`);
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
   * Render the linear layout
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const {
      title = '',
      orientation = 'horizontal',
      spacing = 80,
      nodeSize = 40,
      showLabels = true,
      labelPosition = 'bottom',
      colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181', '#68d391', '#63b3ed', '#f6ad55'],
      showConnections = true,
      connectionColor = '#a0aec0',
      showValues = false
    } = options;

    const nodes = data.nodes;
    const connections = data.connections || [];

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
      transform: `translate(${this.margin.left}, ${this.margin.top})`
    });
    svg.appendChild(chart);

    // Calculate available space
    const chartWidth = width - this.margin.left - this.margin.right;
    const chartHeight = height - this.margin.top - this.margin.bottom;

    // Calculate node positions
    const nodePositions = this.calculatePositions(
      nodes, 
      orientation, 
      spacing, 
      chartWidth, 
      chartHeight,
      nodeSize
    );

    // Draw connections first (so they're behind nodes)
    if (showConnections && connections.length > 0) {
      this.drawConnections(chart, connections, nodePositions, connectionColor, orientation);
    }

    // Draw nodes
    this.drawNodes(
      chart, 
      nodes, 
      nodePositions, 
      nodeSize, 
      colors, 
      showLabels, 
      labelPosition, 
      orientation,
      showValues
    );

    // Draw title
    if (title) {
      this.drawTitle(svg, title, width);
    }

    return svg;
  }

  /**
   * Calculate positions for nodes along the line
   */
  calculatePositions(nodes, orientation, spacing, chartWidth, chartHeight, nodeSize) {
    const positions = {};
    const totalNodes = nodes.length;
    
    // Calculate total span needed
    const totalSpan = (totalNodes - 1) * spacing;
    
    // Determine start position (centered)
    let startX, startY;
    
    if (orientation === 'horizontal') {
      startX = (chartWidth - totalSpan) / 2;
      startY = chartHeight / 2;
    } else {
      startX = chartWidth / 2;
      startY = (chartHeight - totalSpan) / 2;
    }

    nodes.forEach((node, index) => {
      let x, y;
      
      if (orientation === 'horizontal') {
        x = startX + index * spacing;
        y = startY;
      } else {
        x = startX;
        y = startY + index * spacing;
      }
      
      positions[node.id] = { x, y };
    });
    
    return positions;
  }

  /**
   * Draw connections between nodes
   */
  drawConnections(chart, connections, nodePositions, connectionColor, orientation) {
    const connGroup = this.createGroup({ class: 'connections' });
    chart.appendChild(connGroup);

    connections.forEach((conn) => {
      const from = nodePositions[conn.from];
      const to = nodePositions[conn.to];
      
      if (!from || !to) return;

      const type = conn.type || 'direct';
      const label = conn.label || '';

      let pathData;
      let strokeDasharray = '';
      let markerEnd = '';

      switch (type) {
        case 'arrow':
          pathData = this.createDirectPath(from, to);
          markerEnd = 'url(#arrowhead)';
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
        'marker-end': markerEnd,
        'opacity': 0.7
      });
      connGroup.appendChild(path);

      // Add arrowhead def if needed
      if (type === 'arrow') {
        this.addArrowheadDef(chart);
      }

      // Add label on connection
      if (label) {
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        // Offset perpendicular to the line
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = len > 0 ? -dy / len * 12 : 0;
        const offsetY = len > 0 ? dx / len * 12 : 0;

        // Determine label position based on orientation
        let labelX = midX + offsetX;
        let labelY = midY + offsetY;
        
        if (orientation === 'vertical') {
          labelX = midX + 20;
          labelY = midY;
        }

        const text = this.createText({
          x: labelX,
          y: labelY,
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
   * Add arrowhead definition
   */
  addArrowheadDef(chart) {
    // Check if def already exists
    let defs = chart.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      chart.insertBefore(defs, chart.firstChild);
    }
    
    // Check if arrowhead already exists
    if (!defs.querySelector('#arrowhead')) {
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '10');
      marker.setAttribute('markerHeight', '7');
      marker.setAttribute('refX', '10');
      marker.setAttribute('refY', '3.5');
      marker.setAttribute('orient', 'auto');
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
      polygon.setAttribute('fill', '#a0aec0');
      
      marker.appendChild(polygon);
      defs.appendChild(marker);
    }
  }

  /**
   * Create direct path between two points
   */
  createDirectPath(from, to) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  /**
   * Draw nodes on the line
   */
  drawNodes(chart, nodes, nodePositions, defaultSize, colors, showLabels, labelPosition, orientation, showValues) {
    const nodeGroup = this.createGroup({ class: 'nodes' });
    chart.appendChild(nodeGroup);

    nodes.forEach((node, index) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      const size = node.size || defaultSize;
      const color = node.color || colors[index % colors.length];
      const x = pos.x;
      const y = pos.y;
      const radius = size / 2;

      // Node circle
      const circle = this.createCircle({
        cx: x,
        cy: y,
        r: radius,
        fill: color,
        stroke: '#ffffff',
        'stroke-width': 3,
        'cursor': 'pointer'
      });
      
      // Add hover effect
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', radius + 4);
        circle.setAttribute('opacity', '0.9');
      });
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', radius);
        circle.setAttribute('opacity', '1');
      });

      nodeGroup.appendChild(circle);

      // Node label
      if (showLabels) {
        let labelX = x;
        let labelY = y;
        let textAnchor = 'middle';
        let dominantBaseline = 'central';
        
        // Determine label position
        switch (labelPosition) {
          case 'top':
            labelY = y - radius - 10;
            dominantBaseline = 'baseline';
            break;
          case 'bottom':
            labelY = y + radius + 10;
            dominantBaseline = 'hanging';
            break;
          case 'left':
            labelX = x - radius - 10;
            textAnchor = 'end';
            break;
          case 'right':
            labelX = x + radius + 10;
            textAnchor = 'start';
            break;
          case 'center':
          default:
            // Label inside node
            labelX = x;
            labelY = y;
            textAnchor = 'middle';
            dominantBaseline = 'central';
            // Use white text for inside labels
            break;
        }

        // If label is inside, use white text
        const textColor = labelPosition === 'center' ? '#ffffff' : '#1a202c';
        const fontSize = labelPosition === 'center' ? '11px' : '13px';
        const fontWeight = labelPosition === 'center' ? '600' : '600';

        const text = this.createText({
          x: labelX,
          y: labelY,
          'text-anchor': textAnchor,
          'dominant-baseline': dominantBaseline,
          'font-size': fontSize,
          'font-weight': fontWeight,
          maxWidth: labelPosition === 'center' ? Math.max(size - 10, 24) : Math.max(defaultSize * 2, 80),
          minFontSize: 8,
          'fill': textColor,
          'pointer-events': 'none'
        }, node.label);
        nodeGroup.appendChild(text);

        // Show value if requested
        if (showValues && node.value !== undefined) {
          const valueText = this.createText({
            x: labelX,
            y: labelPosition === 'center' ? y + 18 : y + (labelPosition === 'top' ? -18 : 18),
            'text-anchor': textAnchor,
            'dominant-baseline': labelPosition === 'center' ? 'hanging' : (labelPosition === 'top' ? 'hanging' : 'baseline'),
            'font-size': '10px',
            'fill': labelPosition === 'center' ? 'rgba(255,255,255,0.8)' : '#718096',
            'pointer-events': 'none'
          }, node.value.toString());
          nodeGroup.appendChild(valueText);
        }
      }
    });
  }

  /**
   * Draw title
   */
  drawTitle(svg, title, width) {
    const titleText = this.createText({
      x: width / 2,
      y: 30,
      'text-anchor': 'middle',
      'font-size': '18px',
      'font-weight': '700',
      maxWidth: width - 40,
      fill: '#1a202c'
    }, title);
    svg.appendChild(titleText);
  }
}
