// src/components/Chip.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

export default function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}
