import {FormGroup} from '@angular/forms';
import {isEmptyString} from './microbiology/salmonella/test-data';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ResourceCodesDialogResult} from '../common-components/resource-codes-dialog/resource-codes-dialog-result';
import {AlertMessageService} from '../shared/services/alerts';
import {ResourceCodesDialogComponent} from '../common-components/resource-codes-dialog/resource-codes-dialog.component';


export class ResourceControlAssignmentsManager {

   assignedResourceCodesByTargetControlName: Map<string, Set<string>>;

   unassignedCodes: Set<string>;

   // Don't append multiple selection values together for these controls (e.g. dropdown lists),
   // even if a delimiter is set.
   readonly singleValueOnlyControlNames: Set<string>;

   constructor
      (
         private formGroup: FormGroup,
         private resourceTypeListsByTargetControlName: Map<string, string[]>,
         private delimiter: string,
         singleValueOnlyControlNames: string[] = [],
         private resourceTypeCodeExtractor: (string) => string = defaultResourceTypeCodeExtractor
      )
   {
      this.assignedResourceCodesByTargetControlName = new Map();
      this.unassignedCodes = new Set();
      this.singleValueOnlyControlNames = new Set(singleValueOnlyControlNames);
   }

   promptAssignResources
      (
         dialogSvc: MatDialog,
         alertMsgSvc: AlertMessageService,
         dialogConfig?: MatDialogConfig,
      )
   {
      const dlg = dialogSvc.open(ResourceCodesDialogComponent, dialogConfig || {width: 'calc(80%)'});

      dlg.afterClosed().subscribe((result: ResourceCodesDialogResult) => {
         if ( result )
         {
            this.assignResourceCodes(result.resourceCodes);

            if ( this.unassignedCodes.size > 0 )
            {
               alertMsgSvc.alertWarning(
                  `${this.unassignedCodes.size} resource codes were not matched to any fields:`,
                  false,
                  Array.from(this.unassignedCodes)
               );
            }
         }
      });
   }

   applyAssignedResourceToControl(resourceCode: string, controlName: string)
   {
      const ctrl = this.formGroup.get(controlName);

      if ( ctrl )
      {
         if ( this.delimiter && !this.singleValueOnlyControlNames.has(controlName) )
         {
            const ctlVal = ctrl.value as string;

            if ( ctlVal )
               ctrl.setValue(ctlVal + this.delimiter + resourceCode);
            else
               ctrl.setValue(resourceCode);

            this.removeAssignedResourceCodeForControl(resourceCode, controlName);
         }
         else // only single values may be applied
         {
            ctrl.setValue(resourceCode);

            this.removeAllAssignedResourceCodesForControl(controlName);
         }
      }
   }

   removeAllResourceAssignmentsForControl(controlName: string)
   {
      this.assignedResourceCodesByTargetControlName.delete(controlName);
   }


   hasAssignedOrAppliedResources(controlName: string): boolean
   {
      return this.assignedResourceCodesByTargetControlName.has(controlName);
   }

   getAssignedResourceCodesForControl(controlName: string): Set<string>
   {
      return this.assignedResourceCodesByTargetControlName.get(controlName);
   }

   assignResourceCodes(resourceCodes: string[])
   {
      const assignments = this.makeResourceCodeControlAssignments(resourceCodes);

      const assignedResourceCodesByTargetControlName = new Map(assignments.assignedResourceCodesByTargetControlName);

      const resourceCodeInstanceCounts: Map<string, number> = getResourceCodeInstanceCounts(resourceCodes);

      // If a resource code's match to a control is suitably unambiguous then it is applied as the control's value, and is no
      // longer considered assigned. An empty set of assigned codes is left for the control to indicate that a code was applied to it.
      // @ts-ignore
      for (const [controlName, controlResourceCodes] of assignments.assignedResourceCodesByTargetControlName.entries())
      {
         if ( controlResourceCodes.size === 1 )
         {
            const loneResourceCode = controlResourceCodes.values().next().value;
            const codeNumAssignedTargetControls = assignments.assignedTargetControlsCountByResourceCode.get(loneResourceCode);
            const codeMultiplicity = resourceCodeInstanceCounts.get(loneResourceCode);
            if ( codeNumAssignedTargetControls === codeMultiplicity )
            {
               this.formGroup.get(controlName).setValue(loneResourceCode);
               assignedResourceCodesByTargetControlName.set(controlName, new Set());
            }
         }
      }

      this.assignedResourceCodesByTargetControlName = assignedResourceCodesByTargetControlName;
      this.unassignedCodes = assignments.unassignedResourceCodes;
   }

   removeAllAssignedResourceCodesForControl(controlName)
   {
      this.assignedResourceCodesByTargetControlName.delete(controlName);
   }

   removeAssignedResourceCodeForControl(resourceCode: string, controlName: string)
   {
      const codes = this.assignedResourceCodesByTargetControlName.get(controlName);
      if (codes)
      {
         codes.delete(resourceCode);
         if (codes.size === 0) this.assignedResourceCodesByTargetControlName.delete(controlName);
      }
   }

   // Assign the given resource codes to available (empty) target controls by their registered resource types.
   // Returns a map of control name to a set of assigned resource code values (does not consider multiple
   // occurrences of resource code values).
   private makeResourceCodeControlAssignments(resourceCodes: string[]): Assignments
   {
      const resourceCodesByTargetControlName: Map<string, Set<string>> = new Map();
      const matchedTargetControlsCountByResourceCode: Map<string, number> = new Map();

      const unassignedResourceCodes = new Set(resourceCodes);

      const resourceCodesByCodeType: Map<string, Set<string>> =
         getResourceCodeValuesByCodeType(resourceCodes, this.resourceTypeCodeExtractor);

      // @ts-ignore
      for (const [controlName, controlResourceTypes] of this.resourceTypeListsByTargetControlName.entries())
      {
         if ( isEmptyString(this.formGroup.get(controlName).value) )  // only consider empty target fields
         {
            for (const controlResourceType of controlResourceTypes)
            {
               const resourceCodesOfType = resourceCodesByCodeType.get(controlResourceType);
               if (resourceCodesOfType)
               {
                  let controlResourceCodes = resourceCodesByTargetControlName.get(controlName);
                  if (!controlResourceCodes)
                  {
                     controlResourceCodes = new Set();
                     resourceCodesByTargetControlName.set(controlName, controlResourceCodes);
                  }

                  // @ts-ignore
                  for (const resourceCode of resourceCodesOfType)
                  {
                     controlResourceCodes.add(resourceCode);
                     unassignedResourceCodes.delete(resourceCode);
                     // Bump matched controls count for this code.
                     const codeControlsCount = matchedTargetControlsCountByResourceCode.get(resourceCode) || 0;
                     matchedTargetControlsCountByResourceCode.set(resourceCode, codeControlsCount + 1);
                  }
               }
            }
         }
      }

      return {
         assignedResourceCodesByTargetControlName: resourceCodesByTargetControlName,
         assignedTargetControlsCountByResourceCode: matchedTargetControlsCountByResourceCode,
         unassignedResourceCodes
      };
   }

   setMultipleValuesAssignable(controlName: string, multipleAssignable: boolean)
   {
      if ( multipleAssignable && this.singleValueOnlyControlNames.has(controlName) )
         this.singleValueOnlyControlNames.delete(controlName);
      else if ( !multipleAssignable && !this.singleValueOnlyControlNames.has(controlName) )
         this.singleValueOnlyControlNames.add(controlName);
   }
}

function getResourceCodeValuesByCodeType
   (
      resourceCodes: string[],
      resourceTypeCodeExtractor: (string) => string = defaultResourceTypeCodeExtractor
   )
   : Map<string, Set<string>>
{
   const m = new Map<string, Set<string>>();

   for (const resourceCode of resourceCodes)
   {
      const codeType = resourceTypeCodeExtractor(resourceCode) || '';
      const codesForType = m.get(codeType);
      if (codesForType) codesForType.add(resourceCode);
      else m.set(codeType, new Set().add(resourceCode));
   }

   return m;
}

function getResourceCodeInstanceCounts(resourceCodes: string[]): Map<string, number>
{
   const m = new Map<string, number>();

   for (const resourceCode of resourceCodes)
   {
      const count = m.get(resourceCode) || 0;
      m.set(resourceCode, count + 1);
   }

   return m;
}

function defaultResourceTypeCodeExtractor(resourceCode: string): string
{
   const sepIx = resourceCode.indexOf('-');
   if ( sepIx !== -1 )
      return resourceCode.substring(0, sepIx);
   else
   {
      const firstDigitIx = resourceCode.search(/[0-9]/);
      return firstDigitIx === -1 ? '' : resourceCode.substring(0, firstDigitIx);
   }
}


interface Assignments {

   assignedResourceCodesByTargetControlName:  Map<string, Set<string>>;

   assignedTargetControlsCountByResourceCode: Map<string, number>;

   unassignedResourceCodes: Set<string>;
}

