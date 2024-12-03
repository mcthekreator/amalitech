export interface userInterface{
    id: Number,
    name: String,
    username: String,
    phone: String,
    image: String,
    email: String,
    password: String,
    role: String
}
export interface errorInterface{
    error : {
        message: String,
        status: Number
    }
}