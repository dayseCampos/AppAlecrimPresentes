import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from '../styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { fetchProducts } from '../services/products';
import { useCart } from '../hooks/useCart';
import TopBar from '../components/TopBar';

const PALETTE = {
  offWhite: '#F2F2F2',
  sand:     '#EAE4D5',
  taupe:    '#B6B09F',
  black:    '#000000',
};

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite, addToCart } = useCart();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchProducts('Todas', '');
        if (mounted) setAll(list || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const favList = useMemo(() => all.filter((p) => favorites.includes(p.id)), [all, favorites]);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: '#fff', borderColor: '#e6e2d7', borderWidth: 1 }]}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={{ height: 120, borderRadius: 12, marginBottom: 8 }} />
      ) : (
        <View style={{ height: 120, borderRadius: 12, marginBottom: 8, backgroundColor: PALETTE.sand }} />
      )}

      <View style={{ position: 'absolute', right: 6, top: 6 }}>
        <TouchableOpacity
          onPress={() => {
            toggleFavorite(item.id);
            Toast.show({ type: 'success', text1: 'Removido dos favoritos' });
          }}
          style={{ padding: 8, backgroundColor: '#ffffffcc', borderRadius: 999 }}
        >
          <Ionicons name="heart" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.cardTitle, { color: PALETTE.black }]}>{item.name}</Text>
      <Text style={[styles.cardMeta, { color: PALETTE.taupe }]}>
        {item.brand} • {item.category} • {item.subtype}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[styles.money, { color: PALETTE.black }]}>R$ {Number(item.price).toFixed(2)}</Text>
        <TouchableOpacity
          onPress={() => {
            addToCart(item);
            Toast.show({ type: 'success', text1: 'Adicionado ao carrinho' });
          }}
          style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: PALETTE.sand, borderWidth: 1, borderColor: '#e6e2d7' }}
        >
          <Ionicons name="cart" size={18} color={PALETTE.black} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: PALETTE.offWhite }, styles.center]}>
        <TopBar showBack onBackPress={() => navigation.goBack()} showLogo={false} title="Favoritos" />
        <Text style={[styles.subtitle, { color: PALETTE.taupe }]}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.offWhite }]}>
      <TopBar showBack onBackPress={() => navigation.goBack()} showLogo={false} title="Favoritos" />
      {favList.length === 0 ? (
        <Text style={[styles.subtitle, { color: PALETTE.taupe }]}>Você ainda não favoritou nenhum produto.</Text>
      ) : (
        <FlatList data={favList} keyExtractor={(it) => it.id} renderItem={renderItem} />
      )}
    </View>
  );
}
