<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { setInputFilter } from './util/input-helper';

  let _digits: HTMLInputElement;
  const _dispatch = createEventDispatcher();

  onMount(() => {
    setInputFilter(
      _digits,
      (val) => {
        return /^\d*$/.test(val);
      },
      'Only digits are allowed'
    );
  });

  const emitDigits = () => {
    if (_digits.value.length != 3) return;

    _dispatch('digits', _digits.value);
  };

  export const clearInput = () => {
    _digits.value = '';
  };
</script>

<div class="w-max h-max p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
  <input
    on:input={() => emitDigits()}
    tabindex="-1"
    bind:this={_digits}
    class="w-[calc(6rem*3)] h-24 sm:w-[calc(7rem*3)] sm:h-32 text-6xl sm:text-8xl text-center text-black dark:text-white white dark:bg-slate-800 rounded-md digit"
    type="text"
    inputmode="numeric"
    maxlength="3"
    min="0"
  />
</div>

<style>
  .digit {
    appearance: textfield;
    margin: 0;
  }
</style>
