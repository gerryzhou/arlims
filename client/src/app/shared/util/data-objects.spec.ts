import {
   copySharedAtomicDataPathsFromLeft,
   copyUnsharedAtomicDataPathsFromLeft,
   copyWithMergedValuesFrom,
   copyWithoutUnchangedAtomicDataVsReference,
   MergeError,
   partitionLeftChangedAndNewValuesVsRefByConflictWithRights,
   cloneDataObject, atomicValuesDiffList,
} from './data-objects';


describe('copyWithoutUnchangedAtomicDataVsReference function', () => {

   const flatObjA: any = {
      stringOnlyInObjA: 'val-A',
      commonString: 'A value',
      commonStringCommonVal: 'common value',
      commonArray: [1, 2, 3],
      commonArrayCommonValue: [4, 6, 7],
      commonDateField: new Date(2018, 7, 18, 8, 30, 23, 100),
      commonDateFieldCommonValue: new Date(2018, 7, 18, 8, 30, 23, 100),
      commonBoolean: false,
   };

   const flatObjB: any = {
      stringOnlyInObjB: 'val-B',
      commonString: 'B value',
      commonStringCommonVal: 'common value',
      commonArray: [3, 2, 1],
      commonArrayCommonValue: [4, 6, 7],
      commonDateField: new Date(2011, 1, 1, 1, 1, 1, 1),
      commonDateFieldCommonValue: new Date(2018, 7, 18, 8, 30, 23, 100),
      dateOnlyInObjB: new Date(2011, 1, 1, 1, 1, 1, 1),
      commonBoolean: true,
      booleanOnlyInObjB: true,
   };

   it('should yield undefined for simple atomic values that are equal', () => {
      expect(copyWithoutUnchangedAtomicDataVsReference(1, 1)).toBeUndefined();
   });

   it('should leave only fields that don\'t have the same value in the reference object for simple unnested objects', () => {
      const changed = copyWithoutUnchangedAtomicDataVsReference(flatObjA, flatObjB);

      expect(changed.commonString).toBe('A value');
      expect(changed.commonStringCommonVal).toBeUndefined();
      expect(changed.commonArray).toEqual([1, 2, 3]);
      expect(changed.commonArrayCommonVal).toBeUndefined();
      expect(changed.stringOnlyInObjA).toBe('val-A');
      expect(changed.stringOnlyInObjB).toBeUndefined();
      expect(changed.commonDateField.getTime()).toBe(new Date(2018, 7, 18, 8, 30, 23, 100).getTime());
      expect(changed.commonDateFieldCommonValue).toBeUndefined();
      expect(changed.dateOnlyInObjB).toBeUndefined();
      expect(changed.commonBoolean).toBe(false);
      expect(changed.booleanOnlyInObjB).toBeUndefined();

      expect(Object.keys(changed).length).toBe(5);
   });


   it('should leave only fields that don\'t have the same value in the reference object for nested objects', () => {
      const obj1 = {
         commonField: flatObjA,
         commonFieldCommonValue: { common: { a: { x: 1, y: 2}, b: 2 } },
         obj1Field: { obj1NestedField: { a: 99 } }
      };
      const obj2 = {
         commonField: flatObjB,
         commonFieldCommonValue: { common: { a: { x: 1, y: 2}, b: 2 } },
         obj2Field: { obj2NestedField: { b: 1 } }
      };

      const changed = copyWithoutUnchangedAtomicDataVsReference(obj1, obj2);

      const changedCommonField = changed.commonField;
      expect(changedCommonField.commonString).toBe('A value');
      expect(changedCommonField.commonStringCommonVal).toBeUndefined();
      expect(changedCommonField.commonArray).toEqual([1, 2, 3]);
      expect(changedCommonField.commonArrayCommonVal).toBeUndefined();
      expect(changedCommonField.stringOnlyInObjA).toBe('val-A');
      expect(changedCommonField.stringOnlyInObjB).toBeUndefined();
      expect(changedCommonField.commonDateField.getTime()).toBe(new Date(2018, 7, 18, 8, 30, 23, 100).getTime());
      expect(changedCommonField.commonDateFieldCommonValue).toBeUndefined();
      expect(changedCommonField.dateOnlyInObjB).toBeUndefined();
      expect(changedCommonField.commonBoolean).toBe(false);
      expect(changedCommonField.booleanOnlyInObjB).toBeUndefined();

      expect(changed.commonFieldCommonValue).toBeUndefined();

      expect(changed.obj1Field).toBeTruthy();
      expect(changed.obj1Field.obj1NestedField).toBeTruthy();
      expect(changed.obj1Field.obj1NestedField.a).toBe(99);

      expect(Object.keys(changed).length).toBe(2);
   });


   it('should properly eliminate equal nested values', () => {
      const nestedA = {
         a: {
            b: 1,
            c: {
               d: 2,
               e: 3,
               array: [1, 2, 4]
            }
         }
      };
      const nestedB = {
         a: {
            b: 1,
            c: {
               d: 2,
               e: 3,
               array: [1, 2, 4]
            }
         }
      };

      const changed = copyWithoutUnchangedAtomicDataVsReference(nestedA, nestedB);

      expect(Object.keys(changed).length).toBe(0);
   });

   it('should leave only equal fields in nested values', () => {
      const nestedA = {
         a: {
            b: 1,
            c: {
               d: 2,
               e: 3,
               array: [1, 2, 4]
            }
         }
      };
      const nestedB = {
         a: {
            b: 1,
            c: {
               d: 2,
               e: 4,
               array: [1, 4, 2]
            }
         }
      };

      const changed = copyWithoutUnchangedAtomicDataVsReference(nestedA, nestedB);

      expect(Object.keys(changed).length).toBe(1);
      expect(changed.a).toBeTruthy();
      expect(changed.a.c).toBeTruthy();
      expect(changed.a.c.e).toBeTruthy();
      expect(Object.keys(changed.a).length).toBe(1);
      expect(Object.keys(changed.a.c).length).toBe(2);
      expect(changed.a.c.e).toBe(3);
      expect(changed.a.c.array).toEqual([1, 2, 4]);
   });

});

describe('copySharedAtomicDataPathsFromLeft function', () => {

   it('should yield undefined when right side is undefined', () => {
      expect(copySharedAtomicDataPathsFromLeft(1, undefined)).toBeUndefined();
   });

   it('should yield empty object when no data paths are common with reference', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {x: 1, y: 2};
      expect(copySharedAtomicDataPathsFromLeft(a, b)).toEqual({});
   });

   it('should yield copy of left object when reference has identical structure', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {x: 3, y: 1}};
      expect(copySharedAtomicDataPathsFromLeft(a, b)).toEqual(a);
   });

   it('should yield copy of left object without top-level item when reference is missing the item', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {b: {x: 3, y: 1}};
      expect(copySharedAtomicDataPathsFromLeft(a, b)).toEqual({b: {x: 1, y: 2}});
   });

   it('should yield copy of left object without nested item when reference is missing the item', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {y: 1}};
      expect(copySharedAtomicDataPathsFromLeft(a, b)).toEqual({a: 1, b: {y: 2}});
   });

   it('should yield copy of left object without nested object when none of the nested object\'s fields are common', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {u: 3, v: 1}};
      expect(copySharedAtomicDataPathsFromLeft(a, b)).toEqual({a: 1});
   });

   it('should include empty nested object when none of its fields are common and including empty objects', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {u: 3, v: 1}};
      expect(copySharedAtomicDataPathsFromLeft(a, b, true)).toEqual({a: 1, b: {}});
   });

});

describe('copyUnsharedAtomicDataPathsFromLeft function', () => {

   it('should yield left value when right side is undefined', () => {
      expect(copyUnsharedAtomicDataPathsFromLeft(1, undefined)).toBe(1);
   });

   it('should yield left value when no data paths are common with reference', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {x: 1, y: 2};
      expect(copyUnsharedAtomicDataPathsFromLeft(a, b)).toEqual(a);
   });

   it('should yield empty object when right structure includes all paths of the left structure', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {x: 3, y: 1}, z: 22};
      expect(copyUnsharedAtomicDataPathsFromLeft(a, b)).toEqual({});
   });

   it('should yield left value with only top-level item when reference is only missing that item', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {b: {x: 3, y: 1}};
      expect(copyUnsharedAtomicDataPathsFromLeft(a, b)).toEqual({a: 1});
   });

   it('should yield left value with only nested item when reference is only missing that item', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {y: 1}};
      expect(copyUnsharedAtomicDataPathsFromLeft(a, b)).toEqual({b: {x: 1}});
   });

   it('should yield left value with only nested object when none of the nested object\'s fields are common', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {u: 3, v: 1}};
      expect(copyUnsharedAtomicDataPathsFromLeft(a, b)).toEqual({b: {x: 1, y: 2}});
   });

   it('should include empty nested object when all of its fields are common and including empty objects', () => {
      const a = {a: 1, b: {x: 1, y: 2}};
      const b = {a: 2, b: {x: 3, y: 1, z: 1}};
      expect(copyUnsharedAtomicDataPathsFromLeft(a, b, true)).toEqual({b: {}});
   });

});

describe('partitionLeftChangedAndNewValuesVsRefByConflictWithRights function', () => {

   it('should yield no data in each partition for identical changes vs. ref when ignoring identical changes', () => {
      const ref = {a: 1, b: {x: 1, y: 1}};
      const lEdits = {a: 2, b: {x: 3, y: 1}}; // changed: {a: 2, b: {x: 3}}
      const rEdits = {a: 2, b: {x: 3, y: 1}}; // "

      expect(partitionLeftChangedAndNewValuesVsRefByConflictWithRights(lEdits, rEdits, ref)).toEqual(
         {
            nonConflictingValues: {},
            conflictingValues: {},
         }
      );
   });

   it('should yield all as non-conflicting for identical changes when not ignoring identical changes', () => {
      const ref = {a: 1, b: {x: 1, y: 1}};
      const lEdited = {a: 2, b: {x: 3, y: 1}}; // changed: {a: 2, b: {x: 3}}
      const rEdited = {a: 2, b: {x: 3, y: 1}}; // "

      expect(partitionLeftChangedAndNewValuesVsRefByConflictWithRights(lEdited, rEdited, ref, false)).toEqual(
         {
            nonConflictingValues: {a: 2, b: {x: 3}},
            conflictingValues: {},
         }
      );
   });

   it('should yield non-conflicting changes only when changes do not overlap', () => {
      const ref = {a: 1, b: {x: 1, y: 1}};
      const lEdits = {a: 3, b: {x: 4, y: 1}};
      const rEdits = {a: 1, b: {x: 1, y: 2}};

      expect(partitionLeftChangedAndNewValuesVsRefByConflictWithRights(lEdits, rEdits, ref)).toEqual(
         {
            nonConflictingValues: {a: 3, b: {x: 4}},
            conflictingValues: {},
         }
      );
   });

   it('should yield non-conflicting changes only when overlapping changes are all identical', () => {
      const ref = {a: 1, b: {x: 1, y: 1}};
      const lEdits = {a: 3, b: {x: 4, y: 2}};
      const rEdits = {a: 1, b: {x: 1, y: 2}};

      expect(partitionLeftChangedAndNewValuesVsRefByConflictWithRights(lEdits, rEdits, ref)).toEqual(
         {
            nonConflictingValues: {a: 3, b: {x: 4}},
            conflictingValues: {},
         }
      );
   });

   it('should yield conflicting and non-conflicting changes when overlapping changes are not all identical', () => {
      const ref = {a: 1, b: {x: 1, y: 1}};
      const lEdits = {a: 3, b: {x: 4, y: 2}};
      const rEdits = {a: 1, b: {x: 1, y: 3}};

      expect(partitionLeftChangedAndNewValuesVsRefByConflictWithRights(lEdits, rEdits, ref)).toEqual(
         {
            nonConflictingValues: {a: 3, b: {x: 4}},
            conflictingValues: {b: {y: 2}},
         }
      );
   });

   it('should ignore deletions vs the reference', () => {
      const ref = {a: 1, b: {x: 1, y: 1}};
      const lEdits = {a: 3}; // deletion of b field will be ignored
      const rEdits = {a: 1, b: {x: 1, y: 3}};
      expect(partitionLeftChangedAndNewValuesVsRefByConflictWithRights(lEdits, rEdits, ref)).toEqual(
         {
            nonConflictingValues: {a: 3},
            conflictingValues: {},
         }
      );
   });

   it('should yield conflicting and non-conflicting changes for atomic values of various types', () => {
      const ref = {
         a: {
            stringOnlyInRef: 'refVal',
            commonString: 'Ref value',
            commonStringCommonVal: 'common value',
            commonDateField: new Date(2018, 7, 18, 8, 30, 23, 100),
            commonDateFieldCommonValue: new Date(2018, 7, 18, 8, 30, 23, 100),
            commonBoolean: false,
         }
      };
      const lEdits = {
         a: {
            stringOnlyInLeftEdit: 'left only',
            commonString: 'left value',
            commonStringCommonVal: 'common value',
            commonDateField: new Date(2010, 7, 18, 8, 30, 23, 100),
            commonDateFieldCommonValue: new Date(2018, 7, 18, 8, 30, 23, 100),
            commonBoolean: true,
         }
      };
      const rEdits = {
         a: {
            stringOnlyInRightEdit: 'right only',
            commonString: 'right value',
            commonStringCommonVal: 'common value',
            commonDateField: new Date(2009, 7, 18, 8, 30, 23, 100),
            commonDateFieldCommonValue: new Date(2018, 7, 18, 8, 30, 23, 100),
            commonBoolean: false,
         },
         b: {y: 1}
      };

      const partitionedLeftValues = partitionLeftChangedAndNewValuesVsRefByConflictWithRights(lEdits, rEdits, ref);

      expect(partitionedLeftValues).toEqual(
         {
            nonConflictingValues: {
               a: {
                  stringOnlyInLeftEdit: 'left only',
                  commonBoolean: true
               },
            },
            conflictingValues: {
               a: {
                  commonString: 'left value',
                  commonDateField: new Date(2010, 7, 18, 8, 30, 23, 100)
               }
            },
         }
      );
   });

});

describe('copyWithMergedValuesFrom function', () => {

   it('should yield left object value when right side is empty', () => {
      expect(copyWithMergedValuesFrom({a: 1, b: 2}, {}))
         .toEqual({a: 1, b: 2});
   });

   it('should yield right object value when left side is empty for simple flat object', () => {
      expect(copyWithMergedValuesFrom({}, {a: 1, b: 2}))
         .toEqual({a: 1, b: 2});
   });

   it('should yield right object value when left side is empty for object with nested structure', () => {
      expect(copyWithMergedValuesFrom({}, {a: 1, b: {x: 1, y: 2}}))
         .toEqual({a: 1, b: {x: 1, y: 2}});
   });

   it('should yield combined left and right values when there are no common top-level fields', () => {
      expect(copyWithMergedValuesFrom({a: 1, b: {x: 1, y: 2}}, {c: {z: 3}, d: 4}))
         .toEqual({a: 1, b: {x: 1, y: 2}, c: {z: 3}, d: 4});
   });

   it('should merge structures properly when top level field is common but without leaf values overlap', () => {
      expect(copyWithMergedValuesFrom({a: 1, b: {x: 1, y: 2}}, {b: {z: 3}, d: 4}))
         .toEqual({a: 1, b: {x: 1, y: 2, z: 3}, d: 4});
   });

   it('should merge structures properly when top level field is common and leaf values overlap when leaf value overlaps allowed', () => {
      expect(copyWithMergedValuesFrom({a: 1, b: {x: 1, y: 2}}, {b: {x: 3}, d: 4}, true))
         .toEqual({a: 1, b: {x: 3, y: 2}, d: 4});
   });

   it('should fail when leaf values overlap and leaf value overlaps are not allowed', () => {
      expect(() => copyWithMergedValuesFrom({a: 1, b: {x: 1, y: 2}}, {b: {x: 3}, d: 4}, false))
         .toThrowError(MergeError);
   });

});

describe('cloneDataObject function', () => {

   it('should yield empty object for empty input', () => {
      expect(cloneDataObject({})).toEqual({});
   });

   it('should clone top-level array members properly', () => {
      const a = {a: [1, 2]};
      expect(cloneDataObject(a)).toEqual({a: [1, 2]});
   });
});

describe('atomicValuesDiffList function', () => {

   it('should yield empty list when both sides null or undefined', () => {
      expect(atomicValuesDiffList(undefined, undefined)).toEqual([]);
   });

   it('should yield empty list when inputs are same number', () => {
      expect(atomicValuesDiffList(10, 10)).toEqual([]);
   });

   it('should yield empty list when inputs are same date', () => {
      const now = new Date();
      expect(atomicValuesDiffList(now, now)).toEqual([]);
   });

   it('should yield empty list when inputs are same string', () => {
      expect(atomicValuesDiffList('hello', 'hello')).toEqual([]);
   });

   it('should yield empty list when inputs are same array value', () => {
      expect(atomicValuesDiffList([1, 2], [1, 2])).toEqual([]);
   });

   it('should yield empty list when both inputs are empty objects', () => {
      expect(atomicValuesDiffList({}, {})).toEqual([]);
   });

   it('should yield empty list when objects have nested content and have same contents', () => {
      const now = new Date();
      const a = {a: {aa: 1, ab: now}, b: {ba: 'yes', bb: [1, 2]}};
      const b = {a: {aa: 1, ab: now}, b: {ba: 'yes', bb: [1, 2]}};
      expect(atomicValuesDiffList(a, b)).toEqual([]);
   });

   it('should yield \'new\' diff record when resp. values are undefined and a number', () => {
      expect(atomicValuesDiffList(undefined, 2)).toEqual(
         [ { path: '', diffType: 'new', fromValue: undefined, toValue: 2} ]
      );
   });

   it('should yield \'removed\' diff record when resp. values are a number and undefined', () => {
      expect(atomicValuesDiffList(2, undefined)).toEqual(
         [ { path: '', diffType: 'removed', fromValue: 2, toValue: undefined} ]
      );
   });

   it('should yield \'updated\' diff record when resp. values are two different numbers', () => {
      expect(atomicValuesDiffList(2, 3)).toEqual(
         [ { path: '', diffType: 'updated', fromValue: 2, toValue: 3} ]
      );
   });

   it('should yield empty list when objects are simple and have same contents', () => {
      const now = new Date();
      const a = {a: 1, b: now, c: 'yes', d: [1, 2]};
      const b = {a: 1, b: now, c: 'yes', d: [1, 2]};
      expect(atomicValuesDiffList(a, b)).toEqual([]);
   });

   it('should yield \'updated\' record for top level numeric field difference', () => {
      const now = new Date();
      const a = {a: 1, b: now, c: 'yes', d: [1, 2]};
      const b = {a: 2, b: now, c: 'yes', d: [1, 2]};
      expect(atomicValuesDiffList(a, b)).toEqual([
         { path: 'a', diffType: 'updated', fromValue: 1, toValue: 2}
      ]);
   });

   it('should yield \'updated\' record for top level string field difference', () => {
      const now = new Date();
      const a = {a: 1, b: now, c: 'yes', d: [1, 2]};
      const b = {a: 1, b: now, c: 'no', d: [1, 2]};
      expect(atomicValuesDiffList(a, b)).toEqual([
         { path: 'c', diffType: 'updated', fromValue: 'yes', toValue: 'no'}
      ]);
   });

   it('should yield \'new\' record for new top level string field', () => {
      const now = new Date();
      const a = {a: 1, b: now, c: 'yes', d: [1, 2]};
      const b = {a: 1, b: now, c: 'yes', d: [1, 2], e: 'hey!'};
      expect(atomicValuesDiffList(a, b)).toEqual([
         { path: 'e', diffType: 'new', fromValue: undefined, toValue: 'hey!'}
      ]);
   });

   it('should yield \'new\' records for new top level date and string fields', () => {
      const now = new Date();
      const a = {a: 1, c: 'yes', d: [1, 2]};
      const b = {a: 1, c: 'yes', d: [1, 2], e: 'hey!', b: now};
      expect(atomicValuesDiffList(a, b)).toEqual([
         { path: 'e', diffType: 'new', fromValue: undefined, toValue: 'hey!'},
         { path: 'b', diffType: 'new', fromValue: undefined, toValue: now}
      ]);
   });

   it('should yield proper \'new\' diff record for nested values', () => {
      const now = new Date();
      const a = {a: 1, b: {c: 1, d: [1, 2]}};
      const b = {a: 1, b: {c: 1, d: [1, 2], e: 'hey!'}};
      expect(atomicValuesDiffList(a, b)).toEqual([
         { path: 'b/e', diffType: 'new', fromValue: undefined, toValue: 'hey!'},
      ]);
   });

   it('should yield proper \'removed\' diff record for nested values', () => {
      const now = new Date();
      const a = {a: 1, b: {c: 1, d: [1, 2], e: 'hey!'}};
      const b = {a: 1, b: {c: 1, d: [1, 2]}};
      expect(atomicValuesDiffList(a, b)).toEqual([
         { path: 'b/e', diffType: 'removed', fromValue: 'hey!', toValue: undefined},
      ]);
   });

   it('should yield proper \'updated\' diff record for nested string updates', () => {
      const now = new Date();
      const a = {a: 1, b: {c: 1, d: [1, 2], e: 'hey-1'}};
      const b = {a: 1, b: {c: 1, d: [1, 2], e: 'hey-2'}};
      expect(atomicValuesDiffList(a, b)).toEqual([
         { path: 'b/e', diffType: 'updated', fromValue: 'hey-1', toValue: 'hey-2'},
      ]);
   });

});

