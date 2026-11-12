import { UserAccount } from '../types';

const LEGACY_ADMIN_CONFIG_KEY = 'geo_admin_credentials_v1';
const ADMIN_CONFIG_KEY = 'geo_admin_credentials_v2';
const ADMIN_LOCKOUT_KEY = 'geo_admin_lockout_v2';
const ADMIN_SESSION_KEY = 'geo_admin_session_v1';
const HASH_SALT = 'geo_prof_admin_sec_2026::';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 2 * 60 * 1000; // 2 minutos de bloqueio após 5 tentativas falhas
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // Sessão expira após 4 horas ou ao fechar o navegador

export interface AdminSecurityConfig {
  email: string;
  passwordHash: string;
  isDefaultPassword: boolean;
  recoveryKeyHash?: string;
  updatedAt: string;
  credVersion: number;
}

interface AdminLockoutState {
  failedAttempts: number;
  lockedUntil: number | null;
}

interface AdminSession {
  token: string;
  email: string;
  credVersion: number;
  expiresAt: number;
}

/**
 * Implementação síncrona padrão FIPS 180-4 SHA-256 (funciona em HTTPS, localhost e rede local HTTP).
 */
export function sha256Hex(asciiInput: string): string {
  const bytes = new TextEncoder().encode(asciiInput);
  const K: number[] = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const H: number[] = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const bitLen = bytes.length * 8;
  const totalLen = (((bytes.length + 9 + 63) >> 6) << 6);
  const padded = new Uint8Array(totalLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(totalLen - 4, bitLen >>> 0, false);

  const W = new Uint32Array(64);
  const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));

  for (let offset = 0; offset < totalLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      W[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, W[i - 15]) ^ rotr(18, W[i - 15]) ^ (W[i - 15] >>> 3);
      const s1 = rotr(17, W[i - 2]) ^ rotr(19, W[i - 2]) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = H;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  return H.map((v) => v.toString(16).padStart(8, '0')).join('');
}

function hashSecret(secret: string): string {
  return sha256Hex(`${HASH_SALT}${secret}`);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function generateRandomToken(): string {
  try {
    const arr = new Uint8Array(24);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

export function getAdminSecurityConfig(): AdminSecurityConfig {
  try {
    if (localStorage.getItem(LEGACY_ADMIN_CONFIG_KEY)) {
      localStorage.removeItem(LEGACY_ADMIN_CONFIG_KEY);
    }
    const raw = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AdminSecurityConfig;
      if (parsed && parsed.email && parsed.passwordHash) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupted data and re-initialize securely
  }

  const initial: AdminSecurityConfig = {
    email: 'geovana.prof@gmail.com',
    passwordHash: hashSecret('geovana123'),
    isDefaultPassword: true,
    recoveryKeyHash: hashSecret('geovana2026'),
    updatedAt: new Date().toISOString(),
    credVersion: 1
  };
  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(initial));
  return initial;
}

function getLockoutState(): AdminLockoutState {
  try {
    const raw = localStorage.getItem(ADMIN_LOCKOUT_KEY);
    if (!raw) return { failedAttempts: 0, lockedUntil: null };
    const parsed = JSON.parse(raw) as AdminLockoutState;
    if (parsed.lockedUntil && Date.now() >= parsed.lockedUntil) {
      const cleared = { failedAttempts: 0, lockedUntil: null };
      localStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify(cleared));
      return cleared;
    }
    return parsed;
  } catch {
    return { failedAttempts: 0, lockedUntil: null };
  }
}

function saveLockoutState(state: AdminLockoutState): void {
  localStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify(state));
}

export function getRemainingLockoutSeconds(): number {
  const state = getLockoutState();
  if (!state.lockedUntil) return 0;
  const diff = Math.ceil((state.lockedUntil - Date.now()) / 1000);
  return diff > 0 ? diff : 0;
}

export function buildTeacherAccount(email?: string): UserAccount {
  const config = getAdminSecurityConfig();
  return {
    id: 'prof-geovana',
    name: 'Profa. Geovana Ferreira',
    email: email || config.email,
    role: 'teacher',
    phone: '(35) 98412-1944',
    enrolledCourses: [
      'mentoria-vip-individual',
      'mentoria-vip-10-meses',
      'matematica-zero-avancado',
      'fisica-descomplicada'
    ],
    createdAt: '2026-01-10T10:00:00Z',
    notes: 'Professora Titular e Administradora'
  };
}

export function isReservedAdminEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  const config = getAdminSecurityConfig();
  return (
    clean === config.email.toLowerCase() ||
    clean === 'geovana.prof@gmail.com' ||
    clean === 'profa.geovanaferreira@gmail.com'
  );
}

export function isAdminSessionValid(): boolean {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as AdminSession;
    const config = getAdminSecurityConfig();

    if (!session.token || Date.now() >= session.expiresAt) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    if (session.credVersion !== config.credVersion) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function createAdminSession(email: string, credVersion: number): void {
  const session: AdminSession = {
    token: generateRandomToken(),
    email: email.toLowerCase(),
    credVersion,
    expiresAt: Date.now() + SESSION_DURATION_MS
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function authenticateAdmin(
  emailInput: string,
  passwordInput: string
): { success: boolean; user?: UserAccount; error?: string; lockedSeconds?: number } {
  const remainingLock = getRemainingLockoutSeconds();
  if (remainingLock > 0) {
    return {
      success: false,
      error: `Muitas tentativas incorretas. Acesso bloqueado temporariamente por ${remainingLock}s para proteção.`,
      lockedSeconds: remainingLock
    };
  }

  const config = getAdminSecurityConfig();
  const cleanEmail = emailInput.trim().toLowerCase();
  const candidateHash = hashSecret(passwordInput);

  const emailMatches = cleanEmail === config.email.toLowerCase();
  const passwordMatches = constantTimeEqual(candidateHash, config.passwordHash);

  if (!emailMatches || !passwordMatches) {
    const lock = getLockoutState();
    const nextAttempts = lock.failedAttempts + 1;

    if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      saveLockoutState({ failedAttempts: nextAttempts, lockedUntil });
      return {
        success: false,
        error: 'Limite de 5 tentativas excedido. Acesso administrativo bloqueado por 2 minutos.',
        lockedSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000)
      };
    }

    saveLockoutState({ failedAttempts: nextAttempts, lockedUntil: null });
    const left = MAX_FAILED_ATTEMPTS - nextAttempts;
    return {
      success: false,
      error: `Credenciais administrativas inválidas. (${left} ${left === 1 ? 'tentativa restante' : 'tentativas restantes'})`
    };
  }

  // Autenticado com sucesso: limpa tentativas falhas e cria sessão segura
  saveLockoutState({ failedAttempts: 0, lockedUntil: null });
  createAdminSession(config.email, config.credVersion);
  return {
    success: true,
    user: buildTeacherAccount(config.email)
  };
}

export function updateAdminSecurity(params: {
  currentPassword: string;
  newPassword?: string;
  newEmail?: string;
  newRecoveryKey?: string;
}): { success: boolean; error?: string } {
  const config = getAdminSecurityConfig();
  const currentHash = hashSecret(params.currentPassword);

  if (!constantTimeEqual(currentHash, config.passwordHash)) {
    return {
      success: false,
      error: 'A senha atual informada está incorreta.'
    };
  }

  let nextPasswordHash = config.passwordHash;
  let nextIsDefault = config.isDefaultPassword;

  if (params.newPassword !== undefined && params.newPassword.length > 0) {
    if (params.newPassword.length < 6) {
      return {
        success: false,
        error: 'A nova senha deve ter pelo menos 6 caracteres.'
      };
    }
    nextPasswordHash = hashSecret(params.newPassword);
    nextIsDefault = false;
  }

  const nextEmail = params.newEmail?.trim().toLowerCase() || config.email;
  if (!nextEmail.includes('@')) {
    return {
      success: false,
      error: 'Informe um e-mail administrativo válido.'
    };
  }

  let nextRecoveryHash = config.recoveryKeyHash;
  if (params.newRecoveryKey !== undefined && params.newRecoveryKey.trim().length > 0) {
    if (params.newRecoveryKey.trim().length < 4) {
      return {
        success: false,
        error: 'A chave secreta de recuperação deve ter pelo menos 4 caracteres.'
      };
    }
    nextRecoveryHash = hashSecret(params.newRecoveryKey.trim());
  }

  const nextVersion = config.credVersion + 1;
  const updatedConfig: AdminSecurityConfig = {
    email: nextEmail,
    passwordHash: nextPasswordHash,
    isDefaultPassword: nextIsDefault,
    recoveryKeyHash: nextRecoveryHash,
    updatedAt: new Date().toISOString(),
    credVersion: nextVersion
  };

  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updatedConfig));
  saveLockoutState({ failedAttempts: 0, lockedUntil: null });

  // Se já estiver com sessão ativa no painel, renova o token com a nova versão
  if (sessionStorage.getItem(ADMIN_SESSION_KEY)) {
    createAdminSession(nextEmail, nextVersion);
  }

  return { success: true };
}

export function recoverAdminPasswordWithKey(params: {
  email: string;
  recoveryKey: string;
  newPassword: string;
}): { success: boolean; error?: string } {
  const remainingLock = getRemainingLockoutSeconds();
  if (remainingLock > 0) {
    return {
      success: false,
      error: `Aguarde ${remainingLock}s antes de tentar novamente.`
    };
  }

  const config = getAdminSecurityConfig();
  if (!config.recoveryKeyHash) {
    return {
      success: false,
      error: 'Nenhuma chave secreta de recuperação foi cadastrada ainda. Entre com sua senha atual e configure uma chave no painel.'
    };
  }

  const emailMatches = params.email.trim().toLowerCase() === config.email.toLowerCase();
  const keyMatches = constantTimeEqual(hashSecret(params.recoveryKey.trim()), config.recoveryKeyHash);

  if (!emailMatches || !keyMatches) {
    const lock = getLockoutState();
    const nextAttempts = lock.failedAttempts + 1;
    if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
      saveLockoutState({ failedAttempts: nextAttempts, lockedUntil: Date.now() + LOCKOUT_DURATION_MS });
    } else {
      saveLockoutState({ failedAttempts: nextAttempts, lockedUntil: null });
    }
    return {
      success: false,
      error: 'E-mail ou Chave Secreta de Recuperação inválidos.'
    };
  }

  if (params.newPassword.length < 6) {
    return {
      success: false,
      error: 'A nova senha deve ter pelo menos 6 caracteres.'
    };
  }

  const nextVersion = config.credVersion + 1;
  const updatedConfig: AdminSecurityConfig = {
    ...config,
    passwordHash: hashSecret(params.newPassword),
    isDefaultPassword: false,
    updatedAt: new Date().toISOString(),
    credVersion: nextVersion
  };

  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updatedConfig));
  saveLockoutState({ failedAttempts: 0, lockedUntil: null });
  clearAdminSession();

  return { success: true };
}
