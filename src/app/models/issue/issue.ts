export interface Issue {
    id: string
    auth_user_id?: string,
    auth_user_agent_id?: string,
    subject: string,
    description: string,
    file?: File,
    status?: string,
    closed_at?: string,
    created_at?: string,
    channel_plan_id?: string
}
