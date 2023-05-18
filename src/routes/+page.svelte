<script lang="ts">
	import tmi from 'tmi.js';
	import { filterMSG } from '../utils/emotes';
	import { channel } from '../store';
	import { get } from 'svelte/store';

	let name = get(channel) || '';
	let currentChannel = '';
	let status: 'connected' | 'connecting' | 'disconnected' = 'disconnected';
	let messages: string[] = [];

	function isEmptyOrSpaces(str: string) {
		return str === null || str.match(/^ *$/) !== null;
	}

	const client = new tmi.Client({});

	client.on('join', () => {
		status = 'connected';
	});

	client.on('connected', () => {
		channel.subscribe(handleConnect);
	});

	client.on('disconnected', () => {
		status = 'disconnected';
	});

	client.on('message', (channel, tags, message, self) => {
		const name = tags['display-name'];
		const emotes = tags['emotes'];
		const msg = filterMSG(message, emotes);

		if (isEmptyOrSpaces(msg)) return;
		messages = [`${name}: ${msg}`, ...messages];

		if (window !== undefined && window.speechSynthesis !== undefined) {
			const utterThis = new SpeechSynthesisUtterance(`${name}: ${msg}`);
			speechSynthesis.speak(utterThis);
		}
	});

	client.connect();

	function handleConnect(channel: string | null) {
		if (!channel) return;

		status = 'disconnected';
		messages = [];

		if (currentChannel) client.part(currentChannel);
		currentChannel = channel;

		client.join(channel);

		status = 'connecting';
	}
</script>

<div class="w-screen h-screen flex gap-2 items-start p-4">
	<div class="flex-1 flex flex-col-reverse gap-1 p-2 border-2 h-full rounded-lg">
		{#each messages as message}
			<div class="text-lg">
				{message}
			</div>
		{/each}
	</div>
	<div class="flex flex-col h-full">
		<div>
			{#if status === 'connected'}
				<p>Connected to {$channel}</p>
			{:else if status === 'connecting'}
				<p>Connecting to {$channel}...</p>
			{:else}
				<p>Disconnected</p>
			{/if}
		</div>
		<div class="flex gap-2 mt-auto">
			<input
				class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
				type="text"
				placeholder="mraardappel"
				bind:value={name}
			/>
			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap"
				on:click={() => channel.set(name)}
			>
				Start TTS
			</button>
		</div>
	</div>
</div>
