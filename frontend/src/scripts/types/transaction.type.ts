import { RowType } from "./row-item.type"

export type TransactionInfoType = {
    [RowType.id]: number,
    [RowType.type]: string,
    [RowType.category]: string,
    [RowType.amount]: number,
    [RowType.date]: string, 
    [RowType.comment]: string 
}

export type CompressedTransactions = {
    category: string,
    amount: number
}

