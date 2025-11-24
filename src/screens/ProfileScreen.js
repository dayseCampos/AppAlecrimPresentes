// src/screens/ProfileScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, RefreshControl,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import TopBar from '../components/TopBar';

// supabase (require seguro)
let supabase = null;
try {
  const mod = require('../services/supabase');
  supabase = mod?.supabase ?? null;
} catch (_) {}

const PALETTE = {
  offWhite: '#F2F2F2',
  sand:     '#EAE4D5',
  taupe:    '#B6B09F',
  black:    '#000000',
};

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      setErr(null);
      if (supabase?.auth?.getUser) {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data?.user ?? null);
      } else {
        setUser(null);
      }
    } catch (e) {
      setErr(e?.message || 'Falha ao carregar perfil');
      setUser(null);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  }, [loadUser]);

  const handleLogout = async () => {
    try {
      if (supabase?.auth?.signOut) await supabase.auth.signOut();
      navigation.goBack();
    } catch (e) {
      setErr(e?.message || 'Erro ao sair');
    }
  };

  const userEmail = user?.email ?? 'Conecte-se para ver seu perfil';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: PALETTE.offWhite }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      keyboardShouldPersistTaps="handled"
    >
      <TopBar
        showBack
        onBackPress={() => navigation.goBack()}
        showLogo={false}
        title="Perfil"
        rightIcon="cart-outline"
        onRightPress={() => navigation.navigate('Cart')}
      />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.hi}>Olá!</Text>
        <Text style={s.email}>{userEmail}</Text>
      </View>

      {!!err && <Text style={s.error}>Erro: {err}</Text>}

      <View style={s.section}>
        <Text style={s.sectionTitle}>Minha conta</Text>

        <TouchableOpacity style={s.row} onPress={() => navigation.navigate('Favorites')}>
          <Text style={s.rowText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.row} onPress={() => navigation.navigate('Cart')}>
          <Text style={s.rowText}>Carrinho</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.row} onPress={() => navigation.navigate('Home', { screen: 'Catalog' })}>
          <Text style={s.rowText}>Explorar produtos</Text>
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Sessão</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={handleLogout}>
          <Text style={s.primaryBtnText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: '#e6e2d7', backgroundColor: '#fff',
  },
  hi: { fontSize: 18, fontWeight: '800', color: PALETTE.black },
  email: { marginTop: 4, color: PALETTE.taupe },
  error: { marginTop: 10, color: '#ef4444', textAlign: 'center' },

  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: PALETTE.black, marginBottom: 8 },

  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e6e2d7',
    marginBottom: 10,
  },
  rowText: { fontSize: 14, color: PALETTE.black },

  primaryBtn: {
    marginTop: 4, backgroundColor: PALETTE.black, paddingVertical: 12,
    borderRadius: 12, alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },
});
