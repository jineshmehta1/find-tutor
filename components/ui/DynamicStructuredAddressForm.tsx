"use client";

import dynamic from "next/dynamic";
import type { StructuredAddressData } from "./StructuredAddressForm";

const StructuredAddressForm = dynamic(() => import("./StructuredAddressForm"), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-10 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-[220px] bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-medium text-xs">
        Loading Map & Location Form...
      </div>
    </div>
  ),
});

export default StructuredAddressForm;
export type { StructuredAddressData };
