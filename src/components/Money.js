// src/components/Money.js
import React from 'react';
import { Text } from 'react-native';
import { styles } from '../styles';

export default function Money({ value = 0 }) {
  return <Text style={styles.money}>R$ {Number(value || 0).toFixed(2)}</Text>;
}
