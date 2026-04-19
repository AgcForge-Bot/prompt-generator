"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { CAR_TRAILER_SETPIECES, TRAILER_BEAT_OPTIONS, TRAILER_CHARACTER_ROLES, TRAILER_EMOTION_BEATS } from "../../constants";
import type { CarMusicVideoGenerator } from "../../types";

export default function TrailerTab({ gen }: { gen: CarMusicVideoGenerator }) {
	const sc = gen.getSceneConfig(gen.currentScene);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Trailer Beat">
				<Sel
					id="trailer-beat"
					value={sc.trailerBeat ?? "setpiece"}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { trailerBeat: v })}
					options={TRAILER_BEAT_OPTIONS.map((b) => ({ value: b, label: b }))}
				/>
			</Field>
			<Field label="Emotion Beat">
				<Sel
					id="trailer-emotion"
					value={sc.trailerEmotion ?? "determination"}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { trailerEmotion: v })}
					options={TRAILER_EMOTION_BEATS.map((b) => ({ value: b, label: b }))}
				/>
			</Field>
			<Field label="Setpiece">
				<Sel
					id="trailer-setpiece"
					value={sc.trailerSetpiece ?? CAR_TRAILER_SETPIECES[0]}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { trailerSetpiece: v })}
					options={CAR_TRAILER_SETPIECES.map((b) => ({ value: b, label: b }))}
				/>
			</Field>
			<Field label="Focus Character">
				<Sel
					id="trailer-focus"
					value={sc.trailerFocusCharacter ?? gen.trailerCharacters[0]?.name ?? TRAILER_CHARACTER_ROLES[0]}
					onChange={(v) => gen.updateSceneConfig(gen.currentScene, { trailerFocusCharacter: v })}
					options={[
						...gen.trailerCharacters
							.filter((c) => c.name.trim().length > 0)
							.map((c) => ({ value: c.name, label: `${c.name} — ${c.role}` })),
						{ value: "__role__", label: "— fallback (role) —" },
						...TRAILER_CHARACTER_ROLES.map((r) => ({ value: r, label: r })),
					]}
				/>
			</Field>
			<Field label="Opening Credit Text (opsional)">
				<input
					className="forest-input"
					placeholder='Contoh: "Ari — The Driver"'
					value={sc.trailerCreditText ?? ""}
					onChange={(e) =>
						gen.updateSceneConfig(gen.currentScene, { trailerCreditText: e.target.value })
					}
				/>
			</Field>
		</div>
	);
}
