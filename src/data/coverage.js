// Coberturas de rodaje: cada una descompone la escena del editor en 6 planos.
// `shots` son instrucciones de cámara que se combinan con el prompt base;
// la IA (o el modo offline) genera un prompt completo por plano.

export const COVERAGE_TYPES = [
  {
    id: 'full', name: 'Full Coverage',
    desc: 'Cobertura completa clásica: del establishing al detalle.',
    shots: [
      { label: 'Establishing', instruction: 'Extreme wide establishing shot showing the full location and where the subject sits within it.' },
      { label: 'Wide', instruction: 'Wide shot of the subject fully in frame, grounded in the environment.' },
      { label: 'Medium', instruction: 'Medium shot from the waist up, balancing subject presence and context.' },
      { label: 'Close-Up', instruction: 'Close-up on the subject, shallow depth of field, emotional detail readable.' },
      { label: 'Insert', instruction: 'Insert shot of the most story-relevant detail or object in the scene.' },
      { label: 'Reverse', instruction: 'Reverse angle from behind or opposite the subject, revealing what the main angle hid.' },
    ],
  },
  {
    id: 'dialogue', name: 'Dialogue Coverage',
    desc: 'Escena de diálogo entre dos personajes.',
    shots: [
      { label: 'Two-Shot Wide', instruction: 'Wide two-shot establishing both characters and the geography of the conversation.' },
      { label: 'OTS on A', instruction: 'Over-the-shoulder shot favoring character A, character B\'s shoulder as foreground occlusion.' },
      { label: 'OTS on B', instruction: 'Reverse over-the-shoulder favoring character B.' },
      { label: 'Single A (CU)', instruction: 'Clean close-up single on character A, reacting and speaking.' },
      { label: 'Single B (CU)', instruction: 'Clean close-up single on character B.' },
      { label: 'Detail / Hands', instruction: 'Insert on hands, an object exchanged, or a nervous gesture betraying subtext.' },
    ],
  },
  {
    id: 'motion', name: 'Motion Coverage',
    desc: 'Sujeto en movimiento a través del espacio.',
    shots: [
      { label: 'Wide Travel', instruction: 'Extreme wide shot of the subject moving through the full environment.' },
      { label: 'Lateral Track', instruction: 'Lateral tracking shot moving alongside the subject, foreground parallax.' },
      { label: 'Follow Behind', instruction: 'Steadicam follow directly behind the subject, moving into the scene with them.' },
      { label: 'Lead / Face-On', instruction: 'Camera leading in front of the moving subject, face and effort visible.' },
      { label: 'Feet / Detail', instruction: 'Low insert on feet, wheels or contact points hammering the surface.' },
      { label: 'Arrival', instruction: 'Static shot at the destination as the subject enters and stops in frame.' },
    ],
  },
  {
    id: 'extreme-action', name: 'Extreme Action',
    desc: 'Set-piece de acción de alto impacto.',
    shots: [
      { label: 'Epic Wide', instruction: 'Epic low-angle extreme wide of the full action at its peak, maximum scale.' },
      { label: 'Impact CU', instruction: 'Brutal close-up at the exact moment of impact, debris frozen at high shutter speed.' },
      { label: 'Slow-Mo Detail', instruction: 'Ultra slow-motion 120fps detail: particles, glass, sparks suspended mid-air.' },
      { label: 'POV', instruction: 'First-person POV inside the action, visceral and disorienting.' },
      { label: 'Whip Track', instruction: 'Aggressive fast tracking shot whipping past foreground obstacles toward the action.' },
      { label: 'Aftermath Tableau', instruction: 'Static wide of the aftermath: smoke, debris, silence after the chaos.' },
    ],
  },
  {
    id: 'establishing', name: 'Establishing Sequence',
    desc: 'Presentación cinematográfica de un lugar.',
    shots: [
      { label: 'Aerial Approach', instruction: 'Sweeping aerial drone approach toward the location from far away.' },
      { label: 'Landmark Wide', instruction: 'Iconic wide shot of the location\'s most recognizable feature.' },
      { label: 'Street Level', instruction: 'Eye-level shot at ground level, life and texture of the place in motion.' },
      { label: 'Texture Detail', instruction: 'Macro detail of a surface or object that captures the location\'s character.' },
      { label: 'Inhabitant', instruction: 'Candid medium shot of a typical inhabitant absorbed in daily routine.' },
      { label: 'Transition Out', instruction: 'Slow push toward a door, window or corridor that leads deeper into the story.' },
    ],
  },
  {
    id: 'surveillance', name: 'Surveillance Coverage',
    desc: 'La escena vista por cámaras y observadores ocultos.',
    shots: [
      { label: 'CCTV High Corner', instruction: 'Grainy CCTV footage from a high corner angle, timestamp overlay, fixed frame.' },
      { label: 'Long Lens Stakeout', instruction: '200mm telephoto from across the street, compressed planes, shot through a car window.' },
      { label: 'Hidden POV', instruction: 'Partially obstructed POV from a hiding place, foreground objects masking the frame edges.' },
      { label: 'Reflection Spy', instruction: 'The subject observed indirectly through a mirror or shop window reflection.' },
      { label: 'Drone Overhead', instruction: 'Silent overhead drone shot tracking the subject through the space, top-down.' },
      { label: 'Monitor Wall', instruction: 'Bank of security monitors displaying the scene from multiple angles simultaneously.' },
    ],
  },
  {
    id: 'entrance', name: 'Entrance Coverage',
    desc: 'La entrada de un personaje con presencia.',
    shots: [
      { label: 'Door Wide', instruction: 'Wide shot of the entrance as the doors open, backlit silhouette in the threshold.' },
      { label: 'Feet First', instruction: 'Low insert of the first footsteps crossing the threshold.' },
      { label: 'Reaction', instruction: 'Reaction shots of those already in the room turning toward the entrance.' },
      { label: 'Hero Reveal', instruction: 'Slow tilt-up or push-in revealing the character\'s face for the first time, low angle.' },
      { label: 'Walk Through', instruction: 'Steadicam leading the character as they walk through the parting crowd.' },
      { label: 'Arrival Mark', instruction: 'The character stops at their destination, holding the frame with full presence.' },
    ],
  },
  {
    id: 'parallel', name: 'Parallel Action',
    desc: 'Dos acciones simultáneas que convergen.',
    shots: [
      { label: 'Action A Wide', instruction: 'Wide shot establishing action A in its location.' },
      { label: 'Action B Wide', instruction: 'Wide shot establishing action B in a different location, visual contrast with A.' },
      { label: 'A Detail', instruction: 'Tense close-up detail inside action A, clock-ticking urgency.' },
      { label: 'B Detail', instruction: 'Matching close-up inside action B, rhyming composition with the A detail.' },
      { label: 'Convergence', instruction: 'The moment the two actions collide or connect in the same frame.' },
      { label: 'Aftermath Split', instruction: 'Wide shot of the merged aftermath, both threads resolved in one composition.' },
    ],
  },
]
