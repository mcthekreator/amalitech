import { Mat017ItemFormControlName } from './mat017-Item-form-control-name';

describe('Mat017ItemFormControlName', () => {
  describe('fromValues', () => {
    it('should correctly initialize from mat017ItemMatNumber and configurationMatNumber', () => {
      const mat017ItemMatNumber = 'MAT0171234';
      const configurationMatNumber = 'MAT9041234';
      const instance = Mat017ItemFormControlName.fromValues(mat017ItemMatNumber, configurationMatNumber);

      expect(instance.mat017ItemMatNumber).toBe(mat017ItemMatNumber);
      expect(instance.configurationMatNumber).toBe(configurationMatNumber);
    });
  });

  describe('fromString', () => {
    it('should correctly initialize from a valid string', () => {
      const mat017ItemMatNumber = 'MAT0171234';
      const configurationMatNumber = 'MAT9041234';
      const validString = `${mat017ItemMatNumber}|${configurationMatNumber}`;
      const instance = Mat017ItemFormControlName.fromString(validString);

      expect(instance.mat017ItemMatNumber).toBe(mat017ItemMatNumber);
      expect(instance.configurationMatNumber).toBe(configurationMatNumber);
    });

    it('should throw an error for a string without the separator', () => {
      const invalidString = '123456';

      expect(() => {
        Mat017ItemFormControlName.fromString(invalidString);
      }).toThrow();
    });
  });

  describe('getName', () => {
    it('should return the correct name combining mat017ItemMatNumber and configurationMatNumber with separator', () => {
      const mat017ItemMatNumber = 'MAT0171234';
      const configurationMatNumber = 'MAT9041234';
      const instance = Mat017ItemFormControlName.fromValues(mat017ItemMatNumber, configurationMatNumber);

      const expectedName = `${mat017ItemMatNumber}|${configurationMatNumber}`;

      expect(instance.getName()).toBe(expectedName);
    });
  });
});
