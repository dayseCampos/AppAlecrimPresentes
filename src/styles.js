// src/styles.js
import { StyleSheet, Platform } from 'react-native';

export const theme = {
  colors: {
    bg:        '#F8FAFC',  // fundo app
    surface:   '#FFFFFF',  // cards/inputs
    surfaceAlt:'#F2F4F7',
    border:    '#E5E7EB',
    cardBorder:'#EEF2F7',
    text:      '#111827',
    muted:     '#6B7280',

    primary:   '#111827',  // botões/ações
    onPrimary: '#FFFFFF',

    accent:    '#2563EB',  // links/destaques
    success:   '#16A34A',
    danger:    '#EF4444',
    warning:   '#F59E0B',
  },
  radius: { xs:6, sm:10, md:14, lg:18, xl:22, xxl:28, pill:999 },
  spacing:{ xs:6, sm:10, md:14, lg:18, xl:24, xxl:32 },
  font   :{ sm:13, md:15, lg:17, xl:20, h1:28, h2:22 },
};

// sombra consistente iOS/Android
export const shadow = (elev = 4, opacity = 0.12) =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: opacity,
      shadowRadius: Math.ceil(elev * 1.2),
      shadowOffset: { width: 0, height: Math.ceil(elev / 2) },
    },
    android: { elevation: elev },
  });

export const styles = StyleSheet.create({
  /* ===== Layout base ===== */
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  section: { marginBottom: theme.spacing.xl },

  /* ===== Títulos / textos ===== */
  title: {
    fontSize: theme.font.h1,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.3,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.font.h2,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  text: { fontSize: theme.font.md, color: theme.colors.text },
  muted: { fontSize: theme.font.sm, color: theme.colors.muted },

  /* ===== Inputs ===== */
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: Platform.select({ ios: 14, android: 12 }),
    fontSize: theme.font.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    ...shadow(1, 0.06),
  },
  inputError: {
    borderColor: theme.colors.danger,
  },

  /* ===== Botões ===== */
  btn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.xl,
    ...shadow(3),
  },
  btnText: {
    color: theme.colors.onPrimary,
    fontWeight: '800',
    fontSize: theme.font.lg,
    letterSpacing: 0.4,
  },
  btnSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnSecondaryText: {
    color: theme.colors.text,
  },
  btnDanger: {
    backgroundColor: theme.colors.danger,
  },

  /* ===== Cards / listas ===== */
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...shadow(2),
  },
  cardTight: {
    padding: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.font.lg,
    fontWeight: '800',
    color: theme.colors.text,
  },
  cardMeta: {
    marginTop: 2,
    color: theme.colors.muted,
    fontSize: theme.font.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
    opacity: 0.7,
  },

  /* ===== Preços / badges ===== */
  money: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.success,
    letterSpacing: 0.2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeText: {
    fontSize: theme.font.sm,
    color: theme.colors.muted,
    fontWeight: '700',
  },

  /* ===== Imagens de produto ===== */
  productImageWrap: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...shadow(1, 0.07),
  },
  productImage: {
    width: '100%',
    aspectRatio: 1, // quadrado elegante
    resizeMode: 'cover',
  },

  /* ===== Util ===== */
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  chipText: { color: theme.colors.text, fontWeight: '700' },
  chipTextActive: { color: '#fff' },
});
