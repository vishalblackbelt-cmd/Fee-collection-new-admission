import React, { useRef } from 'react';
import { 
  CheckCircle, Award, Printer, ArrowRight, Phone, MessageSquare, BookOpen, 
  RefreshCw, Stamp, HelpCircle, ShieldCheck
} from 'lucide-react';
import { AdmissionFormData } from '../types';

interface SuccessScreenProps {
  formData: AdmissionFormData;
  onReset: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function SuccessScreen({ formData, onReset, showToast }: SuccessScreenProps) {
  // Generate random application reference code
  const refNumberRef = useRef<string>(`TSKA-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in font-sans">
      
      {/* 📜 CERTIFICATE CARD */}
      <div className="form-card bg-gradient-to-b from-[#181818] to-[#0a0a0a] border-4 border-dojo-gold/30 p-8 rounded-2xl relative shadow-[0_15px_40px_rgba(212,168,67,0.1)] overflow-hidden max-w-2xl mx-auto">
        
        {/* Subtle Watermarks */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-9xl text-dojo-white/[0.015] pointer-events-none select-none z-0">
          武道
        </div>
        
        {/* Border Ornamentation */}
        <div className="absolute top-2 left-2 bottom-2 right-2 border border-dojo-gold/15 pointer-events-none rounded-xl" />

        <div className="relative z-10 text-center space-y-6">
          
          {/* Badge Emblem */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-dojo-gold/20 rounded-full blur-md animate-pulse"></div>
              <div className="w-16 h-16 rounded-full border-2 border-dojo-gold bg-dojo-dark flex items-center justify-center relative">
                <Award className="text-dojo-gold w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div>
            <h4 className="font-serif text-dojo-gold tracking-[0.2em] uppercase text-xs font-bold mb-1">
              The Shotokan Karate Academy
            </h4>
            <h3 className="font-serif text-2xl font-black text-dojo-white uppercase tracking-wider">
              Certificate of Enrollment
            </h3>
            <div className="w-24 h-[1px] bg-dojo-gold/40 mx-auto mt-2"></div>
          </div>

          {/* Registrant details */}
          <div className="space-y-4 py-2 font-serif text-center">
            <p className="text-dojo-gray text-xs italic">This certifies that candidate</p>
            <p className="text-xl font-bold text-dojo-white underline decoration-dojo-gold/40 underline-offset-8 decoration-wavy">
              {formData.fullName || 'Test Student'}
            </p>
            <p className="text-dojo-gray text-xs leading-relaxed max-w-md mx-auto">
              has successfully registered for admission in the disciplines of 
              <br />
              <strong className="text-dojo-gold font-sans font-bold text-sm tracking-wide uppercase block mt-1">
                {formData.program || 'Karate-Do'} training program
              </strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-dojo-border/40 py-4 max-w-md mx-auto font-sans text-left text-xs">
            <div>
              <span className="text-dojo-gray block font-semibold text-[10px] uppercase tracking-wider">Reference Code</span>
              <strong className="text-dojo-gold font-bold tracking-wider">{refNumberRef.current}</strong>
            </div>
            <div>
              <span className="text-dojo-gray block font-semibold text-[10px] uppercase tracking-wider">Admission Date</span>
              <span className="text-dojo-white font-semibold">{formData.appDate || '05-Jul-2026'}</span>
            </div>
            <div className="mt-2">
              <span className="text-dojo-gray block font-semibold text-[10px] uppercase tracking-wider">Registration Place</span>
              <span className="text-dojo-white font-semibold">{formData.appPlace || 'New Delhi'}</span>
            </div>
            <div className="mt-2">
              <span className="text-dojo-gray block font-semibold text-[10px] uppercase tracking-wider">Receipt Verification</span>
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wide animate-pulse inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                In Process
              </span>
            </div>
          </div>

          {/* Sensei Signature block */}
          <div className="pt-4 max-w-xs mx-auto flex flex-col items-center">
            <Stamp className="text-dojo-red/30 w-12 h-12 mb-1 rotate-12" />
            <div className="font-serif italic text-dojo-light-gray text-sm underline decoration-zinc-800">
              Sensei Vishal Singh
            </div>
            <p className="text-dojo-gray font-sans text-[9px] uppercase tracking-widest mt-1">
              Technical Director • Shihan (5th Dan)
            </p>
          </div>

        </div>
      </div>

      {/* 📋 NEXT STEPS */}
      <div className="form-card bg-gradient-to-br from-[#121212] to-[#0c0c0c] border border-dojo-border p-6 rounded-xl max-w-2xl mx-auto space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-dojo-gold">
          Your Onboarding Checklist & Next Steps
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-dojo-dark border border-dojo-border/60 rounded-lg flex gap-3">
            <Phone className="text-dojo-red w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-dojo-white">Contact Sensei</h5>
              <p className="text-[10px] text-dojo-gray leading-normal">
                Call 0989-183-8186 to reserve your batch hours.
              </p>
            </div>
          </div>

          <div className="p-3 bg-dojo-dark border border-dojo-border/60 rounded-lg flex gap-3">
            <MessageSquare className="text-emerald-400 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-dojo-white">WhatsApp Dojo</h5>
              <p className="text-[10px] text-dojo-gray leading-normal">
                Message receipt photocopy confirmation directly.
              </p>
            </div>
          </div>

          <div className="p-3 bg-dojo-dark border border-dojo-border/60 rounded-lg flex gap-3">
            <BookOpen className="text-dojo-gold w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-dojo-white">Prepare Uniform</h5>
              <p className="text-[10px] text-dojo-gray leading-normal">
                Order size standard white karate Gi from instructors.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto no-print">
        <button
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-dojo-gold to-yellow-600 hover:from-yellow-500 hover:to-dojo-gold text-dojo-black font-black text-xs uppercase tracking-widest py-3 px-5 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Certificate</span>
        </button>

        <button
          onClick={onReset}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-dojo-dark hover:bg-zinc-900 border border-dojo-border text-dojo-white font-bold text-xs uppercase tracking-widest py-3 px-5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Register Another</span>
        </button>
      </div>

    </div>
  );
}
