# MindsKit UI Theme Improvement Notes

## Current issue

The current UI structure is already good, but the visual hierarchy still feels too flat.

Most areas use nearly the same white/gray tone, so the sidebar, editor, toolbar, header, and footer all appear to sit on the same visual level.

Recommended direction:

Soft Developer Workspace + Purple Accent

The goal is to keep MindsKit minimal, modern, and developer-focused while adding more depth and stronger brand identity.

1. Background Layers

---

Avoid using pure white for every surface.

Suggested light theme layers:

App background: #F7F7F9
Sidebar: #FAFAFB
Editor / Card: #FFFFFF
Secondary surface: #F2F1F5
Border: #E5E3E9
Text: #18181B
Muted text: #71717A
Primary: #8B5CF6
Primary hover: #7C3AED
Success: #16A34A
Error: #DC2626
Warning: #D97706

This creates subtle separation between the app shell, navigation, and editor without making the interface visually heavy.

2. Sidebar

---

The sidebar currently feels similar to a documentation menu.

Improve it by:

- Adding a purple tint to the active item
- Making the active icon purple
- Making category labels more muted
- Adding a soft hover background
- Increasing border radius slightly
- Keeping inactive items neutral

Suggested active state:

background: rgba(139, 92, 246, 0.08);
border: 1px solid rgba(139, 92, 246, 0.20);
color: #7C3AED;

Do not use a fully purple-filled active button.

3. Editor Surface

---

The editor should be the main visual focus of the page.

Improve the editor with:

- Clearer surface background
- Slightly stronger border
- Border radius around 10–12px
- Very subtle shadow
- Purple focus glow
- Better separation between line numbers and content
- Toolbar visually connected to the editor

Suggested focus style:

box-shadow:
0 0 0 1px rgba(139, 92, 246, 0.5),
0 0 0 4px rgba(139, 92, 246, 0.08);

The goal is to make the editor feel like a premium code workspace instead of a standard textarea.

5. Branding Gradient

---

Do not use gradients across the entire interface.

Use a very subtle purple glow only around branding or key areas.

Example:

background:
radial-gradient(
circle at top left,
rgba(139, 92, 246, 0.08),
transparent 28rem
);

Good places to use it:

- Behind the MindsKit logo
- Top-left app shell area
- Very subtle page background decoration

Avoid strong gradients inside every card or button.

6. Header

---

The current header feels too empty.

Possible structure:

MindsKit v0.1.0

                         GitHub   Theme

Future option:

MindsKit v0.1.0

                    Search tools...   GitHub   Theme

Recommended header styling:

- Semi-transparent background
- Light blur
- Bottom border
- Compact height

Example:

background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px);

This helps the UI feel more like an application.

7. Page Hierarchy

---

Add a small breadcrumb above the page title.

Example:

Text Tools / Markdown

Markdown
Apply Markdown emphasis and see the rendered result instantly.

Breadcrumb should be subtle and muted.

This improves context without taking much space.

8. Local Storage / Privacy UI

---

Current wording:

Save my input locally in this browser (off by default, never uploaded)

The concept is good, but the text is visually long.

Recommended:

[ ] Remember input
Stored only in this browser

Or:

Shield icon + Local processing

Tooltip:

Your tool content never leaves this browser.

Use lucide-react icons instead of emojis.

9. Footer

---

Keep the footer visually lightweight.

Suggested structure:

MindsKit · Simple tools for everyday development.

GitHub · LinkedIn · Privacy · License © 2026 MindsKit

Recommended:

- 12px text
- Muted color
- Thin top border
- Minimal vertical padding
- Do not give the footer strong visual weight

10. Dark Theme

---

Dark mode should be one of MindsKit's strongest visual identities because it matches the current bear logo and purple accent well.

Suggested dark theme:

Background: #0B0B0E
Surface: #121216
Surface muted: #18181D
Editor: #0D0D11
Border: #29282F
Text: #F4F4F5
Muted: #A1A1AA
Primary: #A78BFA
Primary hover: #8B5CF6

Optional subtle purple glow:

box-shadow: 0 0 24px rgba(139, 92, 246, 0.10);

Avoid excessive neon effects.

## Priority Changes

If improving the current UI incrementally, prioritize these five changes:

1. Move the center vertical toolbar to the top
2. Give editors clearer card/surface styling
3. Add visual layers between page, sidebar, and editor
4. Use purple only for active, focus, and primary actions
5. Improve dark mode to better match the MindsKit logo

These changes should provide the highest visual impact without rebuilding the existing layout.

## Design Direction Keywords

For AI-assisted implementation, use this general direction:

Linear / Vercel / Raycast inspired,
but softer and slightly more playful,
with subtle MindsKit purple identity.

Important:

Do not directly copy the UI of those products.

Use them only as inspiration for:

- Spacing
- Visual hierarchy
- Restraint
- Typography
- Surface design
- Developer-focused polish

## Overall Goal

MindsKit should feel like:

- A modern developer utility product
- Clean and lightweight
- Privacy-focused
- Professional but not corporate
- Minimal without feeling empty
- Recognizable through subtle purple branding
- Comfortable for long periods of code/text editing

Avoid:

- Excessive gradients
- Too many accent colors
- Heavy shadows
- Large decorative elements
- Overly rounded mobile-style cards
- Strong neon effects
- Crowded toolbars
