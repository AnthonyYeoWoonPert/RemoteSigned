import { get, writable } from 'svelte/store';
import type Account from '../../interface/Account';
import { LOCAL_STORAGE_ACCOUNT_KEY } from '../util/constants';
import { decryptObject, encryptObject } from '../util/crypto-helper';
import { pin } from './pin-store';

export const accounts = writable<Account[]>([]);

export const saveAccounts = () => {
  localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, encryptObject(get(accounts), get(pin)));
};

export const removeAccount = (account: Account) => {
  accounts.update((accs) => accs.filter((a) => a !== account));
  if (get(accounts).length == 0) {
    clearData();
  } else {
    saveAccounts();
  }
};

export const clearData = () => {
  localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_KEY);
};

export const importAccounts = (cipherText: string, pin: string, overwrite: boolean = false): boolean => {
  const importedAccs: Account[] = decryptObject(cipherText, pin);

  if (importedAccs == null) {
    return null;
  }

  if (overwrite == true) {
    accounts.set(importedAccs);
  } else {
    accounts.update((accs) => {
      importedAccs.forEach((a) => {
        if (accs.find((e) => e.username.trim().toLowerCase() == a.username.trim().toLowerCase()) != null) return;
        accs.push(a);
      });
      return accs;
    });
  }

  saveAccounts();

  return true;
};
