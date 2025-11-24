import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles';
import { supabase } from '../services/supabase';
import { useCart } from '../hooks/useCart';
import Toast from 'react-native-toast-message';
import TopBar from '../components/TopBar';

const PALETTE = {
  offWhite: '#F2F2F2',
  sand:     '#EAE4D5',
  taupe:    '#B6B09F',
  black:    '#000000',
};

export default function ProductScreen({ route, navigation }) {
  const routeProduct = route.params?.product || null;
  const productId = route.params?.productId;
  const [product, setProduct] = useState(routeProduct);
  const { addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (routeProduct || !productId) return;
      const { data } = await supabase.from('products').select('*').eq('id', productId).single();
      if (mounted) setProduct(data || null);
    })();
    return () => { mounted = false; };
  }, [productId, routeProduct]);

  if (!product) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: PALETTE.offWhite }]}>
        <TopBar showBack onBackPress={() => navigation.goBack()} showLogo={false} title="Produto" />
        <Text style={[styles.subtitle, { color: PALETTE.taupe }]}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.offWhite }]}>
      <TopBar
        showBack
        onBackPress={() => navigation.goBack()}
        showLogo={false}
        title={product.name}
        rightIcon="cart-outline"
        onRightPress={() => navigation.navigate('Cart')}
      />
      <Image source={{ uri: product.image_url }} style={{ height: 240, borderRadius: 16, marginBottom: 12, backgroundColor: PALETTE.sand }} />
      <Text style={[styles.title, { color: PALETTE.black }]}>{product.name}</Text>
      <Text style={[styles.cardMeta, { color: PALETTE.taupe }]}>
        {product.brand} • {product.category} • {product.subtype}
      </Text>
      <Text style={[styles.money, { color: PALETTE.black }]}>R$ {Number(product.price).toFixed(2)}</Text>
      <Text style={{ marginTop: 12, lineHeight: 20, color: PALETTE.black }}>{product.description}</Text>

      <TouchableOpacity
        style={[styles.btn, { marginTop: 16, backgroundColor: PALETTE.black }]}
        onPress={() => {
          addToCart(product);
          Toast.show({ type: 'success', text1: 'Adicionado ao carrinho' });
        }}
      >
        <Text style={styles.btnText}>Adicionar ao carrinho</Text>
      </TouchableOpacity>
    </View>
  );
}
