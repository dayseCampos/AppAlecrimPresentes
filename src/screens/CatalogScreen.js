// src/screens/CatalogScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import TopBar from '../components/TopBar';
import { fetchProducts } from '../services/products';

const PALETTE = {
  offWhite: '#F2F2F2',
  sand:     '#EAE4D5',
  taupe:    '#B6B09F',
  black:    '#000000',
};

export default function CatalogScreen({ route, navigation }) {
  const brand = route?.params?.brand || 'Todas';
  const query = route?.params?.query || '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchProducts(brand, query);
        if (!mounted) return;
        setItems(list || []);
        setErr(null);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || 'Falha ao carregar');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [brand, query]);

  const title =
    query ? `Buscar: "${query}"` : brand !== 'Todas' ? `Marca: ${brand}` : 'Produtos';

  return (
    <View style={{ flex: 1, backgroundColor: PALETTE.offWhite }}>
      <TopBar
        showBack
        onBackPress={() => navigation.goBack()}
        showLogo={false}
        title={title}
        rightIcon="cart-outline"
        onRightPress={() => navigation.navigate('Cart')}
      />

      {loading && <Text style={s.info}>Carregando...</Text>}
      {err && <Text style={[s.info, { color: '#ef4444' }]}>Erro: {err}</Text>}
      {!loading && !items.length && <Text style={s.info}>Nada encontrado.</Text>}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id?.toString?.()}
        numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => navigation.navigate('Product', { productId: item.id, product: item })}
            activeOpacity={0.9}
          >
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={s.img} resizeMode="cover" />
            ) : (
              <View style={[s.img, { backgroundColor: PALETTE.sand }]} />
            )}
            <Text numberOfLines={2} style={s.name}>{item.name}</Text>
            <Text style={s.meta}>{item.brand} • {item.category}</Text>
            <Text style={s.price}>R$ {Number(item.price).toFixed(2)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  info: { textAlign: 'center', marginTop: 12, color: '#6b7280' },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6e2d7',
  },
  img:  { width: '100%', height: 140, borderRadius: 12 },
  name: { marginTop: 8, fontSize: 13, fontWeight: '700', color: PALETTE.black },
  meta: { fontSize: 11, color: PALETTE.taupe, marginTop: 2 },
  price:{ marginTop: 6, fontSize: 14, fontWeight: '800', color: PALETTE.black },
});
