import { supabase } from "../utils/supabaseClient";

export async function updateProfile({ userId, username, bio, location, avatar_url }) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: username,
        bio: bio,
        location: location,
        avatar_url: avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      return { error: error };
    }

    return { data: data[0] };
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return { error: { message: 'Failed to update profile' } };
  }
}

export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { error: error };
    }

    return { data: data };
  } catch (error) {
    console.error('Error in getProfile:', error);
    return { error: { message: 'Failed to fetch profile' } };
  }
}
