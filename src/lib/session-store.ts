/**
 * ─────────────────────────────────────────────────────────────
 * Server-side device session tracker (in-memory singleton)
 * Tracks how many active sessions each student has open.
 *
 * Limit: max 2 devices per student at a time.
 *
 * Works for a single-server deployment (dev or small VPS).
 * For multi-server / serverless, replace with Redis or a DB.
 * ─────────────────────────────────────────────────────────────
 */

const MAX_DEVICES = 2;

interface DeviceSession {
    sessionToken: string;   // unique JWT jti (or user id + timestamp)
    createdAt: number;   // Unix ms
    userAgent: string;
}

// Global map: userId → list of active sessions
const activeSessions = new Map<string, DeviceSession[]>();

/**
 * Try to register a new session for the given user.
 * Returns { allowed: true }  if under the device limit.
 * Returns { allowed: false } if the device limit is reached.
 */
export function tryRegisterSession(userId: string, sessionToken: string, userAgent = ''): { allowed: boolean } {
    // Clean up expired or timed-out sessions (older than 9 h — slightly more than JWT maxAge)
    const now = Date.now();
    const existing = (activeSessions.get(userId) ?? []).filter(
        s => now - s.createdAt < 9 * 60 * 60 * 1000
    );

    // Already has this token registered (same device re-authenticating) — refresh it
    const sameDevice = existing.find(s => s.sessionToken === sessionToken);
    if (sameDevice) {
        sameDevice.createdAt = now;
        activeSessions.set(userId, existing);
        return { allowed: true };
    }

    // Check device count
    if (existing.length >= MAX_DEVICES) {
        return { allowed: false };
    }

    // Register new session
    existing.push({ sessionToken, createdAt: now, userAgent });
    activeSessions.set(userId, existing);
    return { allowed: true };
}

/** Remove a session when a user signs out */
export function removeSession(userId: string, sessionToken: string) {
    const existing = activeSessions.get(userId) ?? [];
    activeSessions.set(userId, existing.filter(s => s.sessionToken !== sessionToken));
}

/** How many active sessions does a user currently have */
export function getActiveDeviceCount(userId: string): number {
    const now = Date.now();
    return (activeSessions.get(userId) ?? []).filter(
        s => now - s.createdAt < 9 * 60 * 60 * 1000
    ).length;
}
