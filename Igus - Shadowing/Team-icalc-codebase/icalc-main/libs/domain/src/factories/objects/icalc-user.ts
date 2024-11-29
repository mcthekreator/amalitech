import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';
import type { IcalcUser, NewUserDTO } from '../../models';

export type BasicIcalcUserDataForTestObject = Omit<IcalcUser, 'id' | 'creationDate' | 'modificationDate'>;

const testUser: NewUserDTO = {
  email: 'icalcTestUser@icalc-e2e-tests.com',
  password: 'password',
  firstName: 'Test',
  lastName: 'User',
  role: 'Tester',
};

/**
 * createNewUserDTO creates a NewUserDTO
 *
 * @param override pass any needed overrides for the requested NewUserDTO
 * @returns NewUserDTO
 */
export const createNewUserDTO = (override?: NestedPartial<NewUserDTO>): Partial<NewUserDTO> => {
  return mergePartially.deep(testUser, override);
};

export const createTestUserFullName = (): string => {
  return testUser.firstName + ' ' + testUser.lastName;
};

const icalcUser: IcalcUser = {
  id: 'exampleIcalcUserId',
  email: 'icalcTestUser@icalc-e2e-tests.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'Tester',
  creationDate: new Date(),
  modificationDate: new Date(),
};

/**
 * createIcalcUser creates an IcalcUser
 *
 * @returns IcalcUser
 */
export const createIcalcUser = (): IcalcUser => {
  return icalcUser;
};
export const icalcTestUser = createNewUserDTO() as NewUserDTO;
