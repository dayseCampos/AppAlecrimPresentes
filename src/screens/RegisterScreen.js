// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

let supabase = null;
try { supabase = require('../services/supabase')?.supabase ?? null; } catch {}

const PALETTE = {
  offWhite: '#F2F2F2',
  sand:     '#EAE4D5',
  taupe:    '#B6B09F',
  black:    '#000000',
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function onRegister() {
    const mail = email.trim().toLowerCase();
    if (!fullName || !address || !mail || !pass || !confirm) {
      Alert.alert('Ops', 'Preencha todos os campos.');
      return;
    }
    if (pass.length < 6) {
      Alert.alert('Senha fraca', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (pass !== confirm) {
      Alert.alert('Ops', 'As senhas não conferem.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: mail,
        password: pass,
        options: { data: { full_name: fullName, address } },
      });
      if (error) throw error;

      if (!data.session) {
        Alert.alert('Confirme seu e-mail', 'Enviamos um link para confirmar sua conta. Depois de confirmar, faça login.');
        navigation.navigate('Login');
        return;
      }
      navigation.reset({ index: 0, routes: [{ name: 'MainDrawer' }] });
    } catch (e) {
      Alert.alert('Erro no cadastro', e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={s.container}
    >
      <View style={s.header}>
        <View style={s.logoWrap}>
          <Text style={s.logoTop}>ALECRIM</Text>
          <Text style={s.logoBottom}>PRESENTES</Text>
        </View>
        <Text style={s.subtitle}>Criar conta</Text>
      </View>

      <View style={s.form}>
        <TextInput placeholder="Nome completo" placeholderTextColor={PALETTE.taupe} value={fullName} onChangeText={setFullName} style={s.input} />
        <TextInput placeholder="Endereço" placeholderTextColor={PALETTE.taupe} value={address} onChangeText={setAddress} style={s.input} />
        <TextInput placeholder="Email" placeholderTextColor={PALETTE.taupe} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={s.input} />
        <TextInput placeholder="Senha" placeholderTextColor={PALETTE.taupe} value={pass} onChangeText={setPass} secureTextEntry style={s.input} />
        <TextInput placeholder="Confirmar senha" placeholderTextColor={PALETTE.taupe} value={confirm} onChangeText={setConfirm} secureTextEntry style={s.input} />

        <Pressable onPress={onRegister} disabled={loading} style={s.primaryBtn}>
          <Text style={s.primaryText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Login')} style={{ alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: PALETTE.taupe, textDecorationLine: 'underline' }}>Já tem conta? Entrar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.offWhite, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  logoWrap: { alignItems: 'center' },
  logoTop: { fontSize: 26, lineHeight: 26, fontWeight: '800', color: PALETTE.black, letterSpacing: 0.5 },
  logoBottom: { marginTop: 2, fontSize: 12, letterSpacing: 2, color: PALETTE.taupe },
  subtitle: { marginTop: 6, color: PALETTE.taupe },
  form: { gap: 12, paddingHorizontal: 24 },
  input: {
    borderWidth: 1, borderColor: '#e6e2d7', borderRadius: 12, padding: 12,
    backgroundColor: PALETTE.sand, color: PALETTE.black
  },
  primaryBtn: {
    backgroundColor: PALETTE.black, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 8
  },
  primaryText: { color: '#fff', fontWeight: '800' },
});
