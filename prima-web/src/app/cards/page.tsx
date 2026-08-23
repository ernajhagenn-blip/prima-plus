import Link from "next/link";
import { currentParticipant } from "@/lib/session";
import { getWorldProgress } from "@/lib/db";
import { LANGUAGE_CARDS } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const p = await currentParticipant();
  const progress = p ? await getWorldProgress(p.id) : null;
  const owned = new Set(progress?.cards ?? []);

  const byCat = new Map<string, typeof LANGUAGE_CARDS>();
  for (const c of LANGUAGE_CARDS) {
    const arr = byCat.get(c.category) ?? [];
    arr.push(c);
    byCat.set(c.category, arr);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/" className="text-xs font-semibold text-red-700">
        ← PRIMA CITY
      </Link>
      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
          NUSANTARA ISLAND
        </p>
        <h1 className="mt-1 text-xl font-black text-gray-900">Language Cards</h1>
        <p className="mt-2 text-sm text-gray-600">
          Kumpulkan kartu dari tiap pengalaman. Kartu yang sudah kamu miliki
          ditandai <span className="font-semibold text-green-600">✓</span>.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {Array.from(byCat.entries()).map(([cat, cards]) => (
          <div key={cat}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              {cat}
            </h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {cards.map((c) => {
                const isOwned = owned.has(c.title);
                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border p-3 ${
                      isOwned
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-white"
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
