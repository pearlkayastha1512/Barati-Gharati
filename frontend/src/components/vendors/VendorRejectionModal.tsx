"use client";

import { useState } from "react";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";

interface VendorRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  title?: string;
}

const PRESET_REASONS = [
  "📅 Already booked on this event date",
  "💰 Budget / Package mismatch",
  "📍 Location outside service coverage area",
  "⚙️ Unable to accommodate special requirements",
  "✍️ Other reason",
];

export default function VendorRejectionModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Reject Booking Request",
}: VendorRejectionModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== "✍️ Other reason") {
      setCustomReason(preset.replace(/^[^\s]+\s*/, ""));
    } else {
      setCustomReason("");
    }
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim();

    if (!finalReason) {
      setError("Rejection reason is mandatory. Please select or enter a reason.");
      return;
    }

    if (finalReason.length < 4) {
      setError("Please provide a reason with at least 4 characters.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await onSubmit(finalReason);
      setCustomReason("");
      setSelectedPreset("");
      onClose();
    } catch {
      setError("Failed to submit rejection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-rose-200 bg-white p-7 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="text-xs font-medium text-rose-600">Rejection Reason Mandatory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Please select or specify the reason for rejecting this booking request. This reason will be logged and shared with the platform Admin.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Quick Reasons
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_REASONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition border ${
                    selectedPreset === preset
                      ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Detailed Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter reason for rejecting this request..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20"
              required
            />
          </div>

          {/* Validation Error */}
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !customReason.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/30 transition hover:bg-rose-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Submitting..." : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
