'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Database,
  Users,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  AdminUserDetailPanel,
  type AdminPerfil,
} from '@/components/admin/admin-user-detail-panel'

type TabId = 'todos' | 'aluno' | 'admin'
type SortKey = 'nome' | 'criado_em'

const TABS: { id: TabId; label: string }[] = [
  { id: 'aluno', label: 'Formandos' },
  { id: 'admin', label: 'Administradores' },
  { id: 'todos', label: 'Todos' },
]

interface AdminUsersPanelProps {
  perfis: AdminPerfil[]
  loadingData: boolean
  search: string
  onSearchChange: (v: string) => void
  filterCargo: TabId
  onFilterCargoChange: (v: TabId) => void
  sortKey: SortKey
  sortAsc: boolean
  onToggleSort: () => void
  onToggleSortKey: () => void
  onRefresh: () => void
  onExport: () => void
  selectedId: string | null
  onSelectId: (id: string) => void
  currentUserEmail?: string
  updatingId: string | null
  onPromover: (p: AdminPerfil) => void
  onRevogar: (p: AdminPerfil) => void
  onRemover: (p: AdminPerfil) => void
  onRowClick?: (p: AdminPerfil) => void
}

export function AdminUsersPanel({
  perfis,
  loadingData,
  search,
  onSearchChange,
  filterCargo,
  onFilterCargoChange,
  sortKey,
  sortAsc,
  onToggleSort,
  onToggleSortKey,
  onRefresh,
  onExport,
  selectedId,
  onSelectId,
  currentUserEmail,
  updatingId,
  onPromover,
  onRevogar,
  onRemover,
  onRowClick,
}: AdminUsersPanelProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportClick = () => {
    setIsExporting(true)
    setTimeout(() => {
      onExport()
      setIsExporting(false)
    }, 600)
  }

  const filteredPerfis = perfis
    .filter((p) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      const matchCargo = filterCargo === 'todos' || p.cargo === filterCargo
      return matchSearch && matchCargo
    })
    .sort((a, b) => {
      const av = sortKey === 'nome' ? a.nome : a.criado_em
      const bv = sortKey === 'nome' ? b.nome : b.criado_em
      const cmp = av.localeCompare(bv)
      return sortAsc ? cmp : -cmp
    })

  const selectedPerfil = filteredPerfis.find((p) => p.id === selectedId) ?? null

  useEffect(() => {
    if (filteredPerfis.length === 0) return
    if (!selectedId || !filteredPerfis.some((p) => p.id === selectedId)) {
      onSelectId(filteredPerfis[0].id)
    }
  }, [filteredPerfis, selectedId, onSelectId])

  return (
    <div className="flex flex-1 min-h-0 gap-4 lg:gap-5">
      <div className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Pesquisar formando, administrador, email ou ID..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-11 h-11 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
            />
          </div>
        </div>

        <div className="px-4 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#312455] shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-[#312455]">Utilizadores</h2>
            <span className="text-xs text-slate-400 font-medium">({filteredPerfis.length})</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              type="button"
              onClick={onToggleSort}
              title={`Ordenar ${sortAsc ? 'Ascendente' : 'Descendente'}`}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-lg px-2.5 py-2 transition-colors cursor-pointer ${
                sortAsc
                  ? 'text-[#312455] border-[#312455]/20 bg-[#312455]/5 hover:bg-[#312455]/10'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sortAsc ? (
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden sm:inline">Ordem: {sortAsc ? 'Asc' : 'Desc'}</span>
            </button>
            <button
              type="button"
              onClick={onToggleSortKey}
              title={`Filtrar por ${sortKey === 'nome' ? 'Nome' : 'Data'}`}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold border rounded-lg px-2.5 py-2 transition-colors cursor-pointer ${
                sortKey !== 'nome'
                  ? 'text-[#312455] border-[#312455]/20 bg-[#312455]/5 hover:bg-[#312455]/10'
                  : 'text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Filtrar: {sortKey === 'nome' ? 'Nome' : 'Data'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportClick}
              disabled={isExporting}
              title="Exportar CSV"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#312455] border border-[#312455]/30 rounded-lg px-2.5 py-2 hover:bg-[#312455]/5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              ) : (
                <Download className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden sm:inline">{isExporting ? 'A exportar...' : 'Exportar'}</span>
            </button>
            <button
              type="button"
              onClick={onRefresh}
              title="Atualizar lista"
              className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#312455] cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 px-4 sm:px-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterCargoChange(tab.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 cursor-pointer ${
                filterCargo === tab.id
                  ? 'border-[#312455] text-[#312455]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Visualização em Lista para Mobile */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {loadingData ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 bg-slate-100 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-slate-100 rounded w-12 shrink-0" />
                </div>
              ))
            ) : filteredPerfis.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                Nenhum utilizador encontrado
              </div>
            ) : (
              filteredPerfis.map((perfil, index) => {
                const isSelected = perfil.id === selectedId
                return (
                  <div
                    key={perfil.id}
                    onClick={() => {
                      onSelectId(perfil.id)
                      onRowClick?.(perfil)
                    }}
                    className={`cursor-pointer transition-colors p-4 flex items-center justify-between gap-3 border-b border-slate-50 ${
                      isSelected
                        ? 'bg-[#312455] text-white'
                        : index % 2 === 0
                          ? 'bg-white hover:bg-slate-50'
                          : 'bg-slate-50/50 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-gradient-to-br from-[#312455] to-[#8a66a8] text-white'
                        }`}
                      >
                        {perfil.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-sm truncate">{perfil.nome}</p>
                        <p className={`text-[10.5px] truncate font-medium ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                          {perfil.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        perfil.cargo === 'admin'
                          ? isSelected ? 'bg-white/20 text-white' : 'bg-red-50 text-red-600 border border-red-250/30'
                          : isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 border border-blue-250/30'
                      }`}>
                        {perfil.cargo === 'aluno' ? 'Formando' : perfil.cargo}
                      </span>
                      <span className={`text-[9px] font-mono ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                        {perfil.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Visualização em Tabela para Tablet/Desktop */}
          <table className="w-full text-sm hidden sm:table">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-3 pl-5 text-xs font-bold text-slate-500">Nome</th>
                <th className="text-left p-3 text-xs font-bold text-slate-500 hidden sm:table-cell">
                  ID
                </th>
                <th className="text-left p-3 text-xs font-bold text-slate-500 hidden md:table-cell">
                  Cargo
                </th>
                <th className="text-left p-3 text-xs font-bold text-slate-500 hidden lg:table-cell">
                  Registado
                </th>
                <th className="text-left p-3 pr-5 text-xs font-bold text-slate-500">Email</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-slate-50">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="p-3 pl-5">
                        <div className="h-4 bg-slate-100 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredPerfis.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 text-sm">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    Nenhum utilizador encontrado
                  </td>
                </tr>
              ) : (
                filteredPerfis.map((perfil, index) => {
                  const isSelected = perfil.id === selectedId
                  return (
                    <tr
                      key={perfil.id}
                      onClick={() => {
                        onSelectId(perfil.id)
                        onRowClick?.(perfil)
                      }}
                      className={`cursor-pointer transition-colors border-b border-slate-50 ${
                        isSelected
                          ? 'bg-[#312455] text-white'
                          : index % 2 === 0
                            ? 'bg-white hover:bg-slate-50'
                            : 'bg-slate-50/50 hover:bg-slate-100/80'
                      }`}
                    >
                      <td className="p-3 pl-5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-gradient-to-br from-[#312455] to-[#8a66a8] text-white'
                            }`}
                          >
                            {perfil.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold truncate max-w-[140px] sm:max-w-none">
                            {perfil.nome}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`p-3 text-xs font-mono hidden sm:table-cell ${
                          isSelected ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        {perfil.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td
                        className={`p-3 capitalize hidden md:table-cell ${
                          isSelected ? 'text-white/90' : 'text-slate-600'
                        }`}
                      >
                        {perfil.cargo === 'aluno' ? 'Formando' : perfil.cargo}
                      </td>
                      <td
                        className={`p-3 text-xs hidden lg:table-cell ${
                          isSelected ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        {new Date(perfil.criado_em).toLocaleDateString('pt-AO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td
                        className={`p-3 pr-5 text-xs truncate max-w-[180px] ${
                          isSelected ? 'text-white/80' : 'text-slate-500'
                        }`}
                      >
                        {perfil.email}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="hidden xl:flex w-[320px] shrink-0 flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <AdminUserDetailPanel
          perfil={selectedPerfil}
          currentUserEmail={currentUserEmail}
          updatingId={updatingId}
          onPromover={onPromover}
          onRevogar={onRevogar}
          onRemover={onRemover}
        />
      </aside>
    </div>
  )
}
