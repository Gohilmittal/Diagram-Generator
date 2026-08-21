import * as d3 from 'd3';
import BaseDiagram from '../BaseDiagram';

/**
 * LineDiagram - Renders line graphs using D3.js
 * 
 * Features:
 * - Multiple series support
 * - Configurable curve types
 * - Points on the line
 * - Area fill option
 * - Legend
 * - Gridlines
 */
export default class LineDiagram extends BaseDiagram {
  constructor(data, options = {}) {
    super(data, options);
    this.margin = this.options.margin || { top: 60, right: 80, bottom: 70, left: 70 };
  }

  /**
   * Validate input data
   */
  validate() {
    super.validate();

    if (!this.data.data || !this.data.data.series || !Array.isArray(this.data.data.series)) {
      throw new Error('Line graph requires a series array');
    }

    if (this.data.data.series.length === 0) {
      throw new Error('Line graph requires at least one series');
    }

    this.data.data.series.forEach((series, index) => {
      if (!series.name || typeof series.name !== 'string') {
        throw new Error(`Series ${index} missing name (string required)`);
      }
      if (!series.points || !Array.isArray(series.points) || series.points.length < 2) {
        throw new Error(`Series ${index} requires at least 2 data points`);
      }
      
      series.points.forEach((point, pointIndex) => {
        if (point.x === undefined || point.y === undefined) {
          throw new Error(`Series ${index}, point ${pointIndex} missing x or y value`);
        }
        if (typeof point.y !== 'number') {
          throw new Error(`Series ${index}, point ${pointIndex} y value must be a number`);
        }
      });
    });
  }

  /**
   * Render the line graph
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const {
      title = '',
      xLabel = '',
      yLabel = '',
      showPoints = true,
      showLegend = true,
      curveType = 'monotone',
      fillArea = false,
      colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181', '#68d391', '#63b3ed', '#f6ad55']
    } = options;

    // Calculate chart dimensions
    const chartWidth = width - this.margin.left - this.margin.right;
    const chartHeight = height - this.margin.top - this.margin.bottom;

    // Prepare data
    const series = data.series;
    const allPoints = series.flatMap(s => s.points);
    
    // Determine x and y domains
    const xValues = allPoints.map(p => p.x);
    const yValues = allPoints.map(p => p.y);
    
    const xMin = Math.min(...xValues.map(v => typeof v === 'number' ? v : 0));
    const xMax = Math.max(...xValues.map(v => typeof v === 'number' ? v : xValues.length));
    const yMin = Math.min(0, Math.min(...yValues) * 1.1);
    const yMax = Math.max(...yValues) * 1.1;

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
      transform: `translate(${this.margin.left}, ${this.margin.top})`
    });
    svg.appendChild(chart);

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, chartWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([chartHeight, 0])
      .nice();

    // Draw gridlines
    this.drawGridlines(chart, chartWidth, chartHeight, xScale, yScale);

    // Draw axes
    this.drawAxes(chart, chartWidth, chartHeight, xScale, yScale, xLabel, yLabel);

    // Draw lines
    this.drawLines(chart, series, xScale, yScale, colors, curveType, fillArea, showPoints);

    // Draw title
    if (title) {
      this.drawTitle(svg, title);
    }

    // Draw legend
    if (showLegend && series.length > 1) {
      this.drawLegend(svg, series, colors);
    }

    return svg;
  }

  /**
   * Draw gridlines
   */
  drawGridlines(chart, chartWidth, chartHeight, xScale, yScale) {
    // Horizontal gridlines
    const yGridlines = d3.axisLeft(yScale)
      .tickSize(-chartWidth)
      .tickFormat('')
      .ticks(10);

    const yGridGroup = this.createGroup({ class: 'gridlines' });
    chart.appendChild(yGridGroup);
    this.appendD3Selection(yGridGroup, yGridlines);
  }

  /**
   * Draw axes
   */
  drawAxes(chart, chartWidth, chartHeight, xScale, yScale, xLabel, yLabel) {
    // X-axis (bottom)
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d3.format('d'));

    const xAxisGroup = this.createGroup({ 
      transform: `translate(0, ${chartHeight})`,
      class: 'x-axis'
    });
    chart.appendChild(xAxisGroup);
    this.appendD3Selection(xAxisGroup, xAxis);
    xAxisGroup.querySelectorAll('.tick text').forEach(text => {
      this.fitTextElement(text, Math.max(chartWidth / 10 - 6, 28), 8);
    });

    // Y-axis (left)
    const yAxis = d3.axisLeft(yScale)
      .ticks(8)
      .tickFormat(d3.format('.1f'));

    const yAxisGroup = this.createGroup({ class: 'y-axis' });
    chart.appendChild(yAxisGroup);
    this.appendD3Selection(yAxisGroup, yAxis);

    // X-axis label
    if (xLabel) {
      const label = this.createText({
        x: chartWidth / 2,
        y: chartHeight + 45,
        'text-anchor': 'middle',
        'font-size': '14px',
        'font-weight': '600',
        maxWidth: chartWidth - 20,
        fill: '#4a5568'
      }, xLabel);
      chart.appendChild(label);
    }

    // Y-axis label
    if (yLabel) {
      const label = this.createText({
        x: -45,
        y: 15,
        'text-anchor': 'middle',
        'font-size': '14px',
        'font-weight': '600',
        maxWidth: chartHeight - 20,
        fill: '#4a5568',
        transform: 'rotate(-90)'
      }, yLabel);
      chart.appendChild(label);
    }
  }

  /**
   * Draw lines and points
   */
  drawLines(chart, series, xScale, yScale, colors, curveType, fillArea, showPoints) {
    // Define line generator
    const lineGenerator = this.getLineGenerator(xScale, yScale, curveType);

    // Define area generator for fill
    const areaGenerator = fillArea ? this.getAreaGenerator(xScale, yScale, curveType) : null;

    // Draw each series
    series.forEach((seriesData, index) => {
      const color = seriesData.color || colors[index % colors.length];
      const points = seriesData.points;

      // Sort points by x value
      const sortedPoints = [...points].sort((a, b) => {
        if (typeof a.x === 'number' && typeof b.x === 'number') {
          return a.x - b.x;
        }
        return 0;
      });

      // Create series group
      const seriesGroup = this.createGroup({ 
        class: `series-${index}`,
        'data-series': seriesData.name
      });
      chart.appendChild(seriesGroup);

      // Draw area fill if enabled
      if (fillArea && areaGenerator) {
        const areaPath = this.createPath({
          d: areaGenerator(sortedPoints),
          fill: color,
          opacity: 0.2,
          stroke: 'none'
        });
        seriesGroup.appendChild(areaPath);
      }

      // Draw the line
      const path = this.createPath({
        d: lineGenerator(sortedPoints),
        fill: 'none',
        stroke: color,
        'stroke-width': 2.5,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });
      seriesGroup.appendChild(path);

      // Draw points
      if (showPoints) {
        sortedPoints.forEach(point => {
          const circle = this.createCircle({
            cx: xScale(point.x),
            cy: yScale(point.y),
            r: 4.5,
            fill: color,
            stroke: '#ffffff',
            'stroke-width': 2
          });
          
          // Add hover effect
          circle.style.cursor = 'pointer';
          circle.addEventListener('mouseenter', () => {
            this.showTooltip(circle, point, seriesData.name, color);
          });
          circle.addEventListener('mouseleave', () => {
            this.hideTooltip(circle);
          });

          seriesGroup.appendChild(circle);
        });
      }
    });
  }

  /**
   * Get line generator based on curve type
   */
  getLineGenerator(xScale, yScale, curveType) {
    let curve;
    switch (curveType) {
      case 'monotone':
        curve = d3.curveMonotoneX;
        break;
      case 'step':
        curve = d3.curveStepAfter;
        break;
      case 'basis':
        curve = d3.curveBasis;
        break;
      case 'linear':
      default:
        curve = d3.curveLinear;
        break;
    }

    return d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(curve);
  }

  /**
   * Get area generator for fill
   */
  getAreaGenerator(xScale, yScale, curveType) {
    let curve;
    switch (curveType) {
      case 'monotone':
        curve = d3.curveMonotoneX;
        break;
      case 'step':
        curve = d3.curveStepAfter;
        break;
      case 'basis':
        curve = d3.curveBasis;
        break;
      case 'linear':
      default:
        curve = d3.curveLinear;
        break;
    }

    return d3.area()
      .x(d => xScale(d.x))
      .y0(yScale(0))
      .y1(d => yScale(d.y))
      .curve(curve);
  }

  /**
   * Show tooltip on point hover
   */
  showTooltip(element, point, seriesName, color) {
    // Create or update tooltip
    let tooltip = document.querySelector('.line-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'line-tooltip';
      tooltip.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 8px 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        pointer-events: none;
        font-family: -apple-system, sans-serif;
        font-size: 12px;
        z-index: 1000;
        display: none;
      `;
      document.body.appendChild(tooltip);
    }

    // Update tooltip content
    tooltip.innerHTML = `
      <div style="font-weight:600;color:${color}">${seriesName}</div>
      <div>X: ${point.x}</div>
      <div>Y: ${point.y}</div>
    `;

    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - 60) + 'px';
    tooltip.style.top = (rect.top - 60) + 'px';
    tooltip.style.display = 'block';
  }

  /**
   * Hide tooltip
   */
  hideTooltip(element) {
    const tooltip = document.querySelector('.line-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  /**
   * Draw title
   */
  drawTitle(svg, title) {
    const titleText = this.createText({
      x: this.options.width / 2,
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
  drawLegend(svg, series, colors) {
    const legendX = this.options.width - 120;
    const legendY = 80;
    const itemHeight = 28;

    const legend = this.createGroup({ 
      class: 'legend',
      transform: `translate(${legendX}, ${legendY})`
    });
    svg.appendChild(legend);

    series.forEach((item, index) => {
      const y = index * itemHeight;
      const color = item.color || colors[index % colors.length];

      // Line sample
      const line = this.createLine({
        x1: 0,
        y1: y + 7,
        x2: 20,
        y2: y + 7,
        stroke: color,
        'stroke-width': 2.5
      });
      legend.appendChild(line);

      // Label
      const text = this.createText({
        x: 28,
        y: y + 12,
        'dominant-baseline': 'central',
        'font-size': '12px',
        maxWidth: 84,
        minFontSize: 8,
        'fill': '#2d3748'
      }, item.name);
      legend.appendChild(text);
    });
  }

  /**
   * Helper to append D3-generated elements
   */
  appendD3Selection(parent, axisGenerator) {
    const tempDiv = document.createElement('div');
    const tempSvg = d3.select(tempDiv)
      .append('svg')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('height', '0')
      .style('width', '0');
    
    const axis = tempSvg.call(axisGenerator);
    
    const nodes = axis.node().childNodes;
    const fragment = document.createDocumentFragment();
    
    nodes.forEach(node => {
      const clone = node.cloneNode(true);
      if (parent.className && parent.className.baseVal === 'gridlines') {
        clone.style.stroke = '#e2e8f0';
        clone.style.strokeWidth = '1px';
        clone.style.strokeDasharray = '4,4';
      } else {
        clone.style.color = '#4a5568';
        clone.style.fontSize = '12px';
        clone.style.fontFamily = '-apple-system, sans-serif';
      }
      fragment.appendChild(clone);
    });
    
    parent.appendChild(fragment);
    tempDiv.remove();
  }
}
