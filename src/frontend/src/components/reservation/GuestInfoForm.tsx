import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export interface GuestInfoErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface GuestInfoFormProps {
  values: GuestInfo;
  errors: GuestInfoErrors;
  onChange: (values: GuestInfo) => void;
}

export function GuestInfoForm({
  values,
  errors,
  onChange,
}: GuestInfoFormProps) {
  const set =
    (field: keyof GuestInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...values, [field]: e.target.value });

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label
          htmlFor="guest-name"
          className="font-body text-sm font-semibold text-foreground"
        >
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="guest-name"
          data-ocid="reservation.name_input"
          placeholder="e.g. James Harrison"
          value={values.name}
          onChange={set("name")}
          className={
            errors.name
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.name && (
          <p
            className="text-xs text-destructive"
            data-ocid="reservation.name_input.field_error"
          >
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="guest-email"
          className="font-body text-sm font-semibold text-foreground"
        >
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="guest-email"
          type="email"
          data-ocid="reservation.email_input"
          placeholder="james@example.com"
          value={values.email}
          onChange={set("email")}
          className={
            errors.email
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.email && (
          <p
            className="text-xs text-destructive"
            data-ocid="reservation.email_input.field_error"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="guest-phone"
          className="font-body text-sm font-semibold text-foreground"
        >
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="guest-phone"
          type="tel"
          data-ocid="reservation.phone_input"
          placeholder="+44 7700 900000"
          value={values.phone}
          onChange={set("phone")}
          className={
            errors.phone
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }
        />
        {errors.phone && (
          <p
            className="text-xs text-destructive"
            data-ocid="reservation.phone_input.field_error"
          >
            {errors.phone}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="special-requests"
          className="font-body text-sm font-semibold text-foreground"
        >
          Special Requests{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="special-requests"
          data-ocid="reservation.special_requests_textarea"
          placeholder="Allergies, dietary requirements, anniversary celebrations, high chairs..."
          value={values.specialRequests}
          onChange={set("specialRequests")}
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );
}
