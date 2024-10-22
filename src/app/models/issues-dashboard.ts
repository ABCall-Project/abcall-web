export interface IIssuesDashboard {
    id:                 string;
    auth_user_id:       string;
    auth_user_agent_id: string;
    status:             string;
    subject:            string;
    description:        string;
    created_at:         Date;
    closed_at:          Date;
    channel_plan_id:    string;
}