import { toast } from 'react-toastify';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

function buildUrl(path) {
  // If path is absolute (starts with http), use as-is; otherwise prefix with base
  if (path.startsWith('http')) return path;
  // Ensure leading slash
  let p = path.startsWith('/') ? path : `/${path}`;
  // Normalize trailing slash for API routes (before query string)
  const [pathname, query] = p.split('?');
  if (pathname.startsWith('/api/') && !pathname.endsWith('/')) {
    p = `${pathname}/` + (query ? `?${query}` : '');
  }
  return `${API_BASE}${p}`;
}

async function parseJsonSafe(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch (_) {
      return null;
    }
  }
  return null;
}

export async function request(path, { method = 'GET', headers = {}, body, onUnauthorized } = {}) {
  const url = buildUrl(path);
  const finalHeaders = {
    'Accept': 'application/json',
    ...headers,
  };
  const options = { method, headers: finalHeaders };
  if (body !== undefined) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
    if (!finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
  }

  let res;
  try {
    res = await fetch(url, options);
  } catch (err) {
    toast.error('Nie udało się połączyć z serwerem.');
    throw err;
  }

  if (res.status === 401) {
    if (typeof onUnauthorized === 'function') onUnauthorized();
    toast.error('Sesja wygasła lub brak autoryzacji.');
    throw new Error('unauthorized');
  }

  if (!res.ok) {
    const data = await parseJsonSafe(res);
    const msg = data?.detail || data?.message || `Błąd ${res.status}`;
    toast.error(`Wystąpił błąd: ${msg}`);
    const error = new Error(msg);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return await parseJsonSafe(res);
}
