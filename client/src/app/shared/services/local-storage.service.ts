import {Injectable} from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class LocalStorageService {

   public readonly readWriteStorageAvailable: boolean;

   private readonly storage: Storage;

   constructor()
   {
      this.readWriteStorageAvailable = checkStorageAvailable('localStorage');
      this.storage = window['localStorage'] || null;
   }

   store(key: string, value: string)
   {
      if ( !this.readWriteStorageAvailable )
         throw new Error('Writable local storage is not available in this environment.');
      this.storage.setItem(key, value);
   }

   get(key: string): string | null
   {
      if ( this.storage != null ) return this.storage.getItem(key);
      return null;
   }
}


type StorageType = 'localStorage' | 'sessionStorage';

function checkStorageAvailable(type: StorageType): boolean
{
   const storage = window[type];

   try
   {
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
   }
   catch (e)
   {
      return false;
   }
}
