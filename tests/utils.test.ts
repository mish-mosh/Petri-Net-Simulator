import { describe, expect, it } from '@jest/globals';
import { filterRecordOnKeys } from '@/utils';

describe('filterRecordOnKeys', () => {
  it('should return matching keys', () => {
    // given
    const record = { a: 1, b: 2, c: 3 };
    const predicate = (key: string) => key === 'a' || key === 'c';
    const expected = { a: 1, c: 3 };

    // when
    const result = filterRecordOnKeys(record, predicate);

    // then
    expect(result).toEqual(expected);
  });

  it('should return an empty object if none of the keys exist in the record', () => {
    // given
    const record = { a: 1, b: 2, c: 3 };
    const predicate = (key: string) => key === 'd' || key === 'e';
    const expected = {};

    // when
    const result = filterRecordOnKeys(record, predicate);

    // then
    expect(result).toEqual(expected);
  });

  it('should return an empty object if the record is empty', () => {
    // given
    const record = {};
    const predicate = (key: string) => key === 'a' || key === 'c';
    const expected = {};

    // when
    const result = filterRecordOnKeys(record, predicate);

    // then
    expect(result).toEqual(expected);
  });
});