commande
booster / voir les boost actuelle
systeme de level





## **Système de rencontres : Commandes et fonctionnalités**

### **1. Création de profil**
- **Commande :** `/profile create`
- **Choix obligatoires :**
  - **Nom** : Saisi par l’utilisateur.
  - **Tranche d’âge** : Sélection parmi :
    - `13-17`, `18-25`, `26-30`, `31+`.
  - **Centres d’intérêt** : Choix parmi une liste (sélection multiple) :
    - `Gaming`, `Netflix`, `Discord`, `Extérieur`, `Lecture`, `Cinéma`, `Musique`, `Voyages`, `Animaux`, `Cuisine`, `Autre`.
  - **Statut amoureux :** Célibataire, En couple, Préfère ne pas dire.
  - **Statut de recherche :** Amitié, Relation amoureuse, Autre.
  - **Description :** Optionnelle, limitée à X caractères.

- **Confirmation du bot :**
  - *"Profil créé ! Tapez `/profile` pour voir votre profil ou `/profile view @utilisateur` pour voir celui d’une autre personne."*

---

### **2. Matchmaking**
- **Commande :** `/profile match [intérêt]`
  - Le bot analyse les profils pour trouver deux utilisateurs compatibles selon :
    - Leurs intérêts communs.
    - Leur statut amoureux et de recherche.
    - Leur tranche d’âge.
    - Leur disponibilité (priorité : statut *En ligne* ou *Ne pas déranger*, sinon *Hors ligne* avec mention du délai).

- **Création d’un salon privé :**
  - Si une catégorie *Matchmaking* existe (définie par un admin via configuration), le salon est créé sous cette catégorie. Sinon, le bot crée la catégorie par défaut.
  - Réponse :  
    *"@User1 et @User2, vous êtes compatibles ! Voici un salon privé pour discuter pendant 15 minutes."*

---

### **3. Gestion des rencontres**
- **Durée :**
  - Les options de durée sont : `15 min`, `30 min`, ou `60 min`.
  - Le bot envoie un rappel 5 minutes avant la fin :  
    *"Il reste 5 minutes à cette session. Réagissez avec ✅ pour prolonger ou ❌ pour terminer."*

- **Fin de la rencontre :**
  - **Automatique :** Le bot envoie un message :  
    *"La rencontre est terminée. Vous pouvez rester ici ou quitter."*
    - Il propose ensuite des options : 
      - *"Souhaitez-vous sauvegarder ce participant ou évaluer l’interaction ?"*
  - **Manuelle :** Les membres peuvent terminer la discussion avec `/rencontre end`. Le salon est immédiatement fermé, et le bot invite à laisser un feedback.

---

### **4. Feedback**
- **Commande :** `/rencontre feedback`
  - À la fin d’une rencontre, le bot pose une question :
    - *"Avez-vous aimé cette rencontre ? Donnez une note de 1 à 5 et laissez un commentaire."*
    - Exemple : `/rencontre feedback 5 "Très bonne conversation, merci !"`.
  - Le feedback est enregistré dans un profil spécial *"Rencontres"*.

- **Profil personnel et de rencontre :**
  - **Profil personnel :**
    - Liste des centres d’intérêts.
    - Nombre total de rencontres.
    - Historique des matchs.
  - **Profil de rencontres :**
    - Notes moyennes des feedbacks reçus.
    - Liste des badges obtenus.

---

### **5. Suggestions de profils**
- Un salon choisi par un admin peut être utilisé pour afficher des profils suggérés toutes les X minutes/heures.
- Les suggestions incluent un profil partiellement flouté (nom et photo floutés, mais centres d’intérêt visibles).
- Les membres peuvent réagir avec ✅ ou ❌ pour matcher ou passer.
- Si deux personnes se choisissent, le bot crée un salon privé même si cela se produit plusieurs jours après.

---

### **6. Système de badges**
- **Obtention automatique :** Le bot attribue des badges selon des critères :
  - **Badge Sociable :** 5 rencontres réussies.
  - **Badge Curieux :** Participation à 3 rencontres sur des centres d’intérêt variés.
  - **Badge Populaire :** 10 feedbacks positifs reçus.
- **Affichage des badges :**
  - Commande : `/profile badges` :
    - Montre les badges obtenus par l’utilisateur.
  - Commande : `/profile badges available` :
    - Liste tous les badges disponibles avec leurs critères.

---

### **7. Base de données MongoDB**
- **Badges disponibles :**
  - Stockés avec leurs critères.
- **Profils utilisateurs :**
  - Contient nom, tranche d’âge, centres d’intérêt, statut, description, rencontres, feedbacks et badges.
- **Rencontres :**
  - Enregistre chaque match avec les deux participants, la date, la durée et le feedback.

---

### **8. Idées pour enrichir davantage**
- **Statistiques globales :**
  - Affichage du nombre total de rencontres sur le serveur.
  - Classement des utilisateurs avec le plus de feedbacks positifs.
- **Matchmaking évolué :**
  - Priorise les utilisateurs récemment actifs.
  - Utilise un algorithme de compatibilité avec pourcentages visibles.
- **Mini-jeux pendant les rencontres :**
  - Pose des questions aléatoires pour briser la glace :
    - *"Si tu devais vivre dans un jeu vidéo, lequel choisirais-tu ?"*
- **Rappels personnalisés :**
  - Permet aux utilisateurs d’être notifiés lorsqu’un nouveau match potentiel est trouvé.

---



Les permissions des utilisateurs pour exécuter la commande sont-elles correctement configurées ? Les paramètres requis ou facultatifs de la commande sont-ils clairs et bien gérés ? Que se passe-t-il si un utilisateur entre un paramètre invalide ou incomplet ? La commande fonctionne-t-elle dans tous les contextes (salons texte, DM, différents serveurs) ? Les réponses de la commande (messages ou embeds) sont-elles claires et adaptées à l’utilisateur ? La commande peut-elle gérer plusieurs utilisateurs l’utilisant en même temps ? La commande est-elle optimisée pour éviter les ralentissements ou les bugs ? Y a-t-il une logique de gestion des erreurs si la commande échoue ? La commande respecte-t-elle les limites de l’API Discord (ratelimit) ? La commande est-elle intuitive et répond-elle réellement au besoin qu’elle vise à résoudre ?
