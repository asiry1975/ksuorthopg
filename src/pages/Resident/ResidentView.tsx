import AppHeader from "@/components/AppHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CLINIC_TIMES, DAYS, RESIDENTS, ScheduleEntry, useSchedule, type Day, type ClinicTime } from "@/context/ScheduleContext";
import { useMemo, useState } from "react";

export default function ResidentView() {
  const { getFiltered, toggleArrived } = useSchedule();

  const [residentName, setResidentName] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [clinicTime, setClinicTime] = useState<string>("");
  const [search, setSearch] = useState("");

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

  const onArrivedChange = (row: ScheduleEntry, checked: boolean) => {
    toggleArrived(row.id, !!checked);
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
                <TableHead>Resident</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox checked={row.arrived} onCheckedChange={(c) => onArrivedChange(row, !!c)} />
                  </TableCell>
                  <TableCell>{row.residentName}</TableCell>
                  <TableCell>{row.patientName}</TableCell>
                  <TableCell>{row.day}</TableCell>
                  <TableCell>{row.clinicTime}</TableCell>
                  <TableCell>{row.appointmentTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </div>
  );
}
