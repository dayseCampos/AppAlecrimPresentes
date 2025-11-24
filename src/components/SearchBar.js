// src/components/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const PALETTE = {
  offWhite: '#F2F2F2',
  sand: '#EAE4D5',
  taupe: '#B6B09F',
  black: '#000000',
};

export default function SearchBar({
  value,
  onChangeText,
  onSubmit = () => {},
  placeholder = 'O que você procura?',
}) {
  return (
    <View style={s.searchWrap}>
      <Ionicons name="search" size={18} color={PALETTE.taupe} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={PALETTE.taupe}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        style={s.search}
      />
      {!!value && (
        <TouchableOpacity onPress={() => onChangeText('')} style={s.clearBtn}>
          <Ionicons name="close" size={16} color={PALETTE.taupe} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  searchWrap: {
    marginHorizontal: 14,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    backgroundColor: PALETTE.sand,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e2d7',
  },
  search: { marginLeft: 8, flex: 1, fontSize: 14, color: PALETTE.black },
  clearBtn: { padding: 6 },
});
