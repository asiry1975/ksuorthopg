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
  "Resident A",
  "Resident B",
  "Resident C",
];

export const FACULTY = [
  "Dr. Ahmed",
  "Dr. Sara",
  "Dr. Omar",
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
