-- Aggiornamento LinkedIn URLs da report di validazione
-- Match basato su nome estratto dall'URL LinkedIn

-- Chiara Fruscio
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/chiara-fruscio-a436221a' WHERE LOWER(nome) LIKE '%chiara%' AND LOWER(nome) LIKE '%fruscio%';

-- Roberto Roma
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-roma-932511151' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%roma%' AND (LOWER(nome) NOT LIKE '%romanelli%' AND LOWER(nome) NOT LIKE '%romani%');

-- Marco Farina
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marco-farina-b258661' WHERE LOWER(nome) LIKE '%marco%' AND LOWER(nome) LIKE '%farina%';

-- Andrea Mariani
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/andrea-mariani-6b5a326' WHERE LOWER(nome) LIKE '%andrea%' AND LOWER(nome) LIKE '%mariani%';

-- Andrea Porrino
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/andrea-porrino-4a25a529' WHERE LOWER(nome) LIKE '%andrea%' AND LOWER(nome) LIKE '%porrino%';

-- Simone Ruzzante
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/simone-ruzzante-3a474616' WHERE LOWER(nome) LIKE '%simone%' AND LOWER(nome) LIKE '%ruzzante%';

-- Pierre Ricq
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/pierrericq' WHERE LOWER(nome) LIKE '%pierre%' AND LOWER(nome) LIKE '%ricq%';

-- Aldo Di Bernardo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/aldo-di-bernardo-47a18b16' WHERE LOWER(nome) LIKE '%aldo%' AND LOWER(nome) LIKE '%bernardo%';

-- Michael Brunner
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/michael-brunner-caia-cesga-fmva-817ab813a' WHERE LOWER(nome) LIKE '%michael%' AND LOWER(nome) LIKE '%brunner%';

-- Stefano Gratti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-gratti-a4b23934' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%gratti%';

-- Simone Bordoni
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/simonebordoni' WHERE LOWER(nome) LIKE '%simone%' AND LOWER(nome) LIKE '%bordoni%';

-- Concetta Cesarano
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/concetta-cesarano-b209756b' WHERE LOWER(nome) LIKE '%concetta%' AND LOWER(nome) LIKE '%cesarano%';

-- Daniele Crepaz
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/daniele-crepaz-b9487626' WHERE LOWER(nome) LIKE '%daniele%' AND LOWER(nome) LIKE '%crepaz%';

-- Davide Longo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/davide-longo-' WHERE LOWER(nome) LIKE '%davide%' AND LOWER(nome) LIKE '%longo%';

-- Alessandro Capeccia
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/alessandro-capeccia-01aa2729' WHERE LOWER(nome) LIKE '%alessandro%' AND LOWER(nome) LIKE '%capeccia%';

-- Mauro Festa
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/mauro-festa-16707a62' WHERE LOWER(nome) LIKE '%mauro%' AND LOWER(nome) LIKE '%festa%';

-- Fabio Iannelli
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/fabioiannelli' WHERE LOWER(nome) LIKE '%fabio%' AND LOWER(nome) LIKE '%iannelli%';

-- Lucio Rovati
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/lucio-rovati-176b6a22' WHERE LOWER(nome) LIKE '%lucio%' AND LOWER(nome) LIKE '%rovati%';

-- Tommaso Righetti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/tommaso-righetti' WHERE LOWER(nome) LIKE '%tommaso%' AND LOWER(nome) LIKE '%righetti%';

-- Massimo De Palma
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/massimo-de-palma-6485a65' WHERE LOWER(nome) LIKE '%massimo%' AND LOWER(nome) LIKE '%de palma%';

-- Dario Giudici
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/dariogiudici' WHERE LOWER(nome) LIKE '%dario%' AND LOWER(nome) LIKE '%giudici%';

-- Jacopo Ciuffardi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/jacopo-ciuffardi-9750117b' WHERE LOWER(nome) LIKE '%jacopo%' AND LOWER(nome) LIKE '%ciuffardi%';

-- Matteo Biagi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/matteo-biagi-0454596a' WHERE LOWER(nome) LIKE '%matteo%' AND LOWER(nome) LIKE '%biagi%';

-- Marco Boschetti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marco-boschetti-01129796' WHERE LOWER(nome) LIKE '%marco%' AND LOWER(nome) LIKE '%boschetti%' AND LOWER(nome) NOT LIKE '%vitale%';

-- Yoann Nini
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/yoann-nini-a97b817b' WHERE LOWER(nome) LIKE '%yoann%' AND LOWER(nome) LIKE '%nini%';

-- Iolanda Claudia Fissore
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/iolanda-claudia-fissore-174ba954' WHERE LOWER(nome) LIKE '%fissore%';

-- Pierpaolo Dal Cortivo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/pierpaolo-dal-cortivo' WHERE LOWER(nome) LIKE '%pierpaolo%' AND LOWER(nome) LIKE '%cortivo%';

-- Domenico Lombardi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/domenico-lombardi-50953a15' WHERE LOWER(nome) LIKE '%domenico%' AND LOWER(nome) LIKE '%lombardi%';

-- Giacomo Sella
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giacomo-sella-502a5bb3' WHERE LOWER(nome) LIKE '%giacomo%' AND LOWER(nome) LIKE '%sella%';

-- Giorgio Di Palma
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giorgio-di-palma-01399630' WHERE LOWER(nome) LIKE '%giorgio%' AND LOWER(nome) LIKE '%di palma%';

-- Emanuele Bellingeri
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/emanuelebellingeri' WHERE LOWER(nome) LIKE '%emanuele%' AND LOWER(nome) LIKE '%bellingeri%';

-- Sebastiano Barocco
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/sebastiano-barocco-458b5a6' WHERE LOWER(nome) LIKE '%sebastiano%' AND LOWER(nome) LIKE '%barocco%';

-- Enrico Cibati
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/enrico-cibati-83020614' WHERE LOWER(nome) LIKE '%enrico%' AND LOWER(nome) LIKE '%cibati%';

-- Gianpaolo Di Dio
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/gianpaolo-di-dio-77b3b719' WHERE LOWER(nome) LIKE '%gianpaolo%' AND LOWER(nome) LIKE '%di dio%';

-- Stefano Gaeta
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-gaeta-7b441622' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%gaeta%';

-- Alessandro Bianchi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/alessandro-bianchi-cfa' WHERE LOWER(nome) LIKE '%alessandro%' AND LOWER(nome) LIKE '%bianchi%';

-- Edoardo Capuzzi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/edoardo-capuzzi-58229617' WHERE LOWER(nome) LIKE '%edoardo%' AND LOWER(nome) LIKE '%capuzzi%';

-- Valeria Santoro
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/valeria-santoro-cfa' WHERE LOWER(nome) LIKE '%valeria%' AND LOWER(nome) LIKE '%santoro%';

-- Edoardo Bertini
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/edoardo-bertini-42877170' WHERE LOWER(nome) LIKE '%edoardo%' AND LOWER(nome) LIKE '%bertini%';

-- Massimiliano Giannone
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/massimiliano-giannone-b3a52618' WHERE LOWER(nome) LIKE '%massimiliano%' AND LOWER(nome) LIKE '%giannone%';

-- Mara Ariatti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/mara-ariatti-8451961a' WHERE LOWER(nome) LIKE '%mara%' AND LOWER(nome) LIKE '%ariatti%';

-- Carlotta De Courten
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/carlotta-de-courten-864a781b' WHERE LOWER(nome) LIKE '%carlotta%' AND LOWER(nome) LIKE '%courten%';

-- Marco Tubia
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marco-tubia-b2471a18' WHERE LOWER(nome) LIKE '%marco%' AND LOWER(nome) LIKE '%tubia%';

-- Andrea Reale
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/andrea-reale-2bab46b3' WHERE LOWER(nome) LIKE '%andrea%' AND LOWER(nome) LIKE '%reale%';

-- Janek Moik
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/janek-moik-00232624' WHERE LOWER(nome) LIKE '%janek%' AND LOWER(nome) LIKE '%moik%';

-- Pietro Santoro
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/pietro-santoro-17a4773' WHERE LOWER(nome) LIKE '%pietro%' AND LOWER(nome) LIKE '%santoro%';

-- Antonio Quintino Chieffo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/antonio-quintino-chieffo-79532454' WHERE LOWER(nome) LIKE '%antonio%' AND LOWER(nome) LIKE '%chieffo%';

-- Luca Martinuzzi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/luca-martinuzzi-b103135' WHERE LOWER(nome) LIKE '%luca%' AND LOWER(nome) LIKE '%martinuzzi%';

-- Andrea Picchi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/andrea-picchi-90b5a3174' WHERE LOWER(nome) LIKE '%andrea%' AND LOWER(nome) LIKE '%picchi%';

-- Alessandro Maganza
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/alessandromaganza' WHERE LOWER(nome) LIKE '%alessandro%' AND LOWER(nome) LIKE '%maganza%';

-- Nicolas Diers
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/nicolasdiers' WHERE LOWER(nome) LIKE '%nicolas%' AND LOWER(nome) LIKE '%diers%';

-- Antongiulio Marti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/antongiulio-marti-2278073' WHERE LOWER(nome) LIKE '%antongiulio%' AND LOWER(nome) LIKE '%marti%';

-- Marco Scianò
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marco-scian%C3%B2-9658514b' WHERE LOWER(nome) LIKE '%marco%' AND (LOWER(nome) LIKE '%sciano%' OR LOWER(nome) LIKE '%scianò%');

-- Francesco Conte
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/francesco-conte-789a7413' WHERE LOWER(nome) LIKE '%francesco%' AND LOWER(nome) LIKE '%conte%';

-- Roberto Ruggeri
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/robertoruggeri' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%ruggeri%';

-- Giuseppe Turri
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giuseppe-turri-13583212' WHERE LOWER(nome) LIKE '%giuseppe%' AND LOWER(nome) LIKE '%turri%';

-- Salvatore Insinga
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/salvatoreinsinga' WHERE LOWER(nome) LIKE '%salvatore%' AND LOWER(nome) LIKE '%insinga%';

-- Giorgio Boggero
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giorgio-boggero-a09556' WHERE LOWER(nome) LIKE '%giorgio%' AND LOWER(nome) LIKE '%boggero%';

-- Rossano Rufini
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/rossano-rufini-83562a1a' WHERE LOWER(nome) LIKE '%rossano%' AND LOWER(nome) LIKE '%rufini%';

-- Giancarlo Rocchietti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giancarlo-rocchietti-a3a7804' WHERE LOWER(nome) LIKE '%giancarlo%' AND LOWER(nome) LIKE '%rocchietti%';

-- Anna Cerruti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/anna-annacerruti' WHERE LOWER(nome) LIKE '%anna%' AND LOWER(nome) LIKE '%cerruti%';

-- Carlo Pajusco
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/carlopajusco' WHERE LOWER(nome) LIKE '%carlo%' AND LOWER(nome) LIKE '%pajusco%';

-- Andrea Rota
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/andrea-rota-52033b5' WHERE LOWER(nome) LIKE '%andrea%' AND LOWER(nome) LIKE '%rota%';

-- Marco Forasassi Torresani
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marco-forasassi-torresani-214470' WHERE LOWER(nome) LIKE '%forasassi%' OR LOWER(nome) LIKE '%torresani%';

-- Angelo Italiano
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/angelo-italiano-b6a85816' WHERE LOWER(nome) LIKE '%angelo%' AND LOWER(nome) LIKE '%italiano%';

-- Stefano Cassina
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-cassina-71a7a012' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%cassina%';

-- Igor Calcio Caucino
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/igor-calcio-caucino' WHERE LOWER(nome) LIKE '%igor%' AND LOWER(nome) LIKE '%caucino%';

-- Marco Cattaneo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marco-cattaneo-1845bb2' WHERE LOWER(nome) LIKE '%marco%' AND LOWER(nome) LIKE '%cattaneo%';

-- Roberto Ferraresi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-ferraresi-a3206612' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%ferraresi%';

-- Massimo Realini
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/massimo-realini-9b165b6' WHERE LOWER(nome) LIKE '%massimo%' AND LOWER(nome) LIKE '%realini%';

-- Paolo Righetto
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/paolo-righetto-8373b06' WHERE LOWER(nome) LIKE '%paolo%' AND LOWER(nome) LIKE '%righetto%';

-- Giuseppe Prestia
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giuseppe-prestia-a6300a7' WHERE LOWER(nome) LIKE '%giuseppe%' AND LOWER(nome) LIKE '%prestia%';

-- Flavio Francescato
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/flavio-francescato-1a958148' WHERE LOWER(nome) LIKE '%flavio%' AND LOWER(nome) LIKE '%francescato%';

-- Edoardo Salvadeo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/edoardo-salvadeo-2b4343100' WHERE LOWER(nome) LIKE '%edoardo%' AND LOWER(nome) LIKE '%salvadeo%';

-- CFA Saldutti (match by Saldutti)
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/cfa-saldutti-68787b32' WHERE LOWER(nome) LIKE '%saldutti%';

-- Marco Perucca
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marcoperucca' WHERE LOWER(nome) LIKE '%marco%' AND LOWER(nome) LIKE '%perucca%';

-- Giacomo M
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giacomo-m-60005b96' WHERE LOWER(nome) = 'giacomo m' OR (LOWER(nome) LIKE '%giacomo%' AND LOWER(azienda) LIKE '%azimut%');

-- Matteo Rigginello
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/matteo-rigginello-3785698' WHERE LOWER(nome) LIKE '%matteo%' AND LOWER(nome) LIKE '%rigginello%';

-- Adriano Biscaro
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/adriano-biscaro' WHERE LOWER(nome) LIKE '%adriano%' AND LOWER(nome) LIKE '%biscaro%';

-- Irene Albrile
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/irene-albrile-a6b23561' WHERE LOWER(nome) LIKE '%irene%' AND LOWER(nome) LIKE '%albrile%';

-- Daniele Gioffrè
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/danielegioffre' WHERE LOWER(nome) LIKE '%daniele%' AND (LOWER(nome) LIKE '%gioffre%' OR LOWER(nome) LIKE '%gioffrè%');

-- Ludovica Magnoni
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/ludovica-magnoni-48908b62' WHERE LOWER(nome) LIKE '%ludovica%' AND LOWER(nome) LIKE '%magnoni%';

-- Roberto Mortari
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-mortari-cfa-a9a7516b' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%mortari%';

-- Roberto Lettieri
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-lettieri-36b69b59' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%lettieri%';

-- Giovanni Alberici
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/alberici-giovanni-b8830155' WHERE LOWER(nome) LIKE '%giovanni%' AND LOWER(nome) LIKE '%alberici%';

-- Roberto Marangoni
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-marangoni-b2184a4' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%marangoni%';

-- Siviero
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/siviero-sales-director-italy-%F0%9F%87%AE%F0%9F%87%B9-858079140' WHERE LOWER(nome) LIKE '%siviero%';

-- Roberto Quagliuolo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-quagliuolo-a400a43' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%quagliuolo%';

-- Orazio Orsini
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/orazio-orsini-m-i-i-i-b-b5305118' WHERE LOWER(nome) LIKE '%orazio%' AND LOWER(nome) LIKE '%orsini%';

-- Stefano Fontanili
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-fontanili-640a3111' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%fontanili%';

-- Baccaro Lanzoni
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/baccaro-lanzoni-b21a3721a' WHERE LOWER(nome) LIKE '%baccaro%' OR LOWER(nome) LIKE '%lanzoni%';

-- Andrea Rosettani
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/andrearosettani' WHERE LOWER(nome) LIKE '%andrea%' AND LOWER(nome) LIKE '%rosettani%';

-- Giuseppe Pipicella
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giuseppepipicella' WHERE LOWER(nome) LIKE '%giuseppe%' AND LOWER(nome) LIKE '%pipicella%';

-- Ernesto Sellitto
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/ernesto-sellitto' WHERE LOWER(nome) LIKE '%ernesto%' AND LOWER(nome) LIKE '%sellitto%';

-- Rossella Mantini
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/rossella-mantini-92b0a012' WHERE LOWER(nome) LIKE '%rossella%' AND LOWER(nome) LIKE '%mantini%';

-- Roberto Mainetti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-mainetti-45b0a31a' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%mainetti%';

-- Stefano Gastaldello
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-gastaldello-a988114' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%gastaldello%';

-- Vati Pucci
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/vati-pucci-5a02a829' WHERE LOWER(nome) LIKE '%vati%' AND LOWER(nome) LIKE '%pucci%';

-- Roberto Tanzi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-tanzi-a79458bb' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%tanzi%';

-- De Luca
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/de-luca-09852233' WHERE LOWER(nome) LIKE '%de luca%' AND linkedin IS NULL;

-- Andrea Panfili
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/andrea-panfili-622ba76' WHERE LOWER(nome) LIKE '%andrea%' AND LOWER(nome) LIKE '%panfili%';

-- Roberto Da Rio
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-da-rio-b484501a' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%da rio%';

-- Carlo Maione
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/carlo-maione-5813353' WHERE LOWER(nome) LIKE '%carlo%' AND LOWER(nome) LIKE '%maione%';

-- Polonia Finanza
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/polonia-finanza-fideuram-a7b51b228' WHERE LOWER(nome) LIKE '%polonia%';

-- Giacomo Bordin
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giacomobordin' WHERE LOWER(nome) LIKE '%giacomo%' AND LOWER(nome) LIKE '%bordin%' AND LOWER(nome) NOT LIKE '%bordoni%';

-- Marianelli
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marianelli-italian-ventures' WHERE LOWER(nome) LIKE '%marianelli%';

-- Stefania Salvadè
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/salvade-stefania-76b63351' WHERE LOWER(nome) LIKE '%stefania%' AND (LOWER(nome) LIKE '%salvade%' OR LOWER(nome) LIKE '%salvadè%');

-- D'Agostino CFA
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/dagostino-cfa' WHERE LOWER(nome) LIKE '%agostino%' AND linkedin IS NULL;

-- Roberta Benaglia
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberta-benaglia-26615b37' WHERE LOWER(nome) LIKE '%roberta%' AND LOWER(nome) LIKE '%benaglia%';

-- Stefano Stabile
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-stabile-356545109' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%stabile%';

-- Roberto Vigliotti
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-vigliotti-89410313' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%vigliotti%';

-- Roberto Iannelli
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-iannelli-b248a3136' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%iannelli%';

-- Marco Pocher
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/marcopocher' WHERE LOWER(nome) LIKE '%marco%' AND LOWER(nome) LIKE '%pocher%';

-- Giorgia Ragionieri
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/giorgia-ragionieri-71b46130' WHERE LOWER(nome) LIKE '%giorgia%' AND LOWER(nome) LIKE '%ragionieri%';

-- Schiaffino
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/schiaffino-private-banking-investis-b248a39a' WHERE LOWER(nome) LIKE '%schiaffino%';

-- Finocchi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/finocchi-finn-28771415' WHERE LOWER(nome) LIKE '%finocchi%';

-- Stefano Scapola
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-scapola-19a9091' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%scapola%';

-- Roberto Clarizio
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-clarizio-91a56641' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%clarizio%';

-- Roberto Gaspari
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/robertogaspari' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%gaspari%';

-- Zanaboni
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/zanaboni-ciia-b3b35543' WHERE LOWER(nome) LIKE '%zanaboni%';

-- Stefano Manservisi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-manservisi-a8a29a1b' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%manservisi%';

-- Generani
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/generani' WHERE LOWER(nome) LIKE '%generani%';

-- Carlo Longo
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/carlo-longo-692b1a134' WHERE LOWER(nome) LIKE '%carlo%' AND LOWER(nome) LIKE '%longo%';

-- Stefano Zorzi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-zorzi-8566b710' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%zorzi%';

-- Tardino
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/tardino-golding-capital-partners-a91217112' WHERE LOWER(nome) LIKE '%tardino%';

-- Roberto Razza
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-razza-2a911765' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%razza%';

-- Pietro Farina
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/pietro-farina-04a60127' WHERE LOWER(nome) LIKE '%pietro%' AND LOWER(nome) LIKE '%farina%';

-- Roberto Boccardi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-boccardi-378b872b' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%boccardi%';

-- Stefano Baldussi
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-baldussi-684b067a' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%baldussi%';

-- Massimo Rubino
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/massimo-rubino-224b00121' WHERE LOWER(nome) LIKE '%massimo%' AND LOWER(nome) LIKE '%rubino%';

-- Sara Selvaggia Beltrame
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/sara-selvaggia-beltrame-014273116' WHERE LOWER(nome) LIKE '%sara%' AND LOWER(nome) LIKE '%beltrame%';

-- Stefano Mignone
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-mignone-a05b2210' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%mignone%';

-- Stefano Boschetti Vitale
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/stefano-boschetti-vitale-46603a11' WHERE LOWER(nome) LIKE '%stefano%' AND LOWER(nome) LIKE '%boschetti%' AND LOWER(nome) LIKE '%vitale%';

-- Roberto Puccinelli
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-puccinelli-7b949b2' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%puccinelli%';

-- Roberto Bordoni
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-bordoni-625026214' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%bordoni%';

-- Perin
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/perin-generali-investments-esg-funds-analysis-and-benchmarking' WHERE LOWER(nome) LIKE '%perin%' AND LOWER(azienda) LIKE '%generali%';

-- Roberto Crippa
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/roberto-crippa-95562719' WHERE LOWER(nome) LIKE '%roberto%' AND LOWER(nome) LIKE '%crippa%';

-- Sberna
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/sberna' WHERE LOWER(nome) LIKE '%sberna%';

-- Rossana Berglund
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/rossana-berglund-9a00a29' WHERE LOWER(nome) LIKE '%rossana%' AND LOWER(nome) LIKE '%berglund%';

-- Luca Barindelli
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/luca-barindelli-75bb9a7' WHERE LOWER(nome) LIKE '%luca%' AND LOWER(nome) LIKE '%barindelli%';

-- Carlo Trabattoni
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/carlo-trabattoni-49129712a' WHERE LOWER(nome) LIKE '%carlo%' AND LOWER(nome) LIKE '%trabattoni%';

-- Ricq Leong
UPDATE public.abc_investors SET linkedin = 'https://www.linkedin.com/in/ricq-leong-038b0a5' WHERE LOWER(nome) LIKE '%ricq%' AND LOWER(nome) LIKE '%leong%';