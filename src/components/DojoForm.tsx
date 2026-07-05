import React, { useState, useRef } from 'react';
import { 
  User, MapPin, School, Upload, Check, AlertCircle, FileText, Stamp, HelpCircle, Dumbbell, ShieldAlert, Award, Swords
} from 'lucide-react';
import { AdmissionFormData } from '../types';

interface DojoFormProps {
  formData: AdmissionFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdmissionFormData>>;
  onNext: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export default function DojoForm({ formData, setFormData, onNext, showToast }: DojoFormProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Extract only base64 data
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('Identity photocopy must be under 5MB.', 'error');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setFormData(prev => ({
        ...prev,
        idProof: base64,
        idProofName: file.name
      }));
      showToast('Document uploaded successfully!', 'success');
    } catch (err) {
      showToast('Error uploading document. Please try again.', 'error');
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      idProof: '',
      idProofName: ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Field Validations
    if (!formData.fullName.trim()) return showToast('Please enter applicant name.', 'error');
    if (!formData.sex) return showToast('Please select sex.', 'error');
    if (!formData.fatherName.trim()) return showToast("Please enter father's/guardian's name.", 'error');
    if (!formData.dob) return showToast('Please select date of birth.', 'error');
    if (!formData.resAddress.trim()) return showToast('Please enter residence address.', 'error');
    if (!formData.phone.trim()) return showToast('Please enter contact phone number.', 'error');
    if (!formData.physicallyFit) return showToast('Please state if physically fit.', 'error');
    if (!formData.idProof) return showToast('Please upload Passport / Aadhar photocopy.', 'error');
    if (!formData.program) return showToast('Please select a training program.', 'error');
    if (!formData.appDate) return showToast('Please enter registration date.', 'error');
    if (!formData.appPlace.trim()) return showToast('Please enter registration place.', 'error');

    // Terms Acceptance check is handled here too
    const termsChecked = (document.getElementById('acceptTerms') as HTMLInputElement)?.checked;
    if (!termsChecked) {
      return showToast('You must read and accept the Dojo Terms & Conditions.', 'error');
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. PERSONAL INFORMATION */}
      <div className="form-card bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-dojo-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-dojo-border/50 pb-3">
          <div className="w-8 h-8 rounded-lg bg-dojo-red/15 flex items-center justify-center">
            <User className="text-dojo-red w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-dojo-white">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="md:col-span-2">
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              1. Full Name of Candidate <span className="text-dojo-red">*</span>
            </label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter candidate's full name"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
              required
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Sex <span className="text-dojo-red">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sex: 'Male' }))}
                className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  formData.sex === 'Male'
                    ? 'bg-dojo-red/10 border-dojo-red text-dojo-white shadow-[0_0_15px_rgba(196,30,58,0.1)]'
                    : 'bg-dojo-dark/40 border-dojo-border text-dojo-gray hover:text-dojo-white hover:border-zinc-700'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, sex: 'Female' }))}
                className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  formData.sex === 'Female'
                    ? 'bg-dojo-red/10 border-dojo-red text-dojo-white shadow-[0_0_15px_rgba(196,30,58,0.1)]'
                    : 'bg-dojo-dark/40 border-dojo-border text-dojo-gray hover:text-dojo-white hover:border-zinc-700'
                }`}
              >
                Female
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              2. Father's / Guardian's Name <span className="text-dojo-red">*</span>
            </label>
            <input 
              type="text" 
              value={formData.fatherName}
              onChange={e => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
              placeholder="Father's or guardian's full name"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
              required
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Father's Occupation
            </label>
            <input 
              type="text" 
              value={formData.fatherOccupation}
              onChange={e => setFormData(prev => ({ ...prev, fatherOccupation: e.target.value }))}
              placeholder="e.g. Business, Service, etc."
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Father's Address
            </label>
            <input 
              type="text" 
              value={formData.fatherAddress}
              onChange={e => setFormData(prev => ({ ...prev, fatherAddress: e.target.value }))}
              placeholder="Leave blank if same as residence"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              6. Date of Birth <span className="text-dojo-red">*</span>
            </label>
            <input 
              type="date" 
              value={formData.dob}
              onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))}
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm scheme-dark"
              required
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Height (cm)
            </label>
            <input 
              type="number" 
              value={formData.height}
              onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
              placeholder="e.g. 175"
              min="40"
              max="250"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Weight (Kg)
            </label>
            <input 
              type="number" 
              value={formData.weight}
              onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              placeholder="e.g. 68"
              min="10"
              max="300"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. CONTACT & ADDRESS */}
      <div className="form-card bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-dojo-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-dojo-border/50 pb-3">
          <div className="w-8 h-8 rounded-lg bg-dojo-red/15 flex items-center justify-center">
            <MapPin className="text-dojo-red w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-dojo-white">
            Contact & Residence
          </h3>
        </div>

        <div className="mb-5">
          <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
            4. Residence Address <span className="text-dojo-red">*</span>
          </label>
          <textarea 
            value={formData.resAddress}
            onChange={e => setFormData(prev => ({ ...prev, resAddress: e.target.value }))}
            placeholder="Complete residential address with landmark & pincode"
            rows={2}
            className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Phone / Mobile Number <span className="text-dojo-red">*</span>
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="e.g. 98100XXXXX"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
              required
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Email Address (Optional)
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. student@domain.com"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 3. EDUCATION & OCCUPATION */}
      <div className="form-card bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-dojo-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-dojo-border/50 pb-3">
          <div className="w-8 h-8 rounded-lg bg-dojo-red/15 flex items-center justify-center">
            <School className="text-dojo-red w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-dojo-white">
            Education & Physical Fitness
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              5. Educational Qualification
            </label>
            <select
              value={formData.education}
              onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))}
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm cursor-pointer"
            >
              <option value="" className="bg-dojo-card">Select Highest Qualification</option>
              <option value="Below 10th" className="bg-dojo-card">Below 10th</option>
              <option value="10th Pass" className="bg-dojo-card">10th Pass</option>
              <option value="12th Pass" className="bg-dojo-card">12th Pass</option>
              <option value="Graduate" className="bg-dojo-card">Graduate</option>
              <option value="Post Graduate" className="bg-dojo-card">Post Graduate</option>
              <option value="Other" className="bg-dojo-card">Other</option>
            </select>
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              School / College / Institution Name
            </label>
            <input 
              type="text" 
              value={formData.schoolName}
              onChange={e => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
              placeholder="Name of your educational institution"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              8. Student's Current Occupation
            </label>
            <input 
              type="text" 
              value={formData.studentOccupation}
              onChange={e => setFormData(prev => ({ ...prev, studentOccupation: e.target.value }))}
              placeholder="e.g. Student, Working Professional, Freelancer"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              7. Are you physically fit? <span className="text-dojo-red">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, physicallyFit: 'Yes' }))}
                className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  formData.physicallyFit === 'Yes'
                    ? 'bg-dojo-red/10 border-dojo-red text-dojo-white shadow-[0_0_15px_rgba(196,30,58,0.1)]'
                    : 'bg-dojo-dark/40 border-dojo-border text-dojo-gray hover:text-dojo-white hover:border-zinc-700'
                }`}
              >
                Yes, Fit
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, physicallyFit: 'No' }))}
                className={`py-2.5 px-3 rounded-lg border text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                  formData.physicallyFit === 'No'
                    ? 'bg-dojo-red/10 border-dojo-red text-dojo-white shadow-[0_0_15px_rgba(196,30,58,0.1)]'
                    : 'bg-dojo-dark/40 border-dojo-border text-dojo-gray hover:text-dojo-white hover:border-zinc-700'
                }`}
              >
                No, Not Fit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DOCUMENT UPLOAD */}
      <div className="form-card bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-dojo-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-dojo-border/50 pb-3">
          <div className="w-8 h-8 rounded-lg bg-dojo-red/15 flex items-center justify-center">
            <Upload className="text-dojo-red w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-dojo-white">
            Document Upload
          </h3>
        </div>

        <div>
          <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-2">
            3. Passport / Aadhar Card Photocopy (ID Proof) <span className="text-dojo-red">*</span>
          </label>
          
          <div
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
              formData.idProof 
                ? 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10' 
                : dragActive 
                  ? 'border-dojo-red bg-dojo-red/10 scale-[0.99]' 
                  : 'border-dojo-border bg-dojo-dark/30 hover:border-dojo-red hover:bg-dojo-red/5'
            }`}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={onFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
            
            {formData.idProof ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3 border border-green-500/20">
                  <Check className="text-green-400 w-6 h-6 animate-pulse" />
                </div>
                <p className="text-green-400 font-bold text-sm mb-1">
                  ID Photocopy Loaded Successfully
                </p>
                <p className="text-dojo-gray text-xs truncate max-w-sm px-4">
                  {formData.idProofName}
                </p>
                <button
                  type="button"
                  onClick={removeFile}
                  className="mt-3 px-3 py-1.5 rounded-md bg-dojo-red/15 hover:bg-dojo-red/35 text-dojo-red font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-dojo-red/20"
                >
                  Clear Selection
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="text-dojo-gray w-10 h-10 mb-3" />
                <p className="text-dojo-white font-semibold text-sm">
                  Drag and drop file here, or <span className="text-dojo-red underline hover:text-dojo-red-light transition-all">browse</span>
                </p>
                <p className="text-dojo-gray text-xs mt-1.5">
                  Acceptable formats: PDF, JPEG, PNG • Maximum size: 5MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. TRAINING PROGRAM SELECTION */}
      <div className="form-card bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-dojo-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-dojo-border/50 pb-3">
          <div className="w-8 h-8 rounded-lg bg-dojo-red/15 flex items-center justify-center">
            <Award className="text-dojo-red w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-dojo-white">
            Training Program Selection
          </h3>
        </div>

        <div className="mb-6">
          <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-3">
            Select Desired Discipline <span className="text-dojo-red">*</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Karate */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, program: 'Karate' }))}
              className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
                formData.program === 'Karate'
                  ? 'border-dojo-red bg-dojo-red/5 scale-[1.02] shadow-[0_0_20px_rgba(196,30,58,0.15)]'
                  : 'border-dojo-border bg-dojo-dark/40 hover:border-zinc-700 hover:bg-dojo-dark/60'
              }`}
            >
              <Award className={`w-8 h-8 mb-2 transition-all ${formData.program === 'Karate' ? 'text-dojo-gold scale-110' : 'text-dojo-gray'}`} />
              <span className="text-xs font-bold uppercase tracking-wider block text-dojo-white">Karate</span>
            </div>

            {/* Self Defense */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, program: 'Self Defense' }))}
              className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
                formData.program === 'Self Defense'
                  ? 'border-dojo-red bg-dojo-red/5 scale-[1.02] shadow-[0_0_20px_rgba(196,30,58,0.15)]'
                  : 'border-dojo-border bg-dojo-dark/40 hover:border-zinc-700 hover:bg-dojo-dark/60'
              }`}
            >
              <ShieldAlert className={`w-8 h-8 mb-2 transition-all ${formData.program === 'Self Defense' ? 'text-dojo-gold scale-110' : 'text-dojo-gray'}`} />
              <span className="text-xs font-bold uppercase tracking-wider block text-dojo-white">Self Defense</span>
            </div>

            {/* Combat Fitness */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, program: 'Combat Fitness' }))}
              className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
                formData.program === 'Combat Fitness'
                  ? 'border-dojo-red bg-dojo-red/5 scale-[1.02] shadow-[0_0_20px_rgba(196,30,58,0.15)]'
                  : 'border-dojo-border bg-dojo-dark/40 hover:border-zinc-700 hover:bg-dojo-dark/60'
              }`}
            >
              <Dumbbell className={`w-8 h-8 mb-2 transition-all ${formData.program === 'Combat Fitness' ? 'text-dojo-gold scale-110' : 'text-dojo-gray'}`} />
              <span className="text-xs font-bold uppercase tracking-wider block text-dojo-white">Combat Fitness</span>
            </div>

            {/* Kobudo */}
            <div 
              onClick={() => setFormData(prev => ({ ...prev, program: 'Kobudo' }))}
              className={`border rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 select-none ${
                formData.program === 'Kobudo'
                  ? 'border-dojo-red bg-dojo-red/5 scale-[1.02] shadow-[0_0_20px_rgba(196,30,58,0.15)]'
                  : 'border-dojo-border bg-dojo-dark/40 hover:border-zinc-700 hover:bg-dojo-dark/60'
              }`}
            >
              <Swords className={`w-8 h-8 mb-2 transition-all ${formData.program === 'Kobudo' ? 'text-dojo-gold scale-110' : 'text-dojo-gray'}`} />
              <span className="text-xs font-bold uppercase tracking-wider block text-dojo-white">Kobudo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Registration Date <span className="text-dojo-red">*</span>
            </label>
            <input 
              type="date" 
              value={formData.appDate}
              onChange={e => setFormData(prev => ({ ...prev, appDate: e.target.value }))}
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm scheme-dark"
              required
            />
          </div>

          <div>
            <label className="form-label text-xs font-semibold text-dojo-gray uppercase tracking-wider block mb-1.5">
              Place <span className="text-dojo-red">*</span>
            </label>
            <input 
              type="text" 
              value={formData.appPlace}
              onChange={e => setFormData(prev => ({ ...prev, appPlace: e.target.value }))}
              placeholder="e.g. New Delhi"
              className="bg-dojo-dark/80 border border-dojo-border/80 focus:border-dojo-red text-dojo-white font-medium placeholder:text-zinc-700 px-4 py-2.5 rounded-lg w-full outline-none transition-all focus:ring-4 focus:ring-dojo-red/10 text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* 6. TERMS & CONDITIONS */}
      <div className="form-card bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-dojo-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-dojo-border/50 pb-3">
          <div className="w-8 h-8 rounded-lg bg-dojo-red/15 flex items-center justify-center">
            <Stamp className="text-dojo-red w-4.5 h-4.5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-dojo-white">
            Terms & Conditions (Zenshin Dojo Oath)
          </h3>
        </div>

        <div className="terms-box bg-dojo-black/60 rounded-xl p-5 mb-5 border border-dojo-border/50 max-h-[250px] overflow-y-auto text-xs space-y-4 text-dojo-gray leading-relaxed font-sans">
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-dojo-red flex-shrink-0 mt-1.5"></span>
            <p>
              <strong className="text-dojo-white">1. DOJO ETIQUETTE & SPIRIT:</strong> Karate-Do training focuses on the character and spirit development of the student. Trainees must develop patience, self-control, and absolute humility.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-dojo-red flex-shrink-0 mt-1.5"></span>
            <p>
              <strong className="text-dojo-white">2. STRICT SELF-DEFENSE POLICY:</strong> Karate-Do is purely for defensive purposes. provocation is not an excuse for using karate. It should only be used as a defense against active physical attack.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-dojo-red flex-shrink-0 mt-1.5"></span>
            <p>
              <strong className="text-dojo-white">3. NO UNAUTHORIZED TEACHING:</strong> Karate-Do is not for showing off or public exhibitions without prior permission. Students are strictly forbidden from teaching others or conducting unauthorized private lessons.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-dojo-red flex-shrink-0 mt-1.5"></span>
            <p>
              <strong className="text-dojo-white">4. DISCIPLINARY EXPULSION:</strong> Misbehavior or disrespect inside or outside the Dojo is grounds for immediate expulsion. Karate students must exhibit impeccable manners toward instructors, elders, and peers.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-dojo-red flex-shrink-0 mt-1.5"></span>
            <p>
              <strong className="text-dojo-white">5. LIABILITY DISCLAIMER:</strong> While maximum precautions are taken to ensure student safety, T.S.K.A., its administrators, stadium management, and individual instructors hold zero liability for injuries sustained during, before, or after training. Trainees join the academy solely at their own physical risk.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-dojo-red flex-shrink-0 mt-1.5"></span>
            <p>
              <strong className="text-dojo-white">6. CRIMINAL EXCLUSION:</strong> Individuals with active criminal records or records of public misconduct will be barred from training or expelled immediately from the T.S.K.A. rolls.
            </p>
          </div>
          <div className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-dojo-red flex-shrink-0 mt-1.5"></span>
            <p>
              <strong className="text-dojo-white">7. FEE LIABILITY:</strong> Trainees remain liable for timely monthly fees even if absent from training, unless physically incapacitated and backed by an official medical certificate.
            </p>
          </div>
        </div>

        {/* Custom Toggle Checkbox */}
        <div className="mb-5 p-4 rounded-xl bg-dojo-dark border border-dojo-border flex items-start gap-3">
          <input 
            type="checkbox" 
            id="acceptTerms" 
            className="w-4 h-4 rounded border-dojo-border text-dojo-red bg-dojo-dark focus:ring-dojo-red focus:ring-offset-dojo-black mt-0.5 accent-dojo-red cursor-pointer"
            required
          />
          <label htmlFor="acceptTerms" className="text-xs text-dojo-light-gray leading-normal cursor-pointer select-none">
            I, <strong className="text-dojo-white font-semibold">{formData.fullName.trim() || '_________________'}</strong>, have read and understood the Zenshin Dojo code of conduct and voluntarily agree to abide by all specified rules and conditions.
          </label>
        </div>

        {/* Guardian Signatures (For minor candidates) */}
        <div className="p-4 rounded-xl bg-dojo-dark/50 border border-dojo-border/60">
          <p className="text-xs font-bold text-dojo-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-dojo-gold" />
            Minor Candidates Guardian Authorization
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-dojo-gray uppercase block mb-1">
                Guardian Full Name
              </label>
              <input 
                type="text" 
                value={formData.guardianName}
                onChange={e => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                placeholder="Required if applicant is a minor"
                className="bg-dojo-dark border border-dojo-border focus:border-dojo-red text-dojo-white placeholder:text-zinc-850 px-3 py-2 rounded-md w-full outline-none transition-all text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-dojo-gray uppercase block mb-1">
                Digital Signature (Type Full Name)
              </label>
              <input 
                type="text" 
                value={formData.guardianSigText}
                onChange={e => setFormData(prev => ({ ...prev, guardianSigText: e.target.value }))}
                placeholder="Types of signature authentication"
                className="bg-dojo-dark border border-dojo-border focus:border-dojo-red text-dojo-white placeholder:text-zinc-850 px-3 py-2 rounded-md w-full outline-none transition-all text-xs font-serif italic"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-[10px] font-semibold text-dojo-gray uppercase block mb-1">
                Signature Date
              </label>
              <input 
                type="date" 
                value={formData.guardianDate}
                onChange={e => setFormData(prev => ({ ...prev, guardianDate: e.target.value }))}
                className="bg-dojo-dark border border-dojo-border focus:border-dojo-red text-dojo-white px-3 py-2 rounded-md w-full outline-none transition-all text-xs scheme-dark"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-dojo-gray uppercase block mb-1">
                Signature Place
              </label>
              <input 
                type="text" 
                value={formData.guardianPlace}
                onChange={e => setFormData(prev => ({ ...prev, guardianPlace: e.target.value }))}
                placeholder="e.g. New Delhi"
                className="bg-dojo-dark border border-dojo-border focus:border-dojo-red text-dojo-white placeholder:text-zinc-850 px-3 py-2 rounded-md w-full outline-none transition-all text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT FORM & PROCEED TO FEE CHECKOUT BUTTON */}
      <div className="text-center pt-4 no-print">
        <button
          type="submit"
          className="submit-btn inline-flex items-center justify-center gap-2 bg-gradient-to-r from-dojo-red to-dojo-red-dark hover:from-dojo-red-light hover:to-dojo-red text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_5px_20px_rgba(196,30,58,0.2)] hover:shadow-[0_8px_30px_rgba(196,30,58,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 w-full md:w-auto cursor-pointer"
        >
          <span>Continue to Fee Payment & Verification</span>
          <FileText className="w-4 h-4" />
        </button>
        <p className="text-dojo-gray/40 text-[10px] mt-4 uppercase tracking-widest">
          Admission applications remain pending until fee is verified
        </p>
      </div>

    </form>
  );
}
