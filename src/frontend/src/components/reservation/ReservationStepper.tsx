import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description: string;
}

const STEPS: Step[] = [
  { label: "Date & Time", description: "Choose when" },
  { label: "Your Details", description: "Guest info" },
  { label: "Confirm", description: "Review & book" },
];

interface ReservationStepperProps {
  currentStep: number;
}

export function ReservationStepper({ currentStep }: ReservationStepperProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto">
      {STEPS.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-smooth",
                  isCompleted && "bg-primary text-primary-foreground",
                  isActive &&
                    "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted &&
                    !isActive &&
                    "bg-muted text-muted-foreground border border-border",
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    "text-xs font-semibold font-body",
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-shrink-0 h-0.5 w-8 sm:w-12 mb-6 transition-smooth",
                  stepNum < currentStep ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
