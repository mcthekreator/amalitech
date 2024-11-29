export interface ChainflexMockData {
  searchString: string;
  newChainflexLength: string;
  newChainflexPartNumber: string;
}

export const chainflexMockDataScenario: ChainflexMockData = {
  searchString: 'CF10.01.12',
  newChainflexLength: '50',
  newChainflexPartNumber: 'new CF part number',
};

export type SortField = 'part number';
