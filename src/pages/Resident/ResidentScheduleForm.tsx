import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { APPOINTMENT_TIMES, CLINIC_TIMES, DAYS, FACULTY, RESIDENTS, useSchedule } from "@/context/ScheduleContext";

export default function ResidentScheduleForm() {
  const { addEntry } = useSchedule();
  const { toast } = useToast();

  const [residentName, setResidentName] = useState(RESIDENTS[0] ?? "");
  const [facultyName, setFacultyName] = useState(FACULTY[0] ?? "");
  const [day, setDay] = useState(DAYS[0]);
  const [clinicTime, setClinicTime] = useState(CLINIC_TIMES[0]);
  const [appointmentTime, setAppointmentTime] = useState(APPOINTMENT_TIMES[0]);
  const [patientName, setPatientName] = useState("");
  const [clinicNumber, setClinicNumber] = useState("");
  const [notes, setNotes] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName || !facultyName || !patientName || !clinicNumber) {
      toast({ title: "Missing fields", description: "Please complete all required fields." });
      return;
    }
    addEntry({ residentName, facultyName, day, clinicTime, appointmentTime, patientName, clinicNumber, notes });
    toast({ title: "Schedule added", description: `${patientName} at ${appointmentTime}` });
    setPatientName("");
    setClinicNumber("");
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Resident Schedule Form" />
      <main className="container mx-auto p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Resident Name</Label>
              <Select value={residentName} onValueChange={setResidentName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resident" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {RESIDENTS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Faculty</Label>
              <Select value={facultyName} onValueChange={setFacultyName}>
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {FACULTY.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={day} onValueChange={(v) => setDay(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    {DAYS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Clinic Time</Label>
                <Select value={clinicTime} onValueChange={(v) => setClinicTime(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    {CLINIC_TIMES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Appointment Time</Label>
              <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="z-50 max-h-64">
                  {APPOINTMENT_TIMES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Patient name" />
            </div>

            <div className="space-y-2">
              <Label>Clinic Number</Label>
              <Input value={clinicNumber} onChange={(e) => setClinicNumber(e.target.value)} placeholder="e.g. C-12" />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes" />
            </div>
          </div>

          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </main>
    </div>
  );
}
