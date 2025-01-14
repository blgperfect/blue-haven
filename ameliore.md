OKAY donc la tu dois

1. tassuré que chaque code est fonctionnelle.
2. chaque code gere les erreur. et a une bonne interface utulisateur

**Voici un plan complet de la visualisation du projet*


1. salon : profile-setup, profile-femme,profile-homme,profile-autre,self-role-profile,verification,badge(explication),
2. role : (categorie en premier role ensuite) : 
*sexualité* : Heterosexuelle,bisexuelle,homosexuel,lesbienne,pansexuel,assexuelle,aromantic,demi-sexuelle,demiromantic*(aucune ideé de ses quoi aromantic et demiromantic on peux les enlever si on sais pas)
*pronom* (je sais pas comment lecrire) : He/him,she/her,they/them,ask pronom 
*location* : North america,south america,europe,africa,middle east,asia,oceania
*interet* : anime,lire,moovie,cooking,tech,sport,gaming,art,dance,party,fashion. (on peux en ajouté ou modifié mais je veux pas que ce sois pareil)
*status dm* : dm ask , dm open, dm close
*relation* : celibataire,taken,recherche, aucune recherche, amitié, complique,monogamous(en fr stp), polyamoureux, 
*preference* : prefere 18 + , prefere 18 - , distance important, distance pas important,prefere petite, prefere grande, prefere feminine, prefere masculine.
*misc* : travail, sans emploi, etude (ajouté plus au besoin)

**interface utulisateur**

**par salon**     

# self-role-profile(racourcir le nom en francais)
1. image + bouton attaché a l'image (L'image explique que les role sont fait pour texprimé et que les autre voit tes role dans ton profile )
2. bouton principal : Edit Roles (avec un emoji dans le edit roles)
quand tu appuie dessu tu a les bouton suivant : sexualité , pronom, location,interet,status dm, relation, preference,misc
3. quand tu appuie sur les bouton corespondant tu a un menu de selection avec option a coché (tu me suis?) tu peux ainsi choisir plus que un role dependant de ce qui te corespond.
4. quand tu edit tes role le bot repond avec une embed qui dit : role modifié - added /(si tu en a ajouté aucun) removed (les role retiré si tu en a retiré sinon sa fait sa /)
ensuite tu a un bouton a l'emed qui te permet de revenir au menu de selection des role
5. a chaque fois que tu appuie sur un boutond sexualité , pronom, location,interet,status dm, relation, preference,misc
tu a des boutons qui disent <- back  pour revenir au menu ou tu etais ou ya pronom etc

# profile setup 
1. image + embed + bouton attaché a eux (image en haut embed en bas)
2. bouton principal : + créé profile, edit profile , bump profile, upload picture,preview profile , view like
***bouton creation profile**
si le membre a déja créeé sont profile (comme moi actuellement) le bot repond que tu a deja un profil appuie sur le **bouton edit profile**
Quand le membre appuie sur crée profile ou  edit profile un modal apparait avec les question suivante : Ton nom? Tu vien de ou? Quel est ton dating statut ? dit moi en plus apropos de toi ( et dans le modal jimagine que le bot a une structure pour gerer les erreur de caractere etc) une fois quil aime ce quil y a il fait envoyé et hop ses créeé ou si ses modifé un message lui dit que ses modifié en lui mentionnant que les changement apparaitrons la prochaine fois qu'il bump sont profile
**bouton bump profile**
en gros a la création du profile le bot publie automatiquement ton profile dans un salon mais apres si tu souhaite bump ton profile tu dois attenndre 4 heure et si tu appuie sur bump avant le bon moment le bot te dit exactement quand tu bump a nouveau (lee temo quil te reste)
**bouton upload picture**
si tu clique dessu le bot tenvoie un message en privé et il te dit : sil te plait envoie moi ta photo (image de telephone ou d'ordi) si tu ne lui envoie pas en je dirais 30 seconde 1 minute il te dit picture upload time out.
et la si tu a manqué lopportunité il te dit tu peux changer ta photo again dans 57 min sois un delais de 1heure dattente
si tu l'ui envoie il la modifie et le met a jour  lenregistre et la prochaine fois que tu bump ton profile elle seras la (du mooins sa ma lair logique)
**bouton preview Profile**
t'envoie un message ephemere avec ton profile et tes informations j'imagine que comme sa si tu l'aime pas tu peux ainsi ledité quand tu veux
**bouton view like**
 dans le cas ou personne a aimé ton profile il te dit : personne n'a aimé ton profile encore 
 dans le cas ou une personne a aimé ton profil : dans mon cas une personne un embed est apparu et sa dit total unique like 1 like by : le nom de la personne qui ma liker (mais ses facile dimaginé commeent sa serais si plusieur personne mavais aimer)


 # female profile, male profile,other profile.
 # female profile : le gendre femme peux voir 
# mal profile : le masculin 
# other profile :autre 
ce que inclut les profiles : 
user :
name: (configuré plus haut)
location:("")
dating status:(" en fonction du choix de role configuré plus haut)
age("configuré dans les role)
orientation(configuré dans les roles)
dm statuts (config dans role)
verification level(configur. dans le system,e de verification)
about me : "ce que on a ecrit plus haut''
badge : j'aimerais une image des badge qui apparais dans le profil(ou simplment nommé les badge, ou les mettre en tout petit dans l'embed en style emoji je sais pas dutout car si il en a plusieur ?)
photo : en principe par defaut on utulise l'image de lavatar du membre et si il la modifie ses la sienne que l'on met 


*verification* 
*verification* : 
# verification : explique les recompense detre verifié ici par exemple ses proove que tu nest pas un catfish , aie la priorité dans les evenement, abilité dappliquer pour etre moderateur
et la ta les etape de verification (un selfie avec ta piece didentité et une note avec le nom du server et ton discord name) une photo proche de ta piece didentité 
une note pour etre sur que le membre blur cache tout information sensible (personnel) sauf limage et la date de naissance dans l'embed il y a une photo dexemple
et en dessou sa dit pret pour la verification? appuie sur le bouton(aucune idé de ce que sa faut je veux pas la faire dans ce server)

seule commande concernant le profil sont : /profile block (bloque un utulisateur de pouvoir aimé ton profile) obligatoire : user (@) falcutatif userid

/profile like : enable or disable likes // /profile like state: (choix ici enable|desable)
et profile unblock


bref dit moi si j'ai oublié un truc ? en princip mes code actuelle implique deja ce que je texplique + plus encore mais il ne sont pas bien configuré des truc manque etc 


assuré que les gens peuvent choisir plus que 1 role


quand je selectionne un role dans le menu de selection pour le systeme profile sa dit  echec  de limteraction