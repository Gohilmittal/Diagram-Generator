export const bloodRelationSample = {
  type: 'bloodRelation',
  width: 1000,
  height: 700,
  data: {
    persons: [
      { id: 'grandfather', name: 'John Sr.', gender: 'male', title: 'Patriarch', color: '#4299e1' },
      { id: 'grandmother', name: 'Mary', gender: 'female', title: 'Matriarch', color: '#fc8181' },
      { id: 'father', name: 'James', gender: 'male', title: 'Father', color: '#4299e1' },
      { id: 'mother', name: 'Sarah', gender: 'female', title: 'Mother', color: '#fc8181' },
      { id: 'uncle', name: 'Robert', gender: 'male', title: 'Uncle', color: '#4299e1' },
      { id: 'aunt', name: 'Lisa', gender: 'female', title: 'Aunt', color: '#fc8181' },
      { id: 'son1', name: 'Michael', gender: 'male', title: 'Son', color: '#48bb78' },
      { id: 'son2', name: 'David', gender: 'male', title: 'Son', color: '#48bb78' },
      { id: 'daughter', name: 'Emma', gender: 'female', title: 'Daughter', color: '#ed8936' },
      { id: 'cousin', name: 'Tom', gender: 'male', title: 'Cousin', color: '#9f7aea' }
    ],
    relationships: [
      { type: 'spouse', from: 'grandfather', to: 'grandmother' },
      { type: 'parent', from: 'grandfather', to: 'father' },
      { type: 'parent', from: 'grandmother', to: 'father' },
      { type: 'parent', from: 'grandfather', to: 'uncle' },
      { type: 'parent', from: 'grandmother', to: 'uncle' },
      { type: 'spouse', from: 'father', to: 'mother' },
      { type: 'parent', from: 'father', to: 'son1' },
      { type: 'parent', from: 'father', to: 'son2' },
      { type: 'parent', from: 'father', to: 'daughter' },
      { type: 'parent', from: 'mother', to: 'son1' },
      { type: 'parent', from: 'mother', to: 'son2' },
      { type: 'parent', from: 'mother', to: 'daughter' },
      { type: 'spouse', from: 'uncle', to: 'aunt' },
      { type: 'parent', from: 'uncle', to: 'cousin' },
      { type: 'parent', from: 'aunt', to: 'cousin' }
    ]
  },
  options: {
    title: 'Smith Family Tree',
    nodeWidth: 90,
    nodeHeight: 55,
    showGender: true,
    showTitles: true,
    spacingX: 50,
    spacingY: 70,
    showBio: false,
    connectorStyle: 'orthogonal'
  }
};

export const bloodRelationSampleLarge = {
  type: 'bloodRelation',
  width: 1200,
  height: 800,
  data: {
    persons: [
      { id: 'g1', name: 'Elder 1', gender: 'male', color: '#4299e1' },
      { id: 'g2', name: 'Elder 2', gender: 'female', color: '#fc8181' },
      { id: 'p1', name: 'Parent 1', gender: 'male', color: '#4299e1' },
      { id: 'p2', name: 'Parent 2', gender: 'female', color: '#fc8181' },
      { id: 'p3', name: 'Parent 3', gender: 'male', color: '#48bb78' },
      { id: 'p4', name: 'Parent 4', gender: 'female', color: '#ed8936' },
      { id: 'c1', name: 'Child 1', gender: 'male', color: '#9f7aea' },
      { id: 'c2', name: 'Child 2', gender: 'female', color: '#fc8181' },
      { id: 'c3', name: 'Child 3', gender: 'male', color: '#68d391' },
      { id: 'c4', name: 'Child 4', gender: 'female', color: '#63b3ed' },
      { id: 'c5', name: 'Child 5', gender: 'male', color: '#f6ad55' },
      { id: 'c6', name: 'Child 6', gender: 'female', color: '#fc8181' }
    ],
    relationships: [
      { type: 'spouse', from: 'g1', to: 'g2' },
      { type: 'parent', from: 'g1', to: 'p1' },
      { type: 'parent', from: 'g2', to: 'p1' },
      { type: 'parent', from: 'g1', to: 'p3' },
      { type: 'parent', from: 'g2', to: 'p3' },
      { type: 'spouse', from: 'p1', to: 'p2' },
      { type: 'spouse', from: 'p3', to: 'p4' },
      { type: 'parent', from: 'p1', to: 'c1' },
      { type: 'parent', from: 'p2', to: 'c1' },
      { type: 'parent', from: 'p1', to: 'c2' },
      { type: 'parent', from: 'p2', to: 'c2' },
      { type: 'parent', from: 'p3', to: 'c3' },
      { type: 'parent', from: 'p4', to: 'c3' },
      { type: 'parent', from: 'p3', to: 'c4' },
      { type: 'parent', from: 'p4', to: 'c4' },
      { type: 'parent', from: 'p3', to: 'c5' },
      { type: 'parent', from: 'p4', to: 'c5' }
    ]
  },
  options: {
    title: 'Extended Family Tree',
    nodeWidth: 80,
    nodeHeight: 50,
    showGender: true,
    showTitles: false,
    spacingX: 40,
    spacingY: 65,
    showBio: false,
    connectorStyle: 'orthogonal'
  }
};

export const bloodRelationSampleSimple = {
  type: 'bloodRelation',
  width: 700,
  height: 500,
  data: {
    persons: [
      { id: 'parent1', name: 'Anna', gender: 'female', color: '#fc8181' },
      { id: 'parent2', name: 'Bob', gender: 'male', color: '#4299e1' },
      { id: 'child1', name: 'Charlie', gender: 'male', color: '#48bb78' },
      { id: 'child2', name: 'Diana', gender: 'female', color: '#ed8936' }
    ],
    relationships: [
      { type: 'spouse', from: 'parent1', to: 'parent2' },
      { type: 'parent', from: 'parent1', to: 'child1' },
      { type: 'parent', from: 'parent2', to: 'child1' },
      { type: 'parent', from: 'parent1', to: 'child2' },
      { type: 'parent', from: 'parent2', to: 'child2' }
    ]
  },
  options: {
    title: 'Simple Family Tree',
    nodeWidth: 80,
    nodeHeight: 50,
    showGender: true,
    showTitles: false,
    spacingX: 60,
    spacingY: 80,
    showBio: false,
    connectorStyle: 'orthogonal'
  }
};