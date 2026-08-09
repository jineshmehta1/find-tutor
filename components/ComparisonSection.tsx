"use client";

import React from "react";
import { Check, X, Shield, Sparkles, Award, Zap } from "lucide-react";

export function ComparisonSection() {
  const features = [
    {
      name: "Physically Verified Tutor Background & IDs",
      aacharya: true,
      brokers: false,
      genericApps: false,
      detail: "100% address proof, qualification certificates, and identity verified."
    },
    {
      name: "Zero Commission Cuts / Direct Tutor Fee Agreement",
      aacharya: true,
      brokers: false,
      genericApps: false,
      detail: "No hidden 30%-50% agency cut; you agree on fees directly with your tutor."
    },
    {
      name: "Complimentary 30-Minute Trial Demo Session",
      aacharya: true,
      brokers: "Varies / Paid",
      genericApps: false,
      detail: "Evaluate teaching style, compatibility, and schedule before paying."
    },
    {
      name: "Flexible Hybrid Switch (Home Tuition <-> 1-on-1 Online)",
      aacharya: true,
      brokers: false,
      genericApps: "Online Only",
      detail: "Switch between home visits and online sessions seamlessly."
    },
    {
      name: "Local Bhavanipuram & Vijayawada Dedicated Support",
      aacharya: true,
      brokers: "Unreliable",
      genericApps: "Bot Support",
      detail: "Real academic counselors helping you pair with the perfect tutor."
    }
  ];

  return (
    <div className="w-full bg-white rounded-3xl p-6 md:p-12 border border-slate-100 shadow-xl space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4 text-primary" />
          <span>Why We Stand Out</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
          How Aacharya Academy <span className="text-gradient-gold">Compares</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          See why over 1,200+ parents in Bhavanipuram and Vijayawada choose us over traditional channels.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-4 w-1/2">Platform Feature</th>
              <th className="py-4 px-4 bg-primary/5 text-primary rounded-t-2xl text-center w-1/6 font-extrabold text-sm">
                Aacharya Academy
              </th>
              <th className="py-4 px-4 text-center w-1/6">Local Brokers</th>
              <th className="py-4 px-4 text-center w-1/6">Generic Portals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {features.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-400 font-medium">{item.detail}</div>
                </td>

                {/* Aacharya Column */}
                <td className="py-4 px-4 bg-primary/5 text-center font-bold text-slate-950">
                  <div className="flex items-center justify-center">
                    <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4" />
                    </span>
                  </div>
                </td>

                {/* Local Brokers Column */}
                <td className="py-4 px-4 text-center font-medium text-slate-500">
                  {typeof item.brokers === "boolean" ? (
                    item.brokers ? (
                      <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    )
                  ) : (
                    <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {item.brokers}
                    </span>
                  )}
                </td>

                {/* Generic Apps Column */}
                <td className="py-4 px-4 text-center font-medium text-slate-500">
                  {typeof item.genericApps === "boolean" ? (
                    item.genericApps ? (
                      <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    )
                  ) : (
                    <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded text-slate-600">
                      {item.genericApps}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
