import { ArrowRight } from 'lucide-react';

interface InlineCTAProps {
  questionnaireUrl: string;
  categoryName?: string | null;
}

export function InlineCTA({ questionnaireUrl, categoryName }: InlineCTAProps) {
  const title = categoryName
    ? `Affected by a ${categoryName} Issue?`
    : 'Find Out What Your Case Is Worth';

  return (
    <div className="my-10 p-6 bg-card backdrop-blur-xl rounded-xl border-2 border-accent/40 shadow-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-text mb-2">{title}</h4>
          <p className="text-sm text-text-muted">
            Our specialized tool can help you estimate the potential worth of
            your case based on current laws and precedents.
          </p>
        </div>
        <a
          href={questionnaireUrl}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-primary font-bold py-3 px-6 rounded-lg shadow-md transition-colors group"
        >
          Check Case Worth
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
