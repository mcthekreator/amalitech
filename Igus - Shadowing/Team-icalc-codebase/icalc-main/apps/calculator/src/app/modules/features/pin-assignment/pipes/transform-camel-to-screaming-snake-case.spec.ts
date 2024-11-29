import transformCamelToScreamingSnakeCase from '@icalc/frontend/modules/features/pin-assignment/pipes/transform-camel-to-snake-case';
describe('Transform camelCase to SCREAMING_SNAKE_CASE', () => {
  it('should return HELLOWORLD when given helloworld', () => {
    expect(transformCamelToScreamingSnakeCase('helloworld')).toEqual('HELLOWORLD');
  });

  it('should return HELLO_WORLD when given helloWorld', () => {
    expect(transformCamelToScreamingSnakeCase('helloWorld')).toEqual('HELLO_WORLD');
  });

  it('should return HELLO_WORLD123 when given helloWorld123', () => {
    expect(transformCamelToScreamingSnakeCase('helloWorld123')).toEqual('HELLO_WORLD123');
  });

  it('should return HELLO_WORLD123_TEST when given helloWorld123Test', () => {
    expect(transformCamelToScreamingSnakeCase('helloWorld123Test')).toEqual('HELLO_WORLD123_TEST');
  });
});
