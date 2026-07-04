"use client";

export default function PlatformSettings() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Platform Settings
      </h2>

      <div className="mt-8 space-y-6">

        <Setting
          title="Allow Vendor Registration"
          checked
        />

        <Setting
          title="Allow Customer Registration"
          checked
        />

        <Setting
          title="Enable Reviews"
          checked
        />

        <Setting
          title="Enable Payments"
          checked
        />

        <Setting
          title="Maintenance Mode"
        />

      </div>

    </section>
  );
}

function Setting({
  title,
  checked = false,
}: {
  title: string;
  checked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">

      <h3 className="font-medium text-slate-700">
        {title}
      </h3>

      <input
        type="checkbox"
        defaultChecked={checked}
        className="h-5 w-5"
      />

    </div>
  );
}