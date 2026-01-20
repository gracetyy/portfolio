Add the section as shown in the image (C:\Users\Grace\Dev\GitCloneProjects\portfolio\Screenshot 2026-01-18 193916.png) between hero and projects section. It is a "floating" "Manila Folder" or "Case File" in mid air.

LAYOUT STRUCTURE:

1. MAIN CONTAINER (THE FOLDER):

- A large, beige/tan rounded rectangle serving as the background.
- Top Tabs: Four distinct file tabs sticking out from the top edge:
- ABOUT
- HOBBIES
- MISC
- The tabs should look physically layered (different z-indices, subtle top shadows).

2. CONTENT GRID (BENTO BOX STYLE):

- Inside the folder, content is organized into "Paper Cards" taped or clipped onto the folder.

A. LEFT COLUMN (PROFILE CARD):

- Appearance: A frosted glass or translucent paper sheet overlaying the folder texture.
- Content:
- Name: "Grace Yuen" (Large, white/bright sans-serif).
- Role: "Year 3 Computer Science Student @ HKU" (Electric Blue text).
- Bio: 2 paragraphs of small, readable placeholder text (white opacity 80%).
- Footer Actions: "DOWNLOAD CV" (Underlined link) and "CONTACT" (Text link).
- Decor: A subtle "Tape" graphic at the top center holding it down. A faint handwritten text in the bottom right.

B. RIGHT COLUMN (SKILLS & STATUS):

- A 2x2 Grid of smaller white cards.
- Card 1:
  Title: Programming
  Skills as pill tags: Python, Java, R, C, C++
  Card 2: DevOps: Linux CLI, Git, Powershell
  Card 3: Web Development: HTML, CSS, JavaScript, TypeScript, React, Figma
  Card 4: Software: Github, Google Cloud, AWS, Azure, Splunk, Jira, Microsoft Office, Power Automate, Blender, Canva

VISUAL DETAILS:

- Texture: The folder and paper needs a subtle noise texture or paper grain to feel physical, not just a flat CSS color.
- Lighting: A soft top-down light source causing the cards to cast soft drop shadows onto the folder background.

INTERACTIONS (FRAMER MOTION):

- Entrance: The entire folder slides up from the bottom (Y-axis) with a subtile spring animation.
- Tab Hover: Hovering a folder back tab makes it pop up slightly (Y -5px).
- Card Hover: Hovering any white skill card causes a slight "lift" (scale 1.02, shadow increases).
- Tags: Hovering a skill tag (pill) makes it glow with the "Electric Blue" accent color and text color adjust acoordingly to ensure reability

TECHNICAL REQUIREMENTS:

- Use Tailwind CSS for styling (bg-opacity, backdrop-blur, shadow-lg).
- Use `framer-motion` for the layout transitions.
- Ensure the "Tape" and "Sticker" visual elements are implemented (either via CSS shapes or SVG icons).
- The layout must be responsive
