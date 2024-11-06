export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  member_count: number;
  user_role: 'owner' | 'admin' | 'member';
}

export interface TeamCreationData {
  name: string;
  description?: string;
}

export interface TeamUpdateData {
  name?: string;
  description?: string;
  status?: 'active' | 'archived';
}
