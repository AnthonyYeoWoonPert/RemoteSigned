<script lang="ts">
  import { Button, Input, Label, Modal, Spinner } from 'flowbite-svelte';
  import { getStudentProfile } from '../apspace';
  import { accounts, saveAccounts } from './stores/account-store';
  import { pin } from './stores/pin-store';

  export let isOpen = false;
  let username = '';
  let password = '';
  let hasFailedAuthentication = false;
  let isLoading = false;

  const handleAddAccount = (e: Event) => {
    isLoading = true;

    getStudentProfile(username, password)
      .then((profile) => {
        accounts.update((accs) => {
          accs.push({ name: profile.NAME, password, username });
          return accs;
        });
        saveAccounts();
        isOpen = false;
      })
      .catch((reason) => {
        hasFailedAuthentication = true;
        setTimeout(() => {
          hasFailedAuthentication = false;
        }, 3000);
      })
      .finally(() => {
        isLoading = false;
      });
  };
</script>

<Modal bind:open={isOpen} size="xs" class="w-full">
  <form class="flex flex-col space-y-6" on:submit|preventDefault={handleAddAccount}>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">Login with APSpace</h3>
    <Label class="space-y-2">
      <span>APKey</span>
      <Input bind:value={username} type="text" name="apkey" placeholder="TPXXXXXX" required />
    </Label>
    <Label class="space-y-2">
      <span>Password</span>
      <Input bind:value={password} type="password" name="password" placeholder="•••••" required />
    </Label>
    <Button type="submit" class="w-full" color={hasFailedAuthentication ? 'red' : 'blue'}>
      {#if isLoading}
        <Spinner class="mr-3" size="4" color="white" />
      {:else}
        {hasFailedAuthentication ? 'Failed' : 'Login'}
      {/if}
    </Button>
  </form>
</Modal>
