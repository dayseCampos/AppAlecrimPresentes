// src/services/products.js
import { supabase } from '../services/supabase';

const PRODUCT_COLUMNS = ['name','brand','category','subtype','price','image_url','description'];

function cleanPayload(input) {
  const out = {};
  for (const k of PRODUCT_COLUMNS) {
    if (input[k] === undefined) continue;
    if (k === 'price') {
      // converte para número 
      const n = Number(String(input[k]).replace(',', '.'));
      out[k] = Number.isFinite(n) ? n : 0;
    } else {
      out[k] = input[k] === '' ? null : input[k];
    }
  }
  return out;
}

function throwBetter(error) {
  const msg = error?.details || error?.message || 'Erro desconhecido';
  throw new Error(msg);
}

/** Lista de produtos (filtro por marca e/ou busca) */
export async function fetchProducts(brand = 'Todas', search = '') {
  let q = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (brand && brand !== 'Todas') q = q.eq('brand', brand);
  if (search) {
    q = q.or(`name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%`);
  }

  const { data, error } = await q;
  if (error) throwBetter(error);
  return data ?? [];
}

/** Marcas distintas */
export async function fetchBrands() {
  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .not('brand', 'is', null)
    .neq('brand', '')
    .order('brand', { ascending: true });

  if (error) throwBetter(error);
  return Array.from(new Set((data || []).map(r => r.brand)));
}

/** Categorias distintas */
export async function fetchCategories() {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .not('category', 'is', null)
    .neq('category', '')
    .order('category', { ascending: true });

  if (error) throwBetter(error);
  return Array.from(new Set((data || []).map(r => r.category)));
}

/** Banners (opcional) */
export async function fetchBanners() {
  const bannersRes = await supabase
    .from('banners')
    .select('id, image_url, title, highlight, subtitle, cta, active, order_index')
    .eq('active', true)
    .order('order_index', { ascending: true });

  if (!bannersRes.error && bannersRes.data && bannersRes.data.length) {
    return bannersRes.data;
  }
  const productsRes = await supabase
    .from('products')
    .select('id, name, image_url, brand, category, created_at')
    .not('image_url', 'is', null)
    .neq('image_url', '')
    .order('created_at', { ascending: false })
    .limit(5);

  if (productsRes.error || !productsRes.data) return [];
  return productsRes.data.map(p => ({
    id: p.id,
    image_url: p.image_url,
    title: p.brand || 'Destaque',
    highlight: p.name,
    subtitle: p.category || '',
    cta: 'Conferir',
  }));
}


export async function createProduct(payload) {
  const clean = cleanPayload(payload);
  const { data, error } = await supabase
    .from('products')
    .insert(clean)        // objeto simples
    .select('*')          // força retorno padrão
    .single();
  if (error) throwBetter(error);
  return data;
}

export async function updateProduct(id, payload) {
  const clean = cleanPayload(payload);
  const { data, error } = await supabase
    .from('products')
    .update(clean)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throwBetter(error);
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throwBetter(error);
  return true;
}
