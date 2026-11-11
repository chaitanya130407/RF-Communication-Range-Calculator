import React from 'react';
import { GlobalBackButton } from '../components/GlobalBackButton';
import {
  Info,
  Radio,
  BookOpen,
  Target,
  Sparkles,
  AlertTriangle,
  Server,
  Cloud,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const applications = [
    { title: 'Wireless Network Planning', desc: 'Predicting base station and access point coverage radiuses.' },
    { title: 'IoT Systems', desc: 'Sizing LoRa, Zigbee, BLE, and NB-IoT telemetry sensor link budgets.' },
    { title: 'Wi-Fi Coverage Study', desc: 'Analyzing 2.4 GHz vs 5 GHz indoor and outdoor propagation limits.' },
    { title: 'Radio Communication', desc: 'VHF/UHF walkie-talkie, amateur radio, and broadcast signal boundaries.' },
    { title: 'Drone Communication Study', desc: 'Telemetry and video feed line-of-sight link budgeting with remote controllers.' },
    { title: 'RF System Analysis', desc: 'Evaluating transmitter amplifier wattage vs directional high-gain antennas.' },
    { title: 'Educational Simulation', desc: 'Demonstrating Friis free space formulas and logarithmic decibel scales.' },
    { title: 'Basic Wireless Link Planning', desc: 'Point-to-point microwave and wireless bridge preliminary calculations.' },
  ];

  return (
    <div className="space-y-12 py-4 sm:py-6">
      {/* Header & Back Button */}
      <div className="flex items-center gap-3">
        <GlobalBackButton />
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Info className="w-7 h-7 text-blue-600" />
            <span>About Project & RF Theory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Second-Year Electronics and Communication Engineering (ECE) Coursework Simulation
          </p>
        </div>
      </div>

      {/* Project Overview Card (Section 20) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Project Specification
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              RF Communication Range Calculator
            </h2>
            <div className="space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <p><strong>Project Type:</strong> Software-Based RF Simulation Project</p>
              <p><strong>Department:</strong> Electronics and Communication Engineering (ECE)</p>
              <p><strong>Level:</strong> Second-Year Undergraduate Simulation Lab</p>
              <p><strong>Architecture:</strong> Client-Side React SPA + Cloud Firestore & Firebase Auth</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 space-y-2">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Project Objective</span>
            </h3>
            <p className="text-xs sm:text-sm text-blue-950 dark:text-blue-200/90 leading-relaxed">
              To calculate the estimated theoretical communication range of an RF system using frequency, transmit power, antenna gain, receiver sensitivity, and system losses using mathematically validated Free Space Path Loss (FSPL) and Friis equations.
            </p>
          </div>
        </div>
      </section>

      {/* Core Engineering Explanations */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Core RF Concepts Explained</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What is RF Communication?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              RF communication is the transfer of electromagnetic signals through the atmosphere or free space without physical cables. Information is encoded onto an alternating radio-frequency wave and radiated into space through an antenna.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What is Communication Range?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Communication range is the maximum distance over which an RF receiver can detect, demodulate, and interpret signals from a transmitter with an acceptable bit error rate (BER) and signal-to-noise ratio (SNR).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What is RF Propagation?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              RF propagation describes the transmission behavior of radio waves as they travel through a medium. In free space, wavefronts expand spherically, distributing emitted power over an area proportional to distance squared (A = 4π · d²).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What is Free Space Path Loss (FSPL)?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Free Space Path Loss is the geometric power reduction experienced by an electromagnetic wave traveling through unobstructed space, without absorption, reflection, or diffraction. FSPL increases by 6 dB for each doubling of distance.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What is an RF Link Budget?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A link budget is an accounting of all the gains (transmit amplifier, transmitter antenna, receiver antenna) and losses (cable attenuation, free space path loss, connectors) along a wireless transmission link.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What is Receiver Sensitivity?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Receiver sensitivity is the minimum input power level (expressed in dBm) required by a receiver to successfully detect and decode an incoming signal above thermal noise. A lower (more negative) number indicates a more sensitive receiver.
            </p>
          </div>
        </div>
      </section>

      {/* Practical Applications (Section 20) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Real-World Engineering Applications</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {applications.map((app) => (
            <div
              key={app.title}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1.5"
            >
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {app.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {app.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Limitations (Section 21) */}
      <section className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>Project Limitations & Engineering Disclaimer</span>
        </div>
        <blockquote className="text-xs sm:text-sm text-amber-950 dark:text-amber-300 italic border-l-4 border-amber-500 pl-4 py-1 leading-relaxed">
          “This calculator provides a theoretical estimate based mainly on free-space propagation. Actual RF range may differ due to obstacles, terrain, antenna orientation, interference, multipath propagation, atmospheric conditions, hardware limitations, and other environmental factors.”
        </blockquote>
        <p className="text-xs text-amber-900/80 dark:text-amber-400/90 leading-relaxed">
          In real-world deployment, engineers must incorporate <strong>Fresnel zone clearance</strong>, <strong>log-distance shadowing</strong>, <strong>two-ray ground reflection</strong>, and <strong>link fade margins</strong> (typically 10 to 20 dB) to ensure high reliability.
        </p>
      </section>

      {/* Section 27: Firebase Setup & Deployment Guide */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <Server className="w-5 h-5 text-blue-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Firebase Architecture, Setup & Deployment Guide
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          For lab instructors and evaluators, the complete deployment and configuration instructions for Firebase Authentication, Cloud Firestore, and Firebase Hosting are detailed below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              1. Create Firebase Project
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Navigate to the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">Firebase Console</a> and click "Create a Project", naming it <code>rf-range-calculator</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              2. Register Web App
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Add a Web App (<code>&lt;/&gt;</code>) inside Project Settings. Copy the generated <code>firebaseConfig</code> keys into <code>firebase-applet-config.json</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              3. Enable Email/Password Auth
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Go to Authentication → Sign-in method → Enable "Email/Password". This allows students to create individual accounts.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              4. Create Cloud Firestore
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              Under Firestore Database, click "Create database" in your preferred region. Start with production mode.
            </p>
          </div>
        </div>

        {/* Firestore Rules snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>5. Enforce Security Rules (firestore.rules)</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">Strict Per-User Isolation</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;

      match /calculations/{calculationId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow create: if request.auth != null && request.auth.uid == userId;
        allow update, delete: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`}
          </pre>
        </div>

        {/* Local Run & Deploy */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>6. Local Testing & Firebase Hosting Deployment</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <span className="text-slate-500 block mb-1"># Run locally:</span>
              npm install<br />
              npm run dev
            </div>
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              <span className="text-slate-500 block mb-1"># Deploy to Hosting:</span>
              npm run build<br />
              firebase deploy --only hosting,firestore:rules
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
