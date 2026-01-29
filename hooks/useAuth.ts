// Re-export real Supabase auth logic
import useSupabaseAuth from "./useSupabaseAuth";

export default useSupabaseAuth;
export const useAuth = useSupabaseAuth;
