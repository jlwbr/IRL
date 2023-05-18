import { writable } from "svelte/store";

export const channel = writable("");

if (typeof window !== "undefined") {
    const storedChannel = localStorage.getItem("channel");
    channel.set(storedChannel || "");

    channel.subscribe((value) => value && localStorage.setItem("channel", value));
}