let customers: CustomerNode[] = [
  {
    id: 'customerId1',
    name: 'Customer1',
    isExpanded: false,
    isSelected: false,
    type: 'customer',
    sites: [
      {
        id: 'site1',
        name: 'Site1',
        isExpanded: false,
        isSelected: false,
        type: 'site',
        buildings: [
          {
            id: 'building1',
            name: 'Building1',
            isExpanded: false,
            isSelected: false,
            type: 'building',
            areas: [],
            hvacs: []
          },
          {
            id: 'building2',
            name: 'Building2',
            isExpanded: false,
            isSelected: false,
            type: 'building',
            areas: [],
            hvacs: []
          }
        ],
        endpoints: []
      },
      {
        id: 'site2',
        name: 'Site2',
        isExpanded: false,
        isSelected: false,
        type: 'site',
        buildings: [],
        endpoints: []
      }
    ]
  },
  {
    id: 'customerId2',
    name: 'Customer2',
    isExpanded: false,
    isSelected: false,
    type: 'customer',
    sites: [
      {
        id: 'site3',
        name: 'Site3',
        isExpanded: false,
        isSelected: false,
        type: 'site',
        buildings: [],
        endpoints: []
      },
      {
        id: 'site4',
        name: 'Site4',
        isExpanded: false,
        isSelected: false,
        type: 'site',
        buildings: [],
        endpoints: []
      }
    ]
  }
];

export let root: RootNode = {
  customers: customers,
  isExpanded: false
};
