/**
 * Composable for handling async refresh operations with loading state
 */
export function useRefresh() {
  const loading = ref(false);

  async function execute<T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void | Promise<void>
  ): Promise<T | null> {
    if (loading.value) return null;

    loading.value = true;
    try {
      const result = await operation();
      if (onSuccess) {
        await onSuccess(result);
      }
      return result;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading: readonly(loading),
    execute
  };
}
