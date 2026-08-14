import { createClient } from '@/lib/supabase/client'
import { Relationship, RelationshipDetails } from './types'

export async function getMyRelationship() {
  const supabase = createClient()

  const { data, error } = await supabase.rpc(
    'get_my_relationship'
  )

  if (error) {
    throw new Error(error.message)
  }

  return data?.[0] ?? null
}

export async function createRelationship({
  relationshipName,
  startedAt,
}: {
  relationshipName: string
  startedAt?: string
}): Promise<Relationship> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc(
    'create_relationship',
    {
      p_relationship_name: relationshipName,
      p_started_at: startedAt || null,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return data as Relationship
}

export async function joinRelationship(
  inviteCode: string
) {
  const supabase = createClient()

  const { data, error } = await supabase.rpc(
    'join_relationship',
    {
      p_invite_code: inviteCode,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getMyRelationshipDetails(): Promise<RelationshipDetails> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc(
    'get_my_relationship_details'
  )

  if (error) {
    throw new Error(error.message)
  }

  return data as RelationshipDetails
}


export async function getPartnerName() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase.rpc(
    "get_my_relationship_details"
  );

  if (error) {
    throw error;
  }

  const partner = data?.members?.find(
    (member: { user_id: string }) => member.user_id !== user.id
  );
  

  return partner ?? null;
}