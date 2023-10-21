<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  export let digits = 3;
  export let classlist =
    'h-16 w-12 text-black dark:text-white white dark:bg-slate-800 rounded-md flex items-center text-center font-thin text-3xl';
  export let required = false;
  export let type = 'text';
  export let initialValue = '';
  let inputs: HTMLInputElement[] = [];

  const _dispatch = createEventDispatcher();

  onMount(() => {
    if (initialValue.trim() != '') {
      initialValue.split('').forEach((c, i) => (inputs[i].value = c));
    }
  });

  const validateInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

    return e.target.value.length != 0;
  };

  const handleInput = (e, i) => {
    if (!validateInput(e)) return;

    if (i < digits - 1) {
      inputs[i + 1].focus();
    }

    if (i == digits - 1) {
      submitCode();
    }
  };

  const submitCode = () => {
    _dispatch('pin', getCurrentPin());
  };

  const handleKeydown = (e, i) => {
    if (e.code != 'Backspace' && e.code != 'Delete') return;

    if (i == digits - 1 && e.target.value != '') {
      e.target.value = '';
    } else if (i > 0) {
      e.target.value = '';
      inputs[i - 1].focus();
    }
  };

  const handleFocus = (e, i) => {
    e.target.value = '';
  };

  export const clearInput = () => {
    inputs.forEach((el) => (el.value = ''));
  };

  export const getCurrentPin = () => {
    return inputs.reduce((prev, curr) => {
      return prev + curr.value;
    }, '');
  };
</script>

<div class="flex gap-2 w-max h-max p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
  {#each Array(digits) as _, i}
    <input
      {type}
      on:input={(e) => handleInput(e, i)}
      on:keydown|stopPropagation={(e) => handleKeydown(e, i)}
      on:focus={(e) => handleFocus(e, i)}
      bind:this={inputs[i]}
      max="9"
      min="0"
      inputmode="decimal"
      maxlength="1"
      minlength="1"
      class={classlist + ' digit'}
      {required}
    />
  {/each}
</div>

<style>
  .digit {
    appearance: textfield;
    margin: 0;
  }
</style>
