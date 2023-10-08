export function useBase(relative_path: string) {
  return process.env.VUE_ROUTER_BASE + relative_path
}
