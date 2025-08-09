import AppHeader from "@/components/AppHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLINIC_TIMES, DAYS, RESIDENTS, ScheduleEntry, useSchedule, type Day, type ClinicTime } from "@/context/ScheduleContext";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ResidentView() {
  const { getFiltered, toggleArrived } = useSchedule();

  const [residentName, setResidentName] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [clinicTime, setClinicTime] = useState<string>("");
  const [search, setSearch] = useState("");
  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [arrivalEntry, setArrivalEntry] = useState<ScheduleEntry | null>(null);

  const rows = useMemo(() => {
    const filters = {
      residentName: residentName || undefined,
      day: (day as Day) || undefined,
      clinicTime: (clinicTime as ClinicTime) || undefined,
    };
    const list = getFiltered(filters);
    if (!search) return list;
    return list.filter((e) => e.patientName.toLowerCase().includes(search.toLowerCase()))
  }, [getFiltered, residentName, day, clinicTime, search]);

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
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      o.start();
      o.stop(ctx.currentTime + 0.32);
    } catch {}
  };

  const onArrivedChange = (row: ScheduleEntry, checked: boolean) => {
    toggleArrived(row.id, !!checked);
    if (checked) {
      playArrivalSound();
      setArrivalEntry(row);
      setArrivalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Resident View" />
      <main className="container mx-auto p-4 space-y-4">
        <section className="rounded-lg border p-3 grid grid-cols-2 gap-3">
          <div className="space-y-1 col-span-2">
            <Label>Search Patient</Label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by patient name" />
          </div>
          <div className="space-y-1">
            <Label>Resident</Label>
            <Select value={residentName} onValueChange={(v) => setResidentName(v === "ALL" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="ALL">All</SelectItem>
                {RESIDENTS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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
            <Label>Clinic Time</Label>
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
                <TableHead>Resident</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Clinic Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox checked={row.arrived} onCheckedChange={(c) => onArrivedChange(row, !!c)} />
                  </TableCell>
                  <TableCell>{row.residentName}</TableCell>
                  <TableCell>{row.facultyName}</TableCell>
                  <TableCell>{row.appointmentTime}</TableCell>
                  <TableCell>{row.patientName}</TableCell>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.clinicTime}</TableCell>
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
                The following patient has arrived. Please proceed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1 text-foreground">
              <p><span className="font-medium">Instructor:</span> {arrivalEntry?.facultyName}</p>
              <p><span className="font-medium">Resident:</span> {arrivalEntry?.residentName}</p>
              <p><span className="font-medium">Clinic number:</span> {arrivalEntry?.clinicNumber}</p>
              <p><span className="font-medium">Patient:</span> {arrivalEntry?.patientName}</p>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
