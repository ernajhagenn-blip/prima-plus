// Helper client-side untuk mengirim hasil aktivitas siswa ke /api/activity.
// Dipakai oleh komponen client (chat, mini-game, kart, quiz, feedback) di layar hasil.
// participant_id diambil dari cookie httpOnly di sisi server — client cukup kirim
// kind + payload.

export type ActivityKind = "chat" | "activity" | "feedback";

export async function logActivity(kind: ActivityKind, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, payload }),
    });
    return res.ok;
  } catch {
    return false; // gagal simpan tidak mengganggu gameplay
  }
}
