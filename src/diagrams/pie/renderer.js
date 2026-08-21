import * as d3 from 'd3';
import BaseDiagram from '../BaseDiagram';

/**
 * PieDiagram - Renders pie and donut charts using D3.js
 * 
 * Features:
 * - Pie and donut charts
 * - Configurable colors
 * - Labels (inside/outside/both)
 * - Percentages on slices
 * - Legend support
 * - Configurable radius
 */
export default class PieDiagram extends BaseDiagram {
  constructor(data, options = {}) {
    super(data, options);
    this.margin = this.options.margin || { top: 60, right: 120, bottom: 60, left: 60 };
  }

  /**
   * Validate input data
   */
  validate() {
    super.validate();

    // Validate data array
    if (!this.data.data || !Array.isArray(this.data.data) || this.data.data.length === 0) {
      throw new Error('Pie chart requires a non-empty data array');
    }

    // Validate each data point
    this.data.data.forEach((item, index) => {
      if (!item.label || typeof item.label !== 'string') {
        throw new Error(`Data point ${index} missing label (string required)`);
      }
      if (item.value === undefined || typeof item.value !== 'number' || item.value < 0) {
        throw new Error(`Data point ${index} missing positive value (number >= 0 required)`);
      }
      if (item.color && !/^#[0-9a-fA-F]{6}$/.test(item.color)) {
        throw new Error(`Data point ${index} has invalid color format: ${item.color}`);
      }
    });

    // Check for all zero values
    const total = this.data.data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) {
      throw new Error('All values are zero. Pie chart requires at least one positive value.');
    }
  }

  /**
   * Render the pie chart
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const {
      title = '',
      showPercentages = true,
      showLabels = true,
      innerRadius = 0,
      labelPosition = 'outside',
      sortSlices = false,
      colors = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0', '#00BCD4', '#FF5722', '#8BC34A', '#795548', '#607D8B']
    } = options;

    // Calculate chart dimensions
    const chartWidth = width - this.margin.left - this.margin.right;
    const chartHeight = height - this.margin.top - this.margin.bottom;
    const labelScale = showLabels && (labelPosition === 'outside' || labelPosition === 'both') ? 1.2 : 1;
    const radius = Math.min(chartWidth, chartHeight) / 2 / labelScale;
    
    // Center of chart
    const centerX = chartWidth / 2 + this.margin.left;
    const centerY = chartHeight / 2 + this.margin.top + (title ? 10 : 0);

    // Prepare data - filter out zero values
    let filteredData = data.filter(d => d.value > 0);
    
    if (filteredData.length === 0) {
      throw new Error('No data with positive values to display');
    }

    // Sort data if requested
    if (sortSlices) {
      filteredData = filteredData.sort((a, b) => a.value - b.value);
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

    // Create main chart group
    const chart = this.createGroup({
      transform: `translate(${centerX}, ${centerY})`
    });
    svg.appendChild(chart);

    // Set up D3 pie layout
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02);

    // Generate pie data
    const pieData = pie(filteredData);

    // Set up arc generator
    const arc = d3.arc()
      .innerRadius(radius * innerRadius)
      .outerRadius(radius)
      .cornerRadius(2);

    // For labels
    const outerArc = d3.arc()
      .innerRadius(radius * 1.05)
      .outerRadius(radius * 1.15);

    // Draw slices
    const slices = this.createGroup({ class: 'slices' });
    chart.appendChild(slices);

    // Draw each slice
    pieData.forEach((d, index) => {
      const color = d.data.color || colors[index % colors.length];
      
      // Create slice path
      const path = this.createPath({
        d: arc(d),
        fill: color,
        stroke: '#ffffff',
        'stroke-width': 2
      });
      
      // Add hover effect
      path.style.cursor = 'pointer';
      path.addEventListener('mouseenter', () => {
        path.setAttribute('opacity', '0.8');
        path.setAttribute('transform', 'scale(1.02)');
      });
      path.addEventListener('mouseleave', () => {
        path.setAttribute('opacity', '1');
        path.setAttribute('transform', '');
      });
      
      slices.appendChild(path);

      // Calculate percentage
      const total = pieData.reduce((sum, item) => sum + item.data.value, 0);
      const percentage = ((d.data.value / total) * 100);
      const percentageText = percentage.toFixed(1) + '%';

      // Add labels
      if (showLabels) {
        this.addLabel(chart, d, arc, outerArc, radius, labelPosition, percentageText, showPercentages, color);
      }
    });

    // Add title
    if (title) {
      this.drawTitle(svg, title, centerX);
    }

    // Add legend
    this.drawLegend(svg, filteredData, colors, centerX);

    return svg;
  }

  /**
   * Add label for a slice
   */
  addLabel(chart, d, arc, outerArc, radius, position, percentage, showPercentage, color) {
    const midAngle = (d.startAngle + d.endAngle) / 2;
    const label = this.createGroup({ class: 'label' });

    let labelText = d.data.label;
    if (showPercentage) {
      labelText += ` (${percentage})`;
    }

    if (position === 'inside' || position === 'both') {
      // Inside label
      const centroid = arc.centroid(d);
      const innerLabel = this.createText({
        x: centroid[0],
        y: centroid[1],
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': d.data.value > 10 ? '12px' : '10px',
        'font-weight': '600',
        fill: this.getContrastColor(color),
        'pointer-events': 'none'
      }, labelText);
      label.appendChild(innerLabel);
    }

    if (position === 'outside' || position === 'both') {
      // Outside label with connector line
      const outerPoint = outerArc.centroid(d);
      const x = outerPoint[0];
      const y = outerPoint[1];
      
      // Determine text anchor based on position
      const textAnchor = x > 0 ? 'start' : 'end';
      const labelX = x > 0 ? x + 8 : x - 8;

      // Only add if slice is large enough
      const angle = d.endAngle - d.startAngle;
      if (angle > 0.3) {
        // Connector line
        const startPoint = arc.centroid(d);
        const endPoint = [
          x * 1.1,
          y * 1.1
        ];
        
        const line = this.createLine({
          x1: startPoint[0],
          y1: startPoint[1],
          x2: endPoint[0],
          y2: endPoint[1],
          stroke: '#a0aec0',
          'stroke-width': 1,
          'stroke-dasharray': '3,3'
        });
        label.appendChild(line);

        // Label text
        const text = this.createText({
          x: labelX,
          y: y,
          'text-anchor': textAnchor,
          'dominant-baseline': 'central',
          'font-size': '12px',
          'font-weight': '500',
          maxWidth: Math.max(this.options.width * 0.18, 70),
          minFontSize: 8,
          fill: '#2d3748',
          'pointer-events': 'none'
        }, d.data.label);
        label.appendChild(text);

        // Percentage
        if (showPercentage) {
          const pct = this.createText({
            x: labelX,
            y: y + 18,
            'text-anchor': textAnchor,
            'dominant-baseline': 'hanging',
            'font-size': '10px',
            'fill': '#718096',
            'pointer-events': 'none'
          }, percentage);
          label.appendChild(pct);
        }
      }
    }

    chart.appendChild(label);
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

  /**
   * Draw legend
   */
  drawLegend(svg, data, colors, centerX) {
    // Position legend to the right of the chart
    const legendX = this.options.width - 120;
    const legendY = 80;
    const itemHeight = 30;

    const legend = this.createGroup({ 
      class: 'legend',
      transform: `translate(${legendX}, ${legendY})`
    });
    svg.appendChild(legend);

    data.forEach((item, index) => {
      const y = index * itemHeight;
      const color = item.color || colors[index % colors.length];

      // Color box
      const rect = this.createRect({
        x: 0,
        y: y,
        width: 14,
        height: 14,
        fill: color,
        rx: 3
      });
      legend.appendChild(rect);

      // Label
      const text = this.createText({
        x: 22,
        y: y + 12,
        'dominant-baseline': 'central',
        'font-size': '12px',
        maxWidth: 88,
        minFontSize: 8,
        'fill': '#2d3748'
      }, item.label);
      legend.appendChild(text);
    });
  }

  /**
   * Get contrast color (black or white)
   */
  getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#1a202c' : '#ffffff';
  }
}
