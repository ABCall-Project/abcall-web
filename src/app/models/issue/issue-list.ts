
interface Issue {
    id: string
    authUserId?: string,
    auth_user_agent_id?: string,
    subject: string,
    description: string,
    status?: string,
    closedAt?: string,
    createdAt?: string,
    channelPlanId?: string
}
export interface IssueList {
    page: number,
    limit: number,
    totalPages: number,
    has_next: boolean,
    data: Issue[]
}

