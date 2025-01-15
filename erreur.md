**systeme profile**
# si le role est changé avec des emoji ou autre le bot ne reconais pas ce role du moin lors de la commande activation profile il recrée le role qui avais éété modifié avec emoji donc ses probable que le bot ne le reconnaisse pas lors du profils crée etc


j'aimerais faire un systeme de mariage 
db : mongodb (ex de shema ici)
les fichié seras dans /commands/mariage/ici

1. demande de mariage
/propose @ user 
- envoyé la demande de mariage
- message interactif aVec bouton pour accepter ou refuser
- Notification envoyé au 2 user en cas de reponse
2. Mariage officiel
- une fois accepter un evenement special est déclenché exemple :
   *message de celebration dans un salon dedié (dans une commande faudrais offrir de crée le salon pour ladmin , dutulisé un salon actuelle ou ne pas en utulisé dutout) 
   possibilité de personnalisé l'Anonce avec des emoji ou un text custom
3. divorce 
- commande /divorce pour mettre fin au mariage 
- confirmation interactive pour évité les erreur accidentelle

4 Personnalisation
- personnalisation du mariage 
c *commande /wedding-customize pour choisir un date ou lieux fictif , ajouté message ou voeux personalisé , attribué des roles spécifique (marié , fiancé , etc) (encore une fois le bot peux les crée ou ladmin peux utulisé les sien)
5. statistique de couplle
- /couple-stats affiche: 
date de mariage,nombre de jour,mois ou anné marié,statuts duu couple

ps :(sassuré que la commande sois ok pour plusieur server(globalement) + que les information sois encore enregistrer ex: melo marié a paolo sur server1 apparaisse sur server2 mem si melo est sur server 2 mais pas paolo tu me suis ? sassuré que meme si paolo quitte le server mais que un jour il reviene les donné sois toujours la)
p-ps: une personne ne peux pas etre marié a plus que 1 personne a la fois (ex : si melo est marié a paolo il ne peux pas etre marié a lola)  

classement des couple les plus ancien ou populaire avec un systeme de like par ex: /like-couple @ le nom des 2 personne du couple (le like est enregistrer dans la db pour les statistique) ou aussi /like-celib ataire @ le nom de la personne pour les célibataires (le like est enregistrer dans la db pour les statistique)

6. interaction sociale
commande /gift pour offrir des cadeay au partenaire ou futur partenaire 
systeme de point ou de monaie virutelle pour acheter ses cadeau (alors la aucune idé de quoi comme systeme)

7. admin
pour le salon dedier /setup-mariage (on ecrit mariage ou marriage)
parametre activé desactivé les notification ou commande lié au mariage
??creation automatique de role specifique exemple : couple marié? ou on laisse au choix des admin(si ses crée automatiquemet il faut sassuré que ladmin puisse modifié le role ou le nom du role si il le souhaite et que le bot le comprenne)
possible pour admin de gerer les couple via /manage-couple

8. securité
anti abus
limitation des demande de mariage a un utulisateur specifique (par ex : une  seule demande en attente a la fois)
cooldown sur les commande de divorce ou de proposition
*confirmation a 2 facteur*
les 2 user dfoivent confirmer les truc important(mariage,divorce, etc)
une commande /force-divorce peux etre utulisé une fois par heure ? 

donc exemple des commande
/propose @user [message] : envoyé une demande en mariage
/accept-mariage : accepter la demande de mariage
/divorce : mettre fin au mariage
/wedding-customize : personnaliser le mariage
/couple-stats : affiche les statistiques du couple
/like-couple /like-celib liker un couple ou un célibataire
/liste-mariage : liste des demande de mariage en attente
/leaderboard : classement des couple les plus ancien ou populaire avec option de choisir le leardeboard celibataire ou couple


