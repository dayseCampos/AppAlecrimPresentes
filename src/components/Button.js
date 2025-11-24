// src/components/Button.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

export default function Button({ title, onPress, variant = 'primary', style }) {
  const bg = variant === 'secondary' ? '#f3f4f6' : '#111827';
  const color = variant === 'secondary' ? '#111827' : '#fff';
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, { backgroundColor: bg }, style]}>
      <Text style={[styles.btnText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}
