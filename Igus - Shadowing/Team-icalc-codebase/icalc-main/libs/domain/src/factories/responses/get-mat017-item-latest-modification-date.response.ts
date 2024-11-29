import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { Mat017ItemLatestModificationDateResponseDto } from '../../dtos';

const mat017ItemLatestModificationDateResponse: Mat017ItemLatestModificationDateResponseDto = {
  latestModificationDate: new Date(),
};

/**
 * createMat017ItemLatestModificationDateResponse creates a Mat017ItemLatestModificationDateResponseDto
 *
 * @param override pass any needed overrides for the requested Mat017ItemLatestModificationDateResponseDto
 * @returns Mat017ItemLatestModificationDateResponseDto
 */
export const createMat017ItemLatestModificationDateResponse = (
  override?: NestedPartial<Mat017ItemLatestModificationDateResponseDto>
): Mat017ItemLatestModificationDateResponseDto => {
  return mergePartially.deep(mat017ItemLatestModificationDateResponse, override);
};
