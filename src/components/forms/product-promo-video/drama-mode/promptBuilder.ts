import type { DramaDNA, DramaAct } from "./types";
import { AUTO_GIMMICK_TEMPLATES, DRAMA_CTA_GIMMICK_PRESETS, calcDramaActs, calcCtaScenes } from "./constants";

// ─── MODEL DESCRIPTION ────────────────────────────────────────────────────────

function modelDesc(genderAge: string): string {
	const map: Record<string, string> = {
		"pria-muda": "Indonesian male, 19-27 years old, youthful energetic look, athletic build, natural skin tone",
		"pria-tua": "Indonesian male, 30-45 years old, mature distinguished look, confident presence, slightly weathered features",
		"wanita-muda": "Indonesian female, 19-27 years old, youthful vibrant appearance, expressive face, natural beauty",
		"wanita-tua": "Indonesian female, 30-45 years old, mature elegant appearance, warm and trustworthy expression",
	};
	return map[genderAge] ?? map["wanita-muda"];
}

// ─── COLOR GRADE TRANSITIONS ──────────────────────────────────────────────────

const COLOR_GRADES = {
	act1: "desaturated blue-grey tones, heavy vignette, soft drama filter — sinetron style",
	act2: "increasingly exaggerated contrast, theatrical shadows, Korean drama golden-orange cast, dynamic DOF shifts",
	act3_start: "sudden shift to bright saturated commercial palette — vibrant, clean, colorful product-ad aesthetic",
	act3_end: "warm golden-hour commercial glow, product hero lighting, soft bokeh",
	cta: "clean bright studio-style or lifestyle-warm tones, product-forward lighting",
};

// ─── ACT CONTEXT BUILDER ──────────────────────────────────────────────────────

function buildActContext(dna: DramaDNA): string {
	const template = AUTO_GIMMICK_TEMPLATES[dna.productCategory] ?? AUTO_GIMMICK_TEMPLATES["lainnya"];
	const acts = calcDramaActs(dna.totalDurationSec, dna.secPerScene);

	return `
ACT STRUCTURE (${dna.totalScenes} scenes total):
${acts.map(a => `• ACT ${a.actNumber} "${a.actLabel}" [${a.startSec}s–${a.endSec}s, ${a.sceneCount} scenes]:
  Auto-instruction: ${dna.storyboardMode === "auto" ? a.autoHint : "(manual — see manual instructions below)"}
  Color grade: ${a.actNumber === 1 ? COLOR_GRADES.act1 : a.actNumber === 2 ? COLOR_GRADES.act2 : COLOR_GRADES.act3_start}
`).join("")}

GIMMICK FRAMEWORK FOR CATEGORY "${dna.productCategory}":
• Setup Trope: ${template.setupTrope}
• Escalation Gimmick: ${template.escalationGimmick}
• Product Twist Entry: ${template.twistEntry}
• CTA Gimmick: ${template.ctaGimmick}
`.trim();
}

// ─── MANUAL INSTRUCTIONS ─────────────────────────────────────────────────────

function buildManualContext(dna: DramaDNA): string {
	if (dna.storyboardMode !== "manual" || !dna.manualInstructions.length) return "";
	return `\nMANUAL SCENE INSTRUCTIONS:\n${dna.manualInstructions.map(m =>
		`Scene ${m.sceneId} (Act ${m.actNumber}): ${m.description}. Gimmick: ${m.gimmick}. Product visible: ${m.productMention}.`
	).join("\n")}`;
}

// ─── IMAGE CONTEXT ────────────────────────────────────────────────────────────

function buildImageContext(dna: DramaDNA): string {
	const analyzed = dna.productImages.filter(img => img.aiDescription);
	if (!analyzed.length) return "";
	return `\nPRODUCT VISUAL REFERENCE (from uploaded images):\n${analyzed.map((img, i) => `  Image ${i + 1}: ${img.aiDescription}`).join("\n")}`;
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────

export function buildDramaSystemPrompt(): string {
	return `You are a world-class creative director specializing in Thai-style emotional product advertisement films — the style pioneered by agencies like Ogilvy Thailand and directors like Thanonchai Sornsriwichai.

Your expertise:
- Crafting "slice of life" narratives that use EXTREME melodrama and absurdism to hook audiences emotionally
- The formula: Setup relatable cliché drama → Escalate to absurd/hilarious extremes → Plot-twist product reveal as the solution
- References: Thai viral commercials (True Move H "Giving", Pantene "You Can Shine"), Korean drama visual tropes, Indonesian sinetron hyperbole
- Camera language: extreme zoom-ins on emotional faces, slow-motion tears, dramatic score, Korean drama DOF pulls
- The "tertipu tapi terhibur" effect — audience feels joyfully deceived when product twist lands

Your output: A complete JSON script for AI video generation with scene-by-scene prompts. ALL prompts must be in ENGLISH (UI is Indonesian, but all AI-facing content in English for maximum AI video generator compatibility).

CRITICAL CONSISTENCY RULES:
1. Character appearance MUST remain 100% identical across all scenes (same face, hair, outfit)
2. Product identity MUST match reference images exactly across all product-visible scenes
3. Continuity: each scene logically follows from the previous
4. Scene numbering: never skip, scenes must flow narratively
5. Color grade transitions: ACT 1-2 use drama filter → ACT 3+ shifts to bright commercial palette
6. All dialogue lines in Bahasa Indonesia (characters speak Indonesian, but field values in English for AI)`;
}

// ─── USER PROMPT ─────────────────────────────────────────────────────────────

export function buildDramaUserPrompt(dna: DramaDNA): string {
	const ctaGimmickDesc = DRAMA_CTA_GIMMICK_PRESETS.find(p => p.value === dna.cta.ctaGimmick)?.desc ?? dna.cta.ctaGimmick;
	const totalScenes = dna.totalScenes;
	const ctaCount = calcCtaScenes(dna.totalDurationSec, dna.secPerScene);
	const dramaScenes = totalScenes - ctaCount;

	return `Generate a complete Thailand-style drama product advertisement script in JSON format.

PRODUCT:
- Name: ${dna.productName || "[Product Name]"}
- Category: ${dna.productCategory} > ${dna.productSubcategory}
- URL reference: ${dna.productUrl || "none provided"}
${buildImageContext(dna)}

CAST:
- Lead character: ${modelDesc(dna.modelGenderAge)}
- Character must be IDENTICAL in appearance across all ${totalScenes} scenes
- Lock appearance in continuityAnchor at start

VIDEO SPECS:
- Total duration: ${dna.totalDurationSec} seconds
- Total scenes: ${totalScenes} (${dramaScenes} drama scenes + ${ctaCount} CTA scenes)
- Seconds per scene: ${dna.secPerScene}s each
- Aspect ratio: ${dna.aspectRatio}
- Visual style: ${dna.cinematicStyle}
- Resolution: ${dna.aspectRatio === "9:16" ? "1080×1920" : "1920×1080"}

${buildActContext(dna)}
${buildManualContext(dna)}

CTA CONFIGURATION (last ${ctaCount} scenes):
- CTA Gimmick Style: ${ctaGimmickDesc}
- CTA Tagline (in Bahasa Indonesia): "${dna.cta.ctaText}"
- CTA scenes should have 2-3 sub-gimmicks building to the final product reveal + tagline
- End scene: product held clearly, character winks/smiles to camera, tagline voiced over

OUTPUT FORMAT — Return ONLY this JSON structure (no markdown, no backticks, no explanation):
{
  "schema": "dramaAdPrompt.v1",
  "schemaVersion": 1,
  "generatedAt": "[ISO timestamp]",
  "tool": "product-promo-drama-mode",
  "mode": "thailand-drama-ad",
  "language": { "primary": "en", "ui": "id" },
  "productInfo": {
    "name": "${dna.productName || "[Product Name]"}",
    "category": "${dna.productCategory}",
    "subcategory": "${dna.productSubcategory}"
  },
  "video": {
    "title": "[Creative video title that hints at the drama without spoiling the twist]",
    "concept": "[One paragraph describing the full arc: setup, escalation, twist, resolution]",
    "totalDurationSec": ${dna.totalDurationSec},
    "aspectRatio": "${dna.aspectRatio}",
    "fps": 30,
    "resolution": "${dna.aspectRatio === "9:16" ? "1080x1920" : "1920x1080"}"
  },
  "continuityAnchor": {
    "modelDescription": "[Detailed physical description of lead character — face, hair, outfit — LOCKED for all scenes]",
    "productDescription": "[Visual description of product derived from reference images or product info]",
    "colorPalette": "[Palette per act: Act1-2 drama filter / Act3+ bright commercial]",
    "mustKeepConsistent": ["character_appearance", "product_identity", "location_continuity_per_act"]
  },
  "acts": [
    { "actNumber": 1, "actLabel": "Setup Klise", "purpose": "...", "timeRange": "0:00-X:XX" },
    { "actNumber": 2, "actLabel": "Eskalasi Absurd", "purpose": "...", "timeRange": "X:XX-X:XX" },
    { "actNumber": 3, "actLabel": "Twist Produk", "purpose": "...", "timeRange": "X:XX-X:XX" },
    { "actNumber": 4, "actLabel": "CTA", "purpose": "...", "timeRange": "X:XX-X:XX" }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "totalScenes": ${totalScenes},
      "actNumber": 1,
      "actLabel": "Setup Klise",
      "timeLabel": "0:00-0:${String(dna.secPerScene).padStart(2, "0")}",
      "durationSec": ${dna.secPerScene},
      "setting": {
        "location": "[Specific location description]",
        "timeOfDay": "[time]",
        "colorGrade": "${COLOR_GRADES.act1}",
        "atmosphere": "[atmosphere details]"
      },
      "characters": [
        {
          "role": "lead",
          "appearance": "[MUST match continuityAnchor.modelDescription exactly]",
          "action": "[what character does physically]",
          "expression": "[facial expression and emotion]"
        }
      ],
      "camera": {
        "shot": "[shot type: extreme close-up / medium / wide etc]",
        "movement": "[static / slow push-in / zoom / pan etc]",
        "lens": "[lens mm and effect]",
        "angle": "[eye-level / low angle / overhead etc]"
      },
      "lighting": {
        "setup": "[lighting setup]",
        "mood": "[lighting mood]",
        "colorTemperature": "[warm/cool/mixed]"
      },
      "action": {
        "summary": "[one sentence summary of what happens]",
        "details": ["[step 1 of action]", "[step 2]", "[step 3]"],
        "gimmick": "[the comedic/dramatic gimmick element of this scene]",
        "productVisible": false,
        "productAction": "none"
      },
      "dialogue": [
        { "speaker": "lead", "line": "[Indonesian dialogue line]", "tone": "[delivery tone]" }
      ],
      "audio": {
        "music": "[music description — sinetron dramatic score / Korean drama OST style etc]",
        "sfx": ["[sound effect 1]", "[sound effect 2]"],
        "voiceover": "none"
      },
      "transition": "cut to next scene",
      "negativePrompt": "text overlay, watermark, CGI artifacts, inconsistent character appearance, brand logo errors, blurry product",
      "continuityNote": "[Note for AI: what must carry over from previous scene to maintain continuity]"
    }
  ],
  "ctaScenes": [
    {
      "sceneNumber": ${dramaScenes + 1},
      "totalScenes": ${totalScenes},
      "actNumber": 4,
      "actLabel": "CTA",
      "timeLabel": "[timestamp]",
      "durationSec": ${dna.secPerScene},
      "setting": { "location": "[..slightly different from drama - brighter, more commercial]", "timeOfDay": "...", "colorGrade": "${COLOR_GRADES.cta}", "atmosphere": "..." },
      "characters": [{ "role": "lead", "appearance": "[same as continuityAnchor]", "action": "[CTA action]", "expression": "confident, warm, direct-to-camera" }],
      "camera": { "shot": "medium close-up", "movement": "slight push-in", "lens": "50mm", "angle": "eye-level" },
      "lighting": { "setup": "commercial bright three-point lighting", "mood": "warm uplifting", "colorTemperature": "warm golden" },
      "action": {
        "summary": "[CTA action summary]",
        "details": ["[CTA detail 1]", "[show product clearly]", "[deliver tagline]"],
        "gimmick": "[CTA gimmick from selected style]",
        "productVisible": true,
        "productAction": "held prominently toward camera, clearly visible, matches reference exactly"
      },
      "dialogue": [{ "speaker": "lead", "line": "${dna.cta.ctaText}", "tone": "warm, enthusiastic, direct" }],
      "audio": { "music": "upbeat commercial jingle or brand music", "sfx": ["product interaction sound"], "voiceover": "${dna.cta.ctaText}" },
      "transition": "fade to brand logo / end card",
      "negativePrompt": "text overlay, watermark, CGI artifacts, blurry product",
      "continuityNote": "Product appearance must be 100% consistent with all previous product-visible scenes"
    }
  ]
}

RULES:
1. Generate ALL ${totalScenes} scenes total: ${dramaScenes} in "scenes" array + ${ctaCount} in "ctaScenes" array
2. Scene numbers must be sequential and never repeat: 1, 2, 3... ${totalScenes}
3. Every scene's "continuityNote" field must reference what carries over from the previous scene
4. Act 2 must have at least 3 different gimmick escalations spread across its scenes
5. Act 3 MUST have an explicit color-grade shift described in the "colorGrade" field
6. Product first appears in Act 3 scene 1 at earliest
7. All dialogue in Bahasa Indonesia, all other fields in English
8. Output ONLY valid JSON — no text before { or after }`;
}
