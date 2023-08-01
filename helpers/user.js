export async function uploadUserProfileImage(
  supabase,
  userId,
  file,
  bucket,
  profileColumn,
) {
  const newName = Date.now() + file.name;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, file);

  if (error) throw error;

  if (data) {
    console.log(data.path)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + `/storage/v1/object/public/avatars/` + data.path;

    const result = await supabase.from('profiles')
      .update({
        [profileColumn]: url,
      })
      .eq('id', userId);

    if (result.error) throw result.error;
  }
}