
export function cloneDataObject<T>(obj: T): T
{
   const clone = <T>{};
   for (const k of Object.keys(obj))
   {
      if (obj[k] != null &&  isObject(obj[k]))
      {
         clone[k] = cloneDataObject(obj[k]);
      }
      else
      {
         clone[k] = copyAtomicValue(obj[k]);
      }
   }
   return <T>clone;
}

function copyAtomicValue(val): any
{
   if ( val == null ) return val;
   else if ( isArray(val) ) return val.slice();
   else if ( isDate(val) ) return new Date(val.getTime());
   else return val;
}

export function copyWithoutUnchangedAtomicDataVsReference(obj, refObj)
{
   if (isAtomicValue(obj)) return atomicValueEquals(obj, refObj) ? undefined : obj;

   const res = {};

   for (const key of Object.keys(obj))
   {
      const fieldVal = obj[key];
      if (!isFunction(fieldVal))
      {
         const refAtKey = refObj !== undefined ? refObj[key] : undefined;
         const woUnchanged = copyWithoutUnchangedAtomicDataVsReference(fieldVal, refAtKey);
         if (woUnchanged !== undefined &&
            (isAtomicValue(woUnchanged) || Object.keys(woUnchanged).length > 0))
         {
            res[key] = woUnchanged;
         }
      }
   }

   return res;
}

type FieldDiffType = 'new' | 'updated' | 'removed';

export interface AtomicValueDiff
{
   path: string;
   diffType: FieldDiffType;
   fromValue?: any;
   toValue?: any;
}

export function atomicValuesDiffList
   (
      fromObj: any,
      toObj: any,
      path: string = '',
   )
   : AtomicValueDiff[]
{
   if ( !fromObj && !toObj )
      return [];

   if ( fromObj && isAtomicValue(fromObj) )
   {
      if ( !toObj )
         return [{path, diffType: 'removed', fromValue: fromObj, toValue: toObj}];
      else if ( !isAtomicValue(toObj) )
         throw new Error(`values at path ${path} are not comparable`);
      else
         return atomicValueEquals(fromObj, toObj) ? []
            : [{path, diffType: 'updated', fromValue: fromObj, toValue: toObj}];
   }

   if ( toObj && isAtomicValue(toObj) )
   {
      if ( !fromObj )
         return [{path, diffType: 'new', fromValue: fromObj, toValue: toObj}];
      else // fromObj can't be an atomic value here, would have already returned above in that case
         throw new Error(`values at path ${path} are not comparable`);
   }

   // From here neither object is atomic, but one (at most) may be null/undefined.

   const res = [];

   unionKeys(fromObj, toObj).forEach(key => {
      const fromVal = fromObj ? fromObj[key] : undefined;
      const toVal = toObj ? toObj[key] : undefined;

      if ( !isFunction(fromVal) && !isFunction(toVal) )
      {
         const pathWithKey = path ? path + '/' + key : key;
         res.push(...this.atomicValuesDiffList(fromVal, toVal, pathWithKey));
      }
   });

   return res;
}

// "Atomic" values here means those that we won't look within to find further differences of its parts vs another such value.
function isAtomicValue(obj): boolean
{
   return !isObject(obj);
}

function isObject(obj): boolean
{
   return {}.toString.apply(obj) === '[object Object]';
}

function isArray(obj): boolean
{
   return Array.isArray(obj);
}

function isFunction(obj): boolean
{
   return {}.toString.apply(obj) === '[object Function]';
}

function isDate(obj): boolean
{
   return {}.toString.apply(obj) === '[object Date]';
}

function arraysEqual(a: any[], b: any[])
{
   if (a === b) { return true; }
   if (a == null || b == null || a.length !== b.length ) return false;

   for (let i = 0; i < a.length; ++i)
   {
      if (a[i] !== b[i]) return false;
   }

   return true;
}

function atomicValueEquals(a, b): boolean
{
   return (
      a === b ||
      (isDate(a) && isDate(b) && a.getTime() === b.getTime()) ||
      (isArray(a) && isArray(b) && arraysEqual(a, b))
   );
}

/// Return a copy of the left object keeping only items for which the same data path exists in the right reference object.
export function copySharedAtomicDataPathsFromLeft(lObj, rObj, includeEmptyObjects = false): any
{
   if (isAtomicValue(lObj)) return rObj === undefined ? undefined : lObj;

   const res = {};

   for (const key of Object.keys(lObj))
   {
      const lValOrig = lObj[key];

      if (!isFunction(lValOrig))
      {
         const rVal = rObj !== undefined ? rObj[key] : undefined;

         if (rVal !== undefined)
         {
            const lVal = copySharedAtomicDataPathsFromLeft(lValOrig, rVal, includeEmptyObjects);

            if (lVal !== undefined && (isAtomicValue(lVal) || includeEmptyObjects || Object.keys(lVal).length > 0))
            {
               res[key] = lVal;
            }
         }
      }
   }

   return res;
}

export function copyUnsharedAtomicDataPathsFromLeft(lObj, rObj, includeEmptyObjects = false): any
{
   if (isAtomicValue(lObj)) return rObj === undefined ? lObj : undefined;

   const res = {};

   for (const key of Object.keys(lObj))
   {
      const lValOrig = lObj[key];

      if (!isFunction(lValOrig))
      {
         const rVal = rObj !== undefined ? rObj[key] : undefined;

         if (rVal !== undefined)
         {
            const lVal = copyUnsharedAtomicDataPathsFromLeft(lValOrig, rVal, includeEmptyObjects);

            if (lVal !== undefined && (isAtomicValue(lVal) || includeEmptyObjects || Object.keys(lVal).length > 0))
            {
               res[key] = lVal;
            }
         }
         else
         {
            res[key] = lValOrig;
         }
      }
   }

   return res;
}

export function partitionLeftChangedAndNewValuesVsRefByConflictWithRights
   (
      lObj,
      rObj,
      ref,
      omitIdenticalLRChanges = true
   )
   : ConflictsPartition {

   const lChanged = copyWithoutUnchangedAtomicDataVsReference(lObj, ref);
   const rChanged = copyWithoutUnchangedAtomicDataVsReference(rObj, ref);

   // Discard data changed identically vs. ref between left and right (identical edits).
   const lChangedWithoutSameLRChanges = copyWithoutUnchangedAtomicDataVsReference(lChanged, rChanged);

   // Atomic data at remaining shared paths represent conflicting changes.
   const conflicts = copySharedAtomicDataPathsFromLeft(lChangedWithoutSameLRChanges, rChanged);

   const nonConflictsWithoutSameLRChanges = copyUnsharedAtomicDataPathsFromLeft(lChangedWithoutSameLRChanges, rChanged);

   // Atomic data at unshared paths represent non-conflicting changes.
   const nonConflicts = omitIdenticalLRChanges ?
      nonConflictsWithoutSameLRChanges :
      copyUnsharedAtomicDataPathsFromLeft(lChanged, conflicts);

   return {
      conflictingValues: conflicts,
      nonConflictingValues: nonConflicts,
   };
}

export interface ConflictsPartition {
   conflictingValues: any;
   nonConflictingValues: any;
}

export function copyWithMergedValuesFrom(toObj, fromObj, allowReplacingExistingAtomicValues = false): any {
   const res = cloneDataObject(toObj);
   mergeValues(res, fromObj, allowReplacingExistingAtomicValues);
   return res;
}

export function mergeValues(toObj, fromObj, allowReplacingExistingAtomicValues = false)
{
   for (const k of Object.keys(fromObj))
   {
      const fromVal = fromObj[k];

      if (isAtomicValue(fromVal))
      {
         if (toObj[k] !== undefined )
         {
            if (!isAtomicValue(toObj[k]))
            {
               throw new MergeError(`Will not replace a non-atomic value ${toObj[k]} with an atomic value ${fromVal} in merge operation.`);
            }
            if (!allowReplacingExistingAtomicValues)
            {
               throw new MergeError(`Merge operation would have overwritten an existing atomic value for key '${k}'.`);
            }
         }
         toObj[k] = copyAtomicValue(fromVal);
      }
      else // from value is a container (Object)
      {
         if (toObj[k] === undefined)
         {
            toObj[k] = {};
         }
         else if (isAtomicValue(toObj[k]))
         {
            throw new MergeError('Will not replace an atomic value with a non-atomic value in merge operation.');
         }

         mergeValues(toObj[k], fromVal, allowReplacingExistingAtomicValues);
      }
   }
}

export class MergeError extends Error {
   constructor(m: string)
   {
      super(m);
      Object.setPrototypeOf(this, MergeError.prototype);
   }
}


function unionKeys(fromObj: any, toObj: any): Set<string>
{
   const keysUnion = new Set<string>();
   if (fromObj)
      Object.keys(fromObj).forEach(key => keysUnion.add(key));
   if (toObj)
      Object.keys(toObj).forEach(key => keysUnion.add(key));
   return keysUnion;
}

