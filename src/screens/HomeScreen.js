// src/screens/HomeScreen.js
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Dimensions, StyleSheet, Image, Image as RNImage, Keyboard, ScrollView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchProducts, fetchCategories } from '../services/products';
import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';

const PALETTE = { offWhite:'#F2F2F2', sand:'#EAE4D5', taupe:'#B6B09F', black:'#000000' };
const { width } = Dimensions.get('window');

const bannerFone = require('../../assets/banners/fone-pro.png');
const bannerCapa = require('../../assets/banners/capa-strong.png');

const BANNERS = [
  { id: 'fone', image: bannerFone },
  { id: 'capa', image: bannerCapa },
];

// ===== imagens das categorias (via URLs) =====
const CAT_IMAGES = {
  Cabos: { uri: 'https://down-br.img.susercontent.com/file/af48963acc396fa0913e7643848ce32e.webp' },
  Capinhas: { uri: 'https://ik.imagekit.io/gocase/govinci/super-coracoes-pink/antiimpactoslimair-iphone13/mockup?stamp=uploads/designcustomization/28254/preview_pt_shrine/887dd256bd9bffa66c305f4e8802aa1f.png&expires=yes' },
  Carregadores: { uri: 'https://m.media-amazon.com/images/I/51wKmBOrYJL._AC_SL1000_.jpg' },
  'Fones de ouvido': { uri: 'https://martinelloeletrodomesticos.fbitsstatic.net/img/p/fone-de-ouvido-jbl-t520bt-preto-79344/265936.jpg?w=1000&h=1000&v=no-change&qs=ignore' },
  Peliculas: { uri: 'https://gpower.com.br/cdn/shop/files/peliculaxr.jpg?v=1712668700&width=600' },
  'Power banks': { uri: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/oficinadosbits/media/uploads/produtos/foto/dxmyzzxa/file.png' },

  default: { uri: 'https://via.placeholder.com/200' },
};


// ===== variáveis para categorias =====
const sVars = {
  CAT_SIZE: 86,
  CAT_GAP: 20,
};

// Proporção da imagem do produto 
const PRODUCT_ASPECT = 0.8; // 4:5

// Hook do carrinho 
let useCartSafe = () => ({ addToCart: () => {}, favorites: [], toggleFavorite: () => {} });
try { const m = require('../hooks/useCart'); if (typeof m.useCart === 'function') useCartSafe = m.useCart; } catch {}

export default function HomeScreen({ navigation, route }) {
  const [categories, setCategories] = useState([]);
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const { addToCart, favorites, toggleFavorite } = useCartSafe();

  useEffect(() => {
    const b = route?.params?.brand;
    if (b) setBrand(b);
  }, [route?.params?.brand]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await fetchCategories();
        if (!mounted) return;
        const blocked = ['Apple', 'Suportes'];

setCategories(
  (cats || [])
    .filter(c => !blocked.includes(c.label || c))   // remove do array
    .map(c => ({ id: c.id || c, label: c.label || c }))
);

      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchProducts(brand, '');
        if (!mounted) return;
        setAll(Array.isArray(list) ? list : []);
        setErr(null);
      } catch (e) {
        if (!mounted) return;
        setAll([]);
        setErr(e?.message || 'Falha ao carregar produtos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [brand]);

  const products = useMemo(() => {
    if (!search) return all;
    const q = search.toLowerCase();
    return (all || []).filter(p =>
      (p?.name || '').toLowerCase().includes(q) ||
      (p?.brand || '').toLowerCase().includes(q) ||
      (p?.category || '').toLowerCase().includes(q)
    );
  }, [all, search]);

  // ===== alturas por banner =====
  const BANNER_HEIGHTS = useMemo(() => {
    return BANNERS.map(b => {
      try {
        const meta = RNImage.resolveAssetSource(b.image);
        const ratio = meta?.height && meta?.width ? meta.height / meta.width : 0.25;
        return Math.round(width * ratio);
      } catch {
        return Math.round(width * 0.25);
      }
    });
  }, []);

  // ===== auto-slide do banner (web-safe) =====
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerRef = useRef(null);

  // anda sozinho a cada 4s
  useEffect(() => {
    const id = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // quando o índice mudar, rola até o slide correspondente
  useEffect(() => {
    try {
      bannerRef.current?.scrollToIndex?.({
        index: bannerIndex,
        animated: true,
        viewPosition: 0.5,
      });
    } catch {}
  }, [bannerIndex]);

  const getItemLayout = useCallback((_, i) => ({
    length: width,
    offset: width * i,
    index: i,
  }), []);

  const goToCatalogWithQuery = useCallback(() => {
    const q = search.trim();
    if (!q) return;
    Keyboard.dismiss();
    navigation.navigate('Catalog', { query: q });
  }, [navigation, search]);

  // Produtos em alta: até 10
  const trending = useMemo(() => products.slice(0, 10), [products]);

  return (
    <View style={s.container}>
      <TopBar
        onMenuPress={() => navigation.openDrawer()}
        onRightPress={() => navigation.navigate('Cart')}
        rightIcon="cart-outline"
        showBack={false}
        showLogo
      />

      <SearchBar value={search} onChangeText={setSearch} onSubmit={goToCatalogWithQuery} />

      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
        {/* ===== Banner com 2 imagens locais (.png) ===== */}
        <View>
          <FlatList
            ref={bannerRef}
            data={BANNERS}
            keyExtractor={(i) => String(i.id)}
            renderItem={({ item, index }) => {
              const h = BANNER_HEIGHTS[index] ?? Math.round(width * 0.25);
              return (
                <View style={[s.bannerCard, { height: h }]}>
                  <Image
                    source={item.image}
                    style={[s.bannerImg, { height: h }]}
                    resizeMode="contain"  
                  />
                </View>
              );
            }}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            getItemLayout={getItemLayout}
            snapToInterval={width}
            decelerationRate="fast"
            scrollEventThrottle={16}
            // atualiza o índice quando o usuário desliza
            onMomentumScrollEnd={(e) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / width);
              if (!Number.isNaN(i) && i !== bannerIndex) setBannerIndex(i);
            }}
          />
          <View style={s.dotsRow}>
            {BANNERS.map((_, i) => <View key={i} style={[s.dot, bannerIndex === i && s.dotActive]} />)}
          </View>
        </View>

        {/* Faixa informativa */}
        <View style={s.ribbon}>
          <Text style={s.ribbonText}>
            <Text style={{ fontWeight: '700' }}>3x SEM JUROS</Text> A PARTIR DE R$199,90  ·{' '}
          </Text>
          <Text style={[s.ribbonText, { textDecorationLine: 'underline' }]}>Frete Grátis a partir de R$299,90*</Text>
        </View>

        {/* ===== Categorias ===== */}
        {categories.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <FlatList
              data={categories}
              keyExtractor={(i) => String(i.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={s.catItem}
                  onPress={() => navigation.navigate('Catalog', { category: item.label })}
                >
                  <Image
  source={CAT_IMAGES[item.label] || CAT_IMAGES.default}
  style={s.catImg}
/>

                  <Text style={s.catLabel} numberOfLines={2}>{item.label}</Text>
                </TouchableOpacity>
              )}
              horizontal
              style={{ width }}
              contentContainerStyle={{
                paddingHorizontal: 14,
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
              }}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: sVars.CAT_GAP }} />}
            />
          </View>
        )}

        {/* ===== Produtos em alta (máx. 10) ===== */}
        <View style={s.sectionHeader}>
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
    <Text style={{ fontSize: 22 }}>🔥</Text>
    <Text style={s.sectionTitle}>Produtos em alta</Text>
  </View>

  <TouchableOpacity onPress={() => navigation.navigate('Catalog')}>
    <Text style={s.sectionLink}>ver tudo</Text>
  </TouchableOpacity>
</View>


        <FlatList
          data={trending}
          keyExtractor={(i) => String(i.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, paddingHorizontal: 14 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={s.cardGrid} activeOpacity={0.9}
              onPress={() => navigation.navigate('Product', { productId: item.id, product: item })}>
              {item.image_url
                ? <Image source={{ uri: item.image_url }} style={s.cardImg} resizeMode="cover" />
                : <View style={[s.cardImg, { backgroundColor: PALETTE.sand }]} />
              }
              <TouchableOpacity style={s.favBtn} onPress={() => toggleFavorite(item.id)}>
                <Ionicons
                  name={favorites?.includes(item.id) ? 'heart' : 'heart-outline'}
                  size={18}
                  color={favorites?.includes(item.id) ? '#ef4444' : PALETTE.black}
                />
              </TouchableOpacity>
              <Text numberOfLines={2} style={s.cardTitle}>{item.name}</Text>
              <Text style={s.cardMeta}>{item.brand} • {item.category}</Text>
              <View style={s.cardRow}>
                <Text style={s.price}>R$ {Number(item.price).toFixed(2)}</Text>
                <TouchableOpacity style={s.addBtn} onPress={() => addToCart(item)}>
                  <Ionicons name="cart" size={16} color={PALETTE.black} />
                  <Text style={s.addTxt}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={!loading ? <Text style={s.empty}>Sem produtos</Text> : null}
          contentContainerStyle={{ paddingBottom: 24, rowGap: 12, paddingTop: 6 }}
        />

        {loading && <Text style={s.loading}>Carregando...</Text>}
        {err && <Text style={s.error}>Erro: {err}</Text>}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.offWhite },

  // Banner local
  bannerCard: { width, justifyContent: 'flex-end', backgroundColor: '#e2e2e2' },
  bannerImg:  { position: 'absolute', width, left: 0, top: 0, backgroundColor: '#e2e2e2' },

  dotsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: '#d9d6cc' },
  dotActive: { backgroundColor: PALETTE.black, width: 8, height: 8 },

  ribbon: {
    marginHorizontal: 14, marginTop: 12, borderRadius: 10,
    backgroundColor: PALETTE.sand, padding: 10, flexDirection: 'row',
    flexWrap: 'wrap', justifyContent: 'center', borderWidth: 1, borderColor: '#e6e2d7',
  },
  ribbonText: { color: PALETTE.black, fontSize: 12 },

  // Categorias
  catItem: { width: sVars.CAT_SIZE + 24, alignItems: 'center' },
  catImg: {
    width: sVars.CAT_SIZE, height: sVars.CAT_SIZE, borderRadius: 999,
    backgroundColor: PALETTE.sand, borderWidth: 1, borderColor: '#e6e2d7', overflow: 'hidden',
  },
  catLabel: { width: sVars.CAT_SIZE + 24, textAlign: 'center', fontSize: 12, marginTop: 8, color: PALETTE.black },

  // Header da seção
  sectionHeader: { marginTop: 16, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: PALETTE.black },
  sectionLink: { fontSize: 12, color: PALETTE.taupe, textDecorationLine: 'underline' },

  // Cards
  cardGrid: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#e6e2d7',
  },
  cardImg: {
    width: '100%',
    height: undefined,
    aspectRatio: PRODUCT_ASPECT,
    borderRadius: 12,
    backgroundColor: PALETTE.sand,
  },

  favBtn: { position: 'absolute', top: 14, right: 14, backgroundColor: '#ffffffcc', borderRadius: 999, padding: 6, zIndex: 1 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: PALETTE.black, marginTop: 8 },
  cardMeta: { fontSize: 11, color: PALETTE.taupe, marginTop: 2 },
  cardRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 14, fontWeight: '800', color: PALETTE.black },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: PALETTE.sand, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: '#e6e2d7' },
  addTxt: { fontSize: 12, fontWeight: '700', color: PALETTE.black },

  empty: { textAlign: 'center', color: PALETTE.taupe, marginTop: 8 },
  loading: { textAlign: 'center', marginVertical: 16, color: PALETTE.taupe },
  error: { textAlign: 'center', marginVertical: 16, color: '#ef4444' },
});
