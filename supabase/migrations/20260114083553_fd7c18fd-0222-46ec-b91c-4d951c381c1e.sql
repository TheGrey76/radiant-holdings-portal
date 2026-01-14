
INSERT INTO abc_followup_sequences (
  name,
  description,
  trigger_type,
  trigger_days,
  steps,
  is_active
) VALUES (
  'Re-engagement Non-Aperture',
  'Sequenza automatica per investitori che non aprono le email. Attivata dopo 3 giorni di inattività con follow-up a 5, 10 e 15 giorni.',
  'no_open',
  3,
  '[
    {
      "day": 5,
      "subject": "📊 Aggiornamento esclusivo per te",
      "content": "Gentile {{nome}},\n\nAbbiamo notato che potresti esserti perso il nostro ultimo aggiornamento. Ecco un riepilogo delle opportunità più rilevanti per il tuo profilo:\n\n• Nuove opportunità di investimento in settori strategici\n• Performance aggiornate del nostro portafoglio\n• Accesso prioritario a deal esclusivi\n\nSaremmo lieti di organizzare una call per approfondire.\n\nCordiali saluti,\nABC Company Team"
    },
    {
      "day": 10,
      "subject": "🎯 Ultima opportunità: Deal in chiusura",
      "content": "Gentile {{nome}},\n\nVolevamo informarti che alcune delle opportunità che ti abbiamo presentato sono in fase di chiusura.\n\nI posti disponibili sono limitati e vorremmo assicurarci che tu abbia tutte le informazioni necessarie per valutare.\n\n📞 Prenota una call di 15 minuti con il nostro team per una presentazione personalizzata.\n\nResta a disposizione,\nABC Company Team"
    },
    {
      "day": 15,
      "subject": "Manteniamo il contatto?",
      "content": "Gentile {{nome}},\n\nCapiamo che i tempi potrebbero non essere quelli giusti per te in questo momento.\n\nTuttavia, vorremmo restare in contatto per aggiornarti sulle future opportunità che potrebbero essere più in linea con i tuoi interessi.\n\nSe preferisci ricevere aggiornamenti con frequenza diversa o su temi specifici, faccelo sapere rispondendo a questa email.\n\nGrazie per la tua attenzione,\nABC Company Team"
    }
  ]'::jsonb,
  true
);
