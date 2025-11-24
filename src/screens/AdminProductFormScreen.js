// src/screens/AdminProductFormScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  ScrollView, Image, useWindowDimensions, StyleSheet
} from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';

import TopBar from '../components/TopBar';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/products';
import { useIsAdmin } from '../hooks/useIsAdmin';

const PALETTE = {
  offWhite: '#F2F2F2',
  sand:     '#EAE4D5',
  taupe:    '#B6B09F',
  black:    '#000000',
};

const emptyForm = {
  name: '', brand: '', category: '', subtype: '', price: '', image_url: '', description: ''
};

export default function AdminProductFormScreen({ navigation }) {
  const { isAdmin, loading: loadingAdmin } = useIsAdmin();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const { width } = useWindowDimensions();
  const isWide = width >= 980;                 // muda layout do form
  const gridCols = width >= 1200 ? 3 : width >= 820 ? 2 : 1; // grade da lista

  const onBack = useCallback(() => {
    if (navigation?.canGoBack?.()) navigation.goBack();
    else navigation.navigate('Home');
  }, [navigation]);

  async function load() {
    if (!isAdmin) return;
    setLoading(true);
    const data = await fetchProducts('Todas', '');
    setList(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [isAdmin]);

  const save = async () => {
    try {
      const payload = {
        ...form,
        price: Number(String(form.price).replace(',', '.')) || 0,
      };
      if (editingId) {
        await updateProduct(editingId, payload);
        Toast.show({ type: 'success', text1: 'Produto atualizado' });
      } else {
        await createProduct(payload);
        Toast.show({ type: 'success', text1: 'Produto criado' });
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar', text2: e.message });
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name ?? '',
      brand: item.brand ?? '',
      category: item.category ?? '',
      subtype: item.subtype ?? '',
      price: String(item.price ?? ''),
      image_url: item.image_url ?? '',
      description: item.description ?? '',
    });
  };

  const del = async (id) => {
    try {
      await deleteProduct(id);
      Toast.show({ type: 'success', text1: 'Produto removido' });
      await load();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro ao deletar', text2: e.message });
    }
  };

  if (loadingAdmin) {
    return (
      <View style={[s.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <TopBar showLogo onBackPress={onBack} showBack />
        <Text style={{ color: PALETTE.taupe, marginTop: 16 }}>Verificando permissão…</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[s.screen, { alignItems: 'center', justifyContent: 'center' }]}>
        <TopBar showLogo onBackPress={onBack} showBack />
        <Text style={{ color: PALETTE.black, fontWeight: '700', fontSize: 16 }}>Acesso negado.</Text>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <TopBar showLogo onBackPress={onBack} showBack />

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.container}>

          {/* ====== FORM CARD ====== */}
          <View style={s.card}>
            <Text style={s.title}>Admin · Produtos</Text>
            <Text style={s.subtitle}>{editingId ? 'Editar produto' : 'Novo produto'}</Text>

            {/* Linha 1: nome */}
            <View style={s.row}>
              <TextInput
                placeholder="nome"
                placeholderTextColor={PALETTE.taupe}
                value={form.name}
                onChangeText={(v) => setForm(f => ({ ...f, name: v }))}
                style={[s.input, { flex: 1 }]}
              />
            </View>

            {/* Linha 2: brand + category */}
            <View style={[s.row, !isWide && { flexDirection: 'column' }]}>
              <TextInput
                placeholder="marca"
                placeholderTextColor={PALETTE.taupe}
                value={form.brand}
                onChangeText={(v) => setForm(f => ({ ...f, brand: v }))}
                style={[s.input, isWide ? s.inputHalf : { width: '100%' }]}
              />
              <TextInput
                placeholder="categoria"
                placeholderTextColor={PALETTE.taupe}
                value={form.category}
                onChangeText={(v) => setForm(f => ({ ...f, category: v }))}
                style={[s.input, isWide ? s.inputHalf : { width: '100%' }]}
              />
            </View>

            {/* Linha 3: subtype + price */}
            <View style={[s.row, !isWide && { flexDirection: 'column' }]}>
              <TextInput
                placeholder="subcategoria"
                placeholderTextColor={PALETTE.taupe}
                value={form.subtype}
                onChangeText={(v) => setForm(f => ({ ...f, subtype: v }))}
                style={[s.input, isWide ? s.inputHalf : { width: '100%' }]}
              />
              <TextInput
                placeholder="preço"
                placeholderTextColor={PALETTE.taupe}
                value={form.price}
                onChangeText={(v) => setForm(f => ({ ...f, price: v }))}
                keyboardType="decimal-pad"
                style={[s.input, isWide ? s.inputHalf : { width: '100%' }]}
              />
            </View>

            {/* Linha 4: image_url */}
            <View style={s.row}>
              <TextInput
                placeholder="imagem_url"
                placeholderTextColor={PALETTE.taupe}
                value={form.image_url}
                onChangeText={(v) => setForm(f => ({ ...f, image_url: v }))}
                style={[s.input, { flex: 1 }]}
              />
            </View>

            {/* Preview da imagem */}
            {!!form.image_url && (
              <View style={{ marginTop: 8 }}>
                <Image
                  source={{ uri: form.image_url }}
                  style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: PALETTE.sand }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Linha 5: description */}
            <View style={s.row}>
              <TextInput
                placeholder="descrição"
                placeholderTextColor={PALETTE.taupe}
                value={form.description}
                onChangeText={(v) => setForm(f => ({ ...f, description: v }))}
                multiline
                style={[s.input, { flex: 1, minHeight: 90, textAlignVertical: 'top', paddingTop: 12 }]}
              />
            </View>

            {/* Ações */}
            <View style={[s.row, { marginTop: 8, gap: 12 }]}>
              <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={save}>
                <Text style={s.btnTxt}>{editingId ? 'Salvar alterações' : 'Criar produto'}</Text>
              </TouchableOpacity>

              {editingId && (
                <TouchableOpacity
                  style={[s.btn, s.btnNeutral]}
                  onPress={() => { setEditingId(null); setForm(emptyForm); }}
                >
                  <Text style={[s.btnTxt, { color: PALETTE.black }]}>Cancelar edição</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ====== LISTA ====== */}
          <Text style={[s.subtitle, { marginTop: 18 }]}>Lista de produtos</Text>

          {loading ? (
            <Text style={{ color: PALETTE.taupe, marginTop: 8 }}>Carregando…</Text>
          ) : (
            <FlatList
              data={list}
              keyExtractor={(it) => String(it.id)}
              numColumns={gridCols}
              columnWrapperStyle={gridCols > 1 ? { gap: 12 } : null}
              contentContainerStyle={{ gap: 12, paddingTop: 6 }}
              renderItem={({ item }) => (
                <View style={s.pCard}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={s.pImg} />
                  ) : (
                    <View style={[s.pImg, { backgroundColor: PALETTE.sand }]} />
                  )}
                  <Text style={s.pTitle} numberOfLines={2}>{item.name || 'Sem nome'}</Text>
                  <Text style={s.pMeta} numberOfLines={1}>
                    {item.brand} • {item.category}{item.subtype ? ` • ${item.subtype}` : ''}
                  </Text>

                  <View style={s.pRow}>
                    <Text style={s.pPrice}>R$ {Number(item.price ?? 0).toFixed(2)}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity style={[s.smallBtn, { backgroundColor: PALETTE.black }]} onPress={() => edit(item)}>
                        <Ionicons name="create-outline" color="#fff" size={16} />
                        <Text style={s.smallBtnTxt}>Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[s.smallBtn, { backgroundColor: '#ef4444' }]} onPress={() => del(item.id)}>
                        <Ionicons name="trash-outline" color="#fff" size={16} />
                        <Text style={s.smallBtnTxt}>Deletar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.offWhite },
  scroll: { paddingBottom: 32 },
  container: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Card do formulário
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e6e2d7',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  title: { fontSize: 22, fontWeight: '900', color: PALETTE.black, marginBottom: 2 },
  subtitle: { fontSize: 14, fontWeight: '800', color: PALETTE.black, marginBottom: 10 },

  row: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderColor: '#e6e2d7',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: PALETTE.black,
  },
  inputHalf: { width: '50%' },

  // Botões do formulário
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  btnPrimary: { backgroundColor: PALETTE.black },
  btnNeutral: { backgroundColor: PALETTE.sand, borderWidth: 1, borderColor: '#e6e2d7' },
  btnTxt: { color: '#fff', fontWeight: '800' },

  // Cards da lista
  pCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e6e2d7',
    padding: 12,
  },
  pImg: { width: '100%', height: 170, borderRadius: 10, marginBottom: 10, backgroundColor: '#f0f0f0' },
  pTitle: { fontSize: 14, fontWeight: '800', color: PALETTE.black },
  pMeta: { fontSize: 12, color: PALETTE.taupe, marginTop: 2 },
  pRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pPrice: { fontSize: 16, fontWeight: '900', color: PALETTE.black },

  smallBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  smallBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 12 },
});
