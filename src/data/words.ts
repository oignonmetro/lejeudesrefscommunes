// Liste de mots de départ pour « Le jeu des refs communes ».
// Tu peux ajouter / retirer des mots librement.
// Chaque catégorie peut être activée ou non dans les Options.

export interface WordCategory {
  id: string
  label: string
  emoji: string
  words: string[]
}

export const CATEGORIES: WordCategory[] = [
  {
    id: 'films',
    label: 'Films & séries',
    emoji: '🎬',
    words: [
      'Titanic', 'Le Roi Lion', 'Harry Potter', 'Intouchables', 'Avatar',
      'Star Wars', 'Amélie Poulain', 'La Reine des Neiges', 'Jurassic Park',
      'Le Seigneur des Anneaux', 'Astérix', 'Les Bronzés', 'OSS 117',
      'La Casa de Papel', 'Game of Thrones', 'Breaking Bad', 'Friends',
      'Kaamelott', 'Le Père Noël est une ordure', 'Retour vers le futur',
    ],
  },
  {
    id: 'sport',
    label: 'Sport',
    emoji: '⚽',
    words: [
      'Hockey', 'Football', 'Tennis', 'Natation', 'Basket', 'Rugby',
      'Escalade', 'Judo', 'Ski', 'Marathon', 'Boxe', 'Pétanque',
      'Handball', 'Cyclisme', 'Golf', 'Surf', 'Yoga', 'Badminton',
      'Patinage', 'Volley',
    ],
  },
  {
    id: 'objets',
    label: 'Objets du quotidien',
    emoji: '🧦',
    words: [
      'Téléphone', 'Parapluie', 'Brosse à dents', 'Grille-pain', 'Aspirateur',
      'Réveil', 'Portefeuille', 'Tire-bouchon', 'Chargeur', 'Casserole',
      'Télécommande', 'Trousseau de clés', 'Écouteurs', 'Bouilloire',
      'Rasoir', 'Ciseaux', 'Fer à repasser', 'Lampe de poche', 'Tondeuse',
      'Sèche-cheveux',
    ],
  },
  {
    id: 'lieux',
    label: 'Lieux',
    emoji: '🗺️',
    words: [
      'Tour Eiffel', 'Plage', 'Aéroport', 'Supermarché', 'Bibliothèque',
      'Piscine municipale', 'Camping', 'Cinéma', 'Marché de Noël', 'Montagne',
      'Gare', 'Château', 'Zoo', 'Fête foraine', 'Musée', 'Boulangerie',
      'Station de ski', 'Vestiaire', 'Salle de sport', 'Bord de mer',
    ],
  },
  {
    id: 'nourriture',
    label: 'Nourriture',
    emoji: '🍿',
    words: [
      'Popcorn', 'Raclette', 'Kebab', 'Crêpe', 'Sushi', 'Tartiflette',
      'Croissant', 'Pizza', 'Barbe à papa', 'Glace à la vanille', 'Hamburger',
      'Fondue', 'Tacos', 'Chocolat chaud', 'Galette des rois', 'Nutella',
      'Frites', 'Soupe', 'Camembert', 'Madeleine',
    ],
  },
  {
    id: 'animaux',
    label: 'Animaux',
    emoji: '🦊',
    words: [
      'Chat', 'Éléphant', 'Pingouin', 'Hérisson', 'Dauphin', 'Renard',
      'Girafe', 'Escargot', 'Hibou', 'Kangourou', 'Tortue', 'Panda',
      'Loup', 'Abeille', 'Perroquet', 'Crocodile', 'Écureuil', 'Chauve-souris',
      'Poule', 'Mouton',
    ],
  },
  {
    id: 'personnalites',
    label: 'Célébrités',
    emoji: '⭐',
    words: [
      'Leonardo DiCaprio', 'Zinédine Zidane', 'Jamel Debbouze', 'Beyoncé',
      'Mbappé', 'Angèle', 'Omar Sy', 'Céline Dion', 'Franck Ribéry',
      'Louane', 'Jul', 'Booba', 'Aya Nakamura', 'Teddy Riner', 'Gad Elmaleh',
      'Orelsan', 'Stromae', 'Dujardin', 'Cristiano Ronaldo', 'Squeezie',
    ],
  },
  {
    id: 'concepts',
    label: 'Concepts & situations',
    emoji: '💭',
    words: [
      'Un lundi matin', 'La grasse matinée', 'Le premier rendez-vous',
      'Une panne de réveil', 'Un fou rire', 'Le trac', 'Les embouteillages',
      'La sieste', 'Un coup de foudre', 'La rentrée des classes',
      'Une soirée pyjama', 'Le mal de mer', 'Un road trip', 'La canicule',
      'Le déménagement', 'Une soirée jeux', 'Le premier jour de vacances',
      'Un bisou baveux', 'La queue à la caisse', 'Le réveillon',
    ],
  },
]

/** Tire un mot au hasard parmi les catégories activées, en évitant les répétitions récentes. */
export function drawWord(enabledCategoryIds: string[], recent: string[]): string {
  const pool = CATEGORIES.filter((c) => enabledCategoryIds.includes(c.id)).flatMap(
    (c) => c.words,
  )
  if (pool.length === 0) return '???'
  const fresh = pool.filter((w) => !recent.includes(w))
  const candidates = fresh.length > 0 ? fresh : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}
