import { DollarSign, CheckCircle } from 'lucide-react';

interface CaseWorthCardProps {
  questionnaireUrl: string;
}

export function CaseWorthCard({ questionnaireUrl }: CaseWorthCardProps) {
  return (
    <div className="bg-card backdrop-blur-xl rounded-xl shadow-card border-2 border-card-border overflow-hidden">
      {/* Header with accent background */}
      <div className="bg-gradient-gold p-6 text-center">
        <DollarSign className="w-10 h-10 text-primary mx-auto mb-2" />
        <h3 className="text-xl font-bold text-primary">
          What&apos;s My Case Worth?
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-text-muted mb-6 text-center">
          Answer a few simple questions to get an instant estimate of your
          potential settlement value.
        </p>

        <a
          href={questionnaireUrl}
          className="block w-full bg-primary text-text font-bold py-3 px-4 rounded-lg hover:bg-primary/80 transition-colors shadow-md text-center"
        >
          Start Free Calculator
        </a>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>No contact info required</span>
        </div>
      </div>
    </div>
  );
}
