import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/client';

export interface ChatMessage {
  id: string;
  senderName: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface ChatState {
  conversationId: string | null;
  items: ChatMessage[];
  offset: number;
  hasMore: boolean;
  loading: boolean;
  refreshing: boolean;
  errorMessage: string | null;
}

const PAGE_SIZE = 20;

const initialState: ChatState = {
  conversationId: '64', // TODO: make dynamic when conversation list is available
  items: [],
  offset: 0,
  hasMore: true,
  loading: false,
  refreshing: false,
  errorMessage: null,
};

export const fetchMessagesThunk = createAsyncThunk(
  'chat/fetchMessages',
  async (
    arg: { reset?: boolean } | undefined,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { chat: ChatState };
      const { conversationId } = state.chat;
      const nextOffset = arg?.reset ? 0 : state.chat.offset;
      if (!conversationId) return rejectWithValue('No conversation selected');

      const res: any = await api.get(`/conversations/v3/${conversationId}/messages`, {
        params: { offset: nextOffset, limit: PAGE_SIZE },
      });

      console.log('res========chat', res?.data?.data?.items)
      // Accept many shapes: {code,data:{rows:[]}}, {data:[]}, {rows:[]}, []
      const payloadData = res.data?.data ?? res.data;
      const rows: any[] = Array.isArray(payloadData)
        ? payloadData
        : (payloadData?.rows || payloadData?.items || payloadData?.list || payloadData?.messages || []);

      const extract = (m: any) => {
        const id = m.id || m.messageId || m.uuid || m._id;
        // Prefer Zalo message fields based on direction
        const directionRaw: string = (m.direction || '').toString().toUpperCase();
        const isIncoming = directionRaw === 'INCOMING';
        const partnerName = isIncoming
          ? (m.userName || m.from?.name || m.senderName)
          : (m.toDisplayName || m.toName || m.receiverName || m.senderName);
        const partnerAvatar = isIncoming
          ? (m.userAvatar || m.from?.avatar || m.sender?.avatarUrl)
          : (m.toAvatar || m.receiverAvatar || m.avatarUrl);
        const senderName = partnerName || 'Khách hàng';
        const avatarUrl = partnerAvatar;
        const createdAtRaw = m.createdAt || m.created_at || m.timestamp || m.createdTime || m.time;
        const createdAt = createdAtRaw ? new Date(createdAtRaw).toISOString() : new Date().toISOString();
        const baseText =
          m.text ||
          m.content?.text ||
          m.content?.message ||
          m.body?.text ||
          m.payload?.text ||
          m.preview ||
          m.lastMessage?.text ||
          '';

        // Derive readable preview for non-text messages
        const typeRaw: string = (m.messageType || m.type || '').toString().toUpperCase();
        let preview = (baseText || '').trim();
        const attachments = m.attachments || m.files || m.media || [];

        const formatDuration = (seconds?: number) => {
          if (!seconds || Number.isNaN(seconds)) return undefined;
          const mm = Math.floor(seconds / 60);
          const ss = Math.floor(seconds % 60);
          return `${mm}:${ss.toString().padStart(2, '0')}`;
        };

        if (!preview) {
          if (typeRaw === 'CALL_REQUEST' || typeRaw === 'CALL' || typeRaw === 'ZALO_CALL') {
            const direction = (m.callDirection || m.direction || m.extra?.direction || '').toString().toUpperCase();
            const status = m.callStatus || m.status || m.extra?.status;
            const duration = formatDuration(m.duration || m.extra?.durationSeconds);
            const dirText = direction === 'OUT' || direction === 'OUTBOUND' ? 'đi' : direction ? 'đến' : '';
            const parts = [`[Gọi Zalo]${dirText ? ' ' + dirText : ''}`];
            if (status) parts.push(status);
            if (duration) parts.push(duration);
            preview = parts.join(' • ');
          } else if (typeRaw.includes('IMAGE')) {
            preview = '[Hình ảnh]';
          } else if (typeRaw.includes('FILE')) {
            const count = Array.isArray(attachments) ? attachments.length : 1;
            preview = count > 1 ? `[Tệp] ${count} tệp đính kèm` : '[Tệp] 1 tệp đính kèm';
          } else if (typeRaw.includes('TEMPLATE')) {
            preview = m.message ? `[Mẫu] ${m.message}` : '[Mẫu] Tin nhắn mẫu';
          } else if (typeRaw.includes('REACTION')) {
            preview = '[Cảm xúc]';
          } else if (typeRaw.includes('JOIN')) {
            preview = '[Hệ thống] Đã tham gia';
          } else if (typeRaw.includes('LEAVE')) {
            preview = '[Hệ thống] Đã rời';
          } else if (attachments?.length) {
            preview = `[Tệp] Đã gửi ${attachments.length} tệp`;
          }
        }
        return {
          id: String(id ?? `${nextOffset}-${Math.random().toString(36).slice(2, 8)}`),
          senderName,
          avatarUrl,
          content: preview || '',
          createdAt,
        } as ChatMessage;
      };

      const items: ChatMessage[] = rows.map((m: any) => extract(m));

      return { items, received: items.length, reset: !!arg?.reset };
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || e?.message || 'Không thể tải tin nhắn');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversationId(state, action: PayloadAction<string>) {
      state.conversationId = action.payload;
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
      state.errorMessage = null;
    },
    clearChat(state) {
      state.items = [];
      state.offset = 0;
      state.hasMore = true;
      state.errorMessage = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMessagesThunk.pending, (state, action) => {
        const isReset = (action.meta.arg as any)?.reset;
        state.errorMessage = null;
        if (isReset) state.refreshing = true; else state.loading = true;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        const { items, received, reset } = action.payload as { items: ChatMessage[]; received: number; reset: boolean };
        state.loading = false;
        state.refreshing = false;
        state.items = reset ? items : [...state.items, ...items];
        state.offset = reset ? received : state.offset + received;
        state.hasMore = received >= PAGE_SIZE;
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.errorMessage = (action.payload as string) || 'Tải tin nhắn thất bại';
      });
  },
});

export const { setConversationId, clearChat } = chatSlice.actions;
export default chatSlice.reducer;


