import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchConversations as apiFetchConversations } from '@/api/conversations';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Conversation {
  id: string;
  title: string;
  avatarUrl?: string;
  lastPreview?: string;
  lastTimestamp?: string;
  pinned?: boolean;
  pinnedAt?: number;
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

      // restore pinned map (id -> pinnedAt) to avoid losing when refresh
      const persisted = await AsyncStorage.getItem('pinned_conversation_ids');
      const pinnedMap = new Map<string, number>();
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (Array.isArray(parsed)) {
          parsed.forEach((id: string, idx: number) => pinnedMap.set(String(id), Date.now() - idx));
        } else if (parsed && typeof parsed === 'object') {
          Object.entries(parsed).forEach(([id, ts]) => pinnedMap.set(String(id), Number(ts)));
        }
      }

      const items: Conversation[] = rows.map((c: any, idx: number) => ({
        id: String(c.id || c.conversationId || c._id || `conv-${Date.now()}-${idx}`),
        title: c.customerName || c.title || c.name || c.userName || 'Khách hàng',
        avatarUrl: c.customerAvatar || c.avatarUrl || c.userAvatar,
        lastPreview: c.lastMessage ? mapPreview(c.lastMessage) : mapPreview(c),
        lastTimestamp: (c.lastMessage?.timestamp || c.timestamp) ? new Date(c.lastMessage?.timestamp || c.timestamp).toISOString() : undefined,
        pinned: pinnedMap.has(String(c.id || c.conversationId || c._id || `conv-${Date.now()}-${idx}`)),
        pinnedAt: pinnedMap.get(String(c.id || c.conversationId || c._id || `conv-${Date.now()}-${idx}`)),
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
    togglePin(state, action: PayloadAction<string>) {
      const id = action.payload;
      const target = state.items.find((i) => i.id === id);
      if (target) {
        target.pinned = !target.pinned;
        target.pinnedAt = target.pinned ? Date.now() : undefined;
        // Reorder: pinned first, then by pinnedAt desc, then by lastTimestamp
        state.items = [...state.items].sort((a, b) => {
          if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
          if (a.pinned && b.pinned) {
            const pa = a.pinnedAt ?? 0;
            const pb = b.pinnedAt ?? 0;
            if (pb !== pa) return pb - pa;
          }
          const ta = a.lastTimestamp ? Date.parse(a.lastTimestamp) : 0;
          const tb = b.lastTimestamp ? Date.parse(b.lastTimestamp) : 0;
          return tb - ta;
        });
        // persist map
        const pinMap: Record<string, number> = {};
        state.items.forEach((i) => { if (i.pinned && i.pinnedAt) pinMap[i.id] = i.pinnedAt; });
        AsyncStorage.setItem('pinned_conversation_ids', JSON.stringify(pinMap)).catch(() => {});
      }
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
        // Merge pages and de-duplicate by id while preserving pinned flag
        const merged = reset ? items : [...state.items, ...items];
        const map = new Map<string, Conversation>();
        for (const it of merged) {
          const existing = map.get(it.id);
          if (existing) {
            map.set(it.id, { ...existing, ...it, pinned: existing.pinned || it.pinned });
          } else {
            map.set(it.id, it);
          }
        }
        const next = Array.from(map.values());
        // Always keep pinned on top, then by pinnedAt desc (newest pin on top), fallback lastTimestamp desc
        next.sort((a, b) => {
          if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
          if (a.pinned && b.pinned) {
            const pa = a.pinnedAt ?? 0;
            const pb = b.pinnedAt ?? 0;
            if (pb !== pa) return pb - pa;
          }
          const ta = a.lastTimestamp ? Date.parse(a.lastTimestamp) : 0;
          const tb = b.lastTimestamp ? Date.parse(b.lastTimestamp) : 0;
          return tb - ta;
        });
        state.items = next;
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

export const { clearConversations, togglePin } = conversationsSlice.actions;
export default conversationsSlice.reducer;


