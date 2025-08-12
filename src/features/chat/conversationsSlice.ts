import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchConversations as apiFetchConversations } from '@/api/conversations';

export interface Conversation {
  id: string;
  title: string;
  avatarUrl?: string;
  lastPreview?: string;
  lastTimestamp?: string;
}

export interface ConversationsState {
  items: Conversation[];
  offset: number;
  hasMore: boolean;
  loading: boolean;
  refreshing: boolean;
  errorMessage: string | null;
}

const PAGE_SIZE = 20;

const initialState: ConversationsState = {
  items: [],
  offset: 0,
  hasMore: true,
  loading: false,
  refreshing: false,
  errorMessage: null,
};

export const fetchConversationsThunk = createAsyncThunk(
  'conversations/fetch',
  async (arg: { reset?: boolean } | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { conversations: ConversationsState };
      const nextOffset = arg?.reset ? 0 : state.conversations.offset;
      const res: any = await apiFetchConversations(nextOffset, PAGE_SIZE);

      const payload = res?.data ?? res;
      const rows: any[] = Array.isArray(payload?.items) ? payload.items : (payload?.rows || payload?.list || []);

      const mapPreview = (m: any) => {
        const type = (m.messageType || '').toUpperCase();
        const text = m.message || m.text || '';
        if (type.includes('TEXT')) return text;
        if (type.includes('STICKER')) return '[Sticker]';
        if (type.includes('TEMPLATE')) return '[Mẫu]';
        if (type.includes('CALL')) return '[Gọi Zalo]';
        if (type.includes('IMAGE')) return '[Hình ảnh]';
        if (type.includes('FILE')) return '[Tệp]';
        return text || '[Tin nhắn]';
      };

      const items: Conversation[] = rows.map((c: any, idx: number) => ({
        id: String(c.id || c.conversationId || c._id || `conv-${Date.now()}-${idx}`),
        title: c.customerName || c.title || c.name || c.userName || 'Khách hàng',
        avatarUrl: c.customerAvatar || c.avatarUrl || c.userAvatar,
        lastPreview: c.lastMessage ? mapPreview(c.lastMessage) : mapPreview(c),
        lastTimestamp: (c.lastMessage?.timestamp || c.timestamp) ? new Date(c.lastMessage?.timestamp || c.timestamp).toISOString() : undefined,
      }));

      return { items, received: items.length, reset: !!arg?.reset };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || 'Không thể tải cuộc hội thoại');
    }
  }
);

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearConversations(state) {
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchConversationsThunk.pending, (state, action) => {
        const isReset = (action.meta.arg as any)?.reset;
        state.errorMessage = null;
        if (isReset) state.refreshing = true; else state.loading = true;
      })
      .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
        const { items, received, reset } = action.payload as { items: Conversation[]; received: number; reset: boolean };
        state.loading = false;
        state.refreshing = false;
        state.items = reset ? items : [...state.items, ...items];
        state.offset = reset ? received : state.offset + received;
        state.hasMore = received >= PAGE_SIZE;
      })
      .addCase(fetchConversationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.errorMessage = (action.payload as string) || 'Tải cuộc hội thoại thất bại';
      });
  },
});

export const { clearConversations } = conversationsSlice.actions;
export default conversationsSlice.reducer;


