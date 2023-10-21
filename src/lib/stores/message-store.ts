import { writable } from 'svelte/store';
import type Message from '../../interface/Message';

export const messages = writable<Message[]>(JSON.parse(localStorage.getItem('messages')) || []);
