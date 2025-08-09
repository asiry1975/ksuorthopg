import AppHeader from "@/components/AppHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLINIC_TIMES, DAYS, FACULTY, ScheduleEntry, useSchedule, type Day, type ClinicTime } from "@/context/ScheduleContext";
import { useMemo, useState } from "react";

export default function FacultyView() {
  const { getFiltered, toggleSeen } = useSchedule();

  const [facultyName, setFacultyName] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [clinicTime, setClinicTime] = useState<string>("");
  const [search, setSearch] = useState("");

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
                <TableHead>Faculty</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Clinic #</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Arrived</TableHead>
                <TableHead className="text-right">Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.facultyName}</TableCell>
                  <TableCell>{row.residentName}</TableCell>
                  <TableCell>{row.clinicTime}</TableCell>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.appointmentTime}</TableCell>
                  <TableCell>{row.patientName}</TableCell>
                  <TableCell>{row.clinicNumber}</TableCell>
                  <TableCell className="max-w-[160px] truncate" title={row.notes}>{row.notes}</TableCell>
                  <TableCell><Checkbox checked={row.arrived} disabled /></TableCell>
                  <TableCell className="text-right">
                    <Checkbox checked={row.seen} onCheckedChange={(c) => onSeenChange(row, !!c)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}
