import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap, AlertCircle, RefreshCw, Sparkles, Check } from 'lucide-react';

import Header from './components/Header';
import DojoForm from './components/DojoForm';
import PaymentCheckout from './components/PaymentCheckout';
import SuccessScreen from './components/SuccessScreen';

import { AdmissionFormData, FormStep, ToastState } from './types';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaUJWg9mrPCpjzNjxSo_kRnrk5YUrOEUb8JoBeC4XbeLk5kM0U4UWFFXtgt4JTX91W/exec';

const initialFormState: AdmissionFormData = {
  appDate: '2026-07-05', // Default matching user local time year metadata
  fullName: '',
  sex: '',
  fatherName: '',
  fatherOccupation: '',
  fatherAddress: '',
  dob: '',
  height: '',
  weight: '',
  resAddress: '',
  phone: '',
  email: '',
  education: '',
  schoolName: '',
  studentOccupation: '',
  physicallyFit: '',
  program: '',
  appPlace: 'New Delhi',
  utrNumber: '',
  idProof: '',
  idProofName: '',
  paymentProof: '',
  paymentProofName: '',
  guardianName: '',
  guardianSigText: '',
  guardianDate: '',
  guardianPlace: ''
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<FormStep>('form');
  const [formData, setFormData] = useState<AdmissionFormData>(initialFormState);
  
  // Toast notifications
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    visible: false
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Set today's date dynamically on load
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ 
      ...prev, 
      appDate: today,
      guardianDate: today
    }));
  }, []);

  // Developer / Admin Sandbox Pre-fill utilities
  const handlePrefillTestData = () => {
    setFormData({
      appDate: new Date().toISOString().split('T')[0],
      fullName: 'Johnathan Doe',
      sex: 'Male',
      fatherName: 'Robert Doe',
      fatherOccupation: 'Government Servant',
      fatherAddress: 'Flat 402, Block-C, Asiad Village, New Delhi',
      dob: '1998-04-12',
      height: '180',
      weight: '75',
      resAddress: 'Flat 402, Block-C, Asiad Village, New Delhi - 110049',
      phone: '9810123456',
      email: 'johnathan.doe@test.com',
      education: 'Graduate',
      schoolName: 'Delhi University (DU)',
      studentOccupation: 'Software Analyst',
      physicallyFit: 'Yes',
      program: 'Karate',
      utrNumber: '', // Let them enter UTR or use simulated checkout
      idProof: 'MOCK_ID_PROOF_BASE64_STUB',
      idProofName: 'aadhar_photocopy_front_back.png',
      paymentProof: '',
      paymentProofName: '',
      guardianName: '',
      guardianSigText: '',
      guardianDate: '',
      guardianPlace: ''
    });

    // Make sure terms checkbox gets checked if present
    const termsChk = document.getElementById('acceptTerms') as HTMLInputElement;
    if (termsChk) termsChk.checked = true;

    showToast('Sandbox Mock Form Data populated successfully!', 'success');
  };

  const handleSkipToCheckout = () => {
    // Fill required form fields first to avoid validation blockers
    setFormData(prev => ({
      ...prev,
      fullName: prev.fullName || 'Simulator Tester',
      sex: prev.sex || 'Male',
      fatherName: prev.fatherName || 'Master Shifu',
      dob: prev.dob || '2000-01-01',
      resAddress: prev.resAddress || 'Zenshin Dojo Complex, New Delhi',
      phone: prev.phone || '9999911111',
      physicallyFit: prev.physicallyFit || 'Yes',
      program: prev.program || 'Karate',
      idProof: prev.idProof || 'MOCK_ID_PROOF_STUB',
      idProofName: prev.idProofName || 'aadhar_verified_card.png'
    }));

    setCurrentStep('payment');
    showToast('Skipped directly to Fee Payment screen!', 'success');
  };

  const handleBypassToCertificate = () => {
    setFormData(prev => ({
      ...prev,
      fullName: prev.fullName || 'Sensei Candidate',
      program: prev.program || 'Combat Fitness',
      appDate: prev.appDate || new Date().toISOString().split('T')[0],
      appPlace: prev.appPlace || 'New Delhi'
    }));
    setCurrentStep('success');
    showToast('Checkout mock success! Redirect completed.', 'success');
  };

  return (
    <div className="bg-pattern min-h-screen pb-16 relative overflow-x-hidden font-sans select-none">
      
      {/* Absolute fixed Kanji overlay for traditional atmosphere */}
      <div className="kanji-watermark select-none">空手</div>

      {/* Floating alert notification toaster */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border max-w-sm ${
              toast.type === 'success'
                ? 'bg-zinc-900/95 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900/95 border-dojo-red/30 text-dojo-red'
            }`}
          >
            {toast.type === 'success' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-bounce" />
            ) : (
              <AlertCircle className="w-5 h-5 text-dojo-red flex-shrink-0 animate-pulse" />
            )}
            <span className="text-xs font-bold font-sans text-dojo-white">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Header */}
      <Header scriptUrl={SCRIPT_URL} />

      {/* Step progression breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 no-print relative z-10">
        <div className="flex items-center justify-center gap-1.5 md:gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
              currentStep === 'form' 
                ? 'bg-dojo-red text-white shadow-[0_0_15px_rgba(196,30,58,0.4)]' 
                : 'bg-zinc-800 text-dojo-gray'
            }`}>
              1
            </span>
            <span className={`font-bold uppercase tracking-wider text-[10px] ${
              currentStep === 'form' ? 'text-dojo-white' : 'text-dojo-gray'
            }`}>
              Admission Form
            </span>
          </div>

          <div className="h-[1px] w-6 md:w-16 bg-zinc-800" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
              currentStep === 'payment' 
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
                : 'bg-zinc-800 text-dojo-gray'
            }`}>
              2
            </span>
            <span className={`font-bold uppercase tracking-wider text-[10px] ${
              currentStep === 'payment' ? 'text-dojo-white' : 'text-dojo-gray'
            }`}>
              Fee Payment
            </span>
          </div>

          <div className="h-[1px] w-6 md:w-16 bg-zinc-800" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
              currentStep === 'success' 
                ? 'bg-dojo-gold text-dojo-black shadow-[0_0_15px_rgba(214,168,67,0.4)]' 
                : 'bg-zinc-800 text-dojo-gray'
            }`}>
              3
            </span>
            <span className={`font-bold uppercase tracking-wider text-[10px] ${
              currentStep === 'success' ? 'text-dojo-white' : 'text-dojo-gray'
            }`}>
              Enrollment
            </span>
          </div>
        </div>
      </div>

      {/* Main active content view with smooth React motion transitions */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {currentStep === 'form' && (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="text-center mb-6">
                <h2 className="text-lg md:text-xl font-bold tracking-wide uppercase text-dojo-white">
                  Admission <span className="text-dojo-red">Application</span> Form
                </h2>
                <p className="text-dojo-gray text-[11px] uppercase tracking-wider mt-1 font-semibold">
                  New Delhi • Zenshin Traditional Dojo Enrollments
                </p>
              </div>

              <DojoForm 
                formData={formData}
                setFormData={setFormData}
                onNext={() => setCurrentStep('payment')}
                showToast={showToast}
              />
            </motion.div>
          )}

          {currentStep === 'payment' && (
            <motion.div
              key="payment-step"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div className="text-center mb-6">
                <h2 className="text-lg md:text-xl font-bold tracking-wide uppercase text-dojo-white">
                  Payment <span className="text-purple-400">Checkout</span> Gate
                </h2>
                <p className="text-dojo-gray text-[11px] uppercase tracking-wider mt-1 font-semibold">
                  Admission enrollment fee verification portal
                </p>
              </div>

              <PaymentCheckout 
                formData={formData}
                setFormData={setFormData}
                onBack={() => setCurrentStep('form')}
                onSubmit={async () => setCurrentStep('success')}
                showToast={showToast}
                scriptUrl={SCRIPT_URL}
              />
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <div className="text-center mb-6">
                <h2 className="text-lg md:text-xl font-bold tracking-wide uppercase text-dojo-white">
                  Enrollment <span className="text-dojo-gold">Registered</span>
                </h2>
                <p className="text-dojo-gray text-[11px] uppercase tracking-wider mt-1 font-semibold">
                  T.S.K.A. Student registry database updated
                </p>
              </div>

              <SuccessScreen 
                formData={formData}
                onReset={() => {
                  setFormData(initialFormState);
                  setCurrentStep('form');
                }}
                showToast={showToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Traditional footer copyright statement */}
      <footer className="relative z-10 border-t border-dojo-border/60 mt-16 pt-8 text-center no-print pb-4">
        <div className="flex justify-center mb-3">
          <img 
            src="https://i.postimg.cc/tYbRXm92/logo-refined-circle.png" 
            alt="TSKA" 
            className="h-10 opacity-30 object-contain filter grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="text-dojo-gray/40 text-[10px] font-semibold uppercase tracking-wider">
          &copy; {new Date().getFullYear()} The Shotokan Karate Academy • Zenshin Dojo. All rights reserved.
        </p>
      </footer>

     </div>
  );
}
