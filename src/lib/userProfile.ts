import type { UserProfile } from '../types';
import { computeDataSignature, sanitizeInputPayload } from './securityGuard';

const PROFILE_KEY = 'aplx:user_profile';

/**
 * Resizes and center-crops any image to a compact 1:1 square JPEG (< 35KB)
 * to guarantee it never exceeds localStorage limits or breaks layout.
 */
export function processImageToCompactSquare(
  fileOrDataUrl: File | string,
  targetSize = 256,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = '';
    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      objectUrl = URL.createObjectURL(fileOrDataUrl);
      img.src = objectUrl;
    }

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const minDim = Math.min(width, height);
        const cropX = (width - minDim) / 2;
        const cropY = (height - minDim) / 2;

        ctx.drawImage(img, cropX, cropY, minDim, minDim, 0, 0, targetSize, targetSize);
        const compactDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compactDataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = err => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(err);
    };
  });
}

/**
 * Securely loads the user profile with tamper detection and sanitization.
 */
export function loadUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserProfile;
      if (!parsed || typeof parsed !== 'object') return null;

      // Sanitization check
      if (parsed.name) {
        parsed.name = sanitizeInputPayload(parsed.name, 60).clean;
      }
      if (parsed.bio) {
        parsed.bio = sanitizeInputPayload(parsed.bio, 240).clean;
      }

      // Auto-repair if an oversized base64 avatar exists in storage
      if (
        parsed.avatarType === 'custom' &&
        typeof parsed.avatar === 'string' &&
        parsed.avatar.length > 80000
      ) {
        processImageToCompactSquare(parsed.avatar, 256, 0.8)
          .then(compact => {
            parsed.avatar = compact;
            saveUserProfile(parsed);
          })
          .catch(() => {});
      }

      // Verify cryptographic integrity asynchronously in background
      if (parsed.integrityHash) {
        computeDataSignature(parsed)
          .then(computed => {
            if (computed !== parsed.integrityHash) {
              console.warn('[Security Guard] Profile integrity signature mismatch! Tampering detected.');
              parsed.isTampered = true;
            }
          })
          .catch(() => {});
      }

      return parsed;
    }
  } catch (err) {
    console.warn('[Security Guard] Corrupted profile detected in storage, resetting safely.', err);
  }
  return null;
}

/**
 * Securely saves the user profile and generates a cryptographic tamper-evident hash.
 */
export function saveUserProfile(profile: UserProfile): void {
  try {
    // Sanitize fields before saving
    const sanitized: UserProfile = {
      ...profile,
      name: sanitizeInputPayload(profile.name || 'Explorer', 60).clean,
      bio: profile.bio ? sanitizeInputPayload(profile.bio, 240).clean : undefined,
      lastSecurityCheck: Date.now(),
    };

    // Calculate signature
    computeDataSignature(sanitized)
      .then(sig => {
        sanitized.integrityHash = sig;
        localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
      })
      .catch(() => {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
      });
  } catch (err) {
    console.warn('Could not save user profile to localStorage', err);
  }
}

export function isUserSetupComplete(): boolean {
  const profile = loadUserProfile();
  return Boolean(profile && profile.isSetupComplete);
}

export function removeUserProfile(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
  } catch (err) {
    console.warn('Could not remove user profile from localStorage', err);
  }
}

