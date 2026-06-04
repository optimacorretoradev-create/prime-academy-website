'use client'

import {
  ShieldCheck,
  GraduationCap,
  Mail,
  Calendar,
  UserCheck,
  UserX,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AdminPerfil {
  id: string
  nome: string
  email: string
  cargo: 'aluno' | 'admin'
  foto_url: string | null
  criado_em: string
}

interface AdminUserDetailPanelProps {
  perfil: AdminPerfil | null
  currentUserEmail?: string
  updatingId: string | null
  onPromover: (perfil: AdminPerfil) => void
  onRevogar: (perfil: AdminPerfil) => void
  onRemover: (perfil: AdminPerfil) => void
}

export function AdminUserDetailPanel({
  perfil,
  currentUserEmail,
  updatingId,
  onPromover,
  onRevogar,
  onRemover,
}: AdminUserDetailPanelProps) {
  if (!perfil) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center px-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <GraduationCap className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-600">Selecione um utilizador</p>
        <p className="text-xs text-slate-400 mt-1">
          Clique numa linha da tabela para ver os detalhes
        </p>
      </div>
    )
  }

  const shortId = perfil.id.slice(0, 8).toUpperCase()
  const isOwnAccount = perfil.email === currentUserEmail
  const isUpdating = updatingId === perfil.id

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-6 text-center border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 tracking-wide mb-3">{shortId}</p>
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-[#312455]/20 mb-4">
          {perfil.nome.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-black text-[#312455]">{perfil.nome}</h2>
        <p className="text-sm text-slate-500 mt-1">
          {perfil.cargo === 'admin' ? 'Administrador Prime Academy' : 'Aluno Prime Academy'}
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <a
            href={`mailto:${perfil.email}`}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#312455] hover:text-[#312455] transition-colors"
            title="Enviar email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sobre</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Conta registada na plataforma Prime Academy.{' '}
            {perfil.cargo === 'admin'
              ? 'Tem permissões totais de administração do sistema.'
              : 'Tem acesso aos cursos e materiais de formação disponíveis.'}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Detalhes
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-[11px] text-slate-400 font-medium">Cargo</dt>
              <dd className="font-semibold text-[#312455] mt-0.5 capitalize">{perfil.cargo}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-slate-400 font-medium">Estado</dt>
              <dd className="font-semibold text-emerald-600 mt-0.5">Ativo</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[11px] text-slate-400 font-medium">Email</dt>
              <dd className="font-medium text-slate-700 mt-0.5 break-all">{perfil.email}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Registado em
              </dt>
              <dd className="font-semibold text-slate-700 mt-0.5">
                {new Date(perfil.criado_em).toLocaleDateString('pt-AO', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        </div>

        <div className="pt-2">
          {isUpdating ? (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-3">
              <RefreshCw className="w-4 h-4 animate-spin" />
              A atualizar…
            </div>
          ) : isOwnAccount ? (
            <p className="text-xs text-center text-slate-400 italic py-2">Esta é a sua conta</p>
          ) : perfil.cargo === 'aluno' ? (
            <Button
              className="w-full rounded-xl bg-[#312455] hover:bg-[#3d2d6b] text-white font-semibold"
              onClick={() => onPromover(perfil)}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Promover a Admin
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full rounded-xl border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold"
              onClick={() => onRevogar(perfil)}
            >
              <UserX className="w-4 h-4 mr-2" />
              Revogar cargo de Admin
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
          {perfil.cargo === 'admin' ? (
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <GraduationCap className="w-4 h-4 text-[#8a66a8] shrink-0" />
          )}
          <span className="text-xs text-slate-600">
            {perfil.cargo === 'admin'
              ? 'Acesso ao painel admin'
              : 'Acesso ao painel de estudante'}
          </span>
        </div>

        {!isOwnAccount && (
          <Button
            variant="outline"
            className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-semibold"
            onClick={() => onRemover(perfil)}
            disabled={isUpdating}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover utilizador
          </Button>
        )}
      </div>
    </div>
  )
}
