// src/screens/CartScreen.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import TopBar from '../components/TopBar';
import { useCart } from '../hooks/useCart';

const PALETTE = {
  offWhite: '#F2F2F2',
  sand: '#EAE4D5',
  taupe: '#B6B09F',
  black: '#000000',
};

function formatBRL(v) {
  const n = Number(v) || 0;
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}

function Row({ label, value, strong }) {
  return (
    <View style={s.rowBetween}>
      <Text style={[s.rowLabel, strong && s.rowLabelStrong]}>{label}</Text>
      <Text style={[s.rowValue, strong && s.rowValueStrong]}>
        {formatBRL(value)}
      </Text>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    coupon,
    setCoupon,
    subtotal,
    discount,
    total,
    COUPON_CODE,
  } = useCart();

  const totalItems = useMemo(
    () => items.reduce((acc, p) => acc + p.qty, 0),
    [items]
  );

  const hasItems = items.length > 0;
  const couponOk =
    coupon.trim().length > 0 &&
    coupon.trim().toUpperCase() === COUPON_CODE.toUpperCase();

  return (
    <View style={s.container}>
      <TopBar
        title="Carrinho"
        showLogo={false}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {!hasItems ? (
        <View style={s.emptyWrap}>
          <Text style={s.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={s.emptyText}>
            Que tal voltar e escolher alguns produtos?
          </Text>
          <TouchableOpacity
            style={s.emptyBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={s.emptyBtnText}>Ver produtos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={s.listContent}
          ListHeaderComponent={
            <View style={s.headerInfo}>
              <Text style={s.headerTitle}>Itens no carrinho</Text>
              <Text style={s.headerSubtitle}>
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={s.itemCard}>
              <View style={s.itemRowTop}>
                <Text style={s.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={s.itemPrice}>{formatBRL(item.price)}</Text>
              </View>

              <View style={s.itemRowBottom}>
                <View style={s.qtyWrap}>
                  <TouchableOpacity
                    style={s.qtyBtn}
                    onPress={() => updateQty(item.id, -1)}
                  >
                    <Text style={s.qtyBtnText}>-</Text>
                  </TouchableOpacity>

                  <Text style={s.qtyValue}>{item.qty}</Text>

                  <TouchableOpacity
                    style={s.qtyBtn}
                    onPress={() => updateQty(item.id, +1)}
                  >
                    <Text style={s.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={s.removeBtn}
                >
                  <Text style={s.removeText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={s.footerArea}>
              {/* Cupom */}
              <View style={s.couponBox}>
                <Text style={s.sectionTitle}>Cupom do vendedor</Text>

                <TextInput
                  value={coupon}
                  onChangeText={setCoupon}
                  placeholder="Digite o cupom"
                  autoCapitalize="none"
                  style={s.couponInput}
                />

                <Text
                  style={[
                    s.couponHint,
                    couponOk && { color: '#16a34a', fontWeight: '600' },
                  ]}
                >
                  {couponOk
                    ? 'Cupom válido aplicado! (10% off)'
                    : `Dica: ${COUPON_CODE} dá 10% de desconto`}
                </Text>
              </View>

              {/* Resumo */}
              <View style={s.summaryBox}>
                <Text style={s.sectionTitle}>Resumo</Text>
                <Row label="Subtotal" value={subtotal} />
                <Row label="Desconto" value={-discount} />
                <Row label="Total" value={total} strong />

                <TouchableOpacity style={s.finishBtn}>
                  <Text style={s.finishBtnText}>Finalizar compra</Text>
                </TouchableOpacity>

                <TouchableOpacity style={s.clearBtn} onPress={clearCart}>
                  <Text style={s.clearBtnText}>Limpar carrinho</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.offWhite,
  },

  // ===== Empty state =====
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: PALETTE.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: PALETTE.taupe,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: PALETTE.sand,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e6e2d7',
  },
  emptyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: PALETTE.black,
  },

  // ===== List header =====
  listContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 10,
  },
  headerInfo: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: PALETTE.black,
  },
  headerSubtitle: {
    fontSize: 12,
    color: PALETTE.taupe,
    marginTop: 2,
  },

  // ===== Item card =====
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6e2d7',
  },
  itemRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.black,
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: PALETTE.black,
  },

  itemRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e6e2d7',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PALETTE.sand,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.black,
  },
  qtyValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.black,
  },
  removeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeText: {
    fontSize: 12,
    color: '#ef4444',
    textDecorationLine: 'underline',
  },

  // ===== Footer (cupom + resumo) =====
  footerArea: {
    marginTop: 12,
    gap: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: PALETTE.black,
    marginBottom: 8,
  },

  couponBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6e2d7',
  },
  couponInput: {
    backgroundColor: PALETTE.sand,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 6,
  },
  couponHint: {
    fontSize: 11,
    color: PALETTE.taupe,
  },

  summaryBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6e2d7',
    gap: 4,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  rowLabel: {
    fontSize: 13,
    color: PALETTE.taupe,
  },
  rowLabelStrong: {
    fontWeight: '800',
    color: PALETTE.black,
  },
  rowValue: {
    fontSize: 13,
    color: PALETTE.black,
  },
  rowValueStrong: {
    fontWeight: '800',
  },

  finishBtn: {
    marginTop: 10,
    backgroundColor: PALETTE.black,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  clearBtn: {
    marginTop: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 12,
    color: '#ef4444',
    textDecorationLine: 'underline',
  },
});
