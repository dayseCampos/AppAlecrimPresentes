// src/navigation/RootNavigator.js
import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';

// TELAS
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProductScreen from '../screens/ProductScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminProductFormScreen from '../screens/AdminProductFormScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// HOOK de admin
import { useIsAdmin } from '../hooks/useIsAdmin';

// fetchBrands com fallback seguro
let fetchBrandsSafe = async () => [];
try {
  const mod = require('../services/products');
  if (typeof mod.fetchBrands === 'function') fetchBrandsSafe = mod.fetchBrands;
} catch {}

// supabase com require seguro
let supabase = null;
try {
  const mod = require('../services/supabase');
  supabase = mod?.supabase ?? null;
} catch {}

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

/* =====================================================
   HOME STACK – telas internas com títulos em português
   ===================================================== */
function HomeStack() {
  const S = createNativeStackNavigator();

  return (
    <S.Navigator screenOptions={{ headerShown: false }}>
      <S.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />

      <S.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{ title: 'Produtos' }}
      />

      <S.Screen
        name="Product"
        component={ProductScreen}
        options={{ title: 'Catálogo' }}
      />

      <S.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'Carrinho' }}
      />

      <S.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />

      <S.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </S.Navigator>
  );
}

/* =======================================
   COMPONENTE DE SEÇÃO DO MENU LATERAL
   ======================================= */
function DrawerSectionTitle({ children }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 }}>
      <Text style={{ fontWeight: '800', fontSize: 12, letterSpacing: 0.8, color: '#8b877f' }}>
        {children}
      </Text>
    </View>
  );
}

/* =======================================
   CONTEÚDO DO MENU LATERAL (DRAWER)
   ======================================= */
function DrawerContent(props) {
  const { navigation } = props;
  const [brands, setBrands] = useState(['Todas']);
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState('');
  const { isAdmin } = useIsAdmin();

  useEffect(() => {
    let mounted = true;
    let authSub = null;

    (async () => {
      // Marcas
      try {
        const list = await fetchBrandsSafe();
        if (mounted && Array.isArray(list) && list.length) {
          setBrands(['Todas', ...list]);
        }
      } catch { }
      finally {
        if (mounted) setLoading(false);
      }

      // Sessão + listener
      try {
        if (supabase?.auth?.getSession) {
          const { data } = await supabase.auth.getSession();
          if (mounted) {
            setIsLogged(!!data?.session);
            setEmail(data?.session?.user?.email ?? '');
          }

          const subRes = supabase.auth.onAuthStateChange((_e, session) => {
            if (mounted) {
              setIsLogged(!!session);
              setEmail(session?.user?.email ?? '');
            }
          });

          authSub = subRes?.data?.subscription ?? subRes?.subscription ?? null;
        } else {
          setIsLogged(false);
        }
      } catch {
        setIsLogged(false);
      }
    })();

    return () => {
      mounted = false;
      try { authSub?.unsubscribe?.(); } catch { }
    };
  }, []);

  const signOut = useCallback(async () => {
    try { await supabase?.auth?.signOut?.(); } catch { }
    navigation.closeDrawer();
    navigation.navigate('Auth', { screen: 'Login' });
  }, [navigation]);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
      {/* Cabeçalho */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Text style={{ fontWeight: '900', fontSize: 16, color: '#000' }}>ALECRIM</Text>
        <Text style={{ letterSpacing: 2, color: '#8b877f', marginTop: -2, marginBottom: 8 }}>
          PRESENTES
        </Text>

        {isLogged ? (
          <Text style={{ fontSize: 12, color: '#8b877f' }}>{email}</Text>
        ) : (
          <Text style={{ fontSize: 12, color: '#8b877f' }}>Você não está logada</Text>
        )}
      </View>

      {loading && (
        <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator />
          <Text>Carregando marcas...</Text>
        </View>
      )}

      {/* Marcas */}
      <DrawerSectionTitle>Marcas</DrawerSectionTitle>

      {brands.map((b) => (
        <DrawerItem
          key={b}
          label={b}
          onPress={() =>
            navigation.navigate('Home', {
              screen: 'Catalog',
              params: { brand: b },
            })
          }
        />
      ))}

      {/* Minha conta */}
      <DrawerSectionTitle>Minha conta</DrawerSectionTitle>

      <DrawerItem
        label="Favoritos"
        onPress={() => navigation.navigate('Home', { screen: 'Favorites' })}
        icon={({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />}
      />

      <DrawerItem
        label="Perfil"
        onPress={() => navigation.navigate('Home', { screen: 'Profile' })}
        icon={({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />}
      />

      {/* Admin */}
      {isAdmin && (
        <>
          <DrawerSectionTitle>Área admin</DrawerSectionTitle>

          <DrawerItem
            label="Produtos (admin)"
            onPress={() => navigation.navigate('Admin')}
            icon={({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />}
          />
        </>
      )}

      {/* Autenticação */}
      <DrawerSectionTitle>Autenticação</DrawerSectionTitle>

      {isLogged ? (
        <DrawerItem
          label="Sair"
          onPress={signOut}
          icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
        />
      ) : (
        <>
          <DrawerItem
            label="Entrar"
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
            icon={({ color, size }) => <Ionicons name="log-in-outline" size={size} color={color} />}
          />

          <DrawerItem
            label="Criar conta"
            onPress={() => navigation.navigate('Auth', { screen: 'Register' })}
            icon={({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} />}
          />
        </>
      )}
    </DrawerContentScrollView>
  );
}

/* =====================================================
   MAIN DRAWER
   ===================================================== */
function MainDrawer() {
  const { isAdmin } = useIsAdmin();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          marginTop: 64,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        },
        overlayColor: 'rgba(0,0,0,0.15)',
      }}
      drawerContent={(p) => <DrawerContent {...p} />}
    >
      <Drawer.Screen name="Home" component={HomeStack} />
      {isAdmin && <Drawer.Screen name="Admin" component={AdminProductFormScreen} />}
    </Drawer.Navigator>
  );
}

/* =====================================================
   STACK DE AUTENTICAÇÃO
   ===================================================== */
function AuthStack() {
  const A = createNativeStackNavigator();

  return (
    <A.Navigator screenOptions={{ headerShown: false }}>
      <A.Screen name="Login" component={LoginScreen} />
      <A.Screen name="Register" component={RegisterScreen} />
    </A.Navigator>
  );
}

/* =====================================================
   ROOT NAVIGATOR
   ===================================================== */
export default function RootNavigator() {
  const [booting, setBooting] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSub = null;

    (async () => {
      try {
        if (supabase?.auth?.getSession) {
          const { data } = await supabase.auth.getSession();
          if (mounted) setHasSession(!!data?.session);

          const subRes = supabase.auth.onAuthStateChange((_e, session) => {
            if (mounted) setHasSession(!!session);
          });

          authSub = subRes?.data?.subscription ?? subRes?.subscription ?? null;
        } else {
          if (mounted) setHasSession(false);
        }
      } catch {
        if (mounted) setHasSession(false);
      } finally {
        if (mounted) setBooting(false);
      }
    })();

    return () => {
      mounted = false;
      try { authSub?.unsubscribe?.(); } catch { }
    };
  }, []);

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator key={hasSession ? 'user' : 'guest'} screenOptions={{ headerShown: false }}>
      {hasSession ? (
        <>
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
          <Stack.Screen name="Auth" component={AuthStack} />
        </>
      ) : (
        <>
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
        </>
      )}
    </Stack.Navigator>
  );
}
