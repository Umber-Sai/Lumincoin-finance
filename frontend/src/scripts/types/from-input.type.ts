import { Input } from "../components/form"

export type FormInputType = {
    name: FormInputNames,
    icon: string,
    placeholder: string,
    type: string,
    regex: RegExp | null,
    element?: Input 
}

export enum FormInputNames {
    fullName = 'fullName',
    email = 'email',
    password = 'password',
    passwordRepeat = 'passwordRepeat'
}