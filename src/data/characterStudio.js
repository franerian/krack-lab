// Definición de los formularios del Character Studio.
// Cada "look" (pestaña) comparte los campos base y aporta su Cinematic Look.

export const CHARACTER_FIELDS = [
  { group: 'Subject', fields: [
    { id: 'name', label: 'Name', type: 'text', width: 3, placeholder: 'ELIAS HART' },
    { id: 'age', label: 'Age', type: 'text', width: 1, placeholder: '35' },
    { id: 'gender', label: 'Gender', type: 'text', width: 1, placeholder: 'man' },
    { id: 'ethnicity', label: 'Ethnicity', type: 'text', width: 5, placeholder: 'White European' },
    { id: 'face', label: 'Face & Features', type: 'text', width: 5, placeholder: 'fair skin, angular face, light stubble, defined cheekbones, straight nose, thin lips' },
    { id: 'hair', label: 'Hair', type: 'text', width: 5, placeholder: 'silver-gray, short, tousled, spiky texture, fuller on top, slightly darker sides' },
    { id: 'clothing', label: 'Clothing', type: 'text', width: 5, placeholder: 'white turtleneck sweater, smooth knit fabric, clean fitted silhouette, minimalist style' },
  ]},
  { group: 'Mood & Scene', fields: [
    { id: 'expression', label: 'Expression', type: 'text', width: 5, placeholder: 'calm serious expression, slightly parted lips, attentive and composed intensity' },
    { id: 'eyes', label: 'Eye Direction', type: 'text', width: 25, placeholder: 'hazel-brown eyes, direct camera gaze, soft catchlights' },
    { id: 'mood', label: 'Mood', type: 'text', width: 25, placeholder: 'professional, polished, quietly confident atmosphere' },
    { id: 'location', label: 'Location / Environment', type: 'text', width: 5, placeholder: 'studio portrait setting with plain neutral backdrop' },
  ]},
  { group: 'Cinematic Look', fields: [
    { id: 'keylight', label: 'Key Light Side', type: 'select', width: 25,
      options: ['Key Light from Left', 'Key Light from Right', 'Frontal Key Light', 'Backlit / Rim', 'Top Light', 'Underlight'] },
    { id: 'lightmood', label: 'Lighting Mood', type: 'select', width: 25,
      options: ['Natural Light', 'Soft Studio', 'Hard Dramatic', 'Golden Hour', 'Neon Night', 'Low-Key Moody', 'High-Key Bright', 'Candlelight'] },
  ]},
]

// Cada look define el envoltorio de estilo del prompt final.
export const CHARACTER_LOOKS = [
  {
    id: 'cinematic', label: 'Cinematic',
    style: 'cinematic film still, shot on ARRI Alexa with anamorphic lenses, shallow depth of field, film grain, rich color grade',
    framing: 'medium close-up, cinematic composition',
  },
  {
    id: 'interview', label: 'Interview',
    style: 'documentary interview setup, seated subject, softly blurred production background with practical lights, honest and warm',
    framing: 'medium shot, subject slightly off-center at rule-of-thirds, looking just off camera',
  },
  {
    id: 'fashion', label: 'Fashion',
    style: 'high-fashion editorial photography, bold studio flash, seamless backdrop, magazine cover polish',
    framing: 'three-quarter fashion pose, full styling visible, confident stance',
  },
  {
    id: 'film-scene', label: 'Film Scene',
    style: 'a frame from a narrative feature film, the character mid-scene in a lived-in environment, motivated practical lighting',
    framing: 'wide or medium shot embedding the character in the scene, caught mid-action, unaware of camera',
  },
  {
    id: 'portrait', label: 'Portrait',
    style: 'fine art studio portrait, medium format detail, painterly single-source light, timeless neutral backdrop',
    framing: 'chest-up portrait framing, direct engagement with the lens',
  },
  {
    id: 'street', label: 'Street',
    style: 'candid street photography, 35mm film reportage look, natural urban light, authentic imperfection',
    framing: 'environmental medium-full shot, the character within real street life',
  },
]

export const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4', '2.39:1']

// Compila el formulario de personaje a texto de prompt.
// `locked` inyecta una regla MANDATORY de consistencia visual — para escenas
// donde el personaje debe verse igual entre planos (facial features, wardrobe,
// etnia). Es lo equivalente a un "reference lock" de Runway/Nano Banana.
export function compileCharacter(values, lookId, locked = false) {
  const look = CHARACTER_LOOKS.find((l) => l.id === lookId) || CHARACTER_LOOKS[0]
  const v = (id) => (values[id] || '').trim()
  const subjectBits = [
    v('name') && `${v('name')}${v('age') ? `, ${v('age')} years old` : ''}${v('gender') ? ` ${v('gender')}` : ''}`,
    v('ethnicity'), v('face'), v('hair') && `hair: ${v('hair')}`, v('clothing') && `wearing ${v('clothing')}`,
  ].filter(Boolean)
  const moodBits = [v('expression'), v('eyes'), v('mood')].filter(Boolean)
  const lightBits = [v('keylight'), v('lightmood')].filter(Boolean)
  let subject = subjectBits.join('. ')
  if (locked && subject) {
    subject += '. MANDATORY — CHARACTER CONSISTENCY LOCK: preserve this character\'s exact facial features, hair, wardrobe and ethnicity across every shot; no reinvention, no drift from the reference'
  }
  return {
    Subject: subject,
    Style: look.style,
    Lighting: lightBits.join(', '),
    Camera: look.framing,
    Mood: moodBits.join('. '),
    Environment: v('location'),
  }
}
