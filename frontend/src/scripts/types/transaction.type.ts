export type TransactionInfoType = {
    'id': number,
    'type': string,
    'category': string,
    'amount': number,
    'date': string, 
    'comment': string 
}

export type CompressedTransactions = {
    category: string,
    amount: number
}
