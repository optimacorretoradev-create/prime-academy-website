import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Remove vínculos do utilizador antes de apagar perfil e auth.
 * Ignora erros de tabela/coluna inexistente (schema legado).
 */
export async function deleteUserCascade(
  admin: SupabaseClient,
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  const safeDelete = async (table: string, column: string) => {
    const { error } = await admin.from(table).delete().eq(column, userId)
    if (error && !isIgnorableSchemaError(error.message)) {
      return error.message
    }
    return null
  }

  const safeUpdateNull = async (table: string, column: string) => {
    const { error } = await admin
      .from(table)
      .update({ perfil_id: null })
      .eq(column, userId)
    if (error && !isIgnorableSchemaError(error.message)) {
      return error.message
    }
    return null
  }

  const steps = [
    () => safeDelete('notificacoes', 'perfil_id'),
    () => safeDelete('matriculas', 'perfil_id'),
    () => safeDelete('matriculas', 'aluno_id'),
    () => safeDelete('curso_instrutores', 'instrutor_id'),
    () => safeDelete('curso_instrutores', 'designado_por'),
    () => safeUpdateNull('inscricoes', 'perfil_id'),
    () => safeDelete('progresso_aulas', 'aluno_id'),
    () => safeDelete('progresso_aulas', 'perfil_id'),
  ]

  for (const step of steps) {
    const err = await step()
    if (err) return { ok: false, error: err }
  }

  const { error: perfilError } = await admin.from('perfis').delete().eq('id', userId)
  if (perfilError) {
    return { ok: false, error: `Erro ao remover perfil: ${perfilError.message}` }
  }

  const { error: authError } = await admin.auth.admin.deleteUser(userId)
  if (authError && !authError.message.toLowerCase().includes('not found')) {
    return { ok: false, error: `Erro ao remover autenticação: ${authError.message}` }
  }

  return { ok: true }
}

function isIgnorableSchemaError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes('does not exist') ||
    m.includes('não existe') ||
    m.includes('could not find') ||
    m.includes('schema cache') ||
    m.includes('column') && m.includes('does not exist')
  )
}
