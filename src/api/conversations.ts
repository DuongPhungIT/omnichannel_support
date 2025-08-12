import { api } from './client';

export interface ConversationItem {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessagePreview?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export async function fetchConversationMessages(conversationId: string, offset: number, limit: number) {
  const url = `/conversations/v3/${conversationId}/messages`;
  const res = await api.get(url, { params: { offset, limit } });
  return res.data;
}

export async function fetchConversations(offset: number, limit: number) {
  const url = `/conversations/v3`;
  const res = await api.get(url, { params: { offset, limit } });
  return res.data;
}


