<script lang="ts">
  import { Button, Modal } from 'flowbite-svelte';
  import { CircleExclamationSolid } from 'svelte-awesome-icons';

  export let isOpen = false;
  export let message = '';
  export let type: 'primary' | 'error' = 'primary';

  let active_class = '';
  $: switch (type) {
    case 'primary':
      active_class = 'text-sky-500 dark:text-sky-600';
      break;

    case 'error':
      active_class = 'text-red-500 dark:text-red-600';
      break;
  }
</script>

<Modal bind:open={isOpen} size="xs" autoclose class="w-full">
  <div class="text-center">
    <CircleExclamationSolid class="block m-auto mb-4 {active_class}" size="32" />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      {message}
    </h3>
    <Button>Ok</Button>
  </div>
</Modal>
