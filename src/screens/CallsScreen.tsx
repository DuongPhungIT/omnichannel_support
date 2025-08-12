import React from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import CallListItem from '@/components/CallListItem';

type Filter = 'all' | 'missed';

interface CallRow {
  id: string;
  displayName: string;
  timeText: string;
  direction: 'incoming' | 'outgoing' | 'missed';
  kind?: 'voice' | 'video';
  avatarUrl?: string;
}

function generateMock(start: number, count: number): CallRow[] {
  const names = ['Kaiya Rhiel Madsen', 'Jaydon Dorwart', 'Kierra Saris', 'Marcus Ekstrom Bothman', 'Jordyn Aminoff', 'Maren Mango'];
  const dirs: Array<CallRow['direction']> = ['incoming', 'outgoing', 'missed'];
  const kinds: Array<CallRow['kind']> = ['voice', 'video'];
  const rows: CallRow[] = [];
  for (let i = 0; i < count; i += 1) {
    const idNum = start + i + 1;
    const name = names[(start + i) % names.length];
    const direction = dirs[(start + i) % dirs.length];
    const kind = kinds[(start + i) % kinds.length];
    const hour = (13 - ((start + i) % 12)).toString().padStart(2, '0');
    const minute = ((start + i) % 60).toString().padStart(2, '0');
    rows.push({ id: String(idNum), displayName: name, timeText: `${hour}:${minute}`, direction, kind });
  }
  return rows;
}

export default function CallsScreen() {
  const theme = useTheme();
  const [filter, setFilter] = React.useState<Filter>('all');
  const [base, setBase] = React.useState<CallRow[]>(() => generateMock(0, 20));
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const data = React.useMemo(() => {
    if (filter === 'all') return base;
    return base.filter((c) => c.direction === 'missed');
  }, [filter, base]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const next = generateMock(base.length, 20);
      setBase((prev) => [...prev, ...next]);
      if (base.length + next.length >= 200) setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      // Simulate refresh by generating a fresh head
      const fresh = generateMock(0, 20);
      setBase(fresh);
      setHasMore(true);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ padding: 12 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#F3F6FB', borderRadius: 12, padding: 4 }}>
          {(['all', 'missed'] as Filter[]).map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{ flex: 1, backgroundColor: active ? theme.colors.primary : 'transparent', borderRadius: 8, alignItems: 'center', paddingVertical: 8 }}
              >
                <Text style={{ color: active ? '#FFFFFF' : '#173558', fontWeight: active ? '700' : '500' }}>
                  {f === 'all' ? 'Tất cả' : 'Nhỡ'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CallListItem
            displayName={item.displayName}
            timeText={item.timeText}
            direction={item.direction}
            kind={item.kind}
            avatarUrl={item.avatarUrl}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReachedThreshold={0.25}
        onEndReached={loadMore}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListFooterComponent={loadingMore ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator />
          </View>
        ) : null}
      />
    </View>
  );
}


