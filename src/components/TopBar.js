// src/components/TopBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../hooks/useCart';

const PALETTE = { offWhite:'#F2F2F2', sand:'#EAE4D5', taupe:'#B6B09F', black:'#000000' };

export default function TopBar({
  title = 'ALECRIM',
  showLogo = true,
  showBack = false,
  onMenuPress = () => {},
  onBackPress = () => {},
  rightIcon = 'cart-outline',
  onRightPress = () => {},
}) {
  // 🔹 pega a quantidade total de itens no carrinho
  const { itemsCount } = useCart();

  return (
    <View style={s.wrap}>
      <View style={s.row}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={showBack ? onBackPress : onMenuPress}
          accessibilityLabel={showBack ? 'Voltar' : 'Menu'}
        >
          <Ionicons name={showBack ? 'chevron-back' : 'menu'} size={22} color={PALETTE.black} />
        </TouchableOpacity>

        {showLogo ? (
          <View style={s.logoWrap}>
            <Text style={s.logoTop}>ALECRIM</Text>
            <Text style={s.logoBottom}>PRESENTES</Text>
          </View>
        ) : (
          <Text style={s.title} numberOfLines={1}>{title}</Text>
        )}

        <TouchableOpacity
          style={[s.iconBtn, { position: 'relative' }]}
          onPress={onRightPress}
          accessibilityLabel="Carrinho"
        >
          <Ionicons name={rightIcon} size={20} color={PALETTE.black} />

          {itemsCount > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>
                {itemsCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: PALETTE.offWhite,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.sand,
    // zIndex: 100, // opcional se quiser garantir que fique sempre acima
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { padding: 10, borderRadius: 999 },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
  logoTop: { paddingTop: 15, fontSize: 30, lineHeight: 20, fontWeight: '800', color: PALETTE.black, letterSpacing: 0.5 },
  logoBottom: { paddingTop: 5, marginTop: 2, fontSize: 20, letterSpacing: 2, color: PALETTE.taupe },
  title: { fontSize: 18, fontWeight: '800', color: PALETTE.black, maxWidth: '70%' },

  // 🔹 badge do carrinho
  badge: {
    position: 'absolute',
    top: 6,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
