import React from 'react';
import { ArrowRight, ShieldCheck, Zap, BarChart3, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button.js';

interface HeroSectionProps {
  onGetStartedClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStartedClick }) => {
  return (
    <section id="hero" className="relative py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline + Subcopy + CTA */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#F2F3FF] text-[#5F6FFF] border border-[#5F6FFF]/20">
              <Zap className="w-3.5 h-3.5" />
              <span>Modern Lead Management MVP</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.12] tracking-tight">
              Capture, Manage & Convert <span className="text-[#5F6FFF]">Leads Effortlessly.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed">
              LeadDesk Mini gives public visitors a seamless contact experience while giving administrators instant search, filtering, and status workflows in one secure dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStartedClick}
                className="gap-2 text-base font-semibold shadow-md"
              >
                Submit a Lead <ArrowRight className="w-5 h-5" />
              </Button>
              <a href="#features">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5F6FFF]" />
                <span>JWT Secured Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5F6FFF]" />
                <span>React Hook Form + Zod</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5F6FFF]" />
                <span>Mongoose & Express</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Prescripto Card / Illustration */}
          <div className="relative">
            {/* Background Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#5F6FFF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative bg-[#F8F9FD] border border-gray-100 rounded-2xl p-6 md:p-8 shadow-card space-y-6">
              
              {/* Header card preview */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5F6FFF] text-white flex items-center justify-center font-bold text-lg">
                    LD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Lead Processing Overview</h4>
                    <p className="text-xs text-gray-500">Real-time Lead Ingestion</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                  Live Sync
                </span>
              </div>

              {/* Sample Lead Items */}
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Sarah Jenkins</span>
                    <span className="text-xs text-gray-500">sarah.j@acme.com • $10k - $25k</span>
                  </div>
                  <span className="px-2.5 py-1 bg-[#F2F3FF] text-[#5F6FFF] text-xs font-semibold rounded-full border border-[#5F6FFF]/20">
                    New
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Alex Rivera</span>
                    <span className="text-xs text-gray-500">alex@techcorp.io • $25,000+</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                    Contacted
                  </span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-xs flex items-center justify-between opacity-80">
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">David Chen</span>
                    <span className="text-xs text-gray-500">d.chen@global.net • $5k - $10k</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                    Closed
                  </span>
                </div>
              </div>

              {/* Stat Footer Card */}
              <div className="pt-2 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <span className="block text-xl font-bold text-gray-900">100%</span>
                  <span className="text-[11px] text-gray-500">Validated</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <span className="block text-xl font-bold text-[#5F6FFF]">&lt; 100ms</span>
                  <span className="text-[11px] text-gray-500">API Speed</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-100">
                  <span className="block text-xl font-bold text-emerald-600">Secure</span>
                  <span className="text-[11px] text-gray-500">JWT Auth</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
