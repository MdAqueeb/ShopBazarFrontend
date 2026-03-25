import axiosInstance from './axiosInstance';
import type { Transaction } from '../types/transaction';

const API = 'http://localhost:8080/api/transactions';

const unwrap = <T>(res: any): T => (res.data?.data !== undefined ? res.data.data : res.data);

export const transactionApi = {
  getTransactionById: async (transactionId: number) => {
    const res = await axiosInstance.get<any>(`${API}/${transactionId}`);
    return unwrap<Transaction>(res);
  }
};
