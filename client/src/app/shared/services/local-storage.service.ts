import {Injectable} from '@angular/core';

@Injectable({
   providedIn: 'root'
})
export class LocalStorageService {

   public readonly storageAvailable: boolean;

   private storage: Storage | null = null;

   constructor()
   {
      this.storageAvailable = checkStorageAvailable('localStorage');
      this.storage = window['localStorage'];
   }

   store(key: string, value: string)
   {
      this.storage.setItem(key, value);
   }

   get(key: string): string | null
   {
      return this.storage.getItem(key);
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
