import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

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
  const [channel] = useState(() => supabase.channel("schedules"));

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

  // DB-backed sync: load from Supabase and subscribe to realtime
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) {
        setSchedules(
          data.map((r: any) => ({
            id: r.id,
            residentName: r.resident_name,
            facultyName: r.faculty_name,
            day: r.day as Day,
            clinicTime: r.clinic_time as ClinicTime,
            appointmentTime: r.appointment_time,
            patientName: r.patient_name,
            clinicNumber: r.clinic_number,
            notes: r.notes ?? undefined,
            arrived: !!r.arrived,
            seen: !!r.seen,
            createdAt: r.created_at,
          })).sort(sortEntries)
        );
      }
    };
    load();

    const ch = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'schedules' }, (payload: any) => {
        const r = payload.new;
        setSchedules((prev) => [...prev, {
          id: r.id,
          residentName: r.resident_name,
          facultyName: r.faculty_name,
          day: r.day as Day,
          clinicTime: r.clinic_time as ClinicTime,
          appointmentTime: r.appointment_time,
          patientName: r.patient_name,
          clinicNumber: r.clinic_number,
          notes: r.notes ?? undefined,
          arrived: !!r.arrived,
          seen: !!r.seen,
          createdAt: r.created_at,
        }].sort(sortEntries));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'schedules' }, (payload: any) => {
        const r = payload.new;
        setSchedules((prev) => prev.map((e) => e.id === r.id ? {
          id: r.id,
          residentName: r.resident_name,
          facultyName: r.faculty_name,
          day: r.day as Day,
          clinicTime: r.clinic_time as ClinicTime,
          appointmentTime: r.appointment_time,
          patientName: r.patient_name,
          clinicNumber: r.clinic_number,
          notes: r.notes ?? undefined,
          arrived: !!r.arrived,
          seen: !!r.seen,
          createdAt: r.created_at,
        } : e));
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(ch); } catch {}
    };
  }, []);


  useEffect(() => {
    const ch = channel;
    ch.on('broadcast', { event: 'schedule_added' }, (payload: any) => {
      const p = (payload?.payload) || payload;
      if (!p?.id) return;
      setSchedules((prev) => {
        if (prev.some((e) => e.id === p.id)) return prev;
        return [...prev, p as ScheduleEntry].sort(sortEntries);
      });
    });
    ch.on('broadcast', { event: 'schedule_updated' }, (payload: any) => {
      const p = (payload?.payload) || payload;
      if (!p?.id) return;
      setSchedules((prev) => prev.map((e) => (e.id === p.id ? { ...e, ...(p as Partial<ScheduleEntry>) } : e)));
    });
    ch.subscribe();
    return () => {
      try { ch.unsubscribe(); } catch {}
    };
  }, [channel]);

  const addEntry: ScheduleContextValue["addEntry"] = (entry) => {
    void (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const uid = userData?.user?.id;
        if (!uid) return;
        const { data } = await supabase
          .from('schedules')
          .insert({
            user_id: uid,
            resident_name: entry.residentName,
            faculty_name: entry.facultyName,
            day: entry.day,
            clinic_time: entry.clinicTime,
            appointment_time: entry.appointmentTime,
            patient_name: entry.patientName,
            clinic_number: entry.clinicNumber,
            notes: entry.notes ?? null,
          })
          .select('*')
          .maybeSingle();
        if (data) {
          setSchedules((prev) => {
            if (prev.some((e) => e.id === data.id)) return prev;
            return [...prev, {
              id: data.id,
              residentName: data.resident_name,
              facultyName: data.faculty_name,
              day: data.day as Day,
              clinicTime: data.clinic_time as ClinicTime,
              appointmentTime: data.appointment_time,
              patientName: data.patient_name,
              clinicNumber: data.clinic_number,
              notes: data.notes ?? undefined,
              arrived: !!data.arrived,
              seen: !!data.seen,
              createdAt: data.created_at,
            }].sort(sortEntries);
          });
        }
      } catch {}
    })();
  };

  const toggleArrived = (id: string, value: boolean) => {
    setSchedules((prev) => prev.map((e) => (e.id === id ? { ...e, arrived: value } : e)));
    supabase.from('schedules').update({ arrived: value }).eq('id', id).then(() => {});
  };

  const toggleSeen = (id: string, value: boolean) => {
    setSchedules((prev) => prev.map((e) => (e.id === id ? { ...e, seen: value } : e)));
    supabase.from('schedules').update({ seen: value }).eq('id', id).then(() => {});
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
