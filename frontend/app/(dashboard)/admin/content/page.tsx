"use client";

import { useEffect, useState } from "react";
import { FilePenLine } from "lucide-react";
import { toast } from "sonner";
import {
  getSiteContentApi,
  updateSiteContentApi,
} from "@/services/api/admin.api";

type ContentPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

export default function ContentManagementPage() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    const result = await getSiteContentApi();
    if (!result.ok) {
      toast.error(result.error ?? "Unable to load site content.");
      return;
    }
    const response = result.data as { data?: ContentPage[] };
    setPages(Array.isArray(response?.data) ? response.data : []);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (page: ContentPage) => {
    setSaving(page.slug);
    const result = await updateSiteContentApi(page.slug, {
      title: page.title,
      content: page.content,
    });
    setSaving(null);
    if (!result.ok) {
      toast.error(result.error ?? "Unable to update content.");
      return;
    }
    toast.success(`${page.title} updated.`);
    await load();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-[#ff4d6d] to-[#ffb703] p-8 text-[#3f1d2f] shadow-xl">
        <FilePenLine size={30} />
        <h1 className="mt-4 text-4xl font-black">Content Management</h1>
        <p className="mt-2 font-medium">Update the policy, help and informational content used by the website and assistant.</p>
      </section>

      {pages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ffb3bf] bg-white p-12 text-center text-[#8d6171]">
          No managed content records are available yet.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {pages.map((page) => (
            <article key={page.id} className="rounded-3xl border border-[#ffb3bf] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b85f7b]">{page.slug}</p>
              <input
                value={page.title}
                onChange={(event) => setPages((current) => current.map((item) => item.id === page.id ? { ...item, title: event.target.value } : item))}
                className="mt-3 w-full rounded-2xl border border-[#ffd0d8] px-4 py-3 text-xl font-bold text-[#3f1d2f] outline-none"
              />
              <textarea
                value={page.content}
                onChange={(event) => setPages((current) => current.map((item) => item.id === page.id ? { ...item, content: event.target.value } : item))}
                rows={12}
                className="mt-4 w-full rounded-2xl border border-[#ffd0d8] px-4 py-3 leading-7 text-[#5c3343] outline-none"
              />
              <button
                onClick={() => void save(page)}
                disabled={saving === page.slug}
                className="mt-4 rounded-2xl bg-[#ff4d6d] px-5 py-3 font-bold text-white disabled:opacity-60"
              >
                {saving === page.slug ? "Saving…" : "Save Content"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
