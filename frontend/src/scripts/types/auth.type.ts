export type AuthType = {
    tokens : TokensType,
    user : UserType
}

export type ReloginType = {
    tokens : TokensType
}

export type TokensType = {
    accessToken: string,
    refreshToken: string
}

export type UserType = {
    name: string,
    lastname: string,
    id: number
}