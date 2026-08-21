import BaseDiagram from '../BaseDiagram';

/**
 * BloodRelationDiagram - Renders family trees with multiple generations
 * 
 * Features:
 * - Multiple generations support
 * - Spouse connections (horizontal)
 * - Parent-child connections (vertical)
 * - Gender symbols (♂/♀)
 * - Configurable node sizes
 * - Proper tree layout
 * - Support for large family trees
 * - Bio/title display
 */
export default class BloodRelationDiagram extends BaseDiagram {
  constructor(data, options = {}) {
    super(data, options);
    this.margin = this.options.margin || { top: 80, right: 80, bottom: 80, left: 80 };
    this.nodePositions = {};
    this.generationMap = {};
  }

  /**
   * Validate input data
   */
  validate() {
    super.validate();

    if (!this.data.data || !this.data.data.persons || !Array.isArray(this.data.data.persons)) {
      throw new Error('Blood relation tree requires a persons array');
    }

    if (this.data.data.persons.length < 1) {
      throw new Error('Blood relation tree requires at least 1 person');
    }

    if (!this.data.data.relationships || !Array.isArray(this.data.data.relationships)) {
      throw new Error('Blood relation tree requires a relationships array');
    }

    if (this.data.data.relationships.length < 1) {
      throw new Error('Blood relation tree requires at least 1 relationship');
    }

    // Validate persons
    const personIds = new Set();
    this.data.data.persons.forEach((person, index) => {
      if (!person.id && person.id !== 0) {
        throw new Error(`Person ${index} missing id`);
      }
      if (personIds.has(person.id.toString())) {
        throw new Error(`Duplicate person id: ${person.id}`);
      }
      personIds.add(person.id.toString());
      
      if (!person.name || typeof person.name !== 'string') {
        throw new Error(`Person ${index} missing name (string required)`);
      }
      if (person.gender && !['male', 'female', 'unknown'].includes(person.gender)) {
        throw new Error(`Person ${index} has invalid gender: ${person.gender}`);
      }
    });

    // Validate relationships
    this.data.data.relationships.forEach((rel, index) => {
      if (!rel.from && rel.from !== 0) {
        throw new Error(`Relationship ${index} missing from field`);
      }
      if (!rel.to && rel.to !== 0) {
        throw new Error(`Relationship ${index} missing to field`);
      }
      if (!personIds.has(rel.from.toString())) {
        throw new Error(`Relationship ${index}: from person "${rel.from}" not found`);
      }
      if (!personIds.has(rel.to.toString())) {
        throw new Error(`Relationship ${index}: to person "${rel.to}" not found`);
      }
      if (!['parent', 'spouse', 'child', 'sibling', 'cousin'].includes(rel.type)) {
        throw new Error(`Relationship ${index} has invalid type: ${rel.type}`);
      }
    });
  }

  /**
   * Render the blood relation tree
   */
  render() {
    const { width, height } = this.options;
    const { data, options = {} } = this.data;
    const {
      title = '',
      nodeWidth = 90,
      nodeHeight = 55,
      showGender = true,
      showTitles = true,
      colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#fc8181', '#68d391', '#63b3ed', '#f6ad55'],
      spacingX = 50,
      spacingY = 70,
      showBio = false,
      connectorStyle = 'orthogonal'
    } = options;

    const persons = data.persons;
    const relationships = data.relationships;

    // Build the family tree structure
    const treeData = this.buildTree(persons, relationships);

    // Calculate layout
    const chartWidth = width - this.margin.left - this.margin.right;
    const chartHeight = height - this.margin.top - this.margin.bottom;
    const layout = this.calculateLayout(
      treeData,
      nodeWidth,
      nodeHeight,
      spacingX,
      spacingY,
      chartWidth,
      chartHeight
    );

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

    // Draw connectors first (so they're behind nodes)
    this.drawConnectors(chart, layout, relationships, connectorStyle);

    // Draw nodes
    this.drawNodes(chart, layout, persons, nodeWidth, nodeHeight, colors, showGender, showTitles, showBio);

    // Draw title
    if (title) {
      this.drawTitle(svg, title, width);
    }

    return svg;
  }

  /**
   * Build tree structure from persons and relationships
   */
  buildTree(persons, relationships) {
    const tree = {};
    const personMap = {};
    
    // Create person map
    persons.forEach(p => {
      personMap[p.id] = {
        ...p,
        children: [],
        spouses: [],
        parents: [],
        siblings: []
      };
    });

    // Build relationships
    relationships.forEach(rel => {
      const from = personMap[rel.from];
      const to = personMap[rel.to];
      
      if (!from || !to) return;

      switch (rel.type) {
        case 'parent':
          from.children.push(to.id);
          to.parents.push(from.id);
          break;
        case 'spouse':
          from.spouses.push(to.id);
          to.spouses.push(from.id);
          break;
        case 'child':
          to.children.push(from.id);
          from.parents.push(to.id);
          break;
        case 'sibling':
          from.siblings.push(to.id);
          to.siblings.push(from.id);
          break;
        case 'cousin':
          // Handle cousin relationships (simplified)
          break;
      }
    });

    // Find roots (persons with no parents)
    const roots = Object.values(personMap).filter(p => p.parents.length === 0);
    
    // If no roots found, use first person
    const root = roots.length > 0 ? roots[0] : Object.values(personMap)[0];

    // Assign generations
    this.assignGenerations(root, personMap, 0);

    return {
      root,
      personMap,
      allPersons: Object.values(personMap)
    };
  }

  /**
   * Assign generations recursively
   */
  assignGenerations(person, personMap, generation) {
    person.generation = generation;
    
    // Process children
    person.children.forEach(childId => {
      const child = personMap[childId];
      if (child && child.generation === undefined) {
        this.assignGenerations(child, personMap, generation + 1);
      }
    });

    // Process spouses (same generation)
    person.spouses.forEach(spouseId => {
      const spouse = personMap[spouseId];
      if (spouse && spouse.generation === undefined) {
        spouse.generation = generation;
        // Process spouse's children
        spouse.children.forEach(childId => {
          const child = personMap[childId];
          if (child && child.generation === undefined) {
            this.assignGenerations(child, personMap, generation + 1);
          }
        });
      }
    });
  }

  /**
   * Calculate layout for the tree
   */
  calculateLayout(treeData, nodeWidth, nodeHeight, spacingX, spacingY, chartWidth, chartHeight) {
    const positions = {};
    const personMap = treeData.personMap;
    
    // Group persons by generation
    const generations = {};
    Object.values(personMap).forEach(person => {
      const gen = person.generation || 0;
      if (!generations[gen]) generations[gen] = [];
      generations[gen].push(person);
    });

    // Sort generations
    const genKeys = Object.keys(generations).sort((a, b) => a - b);
    const generationCount = genKeys.length;
    const availableVerticalGap = generationCount > 1
      ? Math.max((chartHeight - nodeHeight * generationCount) / (generationCount - 1), 12)
      : 0;
    const verticalGap = Math.min(spacingY, availableVerticalGap);
    const treeHeight = generationCount * nodeHeight + Math.max(generationCount - 1, 0) * verticalGap;
    const startY = Math.max((chartHeight - treeHeight) / 2 + nodeHeight / 2, nodeHeight / 2);
    
    // Calculate positions for each generation
    genKeys.forEach((genKey, genIndex) => {
      const personsInGen = generations[genKey];
      
      // Sort by position within generation (using family hierarchy)
      const sortedPersons = this.sortByFamilyHierarchy(personsInGen, personMap);
      
      // Calculate x positions
      const personCount = sortedPersons.length;
      const availableHorizontalGap = personCount > 1
        ? Math.max((chartWidth - nodeWidth * personCount) / (personCount - 1), 8)
        : 0;
      const horizontalGap = Math.min(spacingX, availableHorizontalGap);
      const totalWidth = personCount * nodeWidth + Math.max(personCount - 1, 0) * horizontalGap;
      const startX = Math.max((chartWidth - totalWidth) / 2 + nodeWidth / 2, nodeWidth / 2);
      
      sortedPersons.forEach((person, index) => {
        const x = startX + index * (nodeWidth + horizontalGap);
        const y = startY + genIndex * (nodeHeight + verticalGap);
        positions[person.id] = { x, y };
      });
    });

    return positions;
  }

  /**
   * Sort persons by family hierarchy within generation
   */
  sortByFamilyHierarchy(persons, personMap) {
    // Simple sort: group by family units (spouse groups)
    const spouseGroups = [];
    const visited = new Set();
    
    persons.forEach(person => {
      if (visited.has(person.id)) return;
      
      const group = [person];
      visited.add(person.id);
      
      // Add spouse if present
      person.spouses.forEach(spouseId => {
        const spouse = personMap[spouseId];
        if (spouse && persons.includes(spouse) && !visited.has(spouseId)) {
          group.push(spouse);
          visited.add(spouseId);
        }
      });
      
      spouseGroups.push(group);
    });
    
    // Flatten groups
    return spouseGroups.flat();
  }

  /**
   * Draw connectors between nodes
   */
  drawConnectors(chart, positions, relationships, style) {
    const connectorGroup = this.createGroup({ class: 'connectors' });
    chart.appendChild(connectorGroup);

    // Draw parent-child connections
    relationships.forEach(rel => {
      if (rel.type === 'parent' || rel.type === 'child') {
        const fromPos = positions[rel.from];
        const toPos = positions[rel.to];
        
        if (!fromPos || !toPos) return;

        let pathData;
        switch (style) {
          case 'curved':
            pathData = this.createCurvedPath(fromPos, toPos);
            break;
          case 'orthogonal':
            pathData = this.createOrthogonalPath(fromPos, toPos);
            break;
          case 'straight':
          default:
            pathData = this.createDirectPath(fromPos, toPos);
            break;
        }

        const path = this.createPath({
          d: pathData,
          fill: 'none',
          stroke: '#a0aec0',
          'stroke-width': 2,
          'opacity': 0.6
        });
        connectorGroup.appendChild(path);
      }
    });

    // Draw spouse connections (horizontal lines)
    relationships.forEach(rel => {
      if (rel.type === 'spouse') {
        const fromPos = positions[rel.from];
        const toPos = positions[rel.to];
        
        if (!fromPos || !toPos) return;

        const path = this.createPath({
          d: this.createDirectPath(fromPos, toPos),
          fill: 'none',
          stroke: '#718096',
          'stroke-width': 2,
          'stroke-dasharray': '4,4',
          'opacity': 0.8
        });
        connectorGroup.appendChild(path);
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
    const offset = Math.min(dist * 0.2, 40);
    const cx = (from.x + to.x) / 2;
    const cy = (from.y + to.y) / 2 - offset;
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }

  /**
   * Create orthogonal (right-angle) path
   */
  createOrthogonalPath(from, to) {
    const midY = (from.y + to.y) / 2;
    return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
  }

  /**
   * Draw nodes with family information
   */
  drawNodes(chart, positions, persons, nodeWidth, nodeHeight, colors, showGender, showTitles, showBio) {
    const nodeGroup = this.createGroup({ class: 'nodes' });
    chart.appendChild(nodeGroup);

    // Create gender symbol mapping
    const genderSymbols = {
      male: '♂',
      female: '♀',
      unknown: '?'
    };

    const genderColors = {
      male: '#4299e1',
      female: '#fc8181',
      unknown: '#a0aec0'
    };

    persons.forEach((person, index) => {
      const pos = positions[person.id];
      if (!pos) return;

      const color = person.color || colors[index % colors.length];
      const gender = person.gender || 'unknown';
      const genderColor = genderColors[gender] || color;
      
      const x = pos.x;
      const y = pos.y;
      const halfWidth = nodeWidth / 2;
      const halfHeight = nodeHeight / 2;

      // Node background
      const rect = this.createRect({
        x: x - halfWidth,
        y: y - halfHeight,
        width: nodeWidth,
        height: nodeHeight,
        fill: color,
        stroke: '#ffffff',
        'stroke-width': 3,
        rx: 8,
        ry: 8,
        'cursor': 'pointer'
      });
      
      // Add hover effect
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('stroke', '#2d3748');
        rect.setAttribute('stroke-width', '4');
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('stroke', '#ffffff');
        rect.setAttribute('stroke-width', '3');
      });

      nodeGroup.appendChild(rect);

      // Gender indicator
      if (showGender) {
        const genderCircle = this.createCircle({
          cx: x + halfWidth - 15,
          cy: y - halfHeight + 15,
          r: 10,
          fill: genderColor,
          stroke: '#ffffff',
          'stroke-width': 2
        });
        nodeGroup.appendChild(genderCircle);

        const genderText = this.createText({
          x: x + halfWidth - 15,
          y: y - halfHeight + 15,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': '12px',
          'font-weight': '700',
          'fill': '#ffffff'
        }, genderSymbols[gender]);
        nodeGroup.appendChild(genderText);
      }

      // Name
      const nameText = this.createText({
        x: x,
        y: y - 4,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        'font-size': '13px',
        'font-weight': '600',
        maxWidth: nodeWidth - 20,
        minFontSize: 8,
        'fill': '#ffffff'
      }, person.name);
      nodeGroup.appendChild(nameText);

      // Title (if available and enabled)
      if (showTitles && person.title) {
        const titleText = this.createText({
          x: x,
          y: y + 16,
          'text-anchor': 'middle',
          'dominant-baseline': 'middle',
          'font-size': '9px',
          'font-weight': '400',
          maxWidth: nodeWidth - 16,
          minFontSize: 7,
          'fill': 'rgba(255,255,255,0.8)'
        }, person.title);
        nodeGroup.appendChild(titleText);
      }

      // Bio (if available and enabled)
      if (showBio && person.bio) {
        const bioText = this.createText({
          x: x,
          y: y + 30,
          'text-anchor': 'middle',
          'dominant-baseline': 'middle',
          'font-size': '8px',
          'font-weight': '400',
          'fill': 'rgba(255,255,255,0.6)'
        }, person.bio.substring(0, 20) + (person.bio.length > 20 ? '...' : ''));
        nodeGroup.appendChild(bioText);
      }

      // Generation indicator
      const genText = this.createText({
        x: x - halfWidth + 5,
        y: y - halfHeight + 12,
        'text-anchor': 'start',
        'dominant-baseline': 'hanging',
        'font-size': '8px',
        'font-weight': '400',
        'fill': 'rgba(255,255,255,0.5)'
      }, `G${person.generation || 0}`);
      nodeGroup.appendChild(genText);
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
      'font-size': '20px',
      'font-weight': '700',
      maxWidth: width - 40,
      fill: '#1a202c'
    }, title);
    svg.appendChild(titleText);
  }
}
