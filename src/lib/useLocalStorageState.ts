import { useEffect, useMemo, useState } from "react";

type Options<T> = {
	serialize?: (value: T) => string;
	deserialize?: (raw: string) => unknown;
	validate?: (value: unknown) => value is T;
	syncAcrossTabs?: boolean;
};

export function useLocalStorageState<T>(
	key: string,
	defaultValue: T | (() => T),
	options?: Options<T>,
) {
	const serialize = useMemo(
		() => options?.serialize ?? ((v: T) => JSON.stringify(v)),
		[options?.serialize],
	);
	const deserialize = useMemo(
		() => options?.deserialize ?? ((raw: string) => JSON.parse(raw)),
		[options?.deserialize],
	);
	const validate = options?.validate;
	const syncAcrossTabs = options?.syncAcrossTabs ?? false;

	const getDefault = useMemo(
		() => (typeof defaultValue === "function" ? (defaultValue as () => T) : () => defaultValue),
		[defaultValue],
	);

	const [state, setState] = useState<T>(() => {
		if (typeof window === "undefined") return getDefault();
		try {
			const raw = window.localStorage.getItem(key);
			if (raw == null) return getDefault();
			const parsed = deserialize(raw);
			if (validate && !validate(parsed)) return getDefault();
			return parsed as T;
		} catch {
			return getDefault();
		}
	});

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(key, serialize(state));
		} catch {}
	}, [key, serialize, state]);

	useEffect(() => {
		if (!syncAcrossTabs) return;
		if (typeof window === "undefined") return;
		function onStorage(e: StorageEvent) {
			if (e.storageArea !== window.localStorage) return;
			if (e.key !== key) return;
			try {
				if (e.newValue == null) {
					setState(getDefault());
					return;
				}
				const parsed = deserialize(e.newValue);
				if (validate && !validate(parsed)) {
					setState(getDefault());
					return;
				}
				setState(parsed as T);
			} catch {
				setState(getDefault());
			}
		}
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, [deserialize, getDefault, key, syncAcrossTabs, validate]);

	return [state, setState] as const;
}
