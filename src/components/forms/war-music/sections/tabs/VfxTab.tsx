"use client";

import Field from "@/components/forms/forest-build/Field";
import Sel from "@/components/forms/forest-build/Sel";
import { OPTIONS } from "../../constants";
import type { WarMusicVideoGenerator } from "../../types";

export default function VfxTab({ gen }: { gen: WarMusicVideoGenerator }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<Field label="Fire / Explosion">
				<Sel
					id="vfx-fire"
					value={gen.getSceneConfig(gen.currentScene).vfxFire}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vfxFire: v })
					}
					options={[...OPTIONS.vfxFire]}
				/>
			</Field>
			<Field label="Smoke">
				<Sel
					id="vfx-smoke"
					value={gen.getSceneConfig(gen.currentScene).vfxSmoke}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vfxSmoke: v })
					}
					options={[...OPTIONS.vfxSmoke]}
				/>
			</Field>
			<Field label="Weapons">
				<Sel
					id="vfx-weapons"
					value={gen.getSceneConfig(gen.currentScene).vfxWeapons}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vfxWeapons: v })
					}
					options={[...OPTIONS.vfxWeapons]}
				/>
			</Field>
			<Field label="Duel">
				<Sel
					id="vfx-duel"
					value={gen.getSceneConfig(gen.currentScene).vfxDuel}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vfxDuel: v })
					}
					options={[...OPTIONS.vfxDuel]}
				/>
			</Field>
			<Field label="Props">
				<Sel
					id="vfx-props"
					value={gen.getSceneConfig(gen.currentScene).vfxProps}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vfxProps: v })
					}
					options={[...OPTIONS.vfxProps]}
				/>
			</Field>
			<Field label="SFX">
				<Sel
					id="vfx-sfx"
					value={gen.getSceneConfig(gen.currentScene).vfxSfx}
					onChange={(v) =>
						gen.updateSceneConfig(gen.currentScene, { vfxSfx: v })
					}
					options={[...OPTIONS.vfxSfx]}
				/>
			</Field>
		</div>
	);
}

