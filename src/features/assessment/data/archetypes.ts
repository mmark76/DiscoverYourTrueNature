import type { ArchetypeProfile } from '../types';

export const archetypes: ArchetypeProfile[] = [
  { id: 'wolf', symbol: '🐺' },
  { id: 'owl', symbol: '🦉' },
  { id: 'eagle', symbol: '🦅' },
  { id: 'dolphin', symbol: '🐬' },
  { id: 'bear', symbol: '🐻' },
];

export const archetypeById = Object.fromEntries(
  archetypes.map((archetype) => [archetype.id, archetype]),
) as Record<ArchetypeProfile['id'], ArchetypeProfile>;
