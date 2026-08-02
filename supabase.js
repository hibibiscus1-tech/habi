const SUPABASE_URL  = 'https://dseregsqwknkggucnmtf.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZXJlZ3Nxd2tua2dndWNubXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2NTkxOTUsImV4cCI6MjEwMTIzNTE5NX0.9ai740xAUfBRlDTQ-1qjbMvcGORDxmivnTJUUTfUUiw';

const { createClient } = (window.supabase || { createClient: null });
const db = createClient ? createClient(SUPABASE_URL, SUPABASE_ANON) : null;

async function fetchAll(table, options = {}) {
  if (!db) return [];
  let query = db.from(table).select('*');
  if (options.order)  query = query.order(options.order, { ascending: options.asc ?? false });
  if (options.limit)  query = query.limit(options.limit);
  if (options.filter) query = query.eq(options.filter.col, options.filter.val);
  const { data, error } = await query;
  if (error) { console.error(`fetchAll(${table})`, error); return []; }
  return data;
}

async function insertRow(table, row) {
  if (!db) return false;
  const { error } = await db.from(table).insert(row);
  if (error) { console.error(`insertRow(${table})`, error); return false; }
  return true;
}

async function deleteRow(table, id) {
  if (!db) return false;
  const { error } = await db.from(table).delete().eq('id', id);
  if (error) { console.error(`deleteRow(${table})`, error); return false; }
  return true;
}

async function updateRow(table, id, updates) {
  if (!db) return false;
  const { error } = await db.from(table).update(updates).eq('id', id);
  if (error) { console.error(`updateRow(${table})`, error); return false; }
  return true;
}

function showToast(msg, duration = 2500) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* Height postMessage is intentionally disabled: SOOP does not listen, and the post
   viewer re-loads the frame in a loop when it sees size changes (mobile/embed v4.6 §3). */
function initIframeResize() {}
function enableIframeAutoHeight() { initIframeResize(); }

/* Admin 🎨 theme tab writes theme-* / type-* into profile.data; apply site-wide. */
async function applyTheme() {
  if (!db) return;
  try {
    const { data } = await db.from('profile').select('data').eq('id', 1).single();
    const p = (data && data.data) || {};
    const map = {
      'theme-main': '--accent', 'theme-main-deep': '--accent-deep',
      'theme-bg': '--bg', 'theme-logo': '--text'
    };
    Object.keys(map).forEach((k) => { if (p[k]) document.documentElement.style.setProperty(map[k], p[k]); });
  } catch (e) {}
}
applyTheme();
