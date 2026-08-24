import Link from "next/link";
import { currentParticipant } from "@/lib/session";
import { getWorldProgress } from "@/lib/db";
import { LANGUAGE_CARDS } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const p = await currentParticipant();
  const progress = p ? getWorldProgress(p.id) : null;
  const owned = new Set(progress?.cards ?? []);

  const byCat = new Map<string, typeof LANGUAGE_CARDS>();
  for (const c of LANGUAGE_CARDS) {
    const arr = byCat.get(c.category) ?? [];
    arr.push(c);
    byCat.set(c.category, arr);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-bold text-blue-500 hover:text-blue-600">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-3xl border-2 border-yellow-200 bg-white/70 p-5 shadow-lg backdrop-blur-md">
        <span className="inline-block rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1 text-xs font-black text-white shadow-md">
          NUSANTARA ISLAND
        </span>
        <h1 className="mt-2 text-xl font-black text-gray-900">Language Cards</h1>
        <p className="mt-2 text-sm text-gray-600">
          Kumpulkan kartu dari tiap pengalaman. Kartu yang sudah kamu miliki
          ditandai <span className="font-semibold text-green-600">✓</span>.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {Array.from(byCat.entries()).map(([cat, cards]) => (
          <div key={cat}>
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-500">
              {cat}
            </h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {cards.map((c) => {
                const isOwned = owned.has(c.title);
                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border-2 p-3 transition-all ${
                      isOwned
                        ? "border-green-300 bg-green-50/70 shadow-md backdrop-blur-sm"
                        : "border-gray-200 bg-white/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">
                        {c.title}
                      </p>
                      {isOwned ? (
                        <span className="text-xs font-bold text-green-600">
                          ✓
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">🔒</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{c.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!p && (
        <p className="mt-6 text-center text-xs text-gray-400">
          Buat profil di PRIMA CITY untuk mencatat kartu yang berhasil dikumpulkan.
        </p>
      )}
    </div>
  );
}
