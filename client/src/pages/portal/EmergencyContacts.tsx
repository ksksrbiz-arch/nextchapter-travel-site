import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  AlertTriangle,
  Save,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getSafeTelHref = (phone: string) => {
    // Allow only characters that are valid for a telephone URI
    const sanitized = phone.replace(/[^0-9+\-()\s]/g, "");
    return `tel:${sanitized}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.relationship)
      newErrors.relationship = "Relationship required";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    if (!/^\+?[\d\s\-()]+$/.test(formData.phone))
      newErrors.phone = "Invalid phone format";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContact = () => {
    if (!validateForm()) return;

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: formData.name,
      relationship: formData.relationship,
      phone: formData.phone,
      email: formData.email || undefined,
      address: formData.address || undefined,
      isPrimary: contacts.length === 0,
    };

    setContacts([newContact, ...contacts]);
    setFormData({
      name: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    setContacts(
      contacts.map(c => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
  };

  const primaryContact = contacts.find(c => c.isPrimary);

  return (
    <div className="space-y-6">
      {/* Primary Contact Highlight */}
      {primaryContact && (
        <Card className="bg-gradient-to-br from-red-950/30 to-orange-950/30 border-red-500/20 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                PRIMARY EMERGENCY CONTACT
              </p>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {primaryContact.name}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={getSafeTelHref(primaryContact.phone)}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {primaryContact.phone}
                  </a>
                </div>
                {primaryContact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`mailto:${primaryContact.email}`}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {primaryContact.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Add Contact Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Emergency Contact
        </Button>
      )}

      {/* Add Contact Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">New Emergency Contact</h3>

          <div className="space-y-4">
            <FormFieldWrapper error={errors.name}>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.relationship}>
              <input
                type="text"
                placeholder="Relationship (e.g., parent, spouse, friend)"
                value={formData.relationship}
                onChange={e => {
                  setFormData({ ...formData, relationship: e.target.value });
                  setErrors({ ...errors, relationship: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.phone}>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={e => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <input
              type="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <textarea
              placeholder="Address (optional)"
              value={formData.address}
              onChange={e =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              rows={2}
            />

            <div className="flex gap-3">
              <Button onClick={handleAddContact} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Contact
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

      {/* Contacts List */}
      {contacts.length > 0 ? (
        <div className="space-y-3">
          {contacts.map(contact => (
            <Card
              key={contact.id}
              className={`p-4 border-border/50 ${contact.isPrimary ? "ring-2 ring-red-500/50" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-foreground">
                      {contact.name}
                    </h4>
                    {contact.isPrimary && (
                      <Badge variant="destructive" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {contact.relationship}
                  </p>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-xs hover:text-primary transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-xs hover:text-primary transition-colors"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                        <span className="text-xs text-muted-foreground">
                          {contact.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {!contact.isPrimary && (
                <button
                  onClick={() => handleSetPrimary(contact.id)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Set as Primary
                </button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Phone}
            title="No Emergency Contacts"
            description="Add at least one trusted contact for emergencies"
            action={{ label: "Add Contact", onClick: () => setShowForm(true) }}
          />
        )
      )}

      {/* Safety Tips */}
      <Card className="border-emerald-500/20 bg-emerald-950/20 p-4">
        <h4 className="font-medium text-sm text-emerald-400 mb-3">
          🛡️ Safety Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Keep at least 2 trusted contacts on file</li>
          <li>• Share your itinerary with your primary contact</li>
          <li>• Check in regularly during your trip</li>
          <li>• Include both local and international contacts</li>
          <li>• Save embassy contact info for your destination</li>
        </ul>
      </Card>
    </div>
  );
}
