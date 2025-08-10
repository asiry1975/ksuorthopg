import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { APPOINTMENT_TIMES, CLINIC_TIMES, DAYS, FACULTY, useSchedule } from "@/context/ScheduleContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

export default function ResidentScheduleFormTest() {
  const { addEntry } = useSchedule();
  const { toast } = useToast();

  // Default to a placeholder until auth is wired up; will be replaced by logged-in resident's name
  const [residentName, setResidentName] = useState<string>("Test Resident");
  const [facultyName, setFacultyName] = useState(FACULTY[0] ?? "");
  const [day, setDay] = useState(DAYS[0]);
  const [clinicTime, setClinicTime] = useState(CLINIC_TIMES[0]);
  const [appointmentTime, setAppointmentTime] = useState(APPOINTMENT_TIMES[0]);
  const [patientName, setPatientName] = useState("");
  const [clinicNumber, setClinicNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [touchedPatientName, setTouchedPatientName] = useState(false);
  const [touchedClinicNumber, setTouchedClinicNumber] = useState(false);

  useEffect(() => {
    document.title = "Resident Schedule Form Test";
    // Try to read the logged-in user's name (optional for now)
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (user) {
        const name = (user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || user.email || "Test Resident";
        setResidentName(name);
      }
    }).catch(() => {
      // ignore errors in test mode
    });
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!residentName || !facultyName || !patientName.trim() || !clinicNumber.trim()) {
      setShowErrors(true);
      setTouchedPatientName(true);
      setTouchedClinicNumber(true);
      toast({ title: "Missing fields", description: "Please complete all required fields." });
      return;
    }
    addEntry({ residentName, facultyName, day, clinicTime, appointmentTime, patientName, clinicNumber, notes });
    toast({ title: "Schedule added", description: `${patientName} at ${appointmentTime}` });
    setIsDialogOpen(true);
    setPatientName("");
    setClinicNumber("");
    setNotes("");
  };

  const isMissingPatient = patientName.trim().length === 0;
  const isMissingClinic = clinicNumber.trim().length === 0;
  const isValid = Boolean(residentName && facultyName && !isMissingPatient && !isMissingClinic);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Resident Schedule Form Test" />
      <main className="container mx-auto p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Resident from login (read-only) */}
            <div className="space-y-2">
              <Label>Resident</Label>
              <Input value={residentName} readOnly aria-readonly placeholder="Resident from login" />
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
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                onBlur={() => setTouchedPatientName(true)}
                placeholder="Patient name"
                required
                aria-invalid={(showErrors || touchedPatientName) && isMissingPatient}
                className={`${(showErrors || touchedPatientName) && isMissingPatient ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {((showErrors || touchedPatientName) && isMissingPatient) && (
                <p className="text-destructive text-sm">Patient name is required.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Clinic Number</Label>
              <Input
                value={clinicNumber}
                onChange={(e) => setClinicNumber(e.target.value)}
                onBlur={() => setTouchedClinicNumber(true)}
                placeholder="e.g. C-12"
                required
                aria-invalid={(showErrors || touchedClinicNumber) && isMissingClinic}
                className={`${(showErrors || touchedClinicNumber) && isMissingClinic ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {((showErrors || touchedClinicNumber) && isMissingClinic) && (
                <p className="text-destructive text-sm">Clinic number is required.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes" />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!isValid} aria-disabled={!isValid}>Submit</Button>
        </form>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Schedule submitted</DialogTitle>
              <DialogDescription>
                Your entry has been added successfully. You can close this dialog to continue.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
