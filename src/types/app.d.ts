export interface IErrorObj {
   [key: string]: { statusCode: number; message: string }
}

interface IEditUser {
   fullname?: string
   username?: string
   avatar?: string
   cover?: string
   bio?: string
}