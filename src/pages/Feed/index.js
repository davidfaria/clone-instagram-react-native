import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList} from 'react-native';

import api from '../../services/api';

import LazyImage from '../../components/LazyImage';

import {Post, Header, Avatar, Name, Description, Loading} from './styles';

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewable, setViewable] = useState([]);

  async function loadPage(pageNumber = page, shouldRefresh = false) {
    if (total && pageNumber > total) return;

    setLoading(true);

    const res = await api.get(
      `feed?_expand=author&_limit=5&_page=${pageNumber}`,
    );

    const data = res.data;

    const totalItens = res.headers['x-total-count'];

    setTotal(Math.floor(totalItens / 5));
    setFeed(shouldRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  }

  useEffect(() => {
    loadPage();
  }, []);

  async function refreshList() {
    setRefreshing(true);

    await loadPage(1, true);

    setRefreshing(false);
  }

  const handleViewbleChanged = useCallback(({changed}) => {
    setViewable(changed.map(({item}) => item.id));
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={post => String(post.id)}
        onEndReached={() => loadPage()}
        onEndReachedThreshold={0.2}
        onRefresh={refreshList}
        refreshing={refreshing}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 10}}
        onViewableItemsChanged={handleViewbleChanged}
        ListFooterComponent={loading && <Loading />}
        renderItem={({item}) => (
          <Post>
            <Header>
              <Avatar source={{uri: item.author.avatar}} />
              <Name>{item.author.name}</Name>
            </Header>

            <LazyImage
              shouldLoad={viewable.includes(item.id)}
              smallSource={item.small}
              source={item.image}
              ratio={item.aspectRatio}
            />

            <Description>
              <Name>{item.author.name}</Name>
              {item.description}
            </Description>
          </Post>
        )}
      />
    </View>
  );
}
