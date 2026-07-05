export interface AdmissionFormData {
  appDate: string;
  fullName: string;
  sex: 'Male' | 'Female' | '';
  fatherName: string;
  fatherOccupation: string;
  fatherAddress: string;
  dob: string;
  height: string;
  weight: string;
  resAddress: string;
  phone: string;
  email: string;
  education: string;
  schoolName: string;
  studentOccupation: string;
  physicallyFit: 'Yes' | 'No' | '';
  program: 'Karate' | 'Self Defense' | 'Combat Fitness' | 'Kobudo' | '';
  appPlace: string;
  utrNumber: string;
  idProof: string; // Base64 or local blob URL
  idProofName: string;
  paymentProof: string; // Base64 or local blob URL
  paymentProofName: string;
  guardianName: string;
  guardianSigText: string;
  guardianDate: string;
  guardianPlace: string;
}

export type FormStep = 'form' | 'payment' | 'success';

export interface ToastState {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}
