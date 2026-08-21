import BaseDiagram from '../BaseDiagram';

/**
 * VennDiagram - Renders 2 and 3 set Venn diagrams
 * 
 * Features:
 * - 2 or 3 set support
 * - Configurable colors and sizes
 * - Region labels
 * - Configurable opacity
 * - Title support
 */
export default class VennDiagram extends BaseDiagram {
  constructor(data, options = {}) {
    super(data, options);
    this.margin = this.options.margin || { top: 60, right: 60, bottom: 60, left: 60 };
  }

  /**
   * Validate input data
   */
  validate() {
    super.validate();

    if (!this.data.data || !this.data.data.sets || !Array.isArray(this.data.data.sets)) {
      throw new Error('Venn diagram requires a sets array');
    }

    if (this.data.data.sets.length < 2 || this.data.data.sets.length > 3) {
      throw new Error('Venn diagram supports exactly 2 or 3 sets');
    }

    // Validate each set
    this.data.data.sets.forEach((set, index) => {
      if (!set.name || typeof set.name !== 'string') {
        throw new Error(`Set ${index} missing name (string required)`);
      }
      if (set.color && !/^#[0-9a-fA-F]{6}$/.test(set.color)) {
        throw new Error(`Set ${index} has invalid color format: ${set.color}`);
      }
      if (set.size && (set.size < 50 || set.size > 200)) {
        throw new Error(`Set ${index} size must be between 50 and 200`);
      }
    });

    // Validate regions if present
    if (this.data.data.regions) {
      const regionKeys = Object.keys(this.data.data.regions);
      const validKeys = ['0', '1', '2', '3', '12', '13', '23', '123'];
      regionKeys.forEach(key => {
        if (!validKeys.includes(key)) {
          throw new Error(`Invalid region key: ${key}. Valid keys: ${validKeys.join(', ')}`);
        }
      });
    }
  }

  /**
   * Render the Venn diagram
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const {
      title = '',
      showLabels = true,
      showRegionLabels = true,
      labelPosition = 'inside',
      opacity = 0.6,
      strokeWidth = 2
    } = options;

    const sets = data.sets;
    const regions = data.regions || {};
    const numSets = sets.length;

    // Calculate center
    const centerX = width / 2;
    const centerY = height / 2;

    // Define default colors
    const defaultColors = ['#4299e1', '#48bb78', '#ed8936'];
    const colors = sets.map((set, index) => set.color || defaultColors[index % defaultColors.length]);

    // Calculate circle positions and sizes
    const circleData = this.calculateCircles(sets, centerX, centerY, numSets);

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
      transform: `translate(0, 0)`
    });
    svg.appendChild(chart);

    // Draw circles
    this.drawCircles(chart, circleData, colors, opacity, strokeWidth, numSets);

    // Draw region labels above the circle fills
    if (showRegionLabels && Object.keys(regions).length > 0) {
      this.drawRegions(chart, regions, circleData, numSets);
    }

    // Draw set labels
    if (showLabels) {
      this.drawLabels(chart, sets, circleData, labelPosition, numSets);
    }

    // Draw title
    if (title) {
      this.drawTitle(svg, title, width);
    }

    return svg;
  }

  /**
   * Calculate circle positions and sizes
   */
  calculateCircles(sets, centerX, centerY, numSets) {
    const defaultSize = 120;
    const circles = [];

    if (numSets === 2) {
      // 2-set Venn diagram
      const size1 = sets[0].size || defaultSize;
      const size2 = sets[1].size || defaultSize;
      
      // Calculate overlap offset
      const offset = (size1 + size2) * 0.3;
      
      circles.push({
        x: centerX - offset / 2,
        y: centerY,
        radius: size1 / 2
      });
      circles.push({
        x: centerX + offset / 2,
        y: centerY,
        radius: size2 / 2
      });
      
    } else if (numSets === 3) {
      // 3-set Venn diagram
      const size1 = sets[0].size || defaultSize;
      const size2 = sets[1].size || defaultSize;
      const size3 = sets[2].size || defaultSize;
      
      // Calculate positions for 3 circles in triangle formation
      const spacing = (size1 + size2 + size3) / 6;
      const triangleRadius = spacing * 1.2;
      
      circles.push({
        x: centerX - triangleRadius * 0.866,
        y: centerY + triangleRadius * 0.5,
        radius: size1 / 2
      });
      circles.push({
        x: centerX + triangleRadius * 0.866,
        y: centerY + triangleRadius * 0.5,
        radius: size2 / 2
      });
      circles.push({
        x: centerX,
        y: centerY - triangleRadius,
        radius: size3 / 2
      });
    }

    return circles;
  }

  /**
   * Draw circles
   */
  drawCircles(chart, circleData, colors, opacity, strokeWidth, numSets) {
    const circleGroup = this.createGroup({ class: 'venn-circles' });
    chart.appendChild(circleGroup);

    circleData.forEach((circle, index) => {
      // Circle with fill
      const circleEl = this.createCircle({
        cx: circle.x,
        cy: circle.y,
        r: circle.radius,
        fill: colors[index % colors.length],
        fillOpacity: opacity,
        stroke: colors[index % colors.length],
        'stroke-width': strokeWidth,
        'stroke-opacity': 0.8
      });
      circleGroup.appendChild(circleEl);

      // Add hover effect
      circleEl.style.cursor = 'pointer';
      circleEl.addEventListener('mouseenter', () => {
        circleEl.setAttribute('fill-opacity', Math.min(opacity + 0.2, 1));
        circleEl.setAttribute('stroke-width', strokeWidth + 1);
      });
      circleEl.addEventListener('mouseleave', () => {
        circleEl.setAttribute('fill-opacity', opacity);
        circleEl.setAttribute('stroke-width', strokeWidth);
      });
    });
  }

  /**
   * Draw labels for sets
   */
  drawLabels(chart, sets, circleData, labelPosition, numSets) {
    const labelGroup = this.createGroup({ class: 'venn-labels' });
    chart.appendChild(labelGroup);

    circleData.forEach((circle, index) => {
      let labelX = circle.x;
      let labelY = circle.y;

      if (labelPosition === 'outside') {
        // Position label outside the circle
        const angle = this.getLabelAngle(index, numSets);
        const offset = circle.radius * 1.3;
        labelX = circle.x + offset * Math.cos(angle);
        labelY = circle.y + offset * Math.sin(angle);
        
        const text = this.createText({
          x: labelX,
          y: labelY,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': '16px',
          'font-weight': '700',
          maxWidth: Math.max(circle.radius * 1.5, 80),
          minFontSize: 9,
          'fill': '#1a202c'
        }, sets[index].name);
        labelGroup.appendChild(text);
      } else {
        // Label inside the circle
        const text = this.createText({
          x: labelX,
          y: labelY,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': '16px',
          'font-weight': '700',
          maxWidth: Math.max(circle.radius * 1.4, 70),
          minFontSize: 9,
          'fill': '#ffffff'
        }, sets[index].name);
        labelGroup.appendChild(text);
      }
    });
  }

  /**
   * Get label angle for outside positioning
   */
  getLabelAngle(index, numSets) {
    if (numSets === 2) {
      return index === 0 ? Math.PI : 0;
    } else {
      // Point each label away from the center of the triangle.
      const angles = [Math.PI * 5 / 6, Math.PI / 6, -Math.PI / 2];
      return angles[index] || 0;
    }
  }

  /**
   * Draw region labels
   */
  drawRegions(chart, regions, circleData, numSets) {
    const regionGroup = this.createGroup({ class: 'venn-regions' });
    chart.appendChild(regionGroup);

    if (numSets === 2) {
      // 2-set regions
      const c1 = circleData[0];
      const c2 = circleData[1];
      
      // Region 1 (only set 1)
      if (regions['1']) {
        const pos = this.getTwoSetRegionPosition(1, c1, c2);
        this.addRegionLabel(regionGroup, pos, regions['1']);
      }
      
      // Region 2 (only set 2)
      if (regions['2']) {
        const pos = this.getTwoSetRegionPosition(2, c1, c2);
        this.addRegionLabel(regionGroup, pos, regions['2']);
      }
      
      // Region 12 (intersection)
      if (regions['12']) {
        const pos = this.getTwoSetRegionPosition('12', c1, c2);
        this.addRegionLabel(regionGroup, pos, regions['12']);
      }
      
    } else if (numSets === 3) {
      // 3-set regions
      const c1 = circleData[0];
      const c2 = circleData[1];
      const c3 = circleData[2];
      
      // Simple positioning for 3-set regions
      const regionPositions = {
        '1': { x: c1.x - c1.radius * 0.45, y: c1.y + c1.radius * 0.25 },
        '2': { x: c2.x + c2.radius * 0.45, y: c2.y + c2.radius * 0.25 },
        '3': { x: c3.x, y: c3.y - c3.radius * 0.45 },
        '12': { x: (c1.x + c2.x) / 2, y: (c1.y + c2.y) / 2 + Math.min(c1.radius, c2.radius) * 0.38 },
        '13': { x: (c1.x + c3.x) / 2 - 12, y: (c1.y + c3.y) / 2 - 5 },
        '23': { x: (c2.x + c3.x) / 2 + 12, y: (c2.y + c3.y) / 2 - 5 },
        '123': { x: (c1.x + c2.x + c3.x) / 3, y: (c1.y + c2.y + c3.y) / 3 + 4 }
      };

      Object.keys(regionPositions).forEach(key => {
        if (regions[key]) {
          const pos = regionPositions[key];
          this.addRegionLabel(regionGroup, pos, regions[key]);
        }
      });
    }
  }

  /**
   * Get position for 2-set region
   */
  getTwoSetRegionPosition(region, c1, c2) {
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const midX = (c1.x + c2.x) / 2;
    const midY = (c1.y + c2.y) / 2;
    
    // Perpendicular direction
    const perpX = -dy / (dist || 1);
    const perpY = dx / (dist || 1);

    switch (region) {
      case 1:
        return {
          x: c1.x - dx / 2 - perpX * 30,
          y: c1.y - dy / 2 - perpY * 30
        };
      case 2:
        return {
          x: c2.x + dx / 2 + perpX * 30,
          y: c2.y + dy / 2 + perpY * 30
        };
      case '12':
        return {
          x: midX,
          y: midY
        };
      default:
        return { x: midX, y: midY };
    }
  }

  /**
   * Add a region label
   */
  addRegionLabel(group, pos, text) {
    const label = this.createText({
      x: pos.x,
      y: pos.y,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      'font-size': '12px',
      'font-weight': '500',
      maxWidth: Math.max(this.options.width / 4, 70),
      minFontSize: 8,
      'fill': '#2d3748',
      'background': 'rgba(255,255,255,0.8)',
      'padding': '2px 6px',
      'border-radius': '4px'
    }, text);
    group.appendChild(label);
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
