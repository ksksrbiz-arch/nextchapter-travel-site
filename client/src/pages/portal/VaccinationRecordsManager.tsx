import { useState } from "react";
import {
  Heart,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Syringe,
  FileText,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface VaccinationRecord {
  id: string;
  vaccineName: string;
  disease: string;
  dateAdministered: string;
  nextDoseDate?: string;
  provider: string;
  location: string;
  batchNumber?: string;
  arm: string;
  notes?: string;
  certificateId?: string;
  countryRequired?: string;
}

const VACCINE_TYPES = [
  "COVID-19 (Pfizer)",
  "COVID-19 (Moderna)",
  "COVID-19 (Johnson & Johnson)",
  "Typhoid",
  "Yellow Fever",
  "Hepatitis A",
  "Hepatitis B",
  "Japanese Encephalitis",
  "Rabies",
  "Tetanus",
  "Polio",
  "Measles/MMR",
  "Varicella (Chickenpox)",
  "Meningococcal",
  "Pneumococcal",
];

const DISEASE_COVERAGE: Record<string, string[]> = {
  "COVID-19": ["COVID-19 endemic areas"],
  "Yellow Fever": ["Africa", "South America", "Southeast Asia"],
  Typhoid: ["South/Southeast Asia", "Africa", "Latin America"],
  "Hepatitis A": ["Most developing countries"],
  "Hepatitis B": ["Recommended for all travelers"],
  "Japanese Encephalitis": ["Southeast/East Asia"],
  Rabies: ["Areas with high rabies risk"],
  Tetanus: ["Recommended for all travelers"],
  Polio: ["Endemic in Afghanistan/Pakistan"],
};

export function VaccinationRecordsManager() {
  const [records, setRecords] = useState<VaccinationRecord[]>([
    {
      id: "1",
      vaccineName: "COVID-19 Booster (Moderna)",
      disease: "COVID-19",
      dateAdministered: "2025-09-15",
      nextDoseDate: "2026-03-15",
      provider: "CVS Pharmacy",
      location: "New York, NY",
      batchNumber: "EL5319",
      arm: "Left",
      certificateId: "NYC-COVID-2025-123456",
      countryRequired: "Most countries",
    },
    {
      id: "2",
      vaccineName: "Yellow Fever",
      disease: "Yellow Fever",
      dateAdministered: "2024-12-01",
      provider: "Travel Clinic International",
      location: "San Francisco, CA",
      batchNumber: "YF456789",
      arm: "Right",
      certificateId: "ICV-2024-YF-987654",
      countryRequired: "Africa, South America",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: "",
    disease: "",
    dateAdministered: "",
    nextDoseDate: "",
    provider: "",
    location: "",
    batchNumber: "",
    arm: "Left",
    certificateId: "",
    countryRequired: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.vaccineName) newErrors.vaccineName = "Vaccine name required";
    if (!formData.disease) newErrors.disease = "Disease required";
    if (!formData.dateAdministered)
      newErrors.dateAdministered = "Date administered required";
    if (!formData.provider) newErrors.provider = "Provider required";
    if (!formData.location) newErrors.location = "Location required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRecord = () => {
    if (!validateForm()) return;

    const newRecord: VaccinationRecord = {
      id: Date.now().toString(),
      vaccineName: formData.vaccineName,
      disease: formData.disease,
      dateAdministered: formData.dateAdministered,
      nextDoseDate: formData.nextDoseDate,
      provider: formData.provider,
      location: formData.location,
      batchNumber: formData.batchNumber,
      arm: formData.arm,
      certificateId: formData.certificateId,
      countryRequired: formData.countryRequired,
    };

    setRecords([newRecord, ...records]);
    setFormData({
      vaccineName: "",
      disease: "",
      dateAdministered: "",
      nextDoseDate: "",
      provider: "",
      location: "",
      batchNumber: "",
      arm: "Left",
      certificateId: "",
      countryRequired: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const isExpiringSoon = (nextDate?: string) => {
    if (!nextDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(nextDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  const isUpcoming = (nextDate?: string) => {
    if (!nextDate) return false;
    const daysUntilDue = Math.ceil(
      (new Date(nextDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilDue > 30;
  };

  const getDiseaseColor = (disease: string) => {
    const colors: Record<string, string> = {
      "COVID-19": "bg-blue-500/20 text-blue-300",
      "Yellow Fever": "bg-yellow-500/20 text-yellow-300",
      Typhoid: "bg-green-500/20 text-green-300",
      "Hepatitis A": "bg-orange-500/20 text-orange-300",
      "Hepatitis B": "bg-orange-500/20 text-orange-300",
      "Japanese Encephalitis": "bg-red-500/20 text-red-300",
    };
    return colors[disease] || "bg-purple-500/20 text-purple-300";
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-br from-emerald-950/30 to-teal-950/30 border-emerald-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Vaccination Status
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Vaccines</p>
            <p className="text-2xl font-bold text-foreground">
              {records.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-emerald-500/30">
            <p className="text-xs text-emerald-300">Up to Date</p>
            <p className="text-2xl font-bold text-emerald-400">
              {
                records.filter(
                  r => !r.nextDoseDate || new Date(r.nextDoseDate) > new Date()
                ).length
              }
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-amber-500/30">
            <p className="text-xs text-amber-300">Pending</p>
            <p className="text-2xl font-bold text-amber-400">
              {
                records.filter(
                  r =>
                    r.nextDoseDate &&
                    new Date(r.nextDoseDate) <=
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                ).length
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Add Record Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Vaccination Record
        </Button>
      )}

      {/* Add Record Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">New Vaccination Record</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.vaccineName}>
                <select
                  value={formData.vaccineName}
                  onChange={e => {
                    setFormData({ ...formData, vaccineName: e.target.value });
                    setErrors({ ...errors, vaccineName: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="">Select Vaccine</option>
                  {VACCINE_TYPES.map(vaccine => (
                    <option key={vaccine} value={vaccine}>
                      {vaccine}
                    </option>
                  ))}
                </select>
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.disease}>
                <input
                  type="text"
                  placeholder="Disease/Condition"
                  value={formData.disease}
                  onChange={e => {
                    setFormData({ ...formData, disease: e.target.value });
                    setErrors({ ...errors, disease: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.dateAdministered}>
                <input
                  type="date"
                  value={formData.dateAdministered}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      dateAdministered: e.target.value,
                    });
                    setErrors({ ...errors, dateAdministered: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <input
                type="date"
                placeholder="Next Dose Date"
                value={formData.nextDoseDate}
                onChange={e =>
                  setFormData({ ...formData, nextDoseDate: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.provider}>
                <input
                  type="text"
                  placeholder="Healthcare Provider"
                  value={formData.provider}
                  onChange={e => {
                    setFormData({ ...formData, provider: e.target.value });
                    setErrors({ ...errors, provider: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.location}>
                <input
                  type="text"
                  placeholder="Location (City, State)"
                  value={formData.location}
                  onChange={e => {
                    setFormData({ ...formData, location: e.target.value });
                    setErrors({ ...errors, location: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Batch Number (optional)"
                value={formData.batchNumber}
                onChange={e =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />

              <select
                value={formData.arm}
                onChange={e =>
                  setFormData({ ...formData, arm: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="Left">Left Arm</option>
                <option value="Right">Right Arm</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Certificate ID (optional)"
              value={formData.certificateId}
              onChange={e =>
                setFormData({ ...formData, certificateId: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <input
              type="text"
              placeholder="Countries/Regions Required (optional)"
              value={formData.countryRequired}
              onChange={e =>
                setFormData({ ...formData, countryRequired: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <div className="flex gap-3">
              <Button onClick={handleAddRecord} className="flex-1">
                Add Record
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Records List */}
      {records.length > 0 ? (
        <div className="space-y-3">
          {records.map(record => (
            <Card key={record.id} className="p-4 border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Syringe className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">
                      {record.vaccineName}
                    </h4>
                    <Badge
                      className={`text-xs ${getDiseaseColor(record.disease)}`}
                    >
                      {record.disease}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {record.provider}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteRecord(record.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Alert if expiring soon */}
              {isExpiringSoon(record.nextDoseDate) && (
                <div className="mb-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">Next dose due soon</p>
                </div>
              )}

              {/* Record Details */}
              <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-black/20 rounded-lg text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Administered</p>
                  <p className="font-medium text-foreground">
                    {new Date(record.dateAdministered).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">
                    {record.location}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Arm</p>
                  <p className="font-medium text-foreground">{record.arm}</p>
                </div>

                {record.nextDoseDate && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Next Dose</p>
                    <p
                      className={`font-medium ${isUpcoming(record.nextDoseDate) ? "text-amber-400" : "text-foreground"}`}
                    >
                      {new Date(record.nextDoseDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-xs">
                {record.batchNumber && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Batch:</span>
                    <span className="font-mono text-foreground">
                      {record.batchNumber}
                    </span>
                  </div>
                )}

                {record.certificateId && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Certificate:</span>
                    <span className="font-mono text-foreground">
                      {record.certificateId}
                    </span>
                  </div>
                )}

                {record.countryRequired && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Required for:</span>
                    <span className="text-foreground">
                      {record.countryRequired}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Heart}
            title="No Vaccination Records"
            description="Store and track your vaccination records for travel"
            action={{ label: "Add Record", onClick: () => setShowForm(true) }}
          />
        )
      )}
    </div>
  );
}
