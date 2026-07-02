// Diccionarios de keywords para el syntax highlighting del editor.
// Cada categoría tiene un color asignado en styles.css (.hl-<categoría>).

export const KEYWORD_CATEGORIES = {
  lighting: {
    label: 'Iluminación',
    terms: [
      'firelight', 'moonlight', 'sunlight', 'daylight', 'candlelight', 'lamplight',
      'neon', 'golden hour', 'blue hour', 'magic hour', 'overcast', 'backlit',
      'backlight', 'rim light', 'rim lighting', 'key light', 'fill light', 'hair light',
      'soft light', 'hard light', 'diffused light', 'volumetric light', 'volumetric',
      'god rays', 'light shafts', 'lens flare', 'glow', 'bioluminescent', 'ambient light',
      'practical lights', 'chiaroscuro', 'low-key', 'high-key', 'low key', 'high key',
      'silhouette', 'highlights', 'shadows', 'contrast', 'underexposed', 'overexposed',
      'dappled light', 'window light', 'top light', 'uplighting', 'strobe', 'flash',
      'tungsten', 'fluorescent', 'sodium vapor', 'moody lighting', 'dramatic lighting',
      'natural light', 'studio lighting', 'three-point lighting', 'rembrandt lighting',
      'butterfly lighting', 'split lighting', 'catchlights', 'specular', 'bounce light',
      'negative fill', 'gel', 'colored gels', 'flickering', 'glowing', 'luminous',
    ],
  },
  camera: {
    label: 'Cámara y lente',
    terms: [
      'close-up', 'close up', 'extreme close-up', 'medium shot', 'wide shot', 'full shot',
      'long shot', 'establishing shot', 'aerial shot', 'drone shot', 'overhead',
      'bird\'s-eye', 'birds-eye', 'worm\'s-eye', 'low-angle', 'high-angle', 'low angle',
      'high angle', 'eye-level', 'eye level', 'dutch angle', 'dutch tilt', 'over-the-shoulder',
      'over the shoulder', 'pov', 'point of view', 'two-shot', 'insert shot', 'macro',
      'telephoto', 'wide-angle', 'wide angle', 'fisheye', 'anamorphic', 'prime lens',
      'zoom lens', '35mm', '50mm', '85mm', '24mm', '14mm', '100mm', '135mm', '200mm',
      'f/1.2', 'f/1.4', 'f/1.8', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16',
      'shallow depth of field', 'deep focus', 'depth of field', 'bokeh', 'rack focus',
      'soft focus', 'tilt-shift', 'tracking shot', 'dolly', 'dolly zoom', 'crane shot',
      'steadicam', 'handheld', 'gimbal', 'pan', 'tilt', 'whip pan', 'zoom', 'push-in',
      'push in', 'pull-out', 'pull out', 'orbit', 'arc shot', 'static shot', 'locked-off',
      'slow motion', 'slow-motion', 'timelapse', 'time-lapse', 'hyperlapse', 'motion blur',
      'long exposure', 'freeze frame', 'framing', 'perspective', 'vantage point',
      'imax', 'full-frame', 'medium format', 'large format', 'viewfinder', 'lens',
    ],
  },
  style: {
    label: 'Estilo',
    terms: [
      'cinematic', 'photorealistic', 'hyperrealistic', 'realistic', 'realism',
      'blockbuster', 'film noir', 'noir', 'neo-noir', 'documentary', 'editorial',
      'fashion editorial', 'vintage', 'retro', 'futuristic', 'cyberpunk', 'steampunk',
      'dieselpunk', 'solarpunk', 'minimalist', 'maximalist', 'baroque', 'gothic',
      'surreal', 'surrealist', 'dreamlike', 'ethereal', 'painterly', 'impressionist',
      'expressionist', 'brutalist', 'art deco', 'art nouveau', 'vaporwave', 'synthwave',
      'grunge', 'gritty', 'polished', 'stylized', 'anime', 'manga', 'comic book',
      'graphic novel', 'watercolor', 'oil painting', 'charcoal', 'pencil sketch',
      'concept art', 'matte painting', 'octane render', 'unreal engine', '3d render',
      'claymation', 'stop motion', 'pixel art', 'low poly', 'isometric', 'look',
      'kodak', 'fujifilm', 'portra', 'ektachrome', 'kodachrome', 'cinestill', 'velvia',
      'tri-x', 'ilford', 'polaroid', 'film grain', 'grain', 'analog', '8mm', '16mm',
      '70mm', 'vhs', 'found footage', 'technicolor', 'sepia', 'monochrome',
      'black and white', 'desaturated', 'saturated', 'teal and orange', 'color grade',
      'color graded', 'bleach bypass', 'cross-processed', 'pastel', 'neon palette',
    ],
  },
  composition: {
    label: 'Composición',
    terms: [
      'rule of thirds', 'centered', 'centered composition', 'symmetrical', 'symmetry',
      'asymmetrical', 'golden ratio', 'leading lines', 'diagonal lines', 'negative space',
      'frame within a frame', 'frame within frame', 'foreground', 'midground',
      'background', 'depth layers', 'layered', 'layering', 'vanishing point',
      'one-point perspective', 'balanced', 'off-center', 'tight framing', 'loose framing',
      'headroom', 'lead room', 'wide', 'panoramic', 'vertical', 'portrait orientation',
      'landscape orientation', '16:9', '9:16', '4:3', '1:1', '2.39:1', '21:9',
      'letterbox', 'full-bleed', 'crop', 'cropped', 'scale', 'massive in scale',
      'towering', 'vast', 'intimate', 'claustrophobic', 'expansive', 'minimal composition',
      'cluttered', 'geometric', 'patterns', 'repetition', 'juxtaposition', 'triangular composition',
    ],
  },
  emotion: {
    label: 'Emoción y tono',
    terms: [
      'dramatic', 'epic', 'intense', 'violent', 'chaotic', 'serene', 'calm', 'peaceful',
      'melancholic', 'melancholy', 'nostalgic', 'nostalgia', 'eerie', 'ominous',
      'foreboding', 'menacing', 'tense', 'suspenseful', 'joyful', 'euphoric', 'triumphant',
      'somber', 'grim', 'bleak', 'hopeful', 'wistful', 'romantic', 'passionate',
      'mysterious', 'enigmatic', 'haunting', 'unsettling', 'awe-inspiring', 'awe',
      'majestic', 'grandiose', 'powerful', 'overwhelming', 'delicate', 'fragile',
      'tender', 'brooding', 'moody', 'atmospheric', 'dynamic', 'energetic', 'frenetic',
      'lonely', 'isolated', 'desolate', 'vibrant', 'lively', 'playful', 'whimsical',
      'sinister', 'dread', 'terror', 'wonder', 'longing', 'yearning', 'defiant',
      'unstoppable', 'destructive', 'explosive', 'feel', 'mood', 'tone', 'emotion',
    ],
  },
  motion: {
    label: 'Movimiento y acción',
    terms: [
      'running', 'sprinting', 'walking', 'falling', 'flying', 'floating', 'drifting',
      'exploding', 'explosion', 'collapsing', 'crashing', 'shattering', 'bursting',
      'swirling', 'spinning', 'rotating', 'rising', 'descending', 'charging', 'leaping',
      'jumping', 'diving', 'crawling', 'chasing', 'fleeing', 'fighting', 'colliding',
      'billowing', 'flowing', 'rippling', 'cascading', 'erupting', 'igniting', 'burning',
      'smoldering', 'crumbling', 'trembling', 'shaking', 'vibrating', 'accelerating',
      'suspended', 'frozen mid-air', 'mid-air', 'in motion', 'kinetic',
    ],
  },
}

// Compila un solo regex por categoría (case-insensitive, límites de palabra).
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

export const CATEGORY_REGEXES = Object.entries(KEYWORD_CATEGORIES).map(
  ([key, { terms }]) => {
    // Ordena por longitud descendente para que "golden hour" gane a "golden".
    const sorted = [...terms].sort((a, b) => b.length - a.length)
    return {
      key,
      regex: new RegExp(`(?<![\\w-])(${sorted.map(escapeRe).join('|')})(?![\\w-])`, 'gi'),
    }
  }
)

// Nombres de sección canónicos del editor estructurado.
export const SECTION_NAMES = [
  'Subject', 'Composition', 'Style', 'Lighting', 'Camera', 'Mood',
  'Action', 'Environment', 'Color', 'Details', 'Audio', 'Negative',
]
