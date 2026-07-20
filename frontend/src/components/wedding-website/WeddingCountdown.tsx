"use client";

import { useEffect, useState } from "react";

type Props = {
  weddingDate: string | null;
};

export default function WeddingCountdown({
  weddingDate,
}: Props) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!weddingDate) return;

    const interval = setInterval(() => {
      const target = new Date(weddingDate).getTime();

      const now = Date.now();

      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);

        return;
      }

      setTimeLeft({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24),
        ),

        hours: Math.floor(
          (difference /
            (1000 * 60 * 60)) %
            24,
        ),

        minutes: Math.floor(
          (difference / (1000 * 60)) %
            60,
        ),

        seconds: Math.floor(
          (difference / 1000) %
            60,
        ),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  if (!weddingDate) {
    return null;
  }

  return (
    <section className="bg-rose-50 py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-rose-500">
          Countdown
        </p>

        <h2 className="mt-4 text-5xl font-bold">
          We Are Getting Married In
        </h2>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            {
              label: "Days",
              value: timeLeft.days,
            },
            {
              label: "Hours",
              value: timeLeft.hours,
            },
            {
              label: "Minutes",
              value: timeLeft.minutes,
            },
            {
              label: "Seconds",
              value: timeLeft.seconds,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[32px] bg-white p-8 shadow-lg"
            >
              <h3 className="text-5xl font-bold text-rose-600">
                {item.value}
              </h3>

              <p className="mt-3 text-gray-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}