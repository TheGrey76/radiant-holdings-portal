import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ReminderTemplatesProps {
  reminderType: 'no_contact' | 'hot_inactive' | 'follow_up_missed';
  investorName: string;
  onSelectTemplate: (subject: string, content: string) => void;
}

const TEMPLATES = {
  no_contact: [
    {
      name: "Re-engagement gentile",
      subject: "Un aggiornamento per lei",
      content: `Gentile {nome},

spero che tutto proceda al meglio. Volevo ricontattarla per aggiornarla sugli sviluppi recenti di ABC Company e capire se ci sono novità dal suo lato.

Sarebbe disponibile per una breve chiamata questa settimana?

Cordiali saluti`,
    },
    {
      name: "Condivisione novità",
      subject: "Novità importanti - ABC Company",
      content: `Gentile {nome},

è passato un po' di tempo dal nostro ultimo contatto e volevo condividere con lei alcune novità significative riguardo ABC Company.

Mi farebbe piacere organizzare una call per illustrarle gli aggiornamenti.

A presto`,
    },
  ],
  hot_inactive: [
    {
      name: "Follow-up urgente",
      subject: "Seguito alla nostra conversazione",
      content: `Gentile {nome},

ho notato che non abbiamo avuto modo di sentirci recentemente dopo il nostro ultimo scambio positivo.

Vorrei capire se ci sono domande o dubbi che posso chiarire, o se preferisce procedere con i prossimi passi.

Resto a disposizione per una chiamata quando preferisce.

Cordiali saluti`,
    },
    {
      name: "Proposta meeting",
      subject: "Proposta incontro - ABC Company",
      content: `Gentile {nome},

dato l'interesse mostrato per il progetto, vorrei proporle un incontro per approfondire i dettagli dell'opportunità.

Quali sono le sue disponibilità per questa o la prossima settimana?

Cordiali saluti`,
    },
  ],
  follow_up_missed: [
    {
      name: "Recupero appuntamento",
      subject: "Riprogrammiamo la nostra call?",
      content: `Gentile {nome},

mi rendo conto che avevamo programmato un contatto che non siamo riusciti a portare a termine.

Vorrei riproporle un appuntamento in un momento più comodo per lei. Quali sono le sue disponibilità?

Cordiali saluti`,
    },
  ],
};

export const ReminderTemplates = ({
  reminderType,
  investorName,
  onSelectTemplate,
}: ReminderTemplatesProps) => {
  const templates = TEMPLATES[reminderType] || TEMPLATES.no_contact;

  const handleSelect = (template: typeof templates[0]) => {
    const content = template.content.replace(/{nome}/g, investorName.split(' ')[0]);
    onSelectTemplate(template.subject, content);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Template email suggeriti">
          <Mail className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium">Template suggeriti</p>
          <div className="space-y-1">
            {templates.map((template, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => handleSelect(template)}
              >
                <div>
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {template.subject}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
