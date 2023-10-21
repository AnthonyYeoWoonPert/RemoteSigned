<script lang="ts">
  import { Button, Checkbox, ChevronLeft, Input, Label, Modal, Textarea } from 'flowbite-svelte';
  import PinInput from './PinInput.svelte';
  import { accounts } from './stores/account-store';
  import { encryptObject } from './util/crypto-helper';

  export let isOpen = false;
  let cipherText = null;
  let exportLink = '';
  let pin = '';
  let includePin = true;
  let showExport = false;

  $: if (cipherText != null) {
    exportLink = window.location.href + `?accounts=${encodeURIComponent(cipherText)}`;
    if (includePin === true) {
      exportLink += `&pin=${encodeURIComponent(pin)}`;
    }
  }

  const handleExportAccounts = (e: Event) => {
    cipherText = encryptObject($accounts, pin);
    showExport = true;
  };
</script>

<Modal bind:open={isOpen} size="sm" class="w-full">
  {#if $accounts.length == 0}
    <h1 class="text-lg text-center font-bold select-none">No accounts to export</h1>
  {:else}
    <h1 class="text-xl font-medium text-gray-900 dark:text-white p-0">Export Accounts</h1>
    <form class="flex flex-col space-y-6 text-center" on:submit|preventDefault={handleExportAccounts}>
      {#if !showExport}
        <h2>Exporting ({$accounts.length}) accounts</h2>
        <Label class="space-y-2 flex justify-center items-center flex-col">
          <span>Pin</span>
          <PinInput type="password" digits={4} required={true} on:pin={(e) => (pin = e.detail)} />
        </Label>
        <Button type="submit">Export</Button>
      {/if}
      {#if showExport}
        <Label class="space-y-2">
          <span>Cipher Text</span>
          <Textarea bind:value={cipherText} name="cipher" placeholder="SGVsbG8gV29ybGQ=" required />
        </Label>
        <Label class="space-y-2">
          <span>Export Link</span>
          <Input bind:value={exportLink} type="text" name="exportLink" required />
        </Label>
        <Checkbox bind:checked={includePin} class="space-y-2">Include pin</Checkbox>
        <Button
          on:click={() => (showExport = false)}
          btnClass="w-min dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
        >
          <ChevronLeft class="w-5 h-5" />
        </Button>
      {/if}
    </form>
  {/if}
</Modal>
