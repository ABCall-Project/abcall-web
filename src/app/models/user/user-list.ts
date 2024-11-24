import { User } from "./user";

export interface UserList {
    page: number,
    limit: number,
    total_pages: number,
    has_next: boolean,
    data: User[]
}