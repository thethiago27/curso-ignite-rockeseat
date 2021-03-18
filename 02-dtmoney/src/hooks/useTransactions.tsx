import {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {api} from "../service/api";

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createAt: string;
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
    children: ReactNode;
}

type TransactionInput = Omit<Transaction, 'id' | 'createAt'>


export const UseTransactions = createContext<TransactionsContextData>({} as TransactionsContextData)


export function TransactionsProvider({children}: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])



    useEffect(() => {
        api.get('/transactions')
            .then(response => setTransactions(response.data.transactions))
    }, [])

    async function createTransaction(transactionInput: TransactionInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createAt: new Date()
        })
        const { transaction } = response.data

        setTransactions([...transactions, transaction])

    }

    return (
        <UseTransactions.Provider value={{
            transactions,
            createTransaction
        }}>
            {children}
        </UseTransactions.Provider>
    )

}

export function useTransactions() {
    return useContext(UseTransactions)
}
