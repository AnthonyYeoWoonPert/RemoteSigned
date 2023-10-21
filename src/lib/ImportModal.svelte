<script lang="ts">
  import { Button, Checkbox, Label, Modal, Textarea } from 'flowbite-svelte';
  import { importAccounts } from './stores/account-store';
  import PinInput from './PinInput.svelte';

  export let onAccountsImported: () => void = () => {};
  export let isOpen = false;
  export let cipherText = '';
  export let pin = '';
  let overwrite = false;
  let hasError = false;

  const handleImportAccounts = (e: Event) => {
    const result = importAccounts(cipherText, pin, overwrite);
    if (result == null) {
      hasError = true;
    } else {
      isOpen = false;
      onAccountsImported();
    }
  };
</script>

<Modal bind:open={isOpen} size="sm" class="w-full">
  <h1 class="text-xl font-medium text-gray-900 dark:text-white p-0">Import Accounts</h1>
  <form class="flex flex-col space-y-6 text-center" on:submit|preventDefault={handleImportAccounts}>
    <Label class="space-y-2">
      <span>Cipher Text</span>
      <Textarea bind:value={cipherText} name="cipher" placeholder="SGVsbG8gV29ybGQ=" rows="4" required />
    </Label>
    <Label class="space-y-2 flex justify-center items-center flex-col">
      <span>Pin</span>
      <PinInput initialValue={pin} type="password" digits={4} required={true} on:pin={(e) => (pin = e.detail)} />
    </Label>
    {#if hasError}
      <h1 class="text-red-600">An error occured while importing, maybe the pin you entered was wrong.</h1>
    {/if}
    <Checkbox bind:checked={overwrite} class="space-y-2">Overwrite existing</Checkbox>
    <Button type="submit">Import</Button>
  </form>
</Modal>
