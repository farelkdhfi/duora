import { createClient } from '@/lib/supabase/client'
import type { AiPersona, Debate, DebateMessage } from './types'

export async function getDebates(
  relationshipId: string,
): Promise<Debate[]> {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('debates')
    .select('*')
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getDebate(
  debateId: string,
): Promise<Debate> {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('debates')
    .select('*')
    .eq('id', debateId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createDebate({
  relationshipId,
  title,
  aiPersona = 'formal',
}: {
  relationshipId: string
  title: string
  aiPersona?: AiPersona
}): Promise<Debate> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    data,
    error,
  } = await supabase
    .from('debates')
    .insert({
      relationship_id: relationshipId,
      created_by: user.id,
      title,
      ai_persona: aiPersona,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateDebatePersona({
  debateId,
  aiPersona,
}: {
  debateId: string
  aiPersona: AiPersona
}) {
  const supabase = createClient()

  const { error } = await supabase
    .from('debates')
    .update({ ai_persona: aiPersona })
    .eq('id', debateId)

  if (error) {
    throw new Error(error.message)
  }

  return debateId
}

export async function deleteDebate(
  debateId: string,
) {
  const supabase = createClient()

  const { error } = await supabase
    .from('debates')
    .delete()
    .eq('id', debateId)

  if (error) {
    throw new Error(error.message)
  }

  return debateId
}

export async function getDebateMessages(
  debateId: string,
): Promise<DebateMessage[]> {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('debate_messages')
    .select(
      `
      *,
      profiles:sender_id (
        display_name,
        username,
        avatar_url
      )
    `,
    )
    .eq('debate_id', debateId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data as DebateMessage[]
}

export async function sendDebateMessage({
  debateId,
  content,
}: {
  debateId: string
  content: string
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    data,
    error,
  } = await supabase
    .from('debate_messages')
    .insert({
      debate_id: debateId,
      sender_id: user.id,
      role: 'user',
      content,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function requestAiAnalysis({
  debateId,
  mode = 'comment',
  provider,
}: {
  debateId: string
  mode?: 'comment' | 'final_verdict'
  provider?: 'openrouter' | 'groq'
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    error: flagError,
  } = await supabase
    .from('debates')
    .update({
      ai_processing_requested_by: user.id,
      ai_processing_started_at:
        new Date().toISOString(),
    })
    .eq('id', debateId)

  if (flagError) {
    throw new Error(flagError.message)
  }

  try {
    const {
      data,
      error,
    } = await supabase.functions.invoke(
      'analyze-debate',
      {
        body: { debateId, mode, provider },
      },
    )

    if (error) {
      throw new Error(error.message)
    }

    return data
  } finally {
    await supabase
      .from('debates')
      .update({
        ai_processing_requested_by: null,
        ai_processing_started_at: null,
      })
      .eq('id', debateId)
  }
}

export async function resolveDebate(
  debateId: string,
) {
  const supabase = createClient()

  const { error } = await supabase.rpc(
    'resolve_debate',
    {
      p_debate_id: debateId,
    },
  )

  if (error) {
    throw new Error(error.message)
  }

  return debateId
}