<script lang="ts">
  import { Button, ChevronLeft, Label, Modal } from 'flowbite-svelte';
  import PinInput from './PinInput.svelte';
  import { decryptObject } from './util/crypto-helper';
  import { LOCAL_STORAGE_ACCOUNT_KEY } from './util/constants';
  import { createEventDispatcher } from 'svelte';
  import { pin } from './stores/pin-store';
  import { saveAccounts } from './stores/account-store';

  export let isOpen = false;
  const _dispatch = createEventDispatcher();

  let pageIndex = 0;
  let currentPinHasError = false;
  let newPinHasError = false;
  let newPinInput: PinInput = null;

  const handlePinChange = (e) => {
    const newPin = newPinInput.getCurrentPin();
    if (newPin.length != 4) {
      newPinHasError = true;
      return;
    }

    pin.set(newPin);
    saveAccounts();

    isOpen = false;
    _dispatch('newpin', newPin);
  };

  const handleCurrentPin = (e: CustomEvent<string>) => {
    const accounts = decryptObject(localStorage.getItem(LOCAL_STORAGE_ACCOUNT_KEY), e.detail);
    if (accounts == null) {
      currentPinHasError = true;
      return;
    }
    pageIndex++;
  };
</script>

<Modal bind:open={isOpen} size="xs" class="w-full">
  <form class="flex flex-col space-y-6 text-center" on:submit|preventDefault={handlePinChange}>
    {#if pageIndex == 0}
      <Label class="space-y-2 flex justify-center items-center flex-col">
        <span class="text-xl font-medium text-gray-900 dark:text-white p-0">Current Pin</span>
        <PinInput type="password" digits={4} required={true} on:pin={handleCurrentPin} />
      </Label>
      {#if currentPinHasError}
        <h1 class="text-red-600">Current pin is wrong.</h1>
      {/if}
    {/if}
    {#if pageIndex == 1}
      <Label class="space-y-2 flex justify-center items-center flex-col">
        <span class="text-xl font-medium text-gray-900 dark:text-white p-0">New Pin</span>
        <PinInput bind:this={newPinInput} type="password" digits={4} required={true} />
      </Label>
      {#if newPinHasError}
        <h1 class="text-red-600">New pin must be 4 digits long.</h1>
      {/if}
      <div class="flex justify-between">
        <Button
          on:click={() => (pageIndex = 0)}
          btnClass="w-min dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        >
          <ChevronLeft class="w-5 h-5" />
        </Button>
        <Button type="submit">Save</Button>
      </div>
    {/if}
  </form>
</Modal>
