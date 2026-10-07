// supabase/functions/ai-assistant-chat/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')!
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

type AiProvider = 'openrouter' | 'groq'

interface ProviderConfig {
  url: string
  apiKey: string
  model: string
}

const PROVIDER_CONFIG: Record<AiProvider, ProviderConfig> = {
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: OPENROUTER_API_KEY,
    model: 'openai/gpt-oss-20b:free',
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: GROQ_API_KEY,
    model: 'openai/gpt-oss-20b',
  },
}

const DEFAULT_PROVIDER_ORDER: AiProvider[] = ['openrouter', 'groq']

// =========================================
// SYSTEM PROMPT
// =========================================

const SYSTEM_PROMPT = `Kamu adalah Duora AI Assistant, asisten relationship personal untuk pasangan LDR yang menggunakan aplikasi Duora.

PERAN KAMU:
- Membantu user memahami dan mengembangkan hubungan mereka, bukan sekadar chatbot umum.
- Bisa ngobrol santai soal relationship secara umum, maupun menjawab pertanyaan spesifik tentang hubungan user dan pasangannya.
- Kamu TIDAK sedang ngobrol dengan pasangan sekaligus — kamu HANYA ngobrol dengan SATU user ini. Jangan asumsikan pasangan juga membaca percakapan ini.

DATA YANG BISA KAMU AKSES LEWAT TOOLS:
- Mood check-in (mood, energy, stress harian)
- Couple Goals & progress tabungan
- Riwayat Q&A yang sudah selesai dijawab kedua pasangan (pertanyaan + jawaban masing-masing)
- Riwayat AI Debate (transkrip diskusi/perdebatan mereka, beserta kesimpulan/verdict dari AI mediator)
- Jadwal/rencana di Planner

KAPAN PAKAI TOOLS:
- Kalau user bertanya sesuatu yang butuh konteks personal (mood, goals, Q&A, riwayat debat, rencana planner), PANGGIL tool yang relevan untuk ambil datanya dulu sebelum menjawab.
- Kalau pertanyaan bersifat general knowledge (misal "gimana cara komunikasi yang baik di LDR", "apa itu love language"), JAWAB LANGSUNG dari pengetahuan umum kamu, TIDAK PERLU panggil tool.
- Kalau pertanyaan butuh keduanya (general knowledge + konteks personal), panggil tool yang relevan DULU, baru gabungkan dengan pengetahuan umum di jawabanmu.
- Kalau user bertanya hal yang menghubungkan beberapa aspek (misal "kenapa mood pasanganku akhir-akhir ini turun"), panggil BEBERAPA tool yang relevan sekaligus (misal mood + Q&A + planner + debat) untuk mencari pola yang saling berkaitan, sebelum menyimpulkan.
- Jangan panggil tool yang tidak relevan dengan pertanyaan user.

ATURAN REASONING & BAHASA (SANGAT PENTING):
- Kamu TIDAK PERNAH membuat klaim psikologis yang pasti tentang kondisi mental atau perasaan pasangan user. Kamu tidak mendiagnosis siapapun.
- Setiap insight yang berasal dari data Duora harus disampaikan dengan bahasa yang transparan dan hati-hati, seperti: "berdasarkan pola yang terlihat...", "ini bisa mengindikasikan...", "mungkin salah satu kemungkinannya adalah...".
- JANGAN PERNAH bilang "pasanganmu pasti merasa X" atau "pasanganmu sedang mengalami Y" sebagai fakta mutlak — selalu bingkai sebagai kemungkinan/pola, bukan kepastian.
- Kalau data yang tersedia tidak cukup untuk menjawab dengan yakin, katakan secara jujur bahwa datanya terbatas, jangan mengarang.
- Transparan soal dari mana insight itu berasal (misal "dari mood check-in minggu ini..." atau "dari jawaban Q&A kalian soal...").
- Kalau membahas isi debat/perdebatan sebelumnya, tetap bersikap netral dan tidak memihak salah satu orang — tujuannya membantu refleksi, bukan menghakimi siapa yang benar.

BATASAN PRIVASI:
- Kamu HANYA boleh mengakses dan membahas jawaban Q&A yang statusnya SUDAH completed (kedua pasangan sudah saling melihat jawaban). Tool yang kamu punya sudah otomatis memfilter ini, jadi kamu tidak akan menerima data Q&A yang belum completed.
- Jangan pernah berpura-pura tahu jawaban Q&A yang belum completed, atau data lain yang tidak diberikan tool.

GAYA BICARA:
- Hangat, empatik, seperti teman yang perhatian tapi tetap bijaksana — bukan kaku seperti customer service.
- Gunakan Bahasa Indonesia yang natural, boleh sedikit santai, tapi tetap sopan dan matang.
- Jangan terlalu panjang kalau tidak perlu; to the point tapi tetap hangat.

Kamu BUKAN pengganti terapis atau profesional kesehatan mental. Kalau ada indikasi masalah serius (kekerasan, kesehatan mental yang mengkhawatirkan), dorong user untuk mencari bantuan profesional.`

// =========================================
// TOOL DEFINITIONS (Fase 1 MVP: Mood + Goals)
// =========================================

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_mood_summary',
      description:
        'Mengambil ringkasan mood check-in terbaru dari user dan pasangannya, termasuk tren mood, energy, dan stress dalam beberapa hari/minggu terakhir. Gunakan ini kalau user bertanya tentang mood, perasaan, energy, atau stress — baik tentang dirinya sendiri maupun pasangannya.',
      parameters: {
        type: 'object',
        properties: {
          days: {
            type: 'number',
            description: 'Jumlah hari ke belakang yang ingin dilihat (default 14 hari)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_goals_summary',
      description:
        'Mengambil ringkasan couple goals dan progress tabungan mereka. Gunakan ini kalau user bertanya tentang goals, rencana, tabungan, atau progress menuju tujuan bersama.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_qna_history',
      description:
        'Mengambil seluruh riwayat Q&A yang sudah selesai dijawab oleh kedua pasangan (pertanyaan beserta jawaban masing-masing). Gunakan ini kalau user bertanya tentang jawaban Q&A, ingin membahas makna di balik jawaban tertentu, atau ingin insight dari pola jawaban Q&A mereka.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['love_and_us', 'deep_talk', 'future', 'memories', 'fun_and_random'],
            description: 'Filter berdasarkan kategori tertentu (opsional, kosongkan untuk semua kategori)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_debate_history',
      description:
        'Mengambil riwayat AI Debate (perdebatan/diskusi) antara user dan pasangannya, termasuk transkrip percakapan mentah dan kesimpulan/verdict dari AI mediator. Gunakan ini kalau user bertanya tentang konflik, perdebatan, atau ingin insight dari pola diskusi mereka sebelumnya.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Jumlah debat terbaru yang ingin diambil (default 5)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_planner_events',
      description:
        'Mengambil jadwal/rencana aktivitas yang sudah dibuat di Planner, baik yang sudah lewat maupun akan datang. Gunakan ini kalau user bertanya tentang rencana, jadwal, aktivitas yang sudah/akan dilakukan bersama.',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
]

// =========================================
// TOOL EXECUTORS
// =========================================

async function executeGetMoodSummary(
  supabase: any,
  relationshipId: string,
  args: { days?: number },
) {
  const days = args.days ?? 14
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('checkin_date, mood, energy, stress, user_id, profiles:user_id(display_name)')
    .eq('relationship_id', relationshipId)
    .gte('checkin_date', sinceDate.toISOString().split('T')[0])
    .order('checkin_date', { ascending: false })

  if (error) {
    return { error: 'Gagal mengambil data mood' }
  }

  if (!data || data.length === 0) {
    return { message: 'Belum ada data mood check-in dalam rentang waktu ini.' }
  }

  return {
    period_days: days,
    checkins: data.map((c: any) => ({
      date: c.checkin_date,
      mood: c.mood,
      energy: c.energy,
      stress: c.stress,
      person: c.profiles?.display_name ?? 'Seseorang',
    })),
  }
}

async function executeGetGoalsSummary(
  supabase: any,
  relationshipId: string,
) {
  const { data: goals, error: goalsError } = await supabase
    .from('goals')
    .select('id, title, category, target_amount, deadline')
    .eq('relationship_id', relationshipId)

  if (goalsError) {
    return { error: 'Gagal mengambil data goals' }
  }

  if (!goals || goals.length === 0) {
    return { message: 'Belum ada couple goals yang dibuat.' }
  }

  const goalIds = goals.map((g: any) => g.id)

  const { data: savings } = await supabase
    .from('savings')
    .select('goal_id, amount')
    .in('goal_id', goalIds)

  const goalsWithProgress = goals.map((g: any) => {
    const totalSaved = (savings ?? [])
      .filter((s: any) => s.goal_id === g.id)
      .reduce((sum: number, s: any) => sum + Number(s.amount), 0)

    return {
      title: g.title,
      category: g.category,
      target_amount: g.target_amount,
      total_saved: totalSaved,
      progress_percentage: g.target_amount
        ? Math.min((totalSaved / g.target_amount) * 100, 100).toFixed(1)
        : null,
      deadline: g.deadline,
    }
  })

  return { goals: goalsWithProgress }
}

async function executeGetQnaHistory(
  supabase: any,
  relationshipId: string,
  args: { category?: string },
) {
  let query = supabase
    .from('qna_sessions')
    .select(`
      category,
      completed_at,
      answer_user_a_id,
      answer_user_a_text,
      answer_user_b_id,
      answer_user_b_text,
      qna_questions:question_id (question_text)
    `)
    .eq('relationship_id', relationshipId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  if (args.category) {
    query = query.eq('category', args.category)
  }

  const { data, error } = await query

  if (error) {
    return { error: 'Gagal mengambil data Q&A' }
  }

  if (!data || data.length === 0) {
    return { message: 'Belum ada sesi Q&A yang selesai dijawab.' }
  }

  // Ambil nama tiap user untuk label jawaban
  const { data: members } = await supabase
    .from('relationship_members')
    .select('user_id, profiles:user_id(display_name)')
    .eq('relationship_id', relationshipId)

  const nameMap = new Map(
    (members ?? []).map((m: any) => [m.user_id, m.profiles?.display_name ?? 'Seseorang']),
  )

  return {
    total_sessions: data.length,
    sessions: data.map((s: any) => ({
      category: s.category,
      question: s.qna_questions?.question_text,
      completed_at: s.completed_at,
      answers: [
        {
          person: nameMap.get(s.answer_user_a_id) ?? 'Seseorang',
          answer: s.answer_user_a_text,
        },
        {
          person: nameMap.get(s.answer_user_b_id) ?? 'Seseorang',
          answer: s.answer_user_b_text,
        },
      ],
    })),
  }
}

async function executeGetDebateHistory(
  supabase: any,
  relationshipId: string,
  args: { limit?: number },
) {
  const limit = args.limit ?? 5

  const { data: debates, error: debatesError } = await supabase
    .from('debates')
    .select('id, title, status, created_at, resolved_at')
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (debatesError) {
    return { error: 'Gagal mengambil data debat' }
  }

  if (!debates || debates.length === 0) {
    return { message: 'Belum ada riwayat AI Debate.' }
  }

  const debateIds = debates.map((d: any) => d.id)

  const { data: messages } = await supabase
    .from('debate_messages')
    .select('debate_id, role, content, sender_id, is_final_verdict, ai_analysis, profiles:sender_id(display_name)')
    .in('debate_id', debateIds)
    .order('created_at', { ascending: true })

  const result = debates.map((d: any) => {
    const debateMessages = (messages ?? []).filter((m: any) => m.debate_id === d.id)

    const transcript = debateMessages.map((m: any) => {
      if (m.role === 'ai') {
        return m.is_final_verdict
          ? `[AI Verdict]: ${m.content}`
          : `[AI Mediator]: ${m.content}`
      }
      const name = m.profiles?.display_name ?? 'Seseorang'
      return `${name}: ${m.content}`
    })

    const finalVerdictMsg = debateMessages.find((m: any) => m.is_final_verdict)

    return {
      title: d.title,
      status: d.status,
      created_at: d.created_at,
      resolved_at: d.resolved_at,
      transcript,
      final_verdict: finalVerdictMsg?.ai_analysis ?? null,
    }
  })

  return { total_debates: result.length, debates: result }
}

async function executeGetPlannerEvents(
  supabase: any,
  relationshipId: string,
) {
  const { data, error } = await supabase
    .from('planner_events')
    .select('title, description, category, event_date, start_time, end_time, is_all_day')
    .eq('relationship_id', relationshipId)
    .order('event_date', { ascending: true })

  if (error) {
    return { error: 'Gagal mengambil data planner' }
  }

  if (!data || data.length === 0) {
    return { message: 'Belum ada rencana/jadwal di Planner.' }
  }

  const today = new Date().toISOString().split('T')[0]

  return {
    upcoming: data.filter((e: any) => e.event_date >= today),
    past: data.filter((e: any) => e.event_date < today),
  }
}

async function executeTool(
  supabase: any,
  relationshipId: string,
  toolName: string,
  toolArgs: any,
): Promise<any> {
  switch (toolName) {
    case 'get_mood_summary':
      return executeGetMoodSummary(supabase, relationshipId, toolArgs)
    case 'get_goals_summary':
      return executeGetGoalsSummary(supabase, relationshipId)
    case 'get_qna_history':
      return executeGetQnaHistory(supabase, relationshipId, toolArgs)
    case 'get_debate_history':
      return executeGetDebateHistory(supabase, relationshipId, toolArgs)
    case 'get_planner_events':
      return executeGetPlannerEvents(supabase, relationshipId)
    default:
      return { error: `Tool "${toolName}" tidak dikenali` }
  }
}

// =========================================
// AI PROVIDER CALL (dengan tool calling support)
// =========================================

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: any[]
  tool_call_id?: string
  name?: string
}

async function callAiProviderWithTools(
  provider: AiProvider,
  messages: ChatMessage[],
): Promise<any> {
  const config = PROVIDER_CONFIG[provider]

  console.log(`[${provider}] Memulai request ke ${config.url} dengan model ${config.model}`)

  if (!config.apiKey) {
    console.error(`[${provider}] API key tidak ditemukan di environment variable`)
    throw new Error(`API key untuk provider "${provider}" belum diset`)
  }

  let response: Response
  try {
    response = await fetch(config.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        tools: TOOLS,
        tool_choice: 'auto',
        temperature: 0.5,
      }),
    })
  } catch (fetchError) {
    console.error(`[${provider}] Network error saat fetch:`, fetchError)
    throw new Error(`[${provider}] Gagal menghubungi API: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
  }

  console.log(`[${provider}] Response status: ${response.status}`)

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[${provider}] Response error body:`, errorText)
    throw new Error(`${provider} error (${response.status}): ${errorText}`)
  }

  let result: any
  try {
    result = await response.json()
  } catch (parseError) {
    const rawText = await response.text().catch(() => '(tidak bisa dibaca)')
    console.error(`[${provider}] Gagal parse JSON response. Raw text:`, rawText)
    throw new Error(`[${provider}] Response bukan JSON valid`)
  }

  console.log(`[${provider}] Raw result:`, JSON.stringify(result).slice(0, 2000))

  const message = result.choices?.[0]?.message

  if (!message) {
    console.error(`[${provider}] Tidak ada message di choices[0]. Full result:`, JSON.stringify(result))
    throw new Error(`${provider} tidak mengembalikan message yang valid`)
  }

  return message
}

interface CallAiWithFallbackResult {
  message: any
  providerUsed: AiProvider
}

async function callAiWithFallbackAndTools(
  preferredProvider: AiProvider | null,
  messages: ChatMessage[],
): Promise<CallAiWithFallbackResult> {
  const providersToTry = preferredProvider
    ? [preferredProvider]
    : DEFAULT_PROVIDER_ORDER

  const errors: string[] = []

  for (const provider of providersToTry) {
    try {
      const message = await callAiProviderWithTools(provider, messages)
      console.log(`[${provider}] Berhasil mendapat response`)
      return { message, providerUsed: provider }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.error(`[${provider}] Gagal, mencoba provider berikutnya. Error:`, msg)
      errors.push(`[${provider}] ${msg}`)
      continue
    }
  }

  console.error('Semua provider gagal. Detail errors:', errors)
  throw new Error(`Semua provider AI gagal:\n${errors.join('\n')}`)
}

// =========================================
// MAIN HANDLER — dengan logging per tahap
// =========================================

const MAX_TOOL_CALL_ROUNDS = 4

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { conversationId, userMessage, provider } = body

    console.log('=== Request masuk ===')
    console.log('conversationId:', conversationId)
    console.log('userMessage:', userMessage?.slice(0, 100))
    console.log('provider:', provider)

    if (!conversationId || !userMessage) {
      console.error('Validasi gagal: conversationId atau userMessage kosong')
      return new Response(
        JSON.stringify({ error: 'conversationId and userMessage are required' }),
        { status: 400, headers: corsHeaders },
      )
    }

    const preferredProvider: AiProvider | null =
      provider === 'openrouter' || provider === 'groq' ? provider : null

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    console.log('Mengambil data conversation...')
    const { data: conversation, error: convError } = await supabase
      .from('ai_assistant_conversations')
      .select('relationship_id, user_id')
      .eq('id', conversationId)
      .single()

    if (convError) {
      console.error('Error ambil conversation:', convError)
      throw new Error(`Conversation not found: ${convError.message}`)
    }

    if (!conversation) {
      console.error('Conversation null padahal tidak ada error')
      throw new Error('Conversation not found')
    }

    const relationshipId = conversation.relationship_id
    console.log('relationshipId:', relationshipId)

    console.log('Menyimpan pesan user...')
    const { error: insertUserMsgError } = await supabase
      .from('ai_assistant_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: userMessage,
      })

    if (insertUserMsgError) {
      console.error('Gagal simpan pesan user:', insertUserMsgError)
      throw new Error(`Gagal menyimpan pesan: ${insertUserMsgError.message}`)
    }

    console.log('Mengambil history percakapan...')
    const { data: historyRows, error: historyError } = await supabase
      .from('ai_assistant_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20)

    if (historyError) {
      console.error('Gagal ambil history:', historyError)
      throw new Error(`Gagal mengambil riwayat percakapan: ${historyError.message}`)
    }

    console.log(`History ditemukan: ${historyRows?.length ?? 0} pesan`)

    const conversationHistory: ChatMessage[] = (historyRows ?? []).map((m: any) => ({
      role: m.role,
      content: m.content,
    }))

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
    ]

    const toolsUsedThisTurn: string[] = []
    let finalAssistantMessage: any = null
    let providerUsedFinal: AiProvider = 'openrouter'

    console.log('Memulai tool calling loop...')

    for (let round = 0; round < MAX_TOOL_CALL_ROUNDS; round++) {
      console.log(`--- Round ${round + 1} ---`)

      const { message: assistantMessage, providerUsed } = await callAiWithFallbackAndTools(
        preferredProvider,
        messages,
      )

      providerUsedFinal = providerUsed

      if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
        console.log('Tidak ada tool_calls, ini jawaban final')
        finalAssistantMessage = assistantMessage
        break
      }

      console.log(
        `AI meminta ${assistantMessage.tool_calls.length} tool call(s):`,
        assistantMessage.tool_calls.map((tc: any) => tc.function.name),
      )

      messages.push({
        role: 'assistant',
        content: assistantMessage.content ?? null,
        tool_calls: assistantMessage.tool_calls,
      })

      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name
        let toolArgs = {}

        try {
          toolArgs = JSON.parse(toolCall.function.arguments || '{}')
        } catch (parseErr) {
          console.error(`Gagal parse arguments untuk tool ${toolName}:`, toolCall.function.arguments, parseErr)
          toolArgs = {}
        }

        console.log(`Menjalankan tool: ${toolName}`, toolArgs)
        toolsUsedThisTurn.push(toolName)

        let toolResult
        try {
          toolResult = await executeTool(supabase, relationshipId, toolName, toolArgs)
          console.log(`Hasil tool ${toolName}:`, JSON.stringify(toolResult).slice(0, 500))
        } catch (toolError) {
          console.error(`Tool ${toolName} melempar exception:`, toolError)
          toolResult = { error: `Tool gagal dieksekusi: ${toolError instanceof Error ? toolError.message : String(toolError)}` }
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: toolName,
          content: JSON.stringify(toolResult),
        })
      }
    }

    if (!finalAssistantMessage) {
      console.error(`Mencapai MAX_TOOL_CALL_ROUNDS (${MAX_TOOL_CALL_ROUNDS}) tanpa jawaban final`)
      throw new Error('AI tidak memberikan jawaban final setelah beberapa percobaan tool call')
    }

    const finalContent = finalAssistantMessage.content ?? 'Maaf, aku tidak bisa menjawab itu sekarang.'

    console.log('Menyimpan pesan AI...')
    const { data: savedMessage, error: insertError } = await supabase
      .from('ai_assistant_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: finalContent,
        tools_used: toolsUsedThisTurn.length > 0 ? toolsUsedThisTurn : null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Gagal simpan pesan AI:', insertError)
      throw new Error(`Gagal menyimpan jawaban AI: ${insertError.message}`)
    }

    console.log('Update conversation metadata...')
    const { count } = await supabase
      .from('ai_assistant_messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)

    const updatePayload: any = { updated_at: new Date().toISOString() }

    if (count === 2) {
      updatePayload.title = userMessage.slice(0, 50)
    }

    await supabase
      .from('ai_assistant_conversations')
      .update(updatePayload)
      .eq('id', conversationId)

    console.log('=== Request selesai sukses ===')

    return new Response(
      JSON.stringify({
        message: savedMessage,
        providerUsed: providerUsedFinal,
        toolsUsed: toolsUsedThisTurn,
      }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      },
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error('=== ERROR FATAL ===')
    console.error('Message:', errorMessage)
    console.error('Stack:', errorStack)

    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      { status: 500, headers: corsHeaders },
    )
  }
})