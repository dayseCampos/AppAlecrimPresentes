// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Alert,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// supabase seguro
let supabase = null;
try { supabase = require('../services/supabase')?.supabase ?? null; } catch {}

const PALETTE = {
  offWhite: '#F2F2F2',
  sand:     '#EAE4D5',
  taupe:    '#B6B09F',
  black:    '#000000',
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function resendVerification(mail) {
    try {
      if (!supabase?.auth?.resend) return;
      await supabase.auth.resend({ type: 'signup', email: mail });
      Alert.alert('Reenvio enviado', 'Cheque sua caixa de entrada (e spam).');
    } catch (e) {
      Alert.alert('Falha ao reenviar', e?.message ?? String(e));
    }
  }

  async function onLogin() {
    const mail = email.trim().toLowerCase();
    const pass = password.trim();
    if (!mail || !pass) {
      Alert.alert('Ops', 'Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: mail,
        password: pass,
      });

      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('email not confirmed')) {
          Alert.alert(
            'Confirme seu e-mail',
            'Te enviamos um link para confirmar. Quer reenviar agora?',
            [
              { text: 'Cancelar' },
              { text: 'Reenviar', onPress: () => resendVerification(mail) },
            ]
          );
        } else if (msg.includes('invalid')) {
          Alert.alert('Credenciais inválidas', 'Email ou senha incorretos.');
        } else {
          Alert.alert('Erro ao entrar', error.message);
        }
        return;
      }

      navigation.reset({ index: 0, routes: [{ name: 'MainDrawer' }] });
    } catch (e) {
      Alert.alert('Erro ao entrar', e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={s.container}
    >
      {/* Cabeçalho com a marca */}
      <View style={s.header}>
        <View style={s.logoWrap}>
          <Text style={s.logoTop}>ALECRIM</Text>
          <Text style={s.logoBottom}>PRESENTES</Text>
        </View>
        <Text style={s.subtitle}>Bem-vindo de volta</Text>
      </View>

      <View style={s.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor={PALETTE.taupe}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={s.input}
        />
        <TextInput
          placeholder="Senha"
          placeholderTextColor={PALETTE.taupe}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={s.input}
        />
        <Pressable onPress={onLogin} disabled={loading} style={s.primaryBtn}>
          <Text style={s.primaryText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Register')} style={s.linkWrap}>
          <Text style={s.link}>Criar uma conta</Text>
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
  linkWrap: { alignItems: 'center', marginTop: 6 },
  link: { color: PALETTE.taupe, textDecorationLine: 'underline' },
});
