"use client";

import { useCallback, useRef, useState } from "react";

export default function useToast() {
	const [toast, setToast] = useState<{ msg: string; show: boolean }>({
		msg: "",
		show: false,
	});
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const show = useCallback((msg: string) => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setToast({ msg, show: true });
		timerRef.current = setTimeout(
			() => setToast((t) => ({ ...t, show: false })),
			2800,
		);
	}, []);
	return { toast, show };
}

