import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Account {
  id: string;
  url: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountStore {
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  getAccount: (id: string) => Account | undefined;
  exportAccounts: () => string;
  importAccounts: (data: string) => void;
  clearAll: () => void;
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      accounts: [],

      addAccount: (account) => {
        const newAccount: Account = {
          ...account,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },

      updateAccount: (id, account) => {
        set((state) => ({
          accounts: state.accounts.map((acc) =>
            acc.id === id
              ? { ...acc, ...account, updatedAt: new Date().toISOString() }
              : acc
          ),
        }));
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((acc) => acc.id !== id),
        }));
      },

      getAccount: (id) => {
        return get().accounts.find((acc) => acc.id === id);
      },

      exportAccounts: () => {
        const accounts = get().accounts;
        return JSON.stringify(accounts, null, 2);
      },

      importAccounts: (data) => {
        try {
          const accounts = JSON.parse(data) as Account[];
          if (Array.isArray(accounts)) {
            set({ accounts });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to import accounts:', error);
          return false;
        }
      },

      clearAll: () => {
        set({ accounts: [] });
      },
    }),
    {
      name: 'password-manager-storage',
    }
  )
);
