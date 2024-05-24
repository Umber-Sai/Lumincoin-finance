export enum CategoryType {
    expense = 'expense',
    income = 'income'
}

export type CategorySettings = {
    [key: string]: string
}

export type CategoryResponseType = Array<CardInfo>

export type CardInfo = {
    id: number,
    title: string
}