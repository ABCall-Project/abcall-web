export interface Issue {
    auth_user_id: string,
    auth_user_agent_id: string,
    subject: string,
    description: string,
    file?: File;
}