import AppHeader from "@/components/AppHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLINIC_TIMES, DAYS, FACULTY, ScheduleEntry, useSchedule, type Day, type ClinicTime } from "@/context/ScheduleContext";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
export default function FacultyView() {
  const { getFiltered, toggleSeen } = useSchedule();
  const { user } = useAuth();

  const [facultyName, setFacultyName] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [clinicTime, setClinicTime] = useState<string>("");
  const [search, setSearch] = useState("");

  const myFacultyName = useMemo(() => {
    const um: any = user?.user_metadata || {};
    return (
      um.display_name || um.full_name || um.name || user?.email || ""
    );
  }, [user]);

  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [arrivalPayload, setArrivalPayload] = useState<any>(null);

  const rows = useMemo(() => {
    const filters = {
      facultyName: facultyName || undefined,
      day: (day as Day) || undefined,
      clinicTime: (clinicTime as ClinicTime) || undefined,
    };
    const list = getFiltered(filters);
    if (!search) return list;
    return list.filter((e) => e.patientName.toLowerCase().includes(search.toLowerCase()))
  }, [getFiltered, facultyName, day, clinicTime, search]);

  const onSeenChange = (row: ScheduleEntry, checked: boolean) => {
    toggleSeen(row.id, !!checked);
  };

  const playArrivalSound = () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      o.start();
      o.stop(ctx.currentTime + 0.62);
    } catch {}
  };

  useEffect(() => {
    const ch = supabase.channel('arrivals');
    ch.on('broadcast', { event: 'patient_arrived' }, (payload: any) => {
      const p = (payload?.payload) || payload;
      if (!p?.facultyName || !myFacultyName) return;
      if (String(p.facultyName).toLowerCase() !== String(myFacultyName).toLowerCase()) return;
      setArrivalPayload(p);
      setArrivalOpen(true);
      playArrivalSound();
    });
    ch.subscribe();
    return () => {
      try { ch.unsubscribe(); } catch {}
    };
  }, [myFacultyName]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Faculty View" />
      <main className="container mx-auto p-4 space-y-4">
        <section className="rounded-lg border p-3 grid grid-cols-2 gap-3">
          <div className="space-y-1 col-span-2">
            <Label>Search Patient</Label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by patient name" />
          </div>
          <div className="space-y-1">
            <Label>Faculty</Label>
            <Select value={facultyName} onValueChange={(v) => setFacultyName(v === "ALL" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="ALL">All</SelectItem>
                {FACULTY.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Day</Label>
            <Select value={day} onValueChange={(v) => setDay(v === "ALL" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="ALL">All</SelectItem>
                {DAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Clinic</Label>
            <Select value={clinicTime} onValueChange={(v) => setClinicTime(v === "ALL" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="ALL">All</SelectItem>
                {CLINIC_TIMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arrived</TableHead>
                <TableHead>Seen</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Clinic #</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox checked={row.arrived} disabled />
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={row.seen} onCheckedChange={(c) => onSeenChange(row, !!c)} />
                  </TableCell>
                  <TableCell>{row.facultyName}</TableCell>
                  <TableCell>{row.residentName}</TableCell>
                  <TableCell>{row.clinicTime}</TableCell>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.appointmentTime}</TableCell>
                  <TableCell>{row.patientName}</TableCell>
                  <TableCell>{row.clinicNumber}</TableCell>
                  <TableCell className="max-w-[160px] truncate" title={row.notes}>{row.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <Dialog open={arrivalOpen} onOpenChange={setArrivalOpen}>
          <DialogContent className="sm:max-w-lg md:max-w-xl">
            <DialogHeader>
              <DialogTitle>Patient arrived</DialogTitle>
              <DialogDescription>
                The following patient has arrived for your clinic.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1 text-foreground">
              <p><span className="font-medium">Instructor:</span> {arrivalPayload?.facultyName}</p>
              <p><span className="font-medium">Resident:</span> {arrivalPayload?.residentName}</p>
              <p><span className="font-medium">Clinic number:</span> {arrivalPayload?.clinicNumber}</p>
              <p><span className="font-medium">Patient:</span> {arrivalPayload?.patientName}</p>
              <p><span className="font-medium">Time:</span> {arrivalPayload?.appointmentTime} ({arrivalPayload?.day} {arrivalPayload?.clinicTime})</p>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="secondary" onClick={() => setArrivalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
       </main>
     </div>
   );
 }
