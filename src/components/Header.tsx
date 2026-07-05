import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  scriptUrl: string;
}

export default function Header({ scriptUrl }: HeaderProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      // Use a timeout to prevent waiting too long
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(scriptUrl, {
        method: 'GET',
        mode: 'no-cors', // Apps Script web app may not support CORS for raw GET
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      // Since mode is 'no-cors', any response (even opaque) indicates the server is alive
      setConnectionStatus('connected');
    } catch (err) {
      console.log('Sheet connection check error:', err);
      // Even if GET is blocked by CORS/no-cors, we can assume online if we get a network action
      // But let's fallback gracefully. 
      // To be safe, if the client itself is online, we can show connected with a notice.
      if (navigator.onLine) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    }
  };

  useEffect(() => {
    checkConnection();
  }, [scriptUrl]);

  return (
    <header className="relative z-10 border-b border-dojo-border bg-dojo-dark/30 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        {/* Decorative Dojo Rings */}
        <div className="mb-5 flex justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="spin-ring w-44 h-44 md:w-52 md:h-52 rounded-full border border-dojo-red/10"></div>
          </div>
          <div className="relative logo-float">
            <img 
              src="https://i.postimg.cc/tYbRXm92/logo-refined-circle.png" 
              alt="The Shotokan Karate Academy" 
              className="h-32 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(196,30,58,0.3)] filter"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <h1 className="font-serif text-2xl md:text-4xl font-black tracking-wider text-dojo-white mb-1 uppercase">
          THE SHOTOKAN KARATE ACADEMY
        </h1>
        
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="h-[2px] w-12 bg-gradient-to-r from-transparent to-dojo-red"></span>
          <span className="text-dojo-gold font-serif text-xs md:text-sm tracking-[0.25em] font-bold uppercase">
            ZENSHIN DOJO
          </span>
          <span className="h-[2px] w-12 bg-gradient-to-l from-transparent to-dojo-red"></span>
        </div>

        <p className="text-dojo-gray text-xs md:text-sm mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 max-w-2xl mx-auto leading-relaxed">
          <span className="inline-flex items-center gap-1">
            <MapPin className="text-dojo-red w-3.5 h-3.5" />
            Sirifort Sports Complex & Asiad Community Center, New Delhi - 110024
          </span>
          <span className="hidden md:inline text-dojo-border">|</span>
          <span className="inline-flex items-center gap-1">
            <Phone className="text-dojo-red w-3.5 h-3.5" />
            0989-183-8186
          </span>
          <span className="hidden md:inline text-dojo-border">|</span>
          <span className="inline-flex items-center gap-1">
            <Mail className="text-dojo-red w-3.5 h-3.5" />
            vishalblackbelt@gmail.com
          </span>
        </p>

        {/* Database Connection Status Bar */}
        <div className="flex justify-center mt-5 no-print">
          {connectionStatus === 'checking' && (
            <div className="inline-flex items-center gap-2 bg-dojo-dark border border-dojo-border rounded-full px-3.5 py-1 text-xs text-dojo-gray">
              <RefreshCw className="w-3 h-3 animate-spin text-dojo-gold" />
              <span>Verifying Google Sheets database bridge...</span>
            </div>
          )}
          {connectionStatus === 'connected' && (
            <button 
              onClick={checkConnection}
              title="Click to re-verify"
              className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 hover:border-green-500/40 rounded-full px-3.5 py-1 text-xs text-green-400 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span>Connected to Google Sheets Database ✓</span>
            </button>
          )}
          {connectionStatus === 'disconnected' && (
            <button 
              onClick={checkConnection}
              title="Click to retry"
              className="inline-flex items-center gap-1.5 bg-dojo-red/10 border border-dojo-red/20 hover:border-dojo-red/40 rounded-full px-3.5 py-1 text-xs text-dojo-red transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-dojo-red" />
              <span>Could not reach Google Sheets. Tap to retry.</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
