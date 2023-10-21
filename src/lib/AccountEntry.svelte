<script lang="ts">
  import { Button, Input, Spinner } from 'flowbite-svelte';
  import { CheckSolid, MinusSolid, XmarkSolid } from 'svelte-awesome-icons';
  import { fade } from 'svelte/transition';
  import type Account from '../interface/Account';
  import { AccountStatus } from '../interface/Account';
  import { removeAccount } from './stores/account-store';
  import { applicationSettings } from './stores/settings-store';

  export let account: Account;

  const iconSize = '18';
</script>

<div class="flex relative flex-row gap-2 items-center">
  {#if account.status != null && account.status != AccountStatus.NONE}
    <div
      transition:fade
      class="absolute flex items-end left-[-16px] dark:bg-slate-700 bg-slate-100 shadow rounded-full p-1 w-6 h-6"
    >
      {#if account.status == AccountStatus.LOADING}
        <Spinner size="100%" />
      {:else if account.status == AccountStatus.SUCCESS}
        <CheckSolid size="100%" class="text-green-500" />
      {:else if account.status == AccountStatus.FAIL}
        <XmarkSolid size="100%" class="text-red-500" />
      {/if}
    </div>
  {/if}

  <Input type={$applicationSettings.hideStudentNames ? 'password' : 'text'} readonly value={account.name} />
  <Button size="xs" class="self-center" color="red" on:click={() => removeAccount(account)}>
    <MinusSolid size={iconSize} />
  </Button>
</div>
