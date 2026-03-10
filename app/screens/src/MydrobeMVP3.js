import { useState } from "react";

const T = {
  bg:       "#F7F5F0",
  surface:  "#FFFFFF",
  card:     "#FAFAF7",
  border:   "#E8E4DC",
  ink:      "#1A1814",
  muted:    "#9B9690",
  lime:     "#3DFF8E",
  limeDeep: "#00D46A",
  tag:      "#F0EDE6",
};

const screens = [
  {
    id: "onboarding", nav: "SCREEN 01", label: "Onboarding", emoji: "◈",
    tagline: "Hook fast. Replace the Notes habit.",
    slogan: '"Your wardrobe, made savable, made social."',
    description: "3 screens. Zero friction. The pitch is personal, not social — we're solving the messy-Notes problem first. Sign-up is phone/Apple/Google with one field: a username. No lengthy profile setup. Users are in the app within 60 seconds.",
    layout: [
      { zone: "Splash Screen", detail: "Full-bleed warm off-white bg. Animated outfit sticker cutouts drifting and overlapping. Centre: large Syne wordmark 'MyDrobe'. Below: slogan 'Your wardrobe, made savable, made social.' One CTA: 'Get Started →' in a mint pill. Card 1 of carousel must show the Notes vs MyDrobe contrast — this is the hook." },
      { zone: "3-Card Value Carousel", detail: "Card 1 — THE PROBLEM: split image, left = chaotic Notes screenshot, right = clean MyDrobe wardrobe. Copy: 'Ditch the Notes hack.' Card 2 — THE MAGIC: animated photo → bg dissolves → sticker floats. Copy: 'One tap. Your outfit, clipped.' Card 3 — MEMORY: throwback notification mockup. Copy: 'Never forget a fit you loved.' Pill progress dots. Skip link top-right." },
      { zone: "Sign-Up Screen", detail: "Minimal. 'Create your MyDrobe.' Username field only. Continue with Apple / Google / phone. No email. No DOB. Tap → straight to empty Wardrobe. Terms in tiny text at bottom." },
      { zone: "First-Use Empty State", detail: "Illustrated hanger + floating empty sticker outline. Copy: 'Your wardrobe is waiting. Add your first fit →'. Large pulsing Add button. No sample data. Immediately actionable." },
    ],
    ux: [
      "Time to first outfit clip: target under 90 seconds from cold open",
      "No email verification gate — remove all friction before first value moment",
      "Carousel is skippable — power users just tap 'Get Started' and go",
      "Username is the only required field; profile photo added later",
    ],
  },
  {
    id: "wardrobe", nav: "SCREEN 02", label: "Wardrobe Home", emoji: "⊞",
    tagline: "The home screen. Your sticker shelves.",
    slogan: "This is where users live. Make it beautiful.",
    description: "The hero screen. Replaces the messy Notes system with a visual, satisfying wardrobe of outfit sticker folders. Personal-first: no social prompts here. Users can create multiple named wardrobes, each showing a fan preview of their top 3 stickers.",
    layout: [
      { zone: "Top Bar", detail: "Left: 'MyDrobe' wordmark (small, tasteful). Right: Search icon (MVP = search within wardrobe names only) + avatar thumbnail. No clutter." },
      { zone: "Wardrobe Folder Grid", detail: "2-column grid of wardrobe folder cards. Each card: warm white rounded card with subtle drop shadow. Top half: sticker fan — top 3 outfit stickers overlapping at angles like a deck of cards. Bottom half: folder name + outfit count badge. Privacy indicator: tiny icon — Private / Friends / Public. Last card: dashed-border '+ New Wardrobe'." },
      { zone: "Inside a Wardrobe", detail: "Tap folder → full-screen wardrobe view. Header: folder name + back arrow + privacy toggle pill + edit icon. Grid: masonry/staggered layout of outfit stickers — each on a light card with date worn (top-right) and brand tag pills below. Long-press = drag to reorder or delete. Tap sticker = Outfit Detail view." },
      { zone: "Outfit Detail View", detail: "Full-screen modal. Large sticker centred. Below: date worn, optional note/caption, tagged items as tappable pills. Action row: Edit / Move to Wardrobe / Delete. Share button (MVP: iOS share sheet). Memory chip if 1 year old: 'You wore this 1 year ago'." },
      { zone: "Privacy Toggle", detail: "Inside wardrobe header: segmented pill — Private · Friends · Public. Default = Private. In MVP, controls whether wardrobe appears on the user's profile when others visit. Feed sharing is Phase 2." },
    ],
    ux: [
      "Sticker fan animates on folder tap — cards fan out like shuffling a deck",
      "Empty wardrobe states are warm and inviting, never cold or clinical",
      "Drag-to-reorder within a wardrobe; long-press to enter edit mode",
      "Privacy default is Private — users opt in to sharing, never surprised",
    ],
  },
  {
    id: "add", nav: "SCREEN 03", label: "Add Outfit", emoji: "⊕",
    tagline: "The magic moment. This is why they downloaded it.",
    slogan: "Snap. Clip. Save. Done.",
    description: "The core product action. Triggered by the central Add button in the bottom nav (large, pill-shaped, stands out). The flow replicates the satisfying 'hold-down to sticker' gesture users already know — but faster, smarter, and organised. Must feel instant and delightful.",
    layout: [
      { zone: "Step 1 — Capture", detail: "Full-screen camera. Faint silhouette guide overlay to help framing. Bottom: large shutter button, gallery thumbnail (left), flip camera (right). Top-left: X to close. Tip chip: 'Plain background = cleaner clip'. Gallery opens full photo picker — recents shown as large tiles." },
      { zone: "Step 2 — The Clip (Magic Moment)", detail: "THIS IS THE HERO INTERACTION. Photo taken → background dissolves away (~0.8s), outfit cutout remains floating on soft neutral bg. Before/after split: before (faded) → after (vibrant sticker). Mint accent glow on sticker edge. Optional sound: soft 'clip' pop. Eraser brush for edge cleanup. CTAs: 'Redo' and 'Looks good →'. This screen should feel like unwrapping something. Do not rush it." },
      { zone: "Step 3 — Save to Wardrobe", detail: "Sticker shown at top (smaller). 'Add to wardrobe:' — horizontal scrollable chip row of existing wardrobes + '+ New' chip. Selected wardrobe highlights in mint. Date worn: auto-today, tappable calendar picker. Optional note field. This step should feel like filing, not filling a form." },
      { zone: "Step 4 — Tag Items (Optional)", detail: "'Skip' clearly visible top-right — NEVER block saving. Sticker shown large. 'Tap your outfit to tag a piece.' Tap drops a pin → text field: 'Brand or store name'. Autocomplete from previous tags. Tags appear as small pill overlays on sticker. Max 6 tags in MVP." },
      { zone: "Step 5 — Confirmation", detail: "Sticker 'flies' into the target wardrobe folder thumbnail, scaling down into it. Copy: 'Saved to [Wardrobe Name]'. Two options: 'Add another' (loops back to camera) or 'View Wardrobe'. No forced share prompt in Phase 1." },
    ],
    ux: [
      "Entire flow from photo to saved: target under 20 seconds",
      "Step 4 (tagging) must be skippable with a single tap — never a blocker",
      "The clip animation is the moment users will screenshot and share — invest in it",
      "Use optimistic UI: show instant sticker preview while processing finishes in background",
    ],
  },
  {
    id: "profile", nav: "SCREEN 04", label: "Profile", emoji: "◉",
    tagline: "Your style history. All in one scroll.",
    slogan: "Personal record first. Social showcase second.",
    description: "The profile is a personal dashboard in Phase 1 — not a public showcase. It shows outfit count, streak, wardrobe grid, and memory moments. Other users can visit profiles once social features launch in Phase 2, but the primary design is self-facing.",
    layout: [
      { zone: "Profile Header", detail: "Large avatar circle (tappable to change). Username + optional display name. Three stats in a row: Outfits · Wardrobes · Streak (all tappable). 'Edit Profile' button (own view). Phase 2: 'Follow' + 'Message' buttons for other users." },
      { zone: "Streak Bar", detail: "Horizontal strip just below header. '[N]-day streak' — mini dot calendar, last 7 days. Filled dot = outfit added that day; hollow = missed. Tapping opens full streak calendar. If streak = 0: shows 'Start your streak today' instead." },
      { zone: "Content Tabs", detail: "Two tabs in Phase 1: 'Wardrobes' | 'History'. Wardrobes = same folder grid as home tab. History = chronological list/grid of every outfit added, sorted newest first. Each entry: sticker thumbnail + wardrobe badge + date. Scrollable, searchable. Phase 2 adds 'Posts' tab." },
      { zone: "Outfit Memory Card", detail: "Appears at top of History when triggered (1yr+ data). Warm card with throwback sticker, copy: 'You wore this 347 days ago.' Tappable to view full outfit detail. 'Re-save' button adds to today's date. Dismissable with swipe. One card shown at a time." },
      { zone: "Monthly Recap Card", detail: "Pinned top of History at month end. 'Your [Month] Top Looks' — collage of top 3 stickers. 'Export as image' generates a clean 1080x1080 graphic — 3 stickers on neutral bg + 'MyDrobe' watermark. Single tap → saves to camera roll. This is the organic virality driver." },
    ],
    ux: [
      "Profile is self-facing in Phase 1 — design for the individual, not the audience",
      "Streak only counts days when an outfit was added, not days the app was opened",
      "Monthly recap export: single tap → saves to camera roll, no share sheet friction",
      "History is searchable by date, wardrobe, or tag in Phase 1",
    ],
  },
];

const phase1 = [
  { icon: "◈", label: "Onboarding",    sub: "Sign up · value hook" },
  { icon: "⊞", label: "Wardrobe Home", sub: "Folder grid · sticker shelves" },
  { icon: "⊕", label: "Add Outfit",    sub: "Snap · clip · save" },
  { icon: "◉", label: "Profile",       sub: "History · streaks · recap" },
];

const phase2List = [
  { icon: "◎", label: "Social Feed",        sub: "Friends · Discover · OOTD" },
  { icon: "◆", label: "Chat & DMs",         sub: "Share outfits · Help Me Pick" },
  { icon: "⬡", label: "Brand Tags",         sub: "Tap-to-tag · brand links" },
  { icon: "◑", label: "Explore / Search",   sub: "Tags · trending looks" },
  { icon: "⟳", label: "Repost & Save",      sub: "Save friends' stickers" },
  { icon: "★", label: "OOTD / Today's Fit", sub: "Daily post · public streak" },
  { icon: "⊙", label: "Public Profiles",    sub: "Shareable URL · followers" },
  { icon: "◬", label: "Notifications v2",   sub: "Likes · reposts · follows" },
];

const phase2Features = [
  { icon: "◎", label: "Social Feed",          detail: "Friends + Discover tabs. OOTD posts. Chronological by default. Today's Fit daily prompt." },
  { icon: "◆", label: "Chat & DMs",           detail: "1:1 DMs with outfit-sticker sharing. 'Help Me Pick' poll — vote between 2–4 stickers." },
  { icon: "⬡", label: "Brand Tags Enhanced",  detail: "Link tags to real brand pages. Tap to shop or explore brand. Affiliate layer possible." },
  { icon: "◑", label: "Explore & Search",     detail: "Search by tag, brand, wardrobe name. Trending hashtags. Discover public wardrobes." },
  { icon: "⟳", label: "Repost & Save",        detail: "Save a friend's outfit sticker to your own wardrobe. Repost with credit to feed." },
  { icon: "★", label: "OOTD / Today's Fit",   detail: "Daily challenge. One post per day. Streak tied to posting publicly, not just saving." },
  { icon: "⊙", label: "Public Profiles",      detail: "Profile becomes a shareable URL. Followers/following. Bio link. Wardrobe showcase." },
  { icon: "◬", label: "Monthly Recap Social", detail: "Recap card gets likes/comments. Others can vote 'Outfit of the Month'." },
];

const userFlow = [
  { n: "1", label: "Sign Up",      sub: "Phone / Apple / Google", c: "#3DFF8E" },
  { n: "2", label: "Snap Fit",     sub: "Camera or Gallery",       c: "#FFD166" },
  { n: "3", label: "Clip Sticker", sub: "BG removed instantly",    c: "#FF6B9D" },
  { n: "4", label: "Save",         sub: "Choose wardrobe + date",  c: "#74C0FC" },
  { n: "5", label: "Tag (opt)",    sub: "Brand / store labels",    c: "#B197FC" },
  { n: "6", label: "Remember",     sub: "Memory + streak + recap", c: "#63E6BE" },
];

export default function MydrobeMVP3() {
  const [active, setActive] = useState("onboarding");
  const [openZone, setOpenZone] = useState(null);
  const [view, setView] = useState("screens");
  const cur = screens.find(s => s.id === active);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: T.bg, color: T.ink, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Syne:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #F7F5F0; }
        ::-webkit-scrollbar-thumb { background: #E8E4DC; border-radius: 2px; }
        .nb { background: none; border: none; cursor: pointer; font-family: inherit; }
        .nav-item { transition: all 0.18s; border-radius: 8px; }
        .nav-item:hover { background: #E8E4DC !important; }
        .nav-item.act { background: #1A1814 !important; color: #F7F5F0 !important; }
        .zone { transition: border-color 0.18s, background 0.18s; cursor: pointer; }
        .zone:hover { border-color: #1A1814 !important; }
        .zone.open { border-color: #1A1814 !important; background: #FFFFFF !important; }
        .p2card { transition: box-shadow 0.18s; }
        .p2card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
      `}</style>

      {/* The rest of your component rendering */}
    </div>
  );
}
