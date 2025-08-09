import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type Day = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";
export type ClinicTime = "AM" | "PM";

export interface ScheduleEntry {
  id: string;
  residentName: string;
  facultyName: string;
  day: Day;
  clinicTime: ClinicTime;
  appointmentTime: string; // HH:mm (24h)
  patientName: string;
  clinicNumber: string;
  notes?: string;
  arrived: boolean;
  seen: boolean;
  createdAt: string;
}

export interface ScheduleFilters {
  residentName?: string;
  facultyName?: string;
  day?: Day;
  clinicTime?: ClinicTime;
}

interface ScheduleContextValue {
  schedules: ScheduleEntry[];
  addEntry: (entry: Omit<ScheduleEntry, "id" | "arrived" | "seen" | "createdAt">) => void;
  toggleArrived: (id: string, value: boolean) => void;
  toggleSeen: (id: string, value: boolean) => void;
  getFiltered: (filters?: ScheduleFilters) => ScheduleEntry[];
}

const ScheduleContext = createContext<ScheduleContextValue | undefined>(undefined);

const STORAGE_KEY = "ksu-ortho-schedules";
const LAST_CLEARED_KEY = "ksu-ortho-schedules-last-cleared";

const dayOrder: Record<Day, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
};

const clinicOrder: Record<ClinicTime, number> = { AM: 0, PM: 1 };

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function sortEntries(a: ScheduleEntry, b: ScheduleEntry): number {
  if (dayOrder[a.day] !== dayOrder[b.day]) return dayOrder[a.day] - dayOrder[b.day];
  if (clinicOrder[a.clinicTime] !== clinicOrder[b.clinicTime])
    return clinicOrder[a.clinicTime] - clinicOrder[b.clinicTime];
  return timeToMinutes(a.appointmentTime) - timeToMinutes(b.appointmentTime);
}

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSchedules(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    } catch {}
  }, [schedules]);

  // Auto-clear all entries daily at 7:00 PM (local time) per device
  useEffect(() => {
    const doClear = () => {
      setSchedules([]);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        localStorage.setItem(LAST_CLEARED_KEY, String(Date.now()));
      } catch {}
    };

    const getToday7pm = () => {
      const d = new Date();
      d.setHours(19, 0, 0, 0);
      return d.getTime();
    };

    // If the app opens after today's 7 PM and wasn't cleared yet, clear immediately
    try {
      const lastCleared = Number(localStorage.getItem(LAST_CLEARED_KEY) || 0);
      const now = Date.now();
      const today7pm = getToday7pm();
      if (now >= today7pm && lastCleared < today7pm) {
        doClear();
      }
    } catch {}

    const msUntilNext7pm = () => {
      const now = new Date();
      const next = new Date();
      next.setHours(19, 0, 0, 0);
      if (now.getTime() >= next.getTime()) {
        next.setDate(next.getDate() + 1);
      }
      return next.getTime() - now.getTime();
    };

    const firstTimeout = setTimeout(() => {
      doClear();
      // subsequent clears every 24 hours
      const daily = setInterval(doClear, 24 * 60 * 60 * 1000);
      // store interval id on window for cleanup reference
      (window as any).__ksuDailyClearInterval = daily;
    }, msUntilNext7pm());

    return () => {
      clearTimeout(firstTimeout);
      const daily = (window as any).__ksuDailyClearInterval;
      if (daily) clearInterval(daily);
    };
  }, []);


  const addEntry: ScheduleContextValue["addEntry"] = (entry) => {
    const newEntry: ScheduleEntry = {
      id: uuidv4(),
      arrived: false,
      seen: false,
      createdAt: new Date().toISOString(),
      ...entry,
    };
    setSchedules((prev) => [...prev, newEntry].sort(sortEntries));
  };

  const toggleArrived = (id: string, value: boolean) => {
    setSchedules((prev) => prev.map((e) => (e.id === id ? { ...e, arrived: value } : e)));
  };

  const toggleSeen = (id: string, value: boolean) => {
    setSchedules((prev) => prev.map((e) => (e.id === id ? { ...e, seen: value } : e)));
  };

  const getFiltered: ScheduleContextValue["getFiltered"] = (filters) => {
    const filtered = schedules.filter((e) => {
      if (filters?.residentName && e.residentName !== filters.residentName) return false;
      if (filters?.facultyName && e.facultyName !== filters.facultyName) return false;
      if (filters?.day && e.day !== filters.day) return false;
      if (filters?.clinicTime && e.clinicTime !== filters.clinicTime) return false;
      return true;
    });
    return [...filtered].sort(sortEntries);
  };

  const value = useMemo(
    () => ({ schedules, addEntry, toggleArrived, toggleSeen, getFiltered }),
    [schedules]
  );

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
};

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error("useSchedule must be used within ScheduleProvider");
  return ctx;
}

export const RESIDENTS = [
  "Dr. Norah M. Alyabis",
  "Dr. Hafsah H. Alali",
  "Dr. Nada A. Alghamdi",
  "Dr. Ghadeer A. Alotaibi",
  "Dr. Atheer A. Alfarhan",
  "Dr. Faisal F. Alzamil",
  "Dr. Abeer O. Alofisan",
  "Dr. Yasmeen A. Alswaity",
  "Dr. Faisal N. Talic",
  "Dr. Third Year",
  "Dr. Turki A. Alajaji",
  "Dr. Sultan I. Alsalamah",
  "Dr. Bashayer M. Alshehry",
  "Dr. Nouf A. Bindakhil",
  "Dr. Mohammad A. Alharbi",
  "Dr. Jawaher S. Alsenaidi",
  "Dr. Ahmed M. Alsaleh",
  "Dr. Nouf F. Alfawaz",
  "Dr. Shaima E. Alabdulkareem",
  "Dr. Saad A. Albwardi",
  "Dr. Alhanouf A. Alnowaiser",
  "Dr. Nawaf A. Alfawaz",
  "Dr. Ziyad M. Aldoghan",
];

export const FACULTY = [
  "PROF. ADEL ALHDLAQ",
  "PROF. ABDULLAH ALDREES",
  "PROF. MOSHABAB ALASIRY",
  "PROF. NASSER ALQAHTANI",
  "PROF. NAIF BINDAYEL",
  "PROF. NABEEL TALIC",
  "PROF. ALJAZI ALDWEESH",
  "PROF. SAHAR ALBARAKATI",
  "PROF. LAILA BAIDAS",
  "PROF. HUDA ALKAWARI",
  "DR. KHALID ALMOAMMAR",
  "DR. MOHAMMAD ALDOSARI",
  "DR. NAIF ALMOSA",
  "DR. ABDULAZIZ ALMUDHI",
  "DR. ABDURAHMAN ALWADEI",
  "DR. EMAN ALSHAYEA",
  "DR. SARAH ALFAQEEH",
  "DR. NADA ALSHIHA",
  "DR. TAGHREED ALYOUSEF",
  "DR. RANA ALTURKI",
  "DR. RAWAN NAGHSABANDI",
  "DR. HESSAH ALHWAISH",
  "DR. FAIZA ALOTAIBI",
  "DR. ALANOUD ALMODIMIGH",
];

export const DAYS: Day[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
export const CLINIC_TIMES: ClinicTime[] = ["AM", "PM"];
export const APPOINTMENT_TIMES: string[] = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];
