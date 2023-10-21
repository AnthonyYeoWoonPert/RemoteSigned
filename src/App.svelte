<script lang="ts">
  import { Button, Card, Tooltip } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import {
    CodeSolid,
    ExclamationSolid,
    EyeSlashSolid,
    EyeSolid,
    FileExportSolid,
    KeySolid,
    PlusSolid,
  } from 'svelte-awesome-icons';
  import { get } from 'svelte/store';
  import { markAttendix } from './apspace';
  import { AccountStatus } from './interface/Account';
  import AccountEntry from './lib/AccountEntry.svelte';
  import AddAccountModal from './lib/AddAccountModal.svelte';
  import ChangePinModal from './lib/ChangePinModal.svelte';
  import ColorModeSwitcher from './lib/ColorModeSwitcher.svelte';
  import ExportModal from './lib/ExportModal.svelte';
  import ImportModal from './lib/ImportModal.svelte';
  import PinInput from './lib/PinInput.svelte';
  import PopupModal from './lib/PopupModal.svelte';
  import { accounts, clearData, importAccounts } from './lib/stores/account-store';
  import { pin } from './lib/stores/pin-store';
  import { applicationSettings, updateSettings } from './lib/stores/settings-store';
  import { LOCAL_STORAGE_ACCOUNT_KEY } from './lib/util/constants';

  let codeInput: PinInput;

  const iconSize = '18';
  let addModalOpen = false;
  let addModalUnique = {};
  let importModalOpen = false;
  let importModalUnique = {};
  let exportModalOpen = false;
  let exportModalUnique = {};
  let popupModalOpen = false;
  let popupModalUnique = {};
  let changePinModalUnique = {};
  let changePinModalOpen = false;
  let popupMessage = '';
  let popupMessageType: 'primary' | 'error' = 'primary';
  let pinPromptShown = true;
  let pinPromptErrorShown = false;
  let hasAccountData = false;

  let queryCipher = '';
  let queryPin = '';

  const showPopup = (msg: string, type: 'primary' | 'error' = 'primary') => {
    popupModalUnique = {};
    popupModalOpen = true;
    popupMessageType = type;
    popupMessage = msg;
  };

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('accounts')) {
      importModalUnique = {};
      importModalOpen = true;
      queryCipher = decodeURIComponent(urlParams.get('accounts'));
    }
    if (urlParams.has('pin')) {
      queryPin = decodeURIComponent(urlParams.get('pin'));
    }
    window.history.replaceState({}, null, window.location.pathname);

    if (localStorage.getItem(LOCAL_STORAGE_ACCOUNT_KEY) != null) {
      hasAccountData = true;
    }
  });

  const handleOnCode = (event: CustomEvent<string>) => {
    let code: string = event.detail;

    try {
      if (!code.match(/^\d{3}$/)) {
        throw new Error('Pin is not correctly formatted!');
      }

      if (get(accounts).length === 0) {
        throw new Error('There are no accounts to mark.');
      }

      if (get(accounts).some((acc) => acc.username.trim() === '' || acc.password.trim() === '')) {
        throw new Error('There are some accounts that have no username or password.');
      }

      let promises: Promise<any>[] = [];

      get(accounts).forEach((account) => {
        accounts.update((accs) => {
          const ix = accs.indexOf(account);
          accs[ix].status = AccountStatus.LOADING;
          return accs;
        });

        promises.push(
          new Promise(async (res, rej) => {
            const response = await markAttendix(account.username, account.password, code);

            // TODO: Handle already-marked accounts
            if (response['errors'] != null) {
              accounts.update((accs) => {
                const ix = accs.indexOf(account);
                accs[ix].status = AccountStatus.FAIL;
                return accs;
              });
              rej(response['errors'][0]['message']);
            } else {
              accounts.update((accs) => {
                const ix = accs.indexOf(account);
                accs[ix].status = AccountStatus.SUCCESS;
                return accs;
              });
              res('');
            }

            setTimeout(() => {
              accounts.update((accs) => {
                const ix = accs.indexOf(account);
                accs[ix].status = AccountStatus.NONE;
                return accs;
              });
            }, 15000);
          })
        );
      });

      Promise.allSettled(promises).then((results: PromiseSettledResult<any>[]) => {
        console.log(results);
      });
    } catch (e) {
      showPopup(e.message, 'error');
    } finally {
      codeInput.clearInput();
    }
  };
</script>

{#if pinPromptShown}
  <div class="flex justify-center items-center flex-col gap-4 text-center p-8 z-50">
    {#if hasAccountData}
      <div class="text-black dark:text-white">
        <div class="text-blue-600 font-bold">You have existing account data.</div>
        <div>This pin you set will be used to decrypt it.</div>
      </div>
      <Button
        on:click={() => {
          clearData();
          hasAccountData = false;
          pinPromptErrorShown = false;
        }}>Clear Data</Button
      >
    {:else}
      <div class="text-black dark:text-white">
        <div class="font-bold">You don't have existing account data.</div>
        <div>This pin you set will be used to encrypt your saved data.</div>
      </div>
    {/if}
    <p class="text-gray-600 dark:text-gray-400">Please enter a pin:</p>
    {#if pinPromptErrorShown}
      <h1 class="text-red-600">An error occured while importing, maybe the pin you entered was wrong.</h1>
    {/if}
    <PinInput
      type="password"
      on:pin={(e) => {
        pin.set(e.detail);

        if (hasAccountData) {
          if (importAccounts(localStorage.getItem(LOCAL_STORAGE_ACCOUNT_KEY), e.detail) == null) {
            pinPromptErrorShown = true;
            return;
          }
        }

        pinPromptShown = false;
      }}
      digits={4}
    />
  </div>
{:else}
  <PinInput
    bind:this={codeInput}
    on:pin={handleOnCode}
    classlist={'w-[calc(2rem*3)] pb-1 sm:pb-4 h-24 sm:w-[calc(2rem*3)] align-middle sm:h-32 text-6xl sm:text-8xl text-center text-black dark:text-white white dark:bg-slate-800 rounded-md'}
  />

  <Card class="gap-4 mt-8 p-4 min-w-[350px] sm:min-w-[400px] h-[400px] overflow-y-auto">
    <div class="flex justify-between">
      <h2 class="text-xl">Students</h2>
      <div>
        <Button
          id="btn-toggle-name"
          size="xs"
          on:click={() => {
            updateSettings('hideStudentNames', !get(applicationSettings).hideStudentNames);
          }}
        >
          {#if $applicationSettings.hideStudentNames}
            <EyeSolid size={iconSize} />
          {:else}
            <EyeSlashSolid size={iconSize} />
          {/if}
        </Button>
        <Tooltip>Toggle Student Names</Tooltip>
        <Button
          id="btn-change-key"
          size="xs"
          on:click={() => {
            changePinModalUnique = {};
            changePinModalOpen = true;
          }}
        >
          <KeySolid size={iconSize} />
        </Button>
        <Tooltip>Change Pin</Tooltip>
        <Button
          size="xs"
          on:click={() => {
            exportModalUnique = {};
            exportModalOpen = true;
          }}
        >
          <FileExportSolid size={iconSize} />
        </Button>
        <Tooltip>Export Accounts</Tooltip>
        <Button
          size="xs"
          on:click={() => {
            importModalUnique = {};
            importModalOpen = true;
          }}
        >
          <CodeSolid size={iconSize} />
        </Button>
        <Tooltip>Import Accounts</Tooltip>
        <Button
          size="xs"
          on:click={() => {
            addModalUnique = {};
            addModalOpen = true;
          }}
        >
          <PlusSolid size={iconSize} />
        </Button>
        <Tooltip>Add Student</Tooltip>
      </div>
    </div>
    {#each $accounts as account}
      <AccountEntry {account} />
    {/each}
  </Card>
  {#key addModalUnique}
    <AddAccountModal isOpen={addModalOpen} />
  {/key}

  {#key popupModalUnique}
    <PopupModal isOpen={popupModalOpen} type={popupMessageType} message={popupMessage} />
  {/key}

  {#key importModalUnique}
    <ImportModal
      onAccountsImported={() => {
        queryCipher = '';
        queryPin = '';
      }}
      pin={queryPin}
      cipherText={queryCipher}
      isOpen={importModalOpen}
    />
  {/key}

  {#key exportModalUnique}
    <ExportModal isOpen={exportModalOpen} />
  {/key}

  {#key changePinModalUnique}
    <ChangePinModal isOpen={changePinModalOpen} />
  {/key}
{/if}
<div class="flex justify-end mt-4">
  <Button
    on:click={() =>
      showPopup(
        'Stored accounts are now encrypted, make sure to re-add all your accounts! Also, added feature to export and import accounts, no more manual work to re-add accounts on new devices.'
      )}
    btnClass="text-red-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
  >
    <ExclamationSolid class="w-5 h-5" />
  </Button>
  <ColorModeSwitcher />
</div>
