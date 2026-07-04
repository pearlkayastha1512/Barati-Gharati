"use client";

import { useEffect, useState } from "react";

import { X, MessageSquare } from "lucide-react";

import { toast } from "sonner";

import { Review } from "@/types/review";

import { useReviewStore } from "@/store/reviewStore";

interface Props {
  open: boolean;

  onClose: () => void;
}

export default function ReplyReviewModal({
  open,
  onClose,
}: Props) {
  const {
    selectedReview,
    replyToReview,
    setSelectedReview,
  } = useReviewStore();

  const [reply, setReply] =
    useState("");

  useEffect(() => {
    if (!selectedReview) {
      return;
    }

    setReply(
      selectedReview.reply ?? ""
    );
  }, [selectedReview]);

  if (!open || !selectedReview) {
    return null;
  }

  const handleSave = () => {
    if (!reply.trim()) {
      toast.error(
        "Reply cannot be empty."
      );

      return;
    }

    replyToReview(
      selectedReview.id,
      reply
    );

    toast.success(
      selectedReview.reply
        ? "Reply updated successfully."
        : "Reply sent successfully."
    );

    setSelectedReview(null);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <MessageSquare
              className="text-orange-500"
              size={22}
            />

            <h2 className="text-2xl font-bold text-slate-900">
              {selectedReview.reply
                ? "Edit Reply"
                : "Reply to Review"}
            </h2>

          </div>

          <button
            onClick={() => {
              setSelectedReview(null);

              onClose();
            }}
            className="rounded-xl p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        {/* Customer Review */}

        <div className="border-b border-slate-100 bg-slate-50 p-6">

          <p className="font-semibold text-slate-900">
            {selectedReview.customerName}
          </p>

          <p className="mt-3 leading-7 text-slate-600">
            {selectedReview.comment}
          </p>

        </div>

        {/* Reply */}

        <div className="p-6">

          <label className="mb-3 block font-semibold text-slate-700">
            Your Reply
          </label>

          <textarea
            value={reply}
            onChange={(e) =>
              setReply(
                e.target.value
              )
            }
            rows={6}
            maxLength={500}
            placeholder="Write a professional response..."
            className="w-full rounded-2xl border border-slate-300 p-4 outline-none transition focus:border-orange-500 text-gray-600"
          />

          <div className="mt-2 text-right text-xs text-slate-500">
            {reply.length}/500
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">

          <button
            onClick={() => {
              setSelectedReview(null);

              onClose();
            }}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            {selectedReview.reply
              ? "Update Reply"
              : "Send Reply"}
          </button>

        </div>

      </div>

    </div>
  );
}