import BaseDiagram from '../BaseDiagram';

/**
 * DirectionalDiagram - Renders directional graphs with arrows
 * 
 * Features:
 * - Nodes with different shapes (circle, rectangle, diamond, hexagon)
 * - Directional connections with arrows
 * - Multiple connection types (direct, curved, orthogonal)
 * - Bidirectional support
 * - Connection weights (thickness)
 * - Auto-layout or manual positioning
 * - Labels on connections
 */
export default class DirectionalDiagram extends BaseDiagram {
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
      throw new Error('Directional layout requires a nodes array');
    }

    if (this.data.data.nodes.length < 2) {
      throw new Error('Directional layout requires at least 2 nodes');
    }

    if (!this.data.data.connections || !Array.isArray(this.data.data.connections) || this.data.data.connections.length === 0) {
      throw new Error('Directional layout requires at least one connection');
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

    // Validate connections
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

  /**
   * Render the directional layout
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const {
      title = '',
      nodeSize = 40,
      showLabels = true,
      colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181', '#68d391', '#63b3ed', '#f6ad55'],
      connectionColor = '#718096',
      showArrows = true,
      arrowSize = 10,
      layout = 'auto',
      spacing = 100
    } = options;

    const nodes = data.nodes;
    const connections = data.connections;

    // Calculate node positions based on layout
    let nodePositions;
    if (layout === 'manual' && nodes.every(n => n.x !== undefined && n.y !== undefined)) {
      // Use manual positions
      nodePositions = this.getManualPositions(nodes);
    } else {
      // Auto-layout
      nodePositions = this.autoLayout(nodes, connections, width, height, spacing, layout);
    }

    // Create SVG container
    const svg = this.createContainer();
    
    // Add background
    svg.appendChild(this.createRect({
      width: width,
      height: height,
      fill: this.options.backgroundColor || '#ffffff',
      rx: 0
    }));

    // Create main group with margin
    const chart = this.createGroup({
      transform: `translate(${this.margin.left}, ${this.margin.top})`
    });
    svg.appendChild(chart);

    // Draw connections first (so they're behind nodes)
    this.drawConnections(
      chart, 
      connections, 
      nodePositions, 
      connectionColor, 
      showArrows, 
      arrowSize
    );

    // Draw nodes
    this.drawNodes(
      chart, 
      nodes, 
      nodePositions, 
      nodeSize, 
      colors, 
      showLabels
    );

    // Draw title
    if (title) {
      this.drawTitle(svg, title, width);
    }

    return svg;
  }

  /**
   * Get manual positions from nodes
   */
  getManualPositions(nodes) {
    const positions = {};
    nodes.forEach(node => {
      positions[node.id] = { x: node.x || 0, y: node.y || 0 };
    });
    return positions;
  }

  /**
   * Auto-layout nodes
   */
  autoLayout(nodes, connections, width, height, spacing, layoutType) {
    const positions = {};
    const totalNodes = nodes.length;
    const chartWidth = width - this.margin.left - this.margin.right;
    const chartHeight = height - this.margin.top - this.margin.bottom;

    if (layoutType === 'grid') {
      // Grid layout
      const cols = Math.ceil(Math.sqrt(totalNodes));
      const rows = Math.ceil(totalNodes / cols);
      const cellWidth = chartWidth / (cols + 1);
      const cellHeight = chartHeight / (rows + 1);
      
      nodes.forEach((node, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        positions[node.id] = {
          x: (col + 1) * cellWidth,
          y: (row + 1) * cellHeight
        };
      });
    } else if (layoutType === 'tree') {
      // Simple tree layout (top-down)
      // Find root nodes (nodes with no incoming connections)
      const incoming = new Set();
      connections.forEach(conn => {
        incoming.add(conn.to.toString());
      });
      
      const roots = nodes.filter(n => !incoming.has(n.id.toString()));
      
      if (roots.length === 0) {
        // If no root, use first node as root
        roots.push(nodes[0]);
      }

      // Simple BFS layout
      const visited = new Set();
      const levels = {};
      const queue = [];
      
      roots.forEach(root => {
        queue.push({ node: root, level: 0 });
      });
      
      while (queue.length > 0) {
        const { node, level } = queue.shift();
        if (visited.has(node.id.toString())) continue;
        visited.add(node.id.toString());
        
        if (!levels[level]) levels[level] = [];
        levels[level].push(node);
        
        // Find children
        connections.forEach(conn => {
          if (conn.from.toString() === node.id.toString() && !visited.has(conn.to.toString())) {
            const child = nodes.find(n => n.id.toString() === conn.to.toString());
            if (child) {
              queue.push({ node: child, level: level + 1 });
            }
          }
        });
      }

      // Position nodes by level
      const levelKeys = Object.keys(levels).sort((a, b) => a - b);
      const maxLevel = levelKeys.length;
      
      levelKeys.forEach((level, levelIndex) => {
        const nodesAtLevel = levels[level];
        const count = nodesAtLevel.length;
        const y = (levelIndex + 1) * (chartHeight / (maxLevel + 1));
        
        nodesAtLevel.forEach((node, index) => {
          const x = (index + 1) * (chartWidth / (count + 1));
          positions[node.id] = { x, y };
        });
      });
      
    } else {
      // Circular layout (default)
      const radius = Math.max(Math.min(chartWidth, chartHeight) / 2 - 40, 40);
      const centerX = chartWidth / 2;
      const centerY = chartHeight / 2;
      
      nodes.forEach((node, index) => {
        const angle = (index / totalNodes) * 2 * Math.PI - Math.PI / 2;
        positions[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
    }

    return positions;
  }

  /**
   * Draw connections between nodes
   */
  drawConnections(chart, connections, nodePositions, defaultColor, showArrows, arrowSize) {
    const connGroup = this.createGroup({ class: 'connections' });
    chart.appendChild(connGroup);

    // Add defs for arrowheads
    if (showArrows) {
      this.addArrowheadDefs(chart, arrowSize);
    }

    connections.forEach((conn, index) => {
      const from = nodePositions[conn.from];
      const to = nodePositions[conn.to];
      
      if (!from || !to) return;

      const direction = conn.direction || 'forward';
      const type = conn.type || 'direct';
      const color = conn.color || defaultColor;
      const weight = conn.weight || 1;
      const label = conn.label || '';

      let pathData;
      let markerStart = '';
      let markerEnd = '';

      // Determine path based on type
      switch (type) {
        case 'curved':
          pathData = this.createCurvedPath(from, to);
          break;
        case 'orthogonal':
          pathData = this.createOrthogonalPath(from, to);
          break;
        case 'direct':
        default:
          pathData = this.createDirectPath(from, to);
          break;
      }

      // Set markers based on direction
      if (showArrows) {
        if (direction === 'forward' || direction === 'bidirectional') {
          markerEnd = 'url(#arrowhead-end)';
        }
        if (direction === 'backward' || direction === 'bidirectional') {
          markerStart = 'url(#arrowhead-start)';
        }
      }

      // Create path
      const path = this.createPath({
        d: pathData,
        fill: 'none',
        stroke: color,
        'stroke-width': weight * 2,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'marker-start': markerStart,
        'marker-end': markerEnd,
        'opacity': 0.8
      });
      connGroup.appendChild(path);

      // Add label on connection
      if (label) {
        const midPoint = this.getMidPoint(pathData);
        if (midPoint) {
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const isVertical = Math.abs(dy) >= Math.abs(dx);
          const isCurved = type === 'curved';
          const labelX = isVertical
            ? midPoint.x + (isCurved ? 24 : -20)
            : midPoint.x;
          const labelY = isVertical ? midPoint.y : midPoint.y - 10;
          const textAnchor = isVertical ? (isCurved ? 'start' : 'end') : 'middle';

          const text = this.createText({
            x: labelX,
            y: labelY,
            'text-anchor': textAnchor,
            'dominant-baseline': isVertical ? 'central' : 'bottom',
            'font-size': '11px',
            maxWidth: 90,
            minFontSize: 8,
            'fill': '#2d3748',
            'background': '#ffffff',
            'padding': '2px 8px',
            'border-radius': '4px'
          }, label);
          connGroup.appendChild(text);
        }
      }
    });
  }

  /**
   * Add arrowhead definitions
   */
  addArrowheadDefs(chart, size) {
    let defs = chart.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      chart.insertBefore(defs, chart.firstChild);
    }
    
    const arrowSize = size || 10;
    const halfSize = arrowSize / 2;

    // End arrowhead
    if (!defs.querySelector('#arrowhead-end')) {
      const markerEnd = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      markerEnd.setAttribute('id', 'arrowhead-end');
      markerEnd.setAttribute('markerWidth', arrowSize);
      markerEnd.setAttribute('markerHeight', arrowSize);
      markerEnd.setAttribute('refX', arrowSize);
      markerEnd.setAttribute('refY', halfSize);
      markerEnd.setAttribute('orient', 'auto');
      
      const polygonEnd = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygonEnd.setAttribute('points', `0 0, ${arrowSize} ${halfSize}, 0 ${arrowSize}`);
      polygonEnd.setAttribute('fill', '#718096');
      
      markerEnd.appendChild(polygonEnd);
      defs.appendChild(markerEnd);
    }

    // Start arrowhead
    if (!defs.querySelector('#arrowhead-start')) {
      const markerStart = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      markerStart.setAttribute('id', 'arrowhead-start');
      markerStart.setAttribute('markerWidth', arrowSize);
      markerStart.setAttribute('markerHeight', arrowSize);
      markerStart.setAttribute('refX', '0');
      markerStart.setAttribute('refY', halfSize);
      markerStart.setAttribute('orient', 'auto');
      
      const polygonStart = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygonStart.setAttribute('points', `${arrowSize} 0, 0 ${halfSize}, ${arrowSize} ${arrowSize}`);
      polygonStart.setAttribute('fill', '#718096');
      
      markerStart.appendChild(polygonStart);
      defs.appendChild(markerStart);
    }
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
    
    // Control point offset
    const offset = Math.min(dist * 0.3, 80);
    const cx = (from.x + to.x) / 2 + offset * (dy / (dist || 1));
    const cy = (from.y + to.y) / 2 - offset * (dx / (dist || 1));
    
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }

  /**
   * Create orthogonal (right-angle) path
   */
  createOrthogonalPath(from, to) {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    // Determine best path
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    
    if (dx > dy) {
      // Horizontal then vertical
      return `M ${from.x} ${from.y} L ${to.x} ${from.y} L ${to.x} ${to.y}`;
    } else {
      // Vertical then horizontal
      return `M ${from.x} ${from.y} L ${from.x} ${to.y} L ${to.x} ${to.y}`;
    }
  }

  /**
   * Get midpoint of a path
   */
  getMidPoint(pathData) {
    // Simple parser for path data
    const points = pathData.match(/[\d.]+/g);
    if (!points || points.length < 4) return null;
    
    const x1 = parseFloat(points[0]);
    const y1 = parseFloat(points[1]);
    const x2 = parseFloat(points[points.length - 2]);
    const y2 = parseFloat(points[points.length - 1]);
    
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2
    };
  }

  /**
   * Draw nodes
   */
  drawNodes(chart, nodes, nodePositions, defaultSize, colors, showLabels) {
    const nodeGroup = this.createGroup({ class: 'nodes' });
    chart.appendChild(nodeGroup);

    nodes.forEach((node, index) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      const size = node.size || defaultSize;
      const color = node.color || colors[index % colors.length];
      const shape = node.shape || 'circle';
      const x = pos.x;
      const y = pos.y;
      const labelWidth = showLabels ? this.estimateTextWidth(node.label, 12) : 0;
      const contentWidth = Math.min(Math.max(labelWidth + 18, size), 130);
      const shapeWidth = shape === 'circle' ? Math.min(contentWidth, 76) : contentWidth;
      const shapeHeight = shape === 'rectangle'
        ? Math.max(size * 0.7, 30)
        : Math.max(size, 40);

      let shapeElement;

      // Create shape based on type
      switch (shape) {
        case 'rectangle':
          shapeElement = this.createRect({
            x: x - shapeWidth / 2,
            y: y - shapeHeight / 2,
            width: shapeWidth,
            height: shapeHeight,
            fill: color,
            stroke: '#ffffff',
            'stroke-width': 2,
            rx: 4
          });
          break;
        case 'diamond':
          const halfWidth = Math.max(shapeWidth * 0.62, size / 2);
          const halfHeight = Math.max(shapeHeight / 2, 24);
          const diamondPath = `M ${x} ${y - halfHeight} L ${x + halfWidth} ${y} L ${x} ${y + halfHeight} L ${x - halfWidth} ${y} Z`;
          shapeElement = this.createPath({
            d: diamondPath,
            fill: color,
            stroke: '#ffffff',
            'stroke-width': 2
          });
          break;
        case 'hexagon':
          const hexPoints = [];
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
            const px = x + shapeWidth / 2 * Math.cos(angle);
            const py = y + shapeHeight / 2 * Math.sin(angle);
            hexPoints.push(`${px},${py}`);
          }
          const hexPath = `M ${hexPoints.join(' L ')} Z`;
          shapeElement = this.createPath({
            d: hexPath,
            fill: color,
            stroke: '#ffffff',
            'stroke-width': 2
          });
          break;
        case 'circle':
        default:
          shapeElement = this.createCircle({
            cx: x,
            cy: y,
            r: Math.max(shapeWidth, shapeHeight) / 2,
            fill: color,
            stroke: '#ffffff',
            'stroke-width': 2
          });
          break;
      }

      // Add hover effect
      shapeElement.style.cursor = 'pointer';
      shapeElement.addEventListener('mouseenter', () => {
        shapeElement.setAttribute('opacity', '0.9');
        shapeElement.setAttribute('stroke-width', '4');
      });
      shapeElement.addEventListener('mouseleave', () => {
        shapeElement.setAttribute('opacity', '1');
        shapeElement.setAttribute('stroke-width', '2');
      });

      nodeGroup.appendChild(shapeElement);

      // Node label
      if (showLabels) {
        const text = this.createText({
          x: x,
          y: y + 4,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': '12px',
          'font-weight': '600',
          maxWidth: Math.max(shapeWidth - 14, 28),
          minFontSize: 7,
          'fill': '#ffffff',
          'pointer-events': 'none'
        }, node.label);
        nodeGroup.appendChild(text);
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
