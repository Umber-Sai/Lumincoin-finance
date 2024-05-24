export enum EditorTypes {
    income = 'income',
    expense = 'expense',
    transactions = 'transactions'
}

export type EditorTypeSettings = {
    [EditorTypes.income]: string
    [EditorTypes.expense]: string
    [EditorTypes.transactions]: string
}

export type EditorInputsType = {
    [EditorTypes.income]: Array<EditorInputPropsType>
    [EditorTypes.expense]: Array<EditorInputPropsType>
    [EditorTypes.transactions]: Array<EditorInputPropsType>
}

export type EditorInputPropsType = {
    p : string,
    id : ERT,
    type : string,
}

export type EditorSelectOptionsType = {
    id: string,
    title: string
}

export enum EditorSelectType {
    type = 'type',
    category_id ='category_id'
}

export enum ERT {
    id = 'id',
    type = 'type',
    amount = 'amount',
    date = 'date',
    comment = 'comment',
    category = 'category',
    title = 'title'
}

export type EditResponseType = {
    [ERT.id]: number,
    [ERT.type]?: string,
    [ERT.amount]?: number,
    [ERT.date]?: string,
    [ERT.comment]?: string,
    [ERT.category]?: string
    [ERT.title]?: string
}


