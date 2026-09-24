// Contenu de démonstration pour l'écran d'accueil (P1-1).
// Aucune connexion SharePoint n'est câblée dans ce lot : ces données sont
// statiques et seront remplacées par un appel réel une fois l'intégration
// SharePoint (authentification + API) livrée dans un lot ultérieur.

export interface Rubric {
  id: string
  label: string
  icon: string
}

export interface NewsItem {
  id: string
  tag: string
  title: string
  date: string
}

export const RUBRICS: Rubric[] = [
  { id: 'applications', label: 'Applications', icon: '🖥️' },
  { id: 'documents', label: 'Dossiers / Documents', icon: '📁' },
  { id: 'liens-utiles', label: 'Liens utiles', icon: '🔗' },
  { id: 'annuaire', label: 'Annuaire', icon: '👥' }
]

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    tag: 'Organisation',
    title: 'Santé mentale des jeunes : ce qu’ils et elles en disent',
    date: '18 septembre 2026'
  },
  {
    id: 'news-2',
    tag: 'RH',
    title: 'Nouvelle procédure de remboursement des frais de déplacement',
    date: '10 septembre 2026'
  },
  {
    id: 'news-3',
    tag: 'Formation',
    title: 'Inscriptions ouvertes — session prévention des risques psychosociaux',
    date: '2 septembre 2026'
  }
]
